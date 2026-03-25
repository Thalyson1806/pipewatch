from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from .database import db
from .config import Config


def create_app(config=Config):
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    Migrate(app, db)

    # CORS restrito só às rotas /api para não expor o endpoint de webhook
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    from .routes.webhooks import bp as webhooks_bp
    from .routes.events import bp as events_bp

    app.register_blueprint(webhooks_bp)
    app.register_blueprint(events_bp)

    return app
 