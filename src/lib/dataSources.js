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

function mapAdvisory(a) {
  const ref = Array.isArray(a.references) && a.references.length ? a.references[0]?.url : null;
  return {
    id: a.cve_id || a.ghsa_id || `GHSA-${Math.random().toString(36).slice(2, 8)}`,
    title: a.summary || a.ghsa_id || "Security advisory",
    type: "Exploit",
    severity: SEVERITY_MAP[(a.severity || "").toLowerCase()] || "Medium",
    source: "GitHub Advisory",
    timestamp: a.published_at || a.updated_at || new Date().toISOString(),
    description: (a.description || a.summary || "No description provided.").slice(0, 600),
    ioc: a.cve_id || ref || a.ghsa_id || "n/a",
    status: "Monitoring",
    region: "Global",
  };
}

export async function fetchGithubAdvisories(limit = 30) {
  const url = `https://api.github.com/advisories?per_page=${limit}&sort=published&direction=desc`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) {
    throw new Error(res.status === 403 ? "GitHub API rate limit reached — try again shortly." : `GitHub API error ${res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Unexpected response from GitHub API.");
  return data.map(mapAdvisory);
}
