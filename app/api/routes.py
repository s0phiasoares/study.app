import json
import sqlite3

from flask import Blueprint, jsonify, request

from app.db.database import get_db
from app.api.validation import (
    optional_text,
    percentage,
    positive_integer,
    require_json,
    required_text,
    valid_date,
    valid_email,
    validate_date_range,
)

api = Blueprint("api", __name__)


def row_data(row):
    return dict(row) if row else None


def get_or_404(table, resource_id):
    row = get_db().execute(f"SELECT * FROM {table} WHERE id = ?", (resource_id,)).fetchone()
    if row is None:
        return None, (jsonify({"error": "Recurso não encontrado"}), 404)
    return row, None


def paginated(query, params=()):
    try:
        page = max(int(request.args.get("page", 1)), 1)
        per_page = min(max(int(request.args.get("per_page", 20)), 1), 100)
    except ValueError as error:
        raise ValueError("page e per_page devem ser números inteiros") from error
    database = get_db()
    count_query = f"SELECT COUNT(*) FROM ({query}) AS filtered"
    total = database.execute(count_query, params).fetchone()[0]
    rows = database.execute(f"{query} LIMIT ? OFFSET ?", (*params, per_page, (page - 1) * per_page)).fetchall()
    return {"items": [row_data(row) for row in rows], "pagination": {"page": page, "per_page": per_page, "total": total}}


@api.errorhandler(ValueError)
def invalid_data(error):
    return jsonify({"error": str(error)}), 400


