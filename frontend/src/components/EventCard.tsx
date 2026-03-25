import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { PipefyEvent } from "../types";
import { ActionBadge } from "./ActionBadge";

interface Props {
  event: PipefyEvent;
  isNew?: boolean;
}

export function EventCard({ event, isNew }: Props) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid",
        borderColor: isNew ? "#6366f1" : "#e2e8f0",
        borderRadius: 10,
        padding: "14px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        transition: "border-color 0.3s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
        <ActionBadge action={event.action} />
        <span style={{ fontSize: 12, color: "#94a3b8" }}>
          {formatDistanceToNow(new Date(event.received_at), {
            addSuffix: true,
            locale: ptBR,
          })}
        </span>
      </div>

      {event.card_title && (
        <span style={{ fontWeight: 500, fontSize: 14, color: "#1e293b" }}>
          {event.card_title}
        </span>
      )}

      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#64748b" }}>
        {event.pipe_name && <span>pipe: {event.pipe_name}</span>}
        {event.phase_name && <span>fase: {event.phase_name}</span>}
      </div>
    </div>
  );
}
