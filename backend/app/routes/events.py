from flask import Blueprint, Response, jsonify, request, stream_with_context

from ..database import db
from ..models import PipefyEvent
from .sse import broadcast, event_stream, new_listener

bp = Blueprint("events", __name__, url_prefix="/api")


@bp.get("/events")
def list_events():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 20, type=int), 100)
    action = request.args.get("action")

    query = PipefyEvent.query.order_by(PipefyEvent.received_at.desc())

    if action:
        query = query.filter(PipefyEvent.action == action)

    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "events": [e.to_dict() for e in paginated.items],
        "total": paginated.total,
        "pages": paginated.pages,
        "page": page,
    })


@bp.get("/events/stream")
def stream_events():
    # SSE em vez de WebSocket — mais simples e suficiente para fluxo unidirecional
    q = new_listener()
    return Response(
        stream_with_context(event_stream(q)),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # desativa buffer do nginx/proxy
        },
    )


@bp.delete("/events")
def clear_events():
    deleted = db.session.query(PipefyEvent).delete()
    db.session.commit()
    # avisa os clientes SSE pra limpar o estado local
    broadcast({"__clear": True})
    return jsonify({"deleted": deleted})


@bp.post("/events/test")
def send_test_event():
    """Dispara um evento fake sem precisar do Pipefy — útil para demos."""
    body = request.get_json(force=True, silent=True) or {}

    from ..routes.webhooks import _extract_fields
    fields = _extract_fields(body.get("data", body))

    event = PipefyEvent(**fields, raw_payload=body)
    db.session.add(event)
    db.session.commit()

    broadcast(event.to_dict())
    return jsonify(event.to_dict()), 201


@bp.get("/stats")
def stats():
    from sqlalchemy import func
    from ..database import db

    rows = (
        db.session.query(PipefyEvent.action, func.count().label("count"))
        .group_by(PipefyEvent.action)
        .all()
    )

    total = sum(r.count for r in rows)

    return jsonify({
        "total": total,
        "by_action": {r.action: r.count for r in rows},
    })
