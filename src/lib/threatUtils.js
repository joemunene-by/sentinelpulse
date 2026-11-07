// Shared threat helpers: ordering, palette, derived metrics, and exports.
// Tailwind class strings are kept literal so the JIT compiler detects them.

export const SEVERITIES = ["Critical", "High", "Medium", "Low"];
export const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export const severityConfig = {
  Critical: { text: "text-signal font-semibold", bars: 4 },
  High: { text: "text-ink font-semibold", bars: 3 },
  Medium: { text: "text-ink-2 font-medium", bars: 2 },
  Low: { text: "text-ink-3", bars: 1 },
};

// Open work reads strongest; closed work recedes. The signal colour stays reserved for severity.
export const statusColors = {
  Active: "text-ink font-semibold",
  Investigating: "text-ink font-medium",
  Monitoring: "text-ink-2",
  Mitigated: "text-ink-3",
  Remediated: "text-ink-3",
  Patched: "text-ink-3",
};

export const levelConfig = {
  SEVERE: { text: "text-signal", bars: 4, word: "Severe" },
  ELEVATED: { text: "text-ink", bars: 3, word: "Elevated" },
  GUARDED: { text: "text-ink", bars: 2, word: "Guarded" },
  LOW: { text: "text-ink", bars: 1, word: "Low" },
};

const OPEN = new Set(["Active", "Investigating", "Monitoring"]);
export const isOpen = (t) => OPEN.has(t.status);

// The lead story: the most severe threat still active, newest first.
export function pickLead(threats) {
  if (!threats.length) return null;
  const rank = (t) => (t.status === "Active" ? 0 : isOpen(t) ? 1 : 2);
  return [...threats].sort(
    (a, b) =>
      (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9) ||
      rank(a) - rank(b) ||
      new Date(b.timestamp) - new Date(a.timestamp),
  )[0];
}

const TYPE_PLURAL = {
  Phishing: "phishing",
  Ransomware: "ransomware",
  APT: "APT intrusions",
  DDoS: "DDoS attacks",
  Exploit: "exploits",
  Malware: "malware",
  "Credential Theft": "credential theft",
  "Supply Chain": "supply chain attacks",
  Network: "network attacks",
  Cryptojacking: "cryptojacking",
  "Insider Threat": "insider threats",
  "Watering Hole": "watering holes",
};
const plural = (type) => TYPE_PLURAL[type] || type.toLowerCase();

// One sentence of context for the headline band, built from the live data.
export function postureSentence(threats) {
  if (!threats.length) return "No threats in view yet.";
  const crit = threats.filter((t) => t.severity === "Critical");
  const live = crit.filter((t) => t.status === "Active");
  const open = threats.filter(isOpen).length;
  if (live.length === 0) {
    const openCrit = crit.filter(isOpen).length;
    if (openCrit) return `No critical threats marked active. ${openCrit} critical ${openCrit === 1 ? "report is" : "reports are"} still open.`;
    if (crit.length) return `No critical threats active. All ${crit.length} critical reports are closed.`;
    return `No critical threats in view. ${open} of ${threats.length} reports are still open.`;
  }
  if (live.length === 1) {
    const [t] = live;
    return `1 critical threat active, ${t.type === "APT" ? "an APT intrusion" : `${t.type.toLowerCase()} activity`} in ${t.region}.`;
  }
  const types = countBy(live, "type");
  const regions = new Set(live.map((t) => t.region)).size;
  const head = `${live.length} critical threats active`;
  if (types[0].value === live.length) return `${head}, all of them ${plural(types[0].name)}.`;
  if (types[0].value === 1) return `${head} across ${types.length} attack types and ${regions === 1 ? "one region" : `${regions} regions`}.`;
  const [a, b] = types;
  if (b && b.value > 1) return `${head}, ${a.value + b.value} of them ${plural(a.name)} or ${plural(b.name)}.`;
  return `${head}, ${a.value} of them ${plural(a.name)}.`;
}

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

// Counts per type, broken down by severity, for the stacked bar chart.
export function typeSeverityData(threats) {
  const map = new Map();
  for (const t of threats) {
    if (!map.has(t.type)) map.set(t.type, { type: t.type, Critical: 0, High: 0, Medium: 0, Low: 0 });
    const row = map.get(t.type);
    if (row[t.severity] !== undefined) row[t.severity] += 1;
  }
  return [...map.values()].sort(
    (a, b) => b.Critical + b.High + b.Medium + b.Low - (a.Critical + a.High + a.Medium + a.Low),
  );
}

export function severityDistribution(threats) {
  return SEVERITIES.map((name) => ({
    name,
    value: threats.filter((t) => t.severity === name).length,
  }));
}

// Rough MITRE ATT&CK technique mapping by threat type. Indicative only.
export const ATTACK_BY_TYPE = {
  Phishing: { id: "T1566", name: "Phishing" },
  Ransomware: { id: "T1486", name: "Data Encrypted for Impact" },
  APT: { id: "T1071", name: "Application Layer Protocol" },
  DDoS: { id: "T1498", name: "Network Denial of Service" },
  Exploit: { id: "T1190", name: "Exploit Public-Facing Application" },
  Malware: { id: "T1059", name: "Command and Scripting Interpreter" },
  "Credential Theft": { id: "T1110", name: "Brute Force" },
  "Supply Chain": { id: "T1195", name: "Supply Chain Compromise" },
  Network: { id: "T1040", name: "Network Sniffing" },
  Cryptojacking: { id: "T1496", name: "Resource Hijacking" },
  "Insider Threat": { id: "T1530", name: "Data from Cloud Storage" },
  "Watering Hole": { id: "T1189", name: "Drive-by Compromise" },
};

export function attackFor(type) {
  return ATTACK_BY_TYPE[type] || null;
}

// Free-text match across the human-meaningful fields, including the mapped
// ATT&CK technique id/name so searching "T1566" or "phishing" works.
export function matchesQuery(threat, q) {
  if (!q) return true;
  const tech = ATTACK_BY_TYPE[threat.type];
  const hay = `${threat.id} ${threat.title} ${threat.type} ${threat.source} ${threat.region} ${threat.ioc} ${threat.status} ${tech ? `${tech.id} ${tech.name}` : ""}`.toLowerCase();
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

export function threatsToJSON(threats) {
  // Drop the transient `isNew` UI flag from the export.
  return JSON.stringify(
    threats.map(({ isNew, ...rest }) => rest),
    null,
    2,
  );
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
