// darkTheme.ts
export const darkTheme = {
  // BASE
  background: "#0B1220", // fundo geral (dark azul petróleo)
  bodyBg: "#070B14", // fundo “por trás” (mais escuro)
  card: "#0F172A", // cards
  surface: "rgba(15, 23, 42, 0.72)",
  surfaceBorder: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.10)",
  shadowSoft: "0 18px 50px rgba(0,0,0,0.55)",

  // BRAND
  primary: "#4C6FFF", // azul vivo no dark (mantém identidade do #00009B)
  primaryHover: "#3B5BFF",
  secondary: "#33CC99",

  // TEXT
  text: "#E5E7EB",
  textMuted: "rgba(229,231,235,0.72)",
  description: "rgba(229,231,235,0.62)",
  "text-white": "#FFFFFF",
  textSmall: "#0B1220", // (se você usa como “badge” em fundo claro, no dark vira texto escuro)
  textOnDark: "#FFFFFF",
  descriptionOnDark: "rgba(255,255,255,0.82)",

  // LINKS / HIGHLIGHTS
  link: "#8AB4FF",
  BGlink: "rgba(76, 111, 255, 0.18)",
  highlight: "#FFC300", // amarelo continua como destaque

  // STATES / BACKGROUNDS ÚTEIS
  active: "rgba(76, 111, 255, 0.18)", // “selecionado” no dark
  lightPrimary: "rgba(76, 111, 255, 0.18)",
  lightSuccess: "rgba(51, 204, 153, 0.16)",
  lightDanger: "rgba(229, 62, 62, 0.18)",
  lightDefault: "rgba(255,255,255,0.06)",

  // INPUTS
  backgroundInput: "rgba(255,255,255,0.06)",
  placeholder: "rgba(229,231,235,0.55)",

  // DANGER / LOGOUT
  danger: "#FF4D4D",
  hoverDanger: "#FF2D2D",
  logoutBg: "#B91C1C",
  logoutBgHover: "#991B1B",

  // STATUS COLORS (mais “premium” no dark)
  statusOpenBg: "rgba(255, 145, 0, 0.18)",
  statusOpenText: "#FFD19A",
  statusAnalyzeBg: "rgba(255, 196, 0, 0.18)",
  statusAnalyzeText: "#FFE58A",
  statusExecutionBg: "rgba(189, 202, 209, 0.14)",
  statusExecutionText: "#7DD3FC",
  statusDoneBg: "rgba(51, 204, 153, 0.18)",
  statusDoneText: "#7CF2C6",
  statusCancelBg: "rgba(255, 77, 77, 0.16)",
  statusCancelText: "#FF9B9B",

  // PRIORITY (ajustadas pro dark sem “estourar”)
  priorityCriticalBg: "rgba(244, 67, 54, 0.22)",
  priorityCriticalText: "#FFB4AE",
  priorityHighBg: "rgba(251, 140, 0, 0.22)",
  priorityHighText: "#FFD0A1",
  priorityMediumBg: "rgba(253, 216, 53, 0.20)",
  priorityMediumText: "#FFE58A",
  priorityLowBg: "rgba(76, 175, 80, 0.20)",
  priorityLowText: "#B9F6CA",
  priorityNoneBg: "rgba(3, 169, 244, 0.20)",
  priorityNoneText: "#A5E7FF",

  // SCROLLBAR
  scrollbarTrack: "rgba(255,255,255,0.06)",
  scrollbarThumb: "rgba(255,255,255,0.18)",
  scrollbarThumbHover: "rgba(255,255,255,0.26)",
  scrollbarThumbActive: "rgba(255,255,255,0.34)",

  warning: "#FFC300",
  warningBg: "rgba(255, 195, 0, 0.16)",
  warningText: "#FFE8A3",

  statusProrrogadoBg: "#5B21B6", // roxo mais escuro/apagado
  statusProrrogadoText: "#EDE9FE", // texto lilás claro
};
