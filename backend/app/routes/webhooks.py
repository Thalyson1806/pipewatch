import hashlib
import hmac
import json

from flask import Blueprint, current_app, request

from ..database import db
from ..models import PipefyEvent
from .sse import broadcast

bp = Blueprint("webhooks", __name__)


def _verify_signature(payload: bytes, header_sig: str) -> bool:
    secret = current_app.config["PIPEFY_WEBHOOK_SECRET"]
    if not secret:
        return True  # assinatura desativada em dev

    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", header_sig)


def _extract_fields(data: dict) -> dict:
    """Normaliza os campos relevantes do payload do Pipefy."""
    card = data.get("card", {})
    pipe = card.get("pipe", {})
    phase = card.get("current_phase", {})

    return {
        "action": data.get("action", "unknown"),
        "card_id": str(card.get("id", "")),
        "card_title": card.get("title", ""),
        "pipe_id": str(pipe.get("id", "")),
        "pipe_name": pipe.get("name", ""),
        "phase_name": phase.get("name", ""),
    }


@bp.post("/webhook/pipefy")
def receive_webhook():
    sig = request.headers.get("X-Pipefy-Signature", "")
    if not _verify_signature(request.data, sig):
        return {"error": "invalid signature"}, 401

    payload = request.get_json(force=True, silent=True)
    if not payload:
        return {"error": "invalid JSON"}, 400

    fields = _extract_fields(payload.get("data", {}))

    event = PipefyEvent(**fields, raw_payload=payload)
    db.session.add(event)
    db.session.commit()

    # notifica clientes SSE em tempo real
    broadcast(event.to_dict())

    return {"received": True, "event_id": event.id}, 201
