from app import create_app


def create_client(tmp_path):
    app = create_app({
        "TESTING": True,
        "DATABASE": str(tmp_path / "test.sqlite3"),
    })
    return app.test_client()


def test_create_resources_and_relationships(tmp_path):
    client = create_client(tmp_path)

    user_response = client.post("/api/v1/users", json={
        "name": "Ana Silva",
        "email": "ana@example.com",
        "goal": "Passar em Engenharia",
    })
    assert user_response.status_code == 201
    user_id = user_response.get_json()["id"]

    plan_response = client.post("/api/v1/study-plans", json={
        "user_id": user_id,
        "title": "Vestibular 2027",
        "objective": "Preparar todas as matérias",
        "start_date": "2026-08-19",
        "end_date": "2027-01-15",
        "subjects": "Matemática, Física",
    })
    assert plan_response.status_code == 201
    plan_id = plan_response.get_json()["id"]

    goal_response = client.post(f"/api/v1/study-plans/{plan_id}/goals", json={
        "title": "Resolver exercícios de funções",
        "target_date": "2026-08-20",
        "study_minutes": 60,
    })
    assert goal_response.status_code == 201

    progress_response = client.post(f"/api/v1/study-plans/{plan_id}/progress", json={
        "progress_date": "2026-08-20",
        "percentage": 35,
        "study_minutes": 60,
    })
    assert progress_response.status_code == 201
    assert progress_response.get_json()["percentage"] == 35

    list_response = client.get("/api/v1/study-plans?page=1&per_page=10")
    assert list_response.status_code == 200
    assert list_response.get_json()["pagination"]["total"] == 1


def test_validation_and_unique_email(tmp_path):
    client = create_client(tmp_path)
    payload = {"name": "Ana", "email": "ana@example.com", "goal": "Estudar"}
    assert client.post("/api/v1/users", json=payload).status_code == 201
    assert client.post("/api/v1/users", json=payload).status_code == 400

    response = client.post("/api/v1/users", json={"name": "Sem objetivo", "email": "bad-email"})
    assert response.status_code == 400


def test_progress_range_and_cascade_delete(tmp_path):
    client = create_client(tmp_path)
    user = client.post("/api/v1/users", json={"name": "Bia", "email": "bia@example.com", "goal": "Foco"}).get_json()
    plan = client.post("/api/v1/plans", json={
        "user_id": user["id"], "title": "Plano", "objective": "Objetivo",
        "start_date": "2026-08-19", "end_date": "2026-08-20",
    }).get_json()
    invalid = client.post(f"/api/v1/plans/{plan['id']}/progress", json={
        "progress_date": "2026-08-19", "percentage": 101, "study_minutes": 10,
    })
    assert invalid.status_code == 400

    progress = client.post(f"/api/v1/plans/{plan['id']}/progress", json={
        "progress_date": "2026-08-19", "percentage": 50, "study_minutes": 10,
    }).get_json()
    client.delete(f"/api/v1/plans/{plan['id']}")
    assert client.get(f"/api/v1/progress/{progress['id']}").status_code == 404