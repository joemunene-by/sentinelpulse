import { useEffect, useMemo, useRef, useState } from "react";
import {
  computeStats, severityCounts, matchesQuery, levelConfig,
  threatsToCSV, threatsToJSON, downloadFile,
} from "../lib/threatUtils";
import usePersistentState from "../hooks/usePersistentState";
import StatCard from "./StatCard";
import ThreatChart from "./ThreatChart";
import SeverityDonut from "./SeverityDonut";
import RegionBar from "./RegionBar";
import TypeStack from "./TypeStack";
import Controls from "./Controls";
import ThreatTable from "./ThreatTable";
import ThreatCard from "./ThreatCard";
import Ago from "./Ago";

export default function Dashboard({ feed, onSelect }) {
  const { threats, totalDetected, live, toggleLive, speed, setSpeed, lastUpdated, source, setSource, sourceState, refresh } = feed;

  // Filters + view persist across reloads.
  const [query, setQuery] = usePersistentState("sp:query", "");
  const [severityArr, setSeverityArr] = usePersistentState("sp:sev", []);
  const [status, setStatus] = usePersistentState("sp:status", "All");
  const [type, setType] = usePersistentState("sp:type", "All");
  const [view, setView] = usePersistentState("sp:view", "grid");
  const [presets, setPresets] = usePersistentState("sp:presets", []);
  const searchRef = useRef(null);

  const severitySet = useMemo(() => new Set(severityArr), [severityArr]);

  const stats = useMemo(() => computeStats(threats), [threats]);
  const sevCounts = useMemo(() => severityCounts(threats), [threats]);
  const types = useMemo(() => [...new Set(threats.map((t) => t.type))].sort(), [threats]);
  const statuses = useMemo(() => [...new Set(threats.map((t) => t.status))].sort(), [threats]);

  // Stat-card deltas: compare current values against a baseline refreshed
  // every 30s, so each card shows movement over the last window.
  const statsRef = useRef({ critical: 0, active: 0, total: 0 });
  statsRef.current = { critical: stats.critical, active: stats.active, total: totalDetected };
  const [baseline, setBaseline] = useState(null);
  useEffect(() => {
    setBaseline({ ...statsRef.current });
    const id = setInterval(() => setBaseline({ ...statsRef.current }), 30000);
    return () => clearInterval(id);
  }, []);
  const deltas = baseline
    ? { critical: stats.critical - baseline.critical, active: stats.active - baseline.active, total: totalDetected - baseline.total }
    : { critical: 0, active: 0, total: 0 };

  const filtered = useMemo(
    () =>
      threats.filter(
        (t) =>
          matchesQuery(t, query) &&
          (severitySet.size === 0 || severitySet.has(t.severity)) &&
          (status === "All" || t.status === status) &&
          (type === "All" || t.type === type),
      ),
    [threats, query, severitySet, status, type],
  );

  const level = levelConfig[stats.level] || levelConfig.LOW;
  const hasFilters = Boolean(query) || severityArr.length > 0 || status !== "All" || type !== "All";

  const toggleSeverity = (sev) =>
    setSeverityArr((prev) => (prev.includes(sev) ? prev.filter((s) => s !== sev) : [...prev, sev]));

  const clearFilters = () => {
    setQuery("");
    setSeverityArr([]);
    setStatus("All");
    setType("All");
  };

  // Filter presets (named snapshots) persisted to localStorage.
  const savePreset = () => {
    const name = window.prompt("Save current filters as preset. Name:");
    const trimmed = name && name.trim();
    if (!trimmed) return;
    const preset = { name: trimmed, query, severity: severityArr, status, type, view };
    setPresets((prev) => [...prev.filter((p) => p.name !== trimmed), preset]);
  };
  const applyPreset = (p) => {
    setQuery(p.query || "");
    setSeverityArr(p.severity || []);
    setStatus(p.status || "All");
    setType(p.type || "All");
    setView(p.view || "grid");
  };
  const deletePreset = (name) => setPresets((prev) => prev.filter((p) => p.name !== name));

  const stamp = new Date().toISOString().slice(0, 10);
  const exportCSV = () => downloadFile(`sentinelpulse-${stamp}.csv`, threatsToCSV(filtered), "text/csv");
  const exportJSON = () => downloadFile(`sentinelpulse-${stamp}.json`, threatsToJSON(filtered), "application/json");

  // Apply filters encoded in the URL once on mount (shared views).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if ([...p.keys()].length === 0) return;
    if (p.has("q")) setQuery(p.get("q") || "");
    if (p.has("sev")) setSeverityArr((p.get("sev") || "").split(",").filter(Boolean));
    if (p.has("status")) setStatus(p.get("status") || "All");
    if (p.has("type")) setType(p.get("type") || "All");
    if (p.has("view")) setView(p.get("view") || "grid");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Encode the current filters into the URL and copy it to the clipboard.
  const shareView = async () => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (severityArr.length) p.set("sev", severityArr.join(","));
    if (status !== "All") p.set("status", status);
    if (type !== "All") p.set("type", type);
    if (view !== "grid") p.set("view", view);
    const qs = p.toString();
    const url = `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ""}`;
    window.history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  };

  // Keyboard shortcuts: "/" focus search, g/l switch view, p toggle live.
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable;
      if (typing) return;
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "g") {
        setView("grid");
      } else if (e.key === "l") {
        setView("list");
      } else if (e.key === "p") {
        toggleLive();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleLive, setView]);

  const cards = [
    { label: "Total threats", value: totalDetected, hint: `${threats.length} in view`, delta: deltas.total },
    { label: "Critical alerts", value: stats.critical, valueClass: stats.critical > 0 ? "text-crit" : "text-ink", hint: "In view", delta: deltas.critical },
    { label: "Active incidents", value: stats.active, hint: "Open and unmitigated", delta: deltas.active },
    { label: "Threat level", value: stats.level, valueClass: level.text, bars: level.bars, hint: "Weighted by severity in view" },
  ];

  const speedNote = { slow: "9s", normal: "4.5s", fast: "2s" }[speed] || "4.5s";
  const subtitle =
    source === "github"
      ? "Latest published GitHub security advisories, mapped to threats."
      : live
        ? `Simulated feed. A new threat arrives every ${speedNote}.`
        : "Simulated feed, paused. Press p or Resume to continue.";

  const emptyState = (
    <div className="px-4 py-12 sm:px-6">
      <p className="text-base font-semibold text-ink">
        {hasFilters ? "No threats match these filters" : "No threats in view yet"}
      </p>
      <p className="mt-1 text-sm text-ink-2">
        {hasFilters
          ? "Widen the search or clear the filters to see the full feed."
          : "New detections will appear here as the feed delivers them."}
      </p>
      {hasFilters && (
        <button type="button" onClick={clearFilters} className="btn mt-4">Clear filters</button>
      )}
    </div>
  );

  let results;
  if (sourceState.loading) {
    results = (
      <section className="panel" aria-busy="true">
        <p className="border-b border-line px-4 py-3 text-sm text-ink-2 sm:px-6">Loading GitHub advisories</p>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b border-line px-4 py-4 last:border-b-0 sm:px-6">
            <span className="h-3 w-16 rounded-sm bg-raised" />
            <span className="h-3 flex-1 rounded-sm bg-raised" />
            <span className="hidden h-3 w-24 rounded-sm bg-raised sm:block" />
          </div>
        ))}
      </section>
    );
  } else if (view === "list") {
    results = <ThreatTable threats={filtered} onSelect={onSelect} empty={emptyState} />;
  } else if (filtered.length === 0) {
    results = <section className="panel">{emptyState}</section>;
  } else {
    results = (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filtered.map((threat) => (
          <ThreatCard key={threat.id} threat={threat} onSelect={onSelect} />
        ))}
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-6 sm:space-y-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-[-0.01em] text-ink sm:text-2xl">Threat operations</h1>
          <p className="mt-1 text-sm text-ink-2">{subtitle}</p>
        </div>
        <p className="text-xs text-ink-3">
          Last update <Ago time={lastUpdated} className="text-ink-2" />
        </p>
      </header>

      <section aria-label="Key metrics" className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-panel">
            <StatCard {...c} />
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ThreatChart />
        </div>
        <SeverityDonut threats={threats} total={totalDetected} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <RegionBar threats={threats} />
        <TypeStack threats={threats} />
      </div>

      <Controls
        query={query}
        setQuery={setQuery}
        inputRef={searchRef}
        severitySet={severitySet}
        toggleSeverity={toggleSeverity}
        severityCounts={sevCounts}
        status={status}
        setStatus={setStatus}
        statuses={statuses}
        type={type}
        setType={setType}
        types={types}
        view={view}
        setView={setView}
        live={live}
        toggleLive={toggleLive}
        speed={speed}
        setSpeed={setSpeed}
        source={source}
        setSource={setSource}
        sourceState={sourceState}
        onRefresh={refresh}
        resultCount={filtered.length}
        totalCount={threats.length}
        hasFilters={hasFilters}
        onClear={clearFilters}
        onExportCSV={exportCSV}
        onExportJSON={exportJSON}
        onShare={shareView}
        presets={presets}
        onSavePreset={savePreset}
        onApplyPreset={applyPreset}
        onDeletePreset={deletePreset}
      />

      {results}
    </main>
  );
}
