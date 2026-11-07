// Mirrors the colour tokens in index.css for code that needs literal values (Recharts).
export const PALETTE = {
  light: {
    paper: "#f4f2ed",
    sheet: "#fbfaf7",
    rule: "#d3cec3",
    ruleStrong: "#8f8a7e",
    ink: "#16150f",
    ink2: "#45423a",
    ink3: "#68645a",
    signal: "#b93d0c",
  },
  dark: {
    paper: "#16150f",
    sheet: "#211f1a",
    rule: "#35332b",
    ruleStrong: "#77736a",
    ink: "#eeebe3",
    ink2: "#c4bfb3",
    ink3: "#9e998d",
    signal: "#f08a4b",
  },
};

export function severityFill(palette, severity) {
  return {
    Critical: palette.signal,
    High: palette.ink,
    Medium: palette.ink3,
    Low: palette.ruleStrong,
  }[severity] || palette.ink3;
}
