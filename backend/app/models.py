from datetime import datetime, timezone

from .database import db


class PipefyEvent(db.Model):
    __tablename__ = "pipefy_events"

    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(100), nullable=False, index=True)  # ex: "card.move"
    card_id = db.Column(db.String(50), nullable=True)
    card_title = db.Column(db.String(500), nullable=True)
    pipe_id = db.Column(db.String(50), nullable=True)
    pipe_name = db.Column(db.String(200), nullable=True)
    phase_name = db.Column(db.String(200), nullable=True)

    # payload bruto guardado pra reprocessar se precisar
    raw_payload = db.Column(db.JSON, nullable=False)

    received_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "action": self.action,
            "card_id": self.card_id,
            "card_title": self.card_title,
            "pipe_id": self.pipe_id,
            "pipe_name": self.pipe_name,
            "phase_name": self.phase_name,
            "received_at": self.received_at.isoformat(),
        }
