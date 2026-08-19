# StudyPath

> A static study planning application for turning long-term goals into daily actions.

## Project Structure

```text
.
├── index.html                 # Landing page
├── pages/                     # Application screens
│   ├── dashboard.html
│   ├── my-path.html
│   ├── planner.html
│   ├── profile.html
│   └── study.html
├── assets/
│   ├── scripts/               # Page behavior and shared browser logic
│   └── styles/                # Page-specific stylesheets
├── app/                       # Flask application and REST API
│   ├── api/                   # Routes and validation
│   └── db/                    # SQLite connection and schema
├── tests/                     # Automated API tests
└── docs/                      # Project documentation
```

## API

The API uses the `/api/v1` prefix and JSON responses:

| Resource | Endpoints |
| --- | --- |
| Users | `GET/POST /users`, `GET/PUT/DELETE /users/<id>` |
| Study plans | `GET/POST /study-plans`, `GET/PUT/DELETE /study-plans/<id>` |
| Daily goals | `GET/POST /study-plans/<id>/goals`, `GET/PUT/DELETE /goals/<id>` |
| Progress | `GET/POST /study-plans/<id>/progress`, `GET/PUT/DELETE /progress/<id>` |

List endpoints accept `page` and `per_page` query parameters. The SQLite schema is created automatically on startup.

## Run Locally

Create a virtual environment, install the dependencies and start the Flask server:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

Then open `http://localhost:5000` in a browser. The API health check is available at `http://localhost:5000/api/v1/health`.

## Conventions

- HTML pages live in `pages/` and use kebab-case names.
- CSS files live in `assets/styles/` and follow the page name.
- JavaScript files live in `assets/scripts/` and follow the page name.
- `index.html` remains at the repository root for static hosting compatibility.
