import json
import queue
import threading

# cada cliente SSE conectado recebe sua própria fila
_listeners: list[queue.Queue] = []
_lock = threading.Lock()


def _add_listener() -> queue.Queue:
    q: queue.Queue = queue.Queue(maxsize=50)
    with _lock:
        _listeners.append(q)
    return q


def _remove_listener(q: queue.Queue) -> None:
    with _lock:
        _listeners.remove(q)


def broadcast(data: dict) -> None:
    message = f"data: {json.dumps(data)}\n\n"
    with _lock:
        for q in _listeners:
            try:
                q.put_nowait(message)
            except queue.Full:
                pass  # cliente lento — descarta o evento pra não bloquear


def event_stream(q: queue.Queue):
    try:
        yield ": keep-alive\n\n"  # evita timeout no Cloud Run (60s como padrão)
        while True:
            try:
                message = q.get(timeout=25)
                yield message
            except queue.Empty:
                yield ": keep-alive\n\n"  # mantém a conexão viva enquanto não chega evento
    except GeneratorExit:
        pass
    finally:
        _remove_listener(q)


def new_listener():
    return _add_listener()
