"use client";

const STATS = [
  { label: "Ads Gerados", value: "12.847", unit: "" },
  { label: "Taxa de CTR médio", value: "4.7", unit: "%" },
  { label: "Ferramentas Ativas", value: "8", unit: "" },
  { label: "Base RAG", value: "342", unit: " docs" },
  { label: "Modelos Gemini", value: "3", unit: "" },
];

export default function StatsBar() {
  return (
    <div
      className="flex items-stretch overflow-x-auto"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(5,5,5,0.6)",
        backdropFilter: "blur(12px)",
      }}
    >
      {STATS.map((stat, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col justify-center px-6 py-4 min-w-[120px]"
          style={{
            borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              lineHeight: 1,
              color: i === 0 ? "var(--accent)" : i === 2 ? "var(--accent3)" : "var(--text)",
            }}
          >
            {stat.value}
            <span
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {stat.unit}
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-dim)",
              marginTop: "4px",
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
