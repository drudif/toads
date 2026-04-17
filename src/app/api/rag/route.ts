/**
 * POST /api/rag
 * Recebe { query: string }, gera embedding via Gemini, retorna chunks relevantes
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieveChunks, isIndexReady } from "@/lib/rag";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const embModel = genai.getGenerativeModel({ model: "gemini-embedding-001" });

export async function POST(req: NextRequest) {
  if (!isIndexReady()) {
    return NextResponse.json(
      { error: "Índice RAG não encontrado. Execute: node scripts/build-index.mjs" },
      { status: 503 }
    );
  }

  const { query } = await req.json();
  if (!query?.trim()) {
    return NextResponse.json({ error: "query obrigatória" }, { status: 400 });
  }

  const result = await embModel.embedContent(query);
  const embedding = result.embedding.values;
  const chunks = retrieveChunks(embedding, 6);

  return NextResponse.json({
    chunks: chunks.map((c) => ({ source: c.source, text: c.text })),
  });
}
