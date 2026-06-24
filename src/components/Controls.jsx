import { FiSearch, FiGrid, FiList, FiDownload, FiPlay, FiPause, FiX } from "react-icons/fi";
import { SEVERITIES, severityConfig } from "../lib/threatUtils";

const selectClass =
  "rounded-lg border border-white/10 bg-surface-card/60 px-3 py-2 text-xs text-slate-300 outline-none transition-colors hover:border-white/20 focus:border-primary";

export default function Controls({
  query, setQuery,
  severitySet, toggleSeverity, severityCounts,
  status, setStatus, statuses,
  type, setType, types,
  view, setView,
  live, toggleLive,
  resultCount, totalCount,
  hasFilters, onClear, onExport,
}) {
  return (
    <div className="glass-card space-y-3 p-4">
      {/* Row 1: search + view/live/export */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search threats, IOCs, sources, regions…"
            className="w-full rounded-lg border border-white/10 bg-surface-card/60 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none transition-colors placeholder:text-slate-600 hover:border-white/20 focus:border-primary"
          />
        </div>

        <button
          type="button"
          onClick={toggleLive}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
            live
              ? "border-sev-low/40 bg-sev-low/10 text-sev-low"
              : "border-white/10 bg-surface-card/60 text-slate-400 hover:border-white/20"
          }`}
        >
          {live ? <FiPause className="h-3.5 w-3.5" /> : <FiPlay className="h-3.5 w-3.5" />}
          {live ? "Live" : "Paused"}
        </button>

        <div className="flex overflow-hidden rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`p-2 transition-colors ${view === "grid" ? "bg-primary/20 text-primary" : "bg-surface-card/60 text-slate-400 hover:text-white"}`}
            aria-label="Grid view"
          >
            <FiGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`p-2 transition-colors ${view === "list" ? "bg-primary/20 text-primary" : "bg-surface-card/60 text-slate-400 hover:text-white"}`}
            aria-label="List view"
          >
            <FiList className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface-card/60 px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-white/20 hover:text-white"
        >
          <FiDownload className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* Row 2: severity chips + selects + result count */}
      <div className="flex flex-wrap items-center gap-2">
        {SEVERITIES.map((sev) => {
          const cfg = severityConfig[sev];
          const on = severitySet.has(sev);
          return (
            <button
              key={sev}
              type="button"
              onClick={() => toggleSeverity(sev)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase transition-all ${
                on ? `${cfg.bg} ${cfg.text} ${cfg.border}` : "border-white/10 text-slate-500 hover:border-white/20"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
              {sev}
              <span className="text-slate-500">{severityCounts[sev] ?? 0}</span>
            </button>
          );
        })}

        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          <option value="All">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
          <option value="All">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-500 transition-colors hover:text-white"
          >
            <FiX className="h-3 w-3" />
            Clear
          </button>
        )}

        <span className="ml-auto text-[11px] text-slate-500">
          Showing <span className="font-semibold text-slate-300">{resultCount}</span> of {totalCount}
        </span>
      </div>
    </div>
  );
}
