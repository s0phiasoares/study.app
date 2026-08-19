import re
from datetime import date


EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def require_json(request):
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        raise ValueError("O corpo da requisição deve ser um objeto JSON")
    return payload


def required_text(payload, field):
    value = payload.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"O campo '{field}' é obrigatório")
    return value.strip()


def optional_text(payload, field, default=""):
    value = payload.get(field, default)
    if not isinstance(value, str):
        raise ValueError(f"O campo '{field}' deve ser texto")
    return value.strip()


def valid_email(value):
    if not EMAIL_PATTERN.match(value):
        raise ValueError("Informe um e-mail válido")
    return value.lower()


def valid_date(value, field):
    try:
        date.fromisoformat(value)
    except (TypeError, ValueError) as error:
        raise ValueError(f"O campo '{field}' deve usar o formato YYYY-MM-DD") from error
    return value


def positive_integer(payload, field, default=0):
    value = payload.get(field, default)
    if isinstance(value, bool) or not isinstance(value, int) or value < 0:
        raise ValueError(f"O campo '{field}' deve ser um número inteiro não negativo")
    return value


def percentage(payload):
    value = payload.get("percentage")
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not 0 <= value <= 100:
        raise ValueError("O percentual deve ser numérico entre 0 e 100")
    return float(value)


def validate_date_range(start_date, end_date):
    if date.fromisoformat(end_date) < date.fromisoformat(start_date):
        raise ValueError("A data final não pode ser anterior à data inicial")
