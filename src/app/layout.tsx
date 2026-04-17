import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const dxBurst = localFont({
  src: "./DxBurst-Regular.otf",
  variable: "--font-dxburst",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TOADS — Ad Copy Intelligence Hub",
  description: "LLM-powered ad creation hub with RAG knowledge base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`h-full ${dxBurst.variable}`}>
      <body className="min-h-full flex flex-col" style={{ background: "#050505" }}>{children}</body>
    </html>
  );
}
