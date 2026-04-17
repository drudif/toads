/**
 * build-index.mjs
 * Lê todos os PDFs de knowledge-base/, extrai texto, gera embeddings via Gemini
 * e salva src/data/rag-index.json
 *
 * Uso: node scripts/build-index.mjs
 * Requer: GEMINI_API_KEY no ambiente (ou .env.local)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Carregar .env.local manualmente (sem dotenv)
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY não encontrada. Adicione ao .env.local");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_DIR = path.resolve(__dirname, "../knowledge-base");
const OUT_DIR = path.resolve(__dirname, "../src/data");
const OUT_FILE = path.join(OUT_DIR, "rag-index.json");

const CHUNK_SIZE = 800;   // chars por chunk
const CHUNK_OVERLAP = 150; // overlap entre chunks

// Importar pdf-parse dinamicamente
const { PDFParse, VerbosityLevel } = await import("pdf-parse");

const genai = new GoogleGenerativeAI(API_KEY);
const embModel = genai.getGenerativeModel({ model: "gemini-embedding-001" });

function chunkText(text, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    i += size - overlap;
  }
  return chunks;
}

async function embedChunk(text, retries = 5) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await embModel.embedContent(text);
      return result.embedding.values;
    } catch (e) {
      if (e.message?.includes("429") && attempt < retries - 1) {
        const wait = 40000 + attempt * 10000; // 40s, 50s, 60s...
        console.warn(`     ⏳ Rate limit, aguardando ${wait / 1000}s...`);
        await new Promise((r) => setTimeout(r, wait));
      } else {
        throw e;
      }
    }
  }
}

async function processPdf(filePath) {
  const buf = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buf, verbosity: 0 });
  await parser.load();
  const result = await parser.getText();
  // getText retorna TextResult com propriedade text ou pages
  const raw = typeof result === "string"
    ? result
    : result?.text ?? result?.pages?.map((p) => p.text ?? p.content ?? "").join(" ") ?? "";
  const clean = raw.replace(/\s+/g, " ").trim();
  await parser.destroy();
  return clean;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(KB_DIR).filter((f) => f.endsWith(".pdf"));
  console.log(`📚 Encontrados ${files.length} PDFs`);

  const index = [];

  for (const file of files) {
    console.log(`  → Processando: ${file}`);
    try {
      const text = await processPdf(path.join(KB_DIR, file));
      const chunks = chunkText(text);
      console.log(`     ${chunks.length} chunks`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (chunk.trim().length < 80) continue; // ignorar chunks muito pequenos
        try {
          const embedding = await embedChunk(chunk);
          index.push({ source: file, chunk: i, text: chunk, embedding });
          // Rate limit: free tier permite 100 req/min → ~650ms por chunk
          await new Promise((r) => setTimeout(r, 650));
        } catch (e) {
          console.warn(`     ⚠ Erro no chunk ${i}: ${e.message}`);
        }
      }
    } catch (e) {
      console.warn(`  ⚠ Erro no arquivo ${file}: ${e.message}`);
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(index));
  console.log(`\n✅ Índice salvo: ${OUT_FILE}`);
  console.log(`   Total de chunks indexados: ${index.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
