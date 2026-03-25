import { useRef, useState } from "react";
import { EventCard } from "./components/EventCard";
import { StatsBar } from "./components/StatsBar";
import { StatusBadge } from "./components/StatusBadge";
import { TestEventForm } from "./components/TestEventForm";
import { useEvents } from "./hooks/useEvents";

const ACTIONS = ["", "card.create", "card.move", "card.done", "card.late", "card.expired"];

export default function App() {
  const [actionFilter, setActionFilter] = useState("");
  const { events, stats, connected, loading, refetch } = useEvents(actionFilter);
  const latestIdRef = useRef<number | null>(null);

  async function handleClear() {
    await fetch("/api/events", { method: "DELETE" });
    // o SSE já recebe o sinal __clear e limpa o estado local
  }

  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={{ color: "#64748b" }}>carregando eventos...</p>
      </div>
    );
  }

  const latestId = events[0]?.id ?? null;
  const prevLatestId = latestIdRef.current;
  latestIdRef.current = latestId;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Pipewatch</h1>
          <p style={styles.subtitle}>eventos do Pipefy em tempo real</p>
        </div>
        <StatusBadge connected={connected} />
      </header>

      {stats && (
        <section style={styles.section}>
          <StatsBar stats={stats} />
        </section>
      )}

      <section style={styles.section}>
        <TestEventForm onSent={refetch} />
      </section>

      <section style={styles.section}>
        <div style={styles.listHeader}>
          <h2 style={styles.sectionTitle}>
            eventos recentes
            {events.length > 0 && (
              <span style={styles.count}>{events.length}</span>
            )}
          </h2>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={styles.select}
            >
              {ACTIONS.map((a) => (
                <option key={a} value={a}>{a || "todos os tipos"}</option>
              ))}
            </select>

            {events.length > 0 && (
              <button onClick={handleClear} style={styles.clearBtn}>
                limpar tudo
              </button>
            )}
          </div>
        </div>

        {events.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: 14 }}>
            nenhum evento ainda. use o formulário acima ou mova um card no Pipefy.
          </p>
        ) : (
          <div style={styles.list}>
            {events.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                isNew={i === 0 && event.id !== prevLatestId}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "32px 20px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  centered: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: "#0f172a",
  },
  subtitle: {
    margin: "4px 0 0",
    fontSize: 14,
    color: "#64748b",
  },
  section: {
    marginBottom: 32,
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap" as const,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#475569",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  count: {
    background: "#e2e8f0",
    color: "#475569",
    borderRadius: 999,
    padding: "1px 8px",
    fontSize: 12,
    fontWeight: 500,
  },
  select: {
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 13,
    color: "#475569",
    background: "#f8fafc",
    cursor: "pointer",
  },
  clearBtn: {
    background: "none",
    border: "1px solid #fecaca",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 13,
    color: "#ef4444",
    cursor: "pointer",
    fontWeight: 500,
  },
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
  },
} as const;
