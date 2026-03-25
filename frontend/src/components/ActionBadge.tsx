const ACTION_COLORS: Record<string, { bg: string; color: string }> = {
  "card.create": { bg: "#dcfce7", color: "#166534" },
  "card.move": { bg: "#dbeafe", color: "#1e40af" },
  "card.done": { bg: "#f3e8ff", color: "#6b21a8" },
  "card.expired": { bg: "#fee2e2", color: "#991b1b" },
  "card.late": { bg: "#ffedd5", color: "#9a3412" },
};

const DEFAULT = { bg: "#f1f5f9", color: "#475569" };

interface Props {
  action: string;
}

export function ActionBadge({ action }: Props) {
  const style = ACTION_COLORS[action] ?? DEFAULT;

  return (
    <span
      style={{
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: "12px",
        fontWeight: 600,
        background: style.bg,
        color: style.color,
      }}
    >
      {action}
    </span>
  );
}
