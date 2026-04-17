"use client";

const TICKERS = [
  "HOOK FORTE ↗",
  "CTA DIRETO ↗",
  "BENEFÍCIO CLARO ↗",
  "PROVA SOCIAL ↗",
  "URGÊNCIA REAL ↗",
  "ESPECIFICIDADE ↗",
  "EMPATIA COM DOR ↗",
  "PROMESSA ÚNICA ↗",
  "LINGUAGEM DO AVATAR ↗",
  "OBJEÇÃO QUEBRADA ↗",
];

const TICKERS_DOUBLED = [...TICKERS, ...TICKERS];

export default function TickerBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(5,5,5,0.85)",
        backdropFilter: "blur(12px)",
        height: "36px",
      }}
    >
      <div
        className="animate-marquee flex items-center h-full"
        style={{ width: "max-content" }}
      >
        {TICKERS_DOUBLED.map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-6">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                color: i % 3 === 0 ? "var(--accent)" : i % 3 === 1 ? "var(--text-muted)" : "var(--accent2)",
              }}
            >
              {item}
            </span>
            <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "8px" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
