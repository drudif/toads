"use client";

export default function Navbar() {
  return (
    <div
      className="fixed top-0 right-0 z-50 flex items-center gap-2 px-5 py-3"
      style={{ pointerEvents: "none" }}
    >
      <span
        className="animate-pulse-dot"
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "var(--accent)",
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: "var(--accent)",
          letterSpacing: "0.1em",
        }}
      >
        GEMINI ONLINE
      </span>
    </div>
  );
}
