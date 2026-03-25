interface Props {
  connected: boolean;
}

export function StatusBadge({ connected }: Props) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        color: connected ? "#22c55e" : "#ef4444",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: connected ? "#22c55e" : "#ef4444",
          animation: connected ? "pulse 2s infinite" : "none",
        }}
      />
      {connected ? "conectado" : "desconectado"}
    </span>
  );
}
