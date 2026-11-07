// Real-world data source: GitHub Security Advisories. The public REST API
// is CORS-enabled and needs no auth (rate-limited per IP), so it can be
// fetched straight from the browser and mapped onto our threat shape.

const SEVERITY_MAP = {
  critical: "Critical",
  high: "High",
  moderate: "Medium",
  medium: "Medium",
  low: "Low",
};

// Advisory bodies are Markdown; the bulletin shows them as plain prose, cut at a sentence.
function plainSummary(md, limit = 480) {
  const text = String(md || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#{1,6}\s*(summary|details|description|impact|overview)?\s*$/gim, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*>#]+|__/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const end = cut.lastIndexOf(". ");
  return end > limit / 3 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}.`;
}

function mapAdvisory(a) {
  const ref = Array.isArray(a.references) && a.references.length ? a.references[0]?.url : null;
  return {
    id: a.cve_id || a.ghsa_id || `GHSA-${Math.random().toString(36).slice(2, 8)}`,
    title: a.summary || a.ghsa_id || "Security advisory",
    type: "Exploit",
    severity: SEVERITY_MAP[(a.severity || "").toLowerCase()] || "Medium",
    source: "GitHub Advisory",
    timestamp: a.published_at || a.updated_at || new Date().toISOString(),
    description: plainSummary(a.description || a.summary) || "GitHub published no description for this advisory.",
    ioc: a.cve_id || ref || a.ghsa_id || "n/a",
    status: "Monitoring",
    region: "Global",
  };
}

export async function fetchGithubAdvisories(limit = 30) {
  const url = `https://api.github.com/advisories?per_page=${limit}&sort=published&direction=desc`;
  let res;
  try {
    res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  } catch {
    throw new Error("Could not reach GitHub. Check your connection and try again.");
  }
  if (!res.ok) {
    throw new Error(res.status === 403 ? "GitHub rate limit reached. Try again in a minute." : `GitHub returned an error (${res.status}). Try again shortly.`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("GitHub sent an unexpected response. Try again shortly.");
  return data.map(mapAdvisory);
}
