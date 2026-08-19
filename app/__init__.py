from pathlib import Path

from flask import Flask, jsonify, send_from_directory

from app.db.database import close_db, init_db
from app.api.routes import api


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True, static_folder=None)
    app.config.from_mapping(
        DATABASE=str(Path(app.instance_path) / "study_app.sqlite3"),
    )

    if test_config is not None:
        app.config.update(test_config)

    Path(app.instance_path).mkdir(parents=True, exist_ok=True)
    app.teardown_appcontext(close_db)
    app.register_blueprint(api, url_prefix="/api/v1")

    with app.app_context():
        init_db()

    @app.get("/api/v1/health")
    def health_check():
        return jsonify({"status": "ok", "service": "study.app"}), 200

    project_root = Path(app.root_path).parent

    @app.get("/")
    def landing_page():
        return send_from_directory(project_root, "index.html")

    @app.get("/pages/<path:filename>")
    def application_page(filename):
        return send_from_directory(project_root / "pages", filename)

    @app.get("/assets/<path:filename>")
    def asset(filename):
        return send_from_directory(project_root / "assets", filename)

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "Recurso não encontrado"}), 404

    @app.errorhandler(405)
    def method_not_allowed(_error):
        return jsonify({"error": "Método HTTP não permitido"}), 405

    return app
