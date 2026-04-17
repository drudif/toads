/**
 * RAG utilities — carrega o índice e faz busca por similaridade cosine
 */

import path from "path";
import fs from "fs";

export interface RagChunk {
  source: string;
  chunk: number;
  text: string;
  embedding: number[];
}

let _index: RagChunk[] | null = null;

function loadIndex(): RagChunk[] {
  if (_index) return _index;
  const indexPath = path.resolve(process.cwd(), "src/data/rag-index.json");
  if (!fs.existsSync(indexPath)) {
    throw new Error("RAG index não encontrado. Execute: node scripts/build-index.mjs");
  }
  _index = JSON.parse(fs.readFileSync(indexPath, "utf-8")) as RagChunk[];
  return _index;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function retrieveChunks(queryEmbedding: number[], topK = 6): RagChunk[] {
  const index = loadIndex();
  const scored = index.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

export function isIndexReady(): boolean {
  const indexPath = path.resolve(process.cwd(), "src/data/rag-index.json");
  return fs.existsSync(indexPath);
}
