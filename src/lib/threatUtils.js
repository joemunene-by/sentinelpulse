// Shared threat helpers: ordering, palette, derived metrics, and exports.
// Tailwind class strings are kept literal so the JIT compiler detects them.

export const SEVERITIES = ["Critical", "High", "Medium", "Low"];
export const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export const severityConfig = {
  Critical: { text: "text-sev-critical", bg: "bg-sev-critical/15", border: "border-sev-critical/30", dot: "bg-sev-critical", ring: "border-l-sev-critical", hex: "#ef4444" },
  High: { text: "text-sev-high", bg: "bg-sev-high/15", border: "border-sev-high/30", dot: "bg-sev-high", ring: "border-l-sev-high", hex: "#f97316" },
  Medium: { text: "text-sev-medium", bg: "bg-sev-medium/15", border: "border-sev-medium/30", dot: "bg-sev-medium", ring: "border-l-sev-medium", hex: "#eab308" },
  Low: { text: "text-sev-low", bg: "bg-sev-low/15", border: "border-sev-low/30", dot: "bg-sev-low", ring: "border-l-sev-low", hex: "#22c55e" },
};

export const statusColors = {
  Active: "text-sev-critical",
  Monitoring: "text-secondary",
  Investigating: "text-sev-medium",
  Mitigated: "text-sev-low",
  Remediated: "text-slate-400",
  Patched: "text-slate-400",
};

// Threat-level styling keyed off the derived posture label.
export const levelConfig = {
  SEVERE: { text: "text-sev-critical", dot: "bg-sev-critical" },
  ELEVATED: { text: "text-sev-high", dot: "bg-sev-high" },
  GUARDED: { text: "text-sev-medium", dot: "bg-sev-medium" },
  LOW: { text: "text-sev-low", dot: "bg-sev-low" },
};

const weight = { Critical: 10, High: 5, Medium: 2, Low: 1 };

// Derive an overall posture label from the live mix of severities.
export function deriveThreatLevel(threats) {
  if (!threats.length) return "LOW";
  const score = threats.reduce((s, t) => s + (weight[t.severity] ?? 0), 0) / threats.length;
  if (score >= 6) return "SEVERE";
  if (score >= 4) return "ELEVATED";
  if (score >= 2.5) return "GUARDED";
  return "LOW";
}

export function computeStats(threats) {
  return {
    total: threats.length,
    critical: threats.filter((t) => t.severity === "Critical").length,
    active: threats.filter((t) => t.status === "Active").length,
    monitoring: threats.filter((t) => t.status === "Monitoring" || t.status === "Investigating").length,
    level: deriveThreatLevel(threats),
  };
}

export function countBy(threats, key) {
  const map = new Map();
  for (const t of threats) map.set(t[key], (map.get(t[key]) || 0) + 1);
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function severityCounts(threats) {
  return Object.fromEntries(SEVERITIES.map((s) => [s, threats.filter((t) => t.severity === s).length]));
}

export function severityDistribution(threats) {
  return SEVERITIES.map((name) => ({
    name,
    value: threats.filter((t) => t.severity === name).length,
    hex: severityConfig[name].hex,
  }));
}

// Free-text match across the human-meaningful fields.
export function matchesQuery(threat, q) {
  if (!q) return true;
  const hay = `${threat.id} ${threat.title} ${threat.type} ${threat.source} ${threat.region} ${threat.ioc} ${threat.status}`.toLowerCase();
  return hay.includes(q.toLowerCase());
}

export function downloadFile(filename, text, type = "text/plain") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function threatsToCSV(threats) {
  const cols = ["id", "title", "type", "severity", "status", "source", "region", "timestamp", "ioc"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = threats.map((t) => cols.map((c) => esc(t[c])).join(","));
  return [cols.join(","), ...rows].join("\n");
}

// Compact relative timestamp, e.g. "3m ago", "just now".
export function relativeTime(input) {
  const then = typeof input === "number" ? input : new Date(input).getTime();
  const secs = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (secs < 5) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
