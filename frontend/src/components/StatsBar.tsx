import type { StatsResponse } from "../types";

interface Props {
  stats: StatsResponse;
}

export function StatsBar({ stats }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <StatCard label="total de eventos" value={stats.total} highlight />
      {Object.entries(stats.by_action).map(([action, count]) => (
        <StatCard key={action} label={action} value={count} />
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight ? "#6366f1" : "#f8fafc",
        color: highlight ? "#fff" : "#1e293b",
        borderRadius: 10,
        padding: "12px 20px",
        minWidth: 120,
        border: "1px solid",
        borderColor: highlight ? "#6366f1" : "#e2e8f0",
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{label}</div>
    </div>
  );
}
