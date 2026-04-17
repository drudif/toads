"use client";

import { useState, useRef, useEffect } from "react";

const PLATFORMS = ["Text Ad", "PMax", "Demand Gen", "Título YouTube", "Descrição YouTube"];
const TONES = ["Direto", "Emocional", "Urgente", "Educativo", "Provocativo"];

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Source {
  file: string;
  label: string;
  url: string;
}

function SelectorGroup({
  label,
  options,
  active,
  onChange,
  activeColor,
  activeBorder,
  activeBg,
}: {
  label: string;
  options: string[];
  active: string;
  onChange: (v: string) => void;
  activeColor: string;
  activeBorder: string;
  activeBg: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-dim)",
        }}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              padding: "5px 11px",
              background: active === o ? activeBg : "rgba(255,255,255,0.03)",
              border: active === o ? `1px solid ${activeBorder}` : "1px solid rgba(255,255,255,0.06)",
              color: active === o ? activeColor : "var(--text-muted)",
              cursor: "pointer",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function RagMonitor({ sources, loading }: { sources: Source[]; loading: boolean }) {
  return (
    <div
      style={{
        padding: "10px 14px",
        background: "rgba(0,229,255,0.03)",
        border: "1px solid rgba(0,229,255,0.1)",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--accent3)",
          marginBottom: sources.length ? "6px" : 0,
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {loading ? (
          <span
            className="animate-spin"
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              border: "1.5px solid rgba(0,229,255,0.3)",
              borderTopColor: "var(--accent3)",
              borderRadius: "50%",
            }}
          />
        ) : (
          <span>◈</span>
        )}
        {loading
          ? "consultando base de conhecimento..."
          : `rag — ${sources.length} fonte${sources.length !== 1 ? "s" : ""} consultada${sources.length !== 1 ? "s" : ""}`}
      </div>
      {sources.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {sources.map((s, i) => (
            <div
              key={i}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.04em",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ color: "rgba(0,229,255,0.25)" }}>↳</span>
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "rgba(0,229,255,0.6)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(0,229,255,0.2)",
                    transition: "color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.color = "var(--accent3)";
                    (e.target as HTMLAnchorElement).style.borderBottomColor = "var(--accent3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.color = "rgba(0,229,255,0.6)";
                    (e.target as HTMLAnchorElement).style.borderBottomColor = "rgba(0,229,255,0.2)";
                  }}
                >
                  {s.label}
                </a>
              ) : (
                <span style={{ color: "rgba(0,229,255,0.5)" }}>{s.label}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QuickGenPanel() {
  const [platform, setPlatform] = useState("Text Ad");
  const [tone, setTone] = useState("Direto");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [approved, setApproved] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setSources([] as Source[]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          format: platform,
          platform,
          tone,
          approved,
        }),
      });

      const data = await res.json();
      if (data.sources) setSources(data.sources);
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Erro: ${data.error}` },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Erro de rede: ${err instanceof Error ? err.message : String(err)}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleApprove = () => {
    setApproved(true);
    sendMessage("Aprovado. Gere mais 5 variações.");
  };

  const handleReset = () => {
    setMessages([]);
    setApproved(false);
    setInput("");
    setSources([] as Source[]);
  };

  const hasConversation = messages.length > 0;
  const showRagMonitor = loading || sources.length > 0;

  return (
    <div
      style={{
        background: "rgba(8,8,8,0.85)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        padding: "28px 32px",
      }}
    >
      {/* Top row: selectors + badges */}
      <div className="flex items-start justify-between gap-6 mb-5">
        <div className="flex gap-8 flex-wrap">
          <SelectorGroup
            label="Plataforma"
            options={PLATFORMS}
            active={platform}
            onChange={setPlatform}
            activeColor="var(--accent3)"
            activeBorder="rgba(0,229,255,0.35)"
            activeBg="rgba(0,229,255,0.08)"
          />
          <SelectorGroup
            label="Tom"
            options={TONES}
            active={tone}
            onChange={setTone}
            activeColor="var(--accent2)"
            activeBorder="rgba(255,77,0,0.4)"
            activeBg="rgba(255,77,0,0.1)"
          />
        </div>
        <div className="flex flex-col gap-2 items-end" style={{ flexShrink: 0 }}>
          <div
            className="tag"
            style={{ borderColor: "rgba(0,229,255,0.3)", color: "var(--accent3)", whiteSpace: "nowrap" }}
          >
            RAG ATIVO
          </div>
          {approved && (
            <div
              className="tag"
              style={{ borderColor: "rgba(200,241,53,0.3)", color: "var(--accent)", whiteSpace: "nowrap" }}
            >
              TOM APROVADO
            </div>
          )}
        </div>
      </div>

      {/* RAG Monitor */}
      {showRagMonitor && <RagMonitor sources={sources} loading={loading} />}

      {/* Conversation thread */}
      {hasConversation && (
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            marginBottom: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "85%",
                  padding: "12px 16px",
                  background: msg.role === "user" ? "rgba(200,241,53,0.08)" : "rgba(255,255,255,0.03)",
                  border: msg.role === "user" ? "1px solid rgba(200,241,53,0.2)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: msg.role === "user" ? "var(--accent)" : "var(--text-dim)",
                    marginBottom: "6px",
                  }}
                >
                  {msg.role === "user" ? "VOCÊ" : "T.O.A.Ds"}
                </div>
                <pre
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: "var(--text)",
                    lineHeight: "1.7",
                    whiteSpace: "pre-wrap",
                    margin: 0,
                  }}
                >
                  {msg.content}
                </pre>
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      )}

      {/* Action buttons */}
      {messages.length > 0 && messages[messages.length - 1].role === "assistant" && !loading && (
        <div className="flex gap-2 mb-4">
          {!approved && (
            <button
              onClick={handleApprove}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "7px 14px",
                background: "rgba(200,241,53,0.1)",
                border: "1px solid rgba(200,241,53,0.3)",
                color: "var(--accent)",
                cursor: "pointer",
              }}
            >
              APROVAR TOM →
            </button>
          )}
          <button
            onClick={handleReset}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "7px 14px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-dim)",
              cursor: "pointer",
            }}
          >
            NOVO BRIEFING
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 items-stretch">
        <textarea
          className="input-field"
          rows={2}
          placeholder={
            hasConversation
              ? "Continue a conversa ou responda as perguntas..."
              : "Descreva o produto, oferta ou contexto do anúncio..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ resize: "none", flex: 1 }}
        />
        <button
          className="btn-primary"
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          style={{
            opacity: loading || !input.trim() ? 0.5 : 1,
            flexShrink: 0,
            alignSelf: "stretch",
            height: "auto",
            padding: "0 28px",
            fontSize: "11px",
          }}
        >
          {loading ? (
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span
                className="animate-spin"
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  border: "2px solid #000",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                }}
              />
              <span style={{ fontSize: "9px", letterSpacing: "0.1em" }}>GERANDO</span>
            </span>
          ) : (
            <span style={{ writingMode: "horizontal-tb" }}>
              {hasConversation ? "ENVIAR →" : "GERAR →"}
            </span>
          )}
        </button>
      </div>

      <div
        style={{
          marginTop: "8px",
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          color: "var(--text-dim)",
          letterSpacing: "0.08em",
        }}
      >
        Enter para enviar · Shift+Enter para nova linha
      </div>
    </div>
  );
}
