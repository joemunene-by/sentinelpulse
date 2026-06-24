import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiShield, FiAlertOctagon, FiActivity, FiTrendingUp, FiClock } from "react-icons/fi";
import {
  computeStats, severityCounts, matchesQuery, levelConfig,
  threatsToCSV, threatsToJSON, downloadFile, relativeTime,
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
    { label: "Total Threats", value: totalDetected, icon: FiShield, color: "text-primary", bg: "bg-primary/10", hint: `${threats.length} in view`, delta: deltas.total },
    { label: "Critical Alerts", value: stats.critical, icon: FiAlertOctagon, color: "text-sev-critical", bg: "bg-sev-critical/10", delta: deltas.critical },
    { label: "Active Incidents", value: stats.active, icon: FiActivity, color: "text-secondary", bg: "bg-secondary/10", delta: deltas.active },
    { label: "Threat Level", value: stats.level, icon: FiTrendingUp, color: level.text, bg: "bg-white/5", hint: "Live posture" },
  ];

  return (
    <main className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      {/* Hero */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-end justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Threat Operations</h1>
          <p className="mt-1 text-sm text-slate-500">Real-time intelligence across global infrastructure.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <FiClock className="h-3 w-3" />
            Updated {relativeTime(lastUpdated)}
          </span>
          <span className={`flex items-center gap-2 rounded-full border border-white/10 bg-surface-card/60 px-3 py-1.5 text-xs font-semibold ${level.text}`}>
            <span className={`h-2 w-2 rounded-full ${level.dot} ${live ? "pulse-dot" : ""}`} />
            {stats.level}
          </span>
        </div>
      </motion.header>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <StatCard key={c.label} index={i} {...c} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <ThreatChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <SeverityDonut threats={threats} total={totalDetected} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <RegionBar threats={threats} />
        <TypeStack threats={threats} />
      </motion.div>

      {/* Controls */}
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

      {/* Results */}
      {view === "list" ? (
        <ThreatTable threats={filtered} onSelect={onSelect} />
      ) : filtered.length === 0 ? (
        <div className="glass-card px-5 py-16 text-center text-sm text-slate-500">
          No threats match the current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((threat, i) => (
            <ThreatCard key={threat.id} threat={threat} index={i} onSelect={onSelect} />
          ))}
        </div>
      )}
    </main>
  );
}