@api.route("/users", methods=["GET", "POST"])
def users():
    database = get_db()
    if request.method == "GET":
        return jsonify(paginated("SELECT * FROM users ORDER BY id DESC")), 200
    payload = require_json(request)
    name = required_text(payload, "name")
    email = valid_email(required_text(payload, "email"))
    goal = required_text(payload, "goal")
    try:
        cursor = database.execute("INSERT INTO users (name, email, goal) VALUES (?, ?, ?)", (name, email, goal))
        database.commit()
    except sqlite3.IntegrityError as error:
        return jsonify({"error": "O e-mail informado já está cadastrado"}), 400
    user = database.execute("SELECT * FROM users WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return jsonify(row_data(user)), 201


@api.route("/users/<int:user_id>", methods=["GET", "PUT", "DELETE"])
def user_detail(user_id):
    user, error = get_or_404("users", user_id)
    if error:
        return error
    database = get_db()
    if request.method == "GET":
        return jsonify(row_data(user)), 200
    if request.method == "DELETE":
        database.execute("DELETE FROM users WHERE id = ?", (user_id,))
        database.commit()
        return "", 204
    payload = require_json(request)
    name = required_text(payload, "name")
    email = valid_email(required_text(payload, "email"))
    goal = required_text(payload, "goal")
    try:
        database.execute("UPDATE users SET name = ?, email = ?, goal = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (name, email, goal, user_id))
        database.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error": "O e-mail informado já está cadastrado"}), 400
    updated = database.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return jsonify(row_data(updated)), 200


def plan_payload(payload):
    start_date = valid_date(required_text(payload, "start_date"), "start_date")
    end_date = valid_date(required_text(payload, "end_date"), "end_date")
    validate_date_range(start_date, end_date)
    return (required_text(payload, "title"), required_text(payload, "objective"), start_date, end_date, optional_text(payload, "subjects"), optional_text(payload, "status", "planned"))


@api.route("/plans", methods=["GET", "POST"])
@api.route("/study-plans", methods=["GET", "POST"])
def plans():
    database = get_db()
    if request.method == "GET":
        query = "SELECT * FROM study_plans WHERE 1 = 1"
        params = []
        if request.args.get("user_id"):
            query += " AND user_id = ?"
            params.append(int(request.args["user_id"]))
        if request.args.get("status"):
            query += " AND status = ?"
            params.append(request.args["status"])
        return jsonify(paginated(f"{query} ORDER BY id DESC", tuple(params))), 200
    payload = require_json(request)
    user_id = payload.get("user_id")
    if isinstance(user_id, bool) or not isinstance(user_id, int):
        raise ValueError("O campo 'user_id' é obrigatório e deve ser numérico")
    if database.execute("SELECT 1 FROM users WHERE id = ?", (user_id,)).fetchone() is None:
        return jsonify({"error": "Usuário não encontrado"}), 404
    values = plan_payload(payload)
    cursor = database.execute("INSERT INTO study_plans (user_id, title, objective, start_date, end_date, subjects, status) VALUES (?, ?, ?, ?, ?, ?, ?)", (user_id, *values))
    database.commit()
    plan = database.execute("SELECT * FROM study_plans WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return jsonify(row_data(plan)), 201


@api.route("/plans/<int:plan_id>", methods=["GET", "PUT", "DELETE"])
@api.route("/study-plans/<int:plan_id>", methods=["GET", "PUT", "DELETE"])
def plan_detail(plan_id):
    plan, error = get_or_404("study_plans", plan_id)
    if error:
        return error
    database = get_db()
    if request.method == "GET":
        return jsonify(row_data(plan)), 200
    if request.method == "DELETE":
        database.execute("DELETE FROM study_plans WHERE id = ?", (plan_id,))
        database.commit()
        return "", 204
    payload = require_json(request)
    values = plan_payload(payload)
    database.execute("UPDATE study_plans SET title = ?, objective = ?, start_date = ?, end_date = ?, subjects = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (*values, plan_id))
    database.commit()
    updated = database.execute("SELECT * FROM study_plans WHERE id = ?", (plan_id,)).fetchone()
    return jsonify(row_data(updated)), 200


def child_payload(payload, is_progress=False):
    if is_progress:
        return (valid_date(required_text(payload, "progress_date"), "progress_date"), percentage(payload), positive_integer(payload, "study_minutes"), optional_text(payload, "status", "in_progress"), optional_text(payload, "notes"))
    return (required_text(payload, "title"), valid_date(required_text(payload, "target_date"), "target_date"), positive_integer(payload, "study_minutes"), optional_text(payload, "status", "pending"))


def child_resource(kind, plan_id):
    is_progress = kind == "progress"
    table = "progress_records" if is_progress else "daily_goals"
    prefix = "progress" if is_progress else "goals"
    plan, error = get_or_404("study_plans", plan_id)
    if error:
        return error
    database = get_db()
    if request.method == "GET":
        return jsonify(paginated(f"SELECT * FROM {table} WHERE plan_id = ? ORDER BY id DESC", (plan["id"],))), 200
    if request.method == "POST":
        payload = require_json(request)
        values = child_payload(payload, is_progress)
        columns = "plan_id, progress_date, percentage, study_minutes, status, notes" if is_progress else "plan_id, title, target_date, study_minutes, status"
        placeholders = ", ".join("?" for _ in values + (plan["id"],))
        cursor = database.execute(f"INSERT INTO {table} ({columns}) VALUES ({placeholders})", (plan["id"], *values))
        database.commit()
        row = database.execute(f"SELECT * FROM {table} WHERE id = ?", (cursor.lastrowid,)).fetchone()
        return jsonify(row_data(row)), 201
    return jsonify({"error": "Método HTTP não permitido"}), 405


@api.route("/plans/<int:plan_id>/goals", methods=["GET", "POST"])
@api.route("/study-plans/<int:plan_id>/goals", methods=["GET", "POST"])
def goals(plan_id):
    return child_resource("goals", plan_id)


@api.route("/plans/<int:plan_id>/progress", methods=["GET", "POST"])
@api.route("/study-plans/<int:plan_id>/progress", methods=["GET", "POST"])
def progress(plan_id):
    return child_resource("progress", plan_id)


def child_detail(kind, resource_id):
    is_progress = kind == "progress"
    table = "progress_records" if is_progress else "daily_goals"
    row, error = get_or_404(table, resource_id)
    if error:
        return error
    database = get_db()
    if request.method == "GET":
        return jsonify(row_data(row)), 200
    if request.method == "DELETE":
        database.execute(f"DELETE FROM {table} WHERE id = ?", (resource_id,))
        database.commit()
        return "", 204
    payload = require_json(request)
    values = child_payload(payload, is_progress)
    if is_progress:
        database.execute("UPDATE progress_records SET progress_date = ?, percentage = ?, study_minutes = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (*values, resource_id))
    else:
        database.execute("UPDATE daily_goals SET title = ?, target_date = ?, study_minutes = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (*values, resource_id))
    database.commit()
    updated = database.execute(f"SELECT * FROM {table} WHERE id = ?", (resource_id,)).fetchone()
    return jsonify(row_data(updated)), 200


@api.route("/goals/<int:goal_id>", methods=["GET", "PUT", "DELETE"])
def goal_detail(goal_id):
    return child_detail("goals", goal_id)


@api.route("/progress/<int:progress_id>", methods=["GET", "PUT", "DELETE"])
def progress_detail(progress_id):
    return child_detail("progress", progress_id)
