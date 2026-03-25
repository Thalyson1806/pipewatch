import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")

    # fallback aponta pro Docker Compose local
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "postgresql://pipewatch:pipewatch@localhost:5432/pipewatch"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # usado pra validar assinatura HMAC dos webhooks do Pipefy
    PIPEFY_WEBHOOK_SECRET = os.environ.get("PIPEFY_WEBHOOK_SECRET", "")

    # string separada por vírgula pra facilitar configurar no Cloud Run
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
