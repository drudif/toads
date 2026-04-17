import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieveChunks, isIndexReady } from "@/lib/rag";
import { resolveSources } from "@/lib/sources";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const embModel = genai.getGenerativeModel({ model: "gemini-embedding-001" });
const genModel = genai.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_BASE = [
  "Voce e T.O.A.Ds - criador de Text-Only Ads (anuncios 100% em texto, zero elementos visuais).",
  "",
  "REGRA MAIS IMPORTANTE: voce so pode usar como referencia o conteudo que esta entre as tags <knowledge> e </knowledge> na mensagem do usuario. Nada fora disso. Se o conteudo nao estiver la, diga que nao encontrou referencia.",
  "",
  "REGRAS:",
  "- Nunca sugira imagens, videos ou recursos visuais",
  "- Trabalhe exclusivamente com texto",
  "- Seja direto e objetivo",
  "",
  "FLUXO:",
  "1. So pergunte mais se estiver faltando produto/servico OU objetivo da campanha. Se tiver esses dois, JA GERE os anuncios.",
  "2. Leia o conteudo em <knowledge>, extraia as praticas relevantes e gere 5 variacoes de texto para o formato e plataforma indicados",
  "3. Apos cada variacao, em 1 linha: cite qual pratica especifica do <knowledge> foi aplicada e o nome exato da fonte de <sources> entre colchetes",
  "4. Apos aprovacao do usuario, gere apenas os textos sem justificativas",
].join("\n");

const SYSTEM_APPROVED = [
  "Voce e T.O.A.Ds - especialista em Text-Only Ads.",
  "Tom aprovado. A partir de agora: gere apenas os textos, sem justificativas, sem explicacoes.",
  "Formato: liste as variacoes numeradas, uma por linha.",
].join("\n");

async function getRagContext(briefing: string) {
  if (!isIndexReady()) return { context: "", sources: [] as ReturnType<typeof resolveSources> };
  try {
    const result = await embModel.embedContent(briefing);
    const chunks = retrieveChunks(result.embedding.values, 6);
    const context = chunks.map((c) => c.text).join("\n\n---\n\n");
    const filenames = [...new Set(chunks.map((c) => c.source))];
    const sources = resolveSources(filenames);
    return { context, sources };
  } catch {
    return { context: "", sources: [] as ReturnType<typeof resolveSources> };
  }
}

export async function POST(req: NextRequest) {
  const {
    messages,
    format,
    platform,
    tone,
    approved = false,
  }: {
    messages: Message[];
    format: string;
    platform: string;
    tone: string;
    approved: boolean;
  } = await req.json();

  if (!messages?.length) {
    return NextResponse.json({ error: "messages obrigatorio" }, { status: 400 });
  }

  const userText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" ");

  const { context: ragContext, sources } = await getRagContext(
    `${format} ${platform} ${tone} ${userText}`
  );

  const systemPrompt = approved ? SYSTEM_APPROVED : SYSTEM_BASE;

  const cleanRag = ragContext
    ? ragContext.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ").slice(0, 12000)
    : "";

  const sourcesBlock = sources.length
    ? "<sources>\n" + sources.map((s) => "- " + s.label).join("\n") + "\n</sources>"
    : "";

  const knowledgeBlock = cleanRag
    ? "<knowledge>\n" + cleanRag + "\n</knowledge>\n\n" + sourcesBlock + "\n\n"
    : "";

  const contextLine = "[Plataforma: " + platform + " | Tom: " + tone + "]\n\n";

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: m.content }],
  }));

  // Injetar RAG + contexto diretamente na mensagem do usuario
  const lastUserMessage = knowledgeBlock + contextLine + messages[messages.length - 1].content;

  const chat = genModel.startChat({
    history,
    systemInstruction: {
      role: "system",
      parts: [{ text: systemPrompt }],
    },
  });

  try {
    const result = await chat.sendMessage(lastUserMessage);
    const raw = result.response.text();
    // Remover markdown bold/italic (asteriscos)
    const text = raw.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
    return NextResponse.json({ reply: text, sources });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[generate] Gemini error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
