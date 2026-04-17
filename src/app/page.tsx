"use client";

import IframeBackground from "@/components/IframeBackground";
import Navbar from "@/components/Navbar";
import TickerBar from "@/components/TickerBar";
import QuickGenPanel from "@/components/QuickGenPanel";

export default function HomePage() {
  return (
    <div className="relative min-h-screen" style={{ background: "transparent" }}>
      <div className="noise-overlay" />
      <IframeBackground />
      <Navbar />

      {/* TOADS wordmark — z-1, pointer-events:none, sits above iframe */}
      <div
        className="fixed"
        style={{
          zIndex: 1,
          pointerEvents: "none",
          top: "0px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div className="flex flex-col items-end">
          <span
            style={{
              fontFamily: "var(--font-dxburst), sans-serif",
              fontSize: "clamp(84px, 15.4vw, 210px)",
              lineHeight: 1,
              color: "var(--accent)",
              letterSpacing: "0.1em",
              userSelect: "none",
              marginTop: "20px",
            }}
          >
            T.O.ADs
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(10px, 1vw, 13px)",
              color: "var(--text-muted)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginTop: "4px",
            }}
          >
            <span style={{ color: "var(--accent)" }}>T</span>ext{" "}
            <span style={{ color: "var(--accent)" }}>O</span>nly{" "}
            <span style={{ color: "var(--accent)" }}>ads</span> by CONVERT
          </span>
        </div>
      </div>

      <main
        className="relative flex items-center justify-center"
        style={{
          zIndex: 2,
          pointerEvents: "none",
          minHeight: "100vh",
          paddingTop: "0px",
          paddingBottom: "36px",
        }}
      >
        <div style={{ pointerEvents: "auto", width: "100%", maxWidth: "960px", padding: "0 24px", marginTop: "520px" }}>
          <QuickGenPanel />
        </div>
      </main>

      <TickerBar />
    </div>
  );
}
