import { FiSearch, FiGrid, FiList, FiDownload, FiPlay, FiPause, FiX, FiStar } from "react-icons/fi";
import { SEVERITIES, severityConfig } from "../lib/threatUtils";

const selectClass =
  "rounded-lg border border-white/10 bg-surface-card/60 px-3 py-2 text-xs text-slate-300 outline-none transition-colors hover:border-white/20 focus:border-primary";

export default function Controls({
  query, setQuery, inputRef,
  severitySet, toggleSeverity, severityCounts,
  status, setStatus, statuses,
  type, setType, types,
  view, setView,
  live, toggleLive,
  speed, setSpeed,
  resultCount, totalCount,
  hasFilters, onClear, onExportCSV, onExportJSON,
  presets, onSavePreset, onApplyPreset, onDeletePreset,
}) {
  return (
    <div className="glass-card space-y-3 p-4">
      {/* Row 1: search + speed + view/live/export */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search threats, IOCs, ATT&CK techniques…  ( / )"
            className="w-full rounded-lg border border-white/10 bg-surface-card/60 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none transition-colors placeholder:text-slate-600 hover:border-white/20 focus:border-primary"
          />
        </div>

        <button
          type="button"
          onClick={toggleLive}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
            live ? "border-sev-low/40 bg-sev-low/10 text-sev-low" : "border-white/10 bg-surface-card/60 text-slate-400 hover:border-white/20"
          }`}
        >
          {live ? <FiPause className="h-3.5 w-3.5" /> : <FiPlay className="h-3.5 w-3.5" />}
          {live ? "Live" : "Paused"}
        </button>

        <select
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          className={selectClass}
          title="Live feed speed"
          aria-label="Feed speed"
        >
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </select>

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

        <div className="flex items-center overflow-hidden rounded-lg border border-white/10 text-xs">
          <span className="flex items-center gap-1 bg-surface-card/60 px-2 py-2 text-slate-500">
            <FiDownload className="h-3.5 w-3.5" />
          </span>
          <button type="button" onClick={onExportCSV} className="bg-surface-card/60 px-2 py-2 font-medium text-slate-400 transition-colors hover:text-white">CSV</button>
          <button type="button" onClick={onExportJSON} className="border-l border-white/10 bg-surface-card/60 px-2 py-2 font-medium text-slate-400 transition-colors hover:text-white">JSON</button>
        </div>
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
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
          <option value="All">All types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
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

      {/* Row 3: presets */}
      <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-3">
        <span className="text-[11px] uppercase tracking-wider text-slate-500">Presets</span>
        {presets.map((p) => (
          <span key={p.name} className="flex items-center gap-1 rounded-full border border-white/10 bg-surface-card/60 py-1 pl-2.5 pr-1 text-[11px]">
            <button type="button" onClick={() => onApplyPreset(p)} className="text-slate-300 transition-colors hover:text-white">{p.name}</button>
            <button type="button" onClick={() => onDeletePreset(p.name)} className="text-slate-600 transition-colors hover:text-red-400" aria-label={`Delete preset ${p.name}`}>
              <FiX className="h-3 w-3" />
            </button>
          </span>
        ))}
        {presets.length === 0 && <span className="text-[11px] text-slate-600">none saved</span>}
        <button
          type="button"
          onClick={onSavePreset}
          disabled={!hasFilters}
          className="ml-auto flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-slate-400 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          title={hasFilters ? "Save the current filters as a preset" : "Set some filters first"}
        >
          <FiStar className="h-3 w-3" />
          Save current
        </button>
      </div>
    </div>
  );
}
