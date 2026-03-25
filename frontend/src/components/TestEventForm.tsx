import { useState } from "react";

const ACTIONS = [
  "card.create",
  "card.move",
  "card.done",
  "card.late",
  "card.expired",
];

interface Props {
  onSent: () => void;
}

export function TestEventForm({ onSent }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    action: "card.move",
    card_title: "",
    pipe_name: "",
    phase_name: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/events/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: form.action,
        card: {
          id: String(Date.now()),
          title: form.card_title || "Card sem título",
          pipe: { id: "1", name: form.pipe_name || "Pipe" },
          current_phase: { id: "1", name: form.phase_name || "Fase" },
        },
      }),
    });

    setLoading(false);
    setOpen(false);
    setForm({ action: "card.move", card_title: "", pipe_name: "", phase_name: "" });
    onSent();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={styles.triggerBtn}>
        + enviar evento de teste
      </button>
    );
  }

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>Novo evento de teste</span>
        <button onClick={() => setOpen(false)} style={styles.closeBtn}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Ação
          <select
            value={form.action}
            onChange={(e) => setForm({ ...form, action: e.target.value })}
            style={styles.input}
          >
            {ACTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Título do card
          <input
            style={styles.input}
            placeholder="ex: Proposta para Empresa X"
            value={form.card_title}
            onChange={(e) => setForm({ ...form, card_title: e.target.value })}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={styles.label}>
            Pipe
            <input
              style={styles.input}
              placeholder="ex: Vendas"
              value={form.pipe_name}
              onChange={(e) => setForm({ ...form, pipe_name: e.target.value })}
            />
          </label>

          <label style={styles.label}>
            Fase atual
            <input
              style={styles.input}
              placeholder="ex: Em análise"
              value={form.phase_name}
              onChange={(e) => setForm({ ...form, phase_name: e.target.value })}
            />
          </label>
        </div>

        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? "enviando..." : "disparar evento"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  triggerBtn: {
    background: "none",
    border: "1px dashed #cbd5e1",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 13,
    color: "#6366f1",
    cursor: "pointer",
    fontWeight: 500,
  },
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "20px",
    marginBottom: 24,
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    color: "#94a3b8",
    padding: "0 4px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 14,
  },
  label: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 6,
    fontSize: 13,
    color: "#475569",
    fontWeight: 500,
  },
  input: {
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
    background: "#f8fafc",
  },
  submitBtn: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 4,
  },
} as const;
