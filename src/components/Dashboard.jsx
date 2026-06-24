import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiShield, FiAlertOctagon, FiActivity, FiTrendingUp, FiClock } from "react-icons/fi";
import {
  computeStats, severityCounts, matchesQuery, levelConfig,
  threatsToCSV, downloadFile, relativeTime,
} from "../lib/threatUtils";
import StatCard from "./StatCard";
import ThreatChart from "./ThreatChart";
import SeverityDonut from "./SeverityDonut";
import RegionBar from "./RegionBar";
import Controls from "./Controls";
import ThreatTable from "./ThreatTable";
import ThreatCard from "./ThreatCard";

export default function Dashboard({ feed, onSelect }) {
  const { threats, totalDetected, live, toggleLive, lastUpdated } = feed;

  const [query, setQuery] = useState("");
  const [severitySet, setSeveritySet] = useState(() => new Set());
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [view, setView] = useState("grid");

  const stats = useMemo(() => computeStats(threats), [threats]);
  const sevCounts = useMemo(() => severityCounts(threats), [threats]);
  const types = useMemo(() => [...new Set(threats.map((t) => t.type))].sort(), [threats]);
  const statuses = useMemo(() => [...new Set(threats.map((t) => t.status))].sort(), [threats]);

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
  const hasFilters = Boolean(query) || severitySet.size > 0 || status !== "All" || type !== "All";

  const toggleSeverity = (sev) =>
    setSeveritySet((prev) => {
      const next = new Set(prev);
      if (next.has(sev)) next.delete(sev);
      else next.add(sev);
      return next;
    });

  const clearFilters = () => {
    setQuery("");
    setSeveritySet(new Set());
    setStatus("All");
    setType("All");
  };

  const exportCSV = () =>
    downloadFile(`sentinelpulse-${new Date().toISOString().slice(0, 10)}.csv`, threatsToCSV(filtered), "text/csv");

  const cards = [
    { label: "Total Threats", value: totalDetected, icon: FiShield, color: "text-primary", bg: "bg-primary/10", glow: "glow-primary", hint: `${threats.length} in view` },
    { label: "Critical Alerts", value: stats.critical, icon: FiAlertOctagon, color: "text-sev-critical", bg: "bg-sev-critical/10" },
    { label: "Active Incidents", value: stats.active, icon: FiActivity, color: "text-secondary", bg: "bg-secondary/10", glow: "glow-secondary" },
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
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Threat Operations
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time intelligence across global infrastructure.
          </p>
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
      >
        <RegionBar threats={threats} />
      </motion.div>

      {/* Controls */}
      <Controls
        query={query}
        setQuery={setQuery}
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
        resultCount={filtered.length}
        totalCount={threats.length}
        hasFilters={hasFilters}
        onClear={clearFilters}
        onExport={exportCSV}
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
