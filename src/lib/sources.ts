export interface SourceMeta {
  label: string;
  url: string;
}

// Todos os arquivos servidos via /public/docs/
function pdf(filename: string, label: string): SourceMeta {
  return { label, url: "/docs/" + filename };
}

export const SOURCE_MAP: Record<string, SourceMeta> = {
  "1_TikTok_Ignite_Framework.pdf": pdf("1_TikTok_Ignite_Framework.pdf", "TikTok Ignite Framework"),
  "2_TikTok_Ignite_Insights.pdf": pdf("2_TikTok_Ignite_Insights.pdf", "TikTok Ignite Insights"),
  "2_TikTok_Ignite_Insights1.pdf": pdf("2_TikTok_Ignite_Insights1.pdf", "TikTok Ignite Insights Vol.2"),
  "Anunciosdedisplay_umguiadepraticasrecomendadasparacriativos-AjudadoGoogleAds.pdf": pdf(
    "Anunciosdedisplay_umguiadepraticasrecomendadasparacriativos-AjudadoGoogleAds.pdf",
    "Google Ads — Anuncios de Display"
  ),
  "BoaspraticasparacriativosdoStories_CentraldeAjudadaMetaparaEmpresas.pdf": pdf(
    "BoaspraticasparacriativosdoStories_CentraldeAjudadaMetaparaEmpresas.pdf",
    "Meta — Boas Praticas para Stories"
  ),
  "CREATIVEDAYCONVERT19.08.pdf": pdf("CREATIVEDAYCONVERT19.08.pdf", "Creative Day CONVERT"),
  "CreativeExcellenceGOOGLE.pdf": pdf("CreativeExcellenceGOOGLE.pdf", "Google — Creative Excellence"),
  "GERALA.pdf": pdf("GERALA.pdf", "Guia Geral de Criativos A"),
  "GERALB.pdf": pdf("GERALB.pdf", "Guia Geral de Criativos B"),
  "GuiadeexcelenciaemcriativosparacampanhasDemandGen-GoogleAdsAjuda.pdf": pdf(
    "GuiadeexcelenciaemcriativosparacampanhasDemandGen-GoogleAdsAjuda.pdf",
    "Google Ads — Excelencia em Criativos Demand Gen"
  ),
  "Guiadepraticasrecomendadasparaanunciosresponsivosdedisplay-AjudadoGoogleAds.pdf": pdf(
    "Guiadepraticasrecomendadasparaanunciosresponsivosdedisplay-AjudadoGoogleAds.pdf",
    "Google Ads — Anuncios Responsivos de Display"
  ),
  "MetaRealTalkAgencySuperpack.pdf": pdf("MetaRealTalkAgencySuperpack.pdf", "Meta — Real Talk Agency Superpack"),
  "OABCDdacriacaodeanunciosemvideoeficientes-PublicidadenoYouTube.pdf": pdf(
    "OABCDdacriacaodeanunciosemvideoeficientes-PublicidadenoYouTube.pdf",
    "YouTube — ABCD da Criacao de Anuncios"
  ),
  "OtimizeascampanhasdaRededeDisplay-GoogleAdsAjuda.pdf": pdf(
    "OtimizeascampanhasdaRededeDisplay-GoogleAdsAjuda.pdf",
    "Google Ads — Otimize Campanhas de Display"
  ),
  "Praticasrecomendadasparaodesempenhodoscriativos-GoogleAdsAjuda.pdf": pdf(
    "Praticasrecomendadasparaodesempenhodoscriativos-GoogleAdsAjuda.pdf",
    "Google Ads — Praticas para Desempenho de Criativos"
  ),
  "ReelsAdsGuide.pdf": pdf("ReelsAdsGuide.pdf", "Meta — Guia de Anuncios em Reels"),
  "ThoughtPaper_CreativeTacticsForPerformance_ptbr.pdf": pdf(
    "ThoughtPaper_CreativeTacticsForPerformance_ptbr.pdf",
    "Meta — Creative Tactics for Performance"
  ),
  "TikTok_Follow_Me_Best_Practices_Playbook_EN.pdf": pdf(
    "TikTok_Follow_Me_Best_Practices_Playbook_EN.pdf",
    "TikTok — Follow Me Best Practices"
  ),
  "TikTok_Playground-Performance.pdf": pdf("TikTok_Playground-Performance.pdf", "TikTok — Playground Performance"),
  "Tiktok-CreativeBestPractices.pdf": pdf("Tiktok-CreativeBestPractices.pdf", "TikTok — Creative Best Practices"),
  "VejaosABCDsdoYouTube-ThinkwithGoogle.pdf": pdf(
    "VejaosABCDsdoYouTube-ThinkwithGoogle.pdf",
    "Think with Google — ABCDs do YouTube"
  ),
  "codigos_criativos_pt_BR.pdf": pdf("codigos_criativos_pt_BR.pdf", "Meta — Codigos Criativos"),
  "creative_best_practices_guide.pdf": pdf("creative_best_practices_guide.pdf", "Guia de Melhores Praticas Criativas"),
  "pt-BR_Criativos_mais_eficientes_para_seu_marketing_de_performance.pdf": pdf(
    "pt-BR_Criativos_mais_eficientes_para_seu_marketing_de_performance.pdf",
    "Meta — Criativos para Marketing de Performance"
  ),
};

export function resolveSources(filenames: string[]): Array<SourceMeta & { file: string }> {
  return filenames.map((f) => ({
    file: f,
    ...(SOURCE_MAP[f] ?? { label: f.replace(/\.pdf$/i, "").replace(/[-_]/g, " "), url: "/docs/" + f }),
  }));
}
