"use client";

interface ToolCardProps {
  index: number;
  name: string;
  description: string;
  type: string;
  accentColor?: string;
  uses?: number;
  badge?: string;
}

export default function ToolCard({
  index,
  name,
  description,
  type,
  accentColor = "var(--accent)",
  uses = 0,
  badge,
}: ToolCardProps) {
  const numStr = String(index + 1).padStart(2, "0");

  return (
    <div
      className="tool-card"
      style={{
        background: "rgba(10,10,10,0.75)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
        padding: "28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Number watermark */}
      <span
        style={{
          position: "absolute",
          top: "-10px",
          right: "16px",
          fontFamily: "var(--font-display)",
          fontSize: "80px",
          color: "rgba(255,255,255,0.03)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {numStr}
      </span>

      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "3px",
          height: "100%",
          background: accentColor,
          opacity: 0.7,
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="tag"
              style={{
                borderColor: `${accentColor}44`,
                color: accentColor,
                fontFamily: "var(--font-mono)",
              }}
            >
              {type}
            </span>
            {badge && (
              <span
                className="tag"
                style={{
                  borderColor: "rgba(255,77,0,0.35)",
                  color: "var(--accent2)",
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "26px",
              lineHeight: 1,
              letterSpacing: "0.04em",
              color: "var(--text)",
            }}
          >
            {name}
          </h3>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-dim)",
            letterSpacing: "0.08em",
          }}
        >
          {numStr}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "13px",
          color: "var(--text-muted)",
          lineHeight: "1.6",
          marginBottom: "24px",
        }}
      >
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-dim)",
            letterSpacing: "0.06em",
          }}
        >
          {uses.toLocaleString("pt-BR")} gerações
        </span>
        <button
          className="btn-primary"
          style={{ padding: "9px 18px", fontSize: "10px" }}
        >
          USAR →
        </button>
      </div>
    </div>
  );
}
