import { useState } from "react";
import { FiSearch, FiGrid, FiList, FiDownload, FiPlay, FiPause, FiX, FiShare2, FiRefreshCw, FiCheck, FiBookmark } from "react-icons/fi";
import { SEVERITIES, severityConfig } from "../lib/threatUtils";
import { LevelBars } from "./Severity";

export default function Controls(props) {
  const {
    query, setQuery, inputRef,
    severitySet, toggleSeverity, severityCounts,
    status, setStatus, statuses,
    type, setType, types,
    view, setView,
    live, toggleLive,
    speed, setSpeed,
    source, setSource, sourceState, onRefresh,
    resultCount, totalCount,
    hasFilters, onClear, onExportCSV, onExportJSON, onShare,
    presets, onSavePreset, onApplyPreset, onDeletePreset,
  } = props;

  const [shared, setShared] = useState(false);
  const doShare = async () => {
    const ok = await onShare();
    if (ok) {
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    }
  };

  return (
    <section className="panel" aria-label="Filters and feed controls">
      <div className="flex flex-wrap items-center gap-2 p-4 sm:px-6">
        <label className="relative min-w-0 flex-[1_1_100%] lg:flex-[1_1_320px]">
          <span className="sr-only">Search threats</span>
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search threats or IOCs"
            title="Matches ID, title, type, source, region, IOC, status and ATT&CK technique"
            className="field w-full pl-9 pr-10 text-lg outline-none sm:text-base"
          />
          <span className="kbd pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 sm:inline">/</span>
        </label>

        <select value={source} onChange={(e) => setSource(e.target.value)} className="field flex-1 sm:flex-none" title="Data source" aria-label="Data source">
          <option value="sim">Simulated feed</option>
          <option value="github">GitHub advisories</option>
        </select>

        {source === "sim" ? (
          <>
            <button type="button" onClick={toggleLive} className="btn" aria-pressed={live} title={live ? "Pause the feed (p)" : "Resume the feed (p)"}>
              {live ? <FiPause className="h-4 w-4" /> : <FiPlay className="h-4 w-4" />}
              {live ? "Pause" : "Resume"}
            </button>
            <select value={speed} onChange={(e) => setSpeed(e.target.value)} className="field flex-1 sm:flex-none" title="Feed speed" aria-label="Feed speed">
              <option value="slow">Slow, every 9s</option>
              <option value="normal">Normal, every 4.5s</option>
              <option value="fast">Fast, every 2s</option>
            </select>
          </>
        ) : (
          <button type="button" onClick={onRefresh} disabled={sourceState.loading} className="btn">
            <FiRefreshCw className="h-4 w-4" />
            {sourceState.loading ? "Refreshing" : "Refresh"}
          </button>
        )}
      </div>

      {(sourceState.error || sourceState.loading) && (
        <p className="border-t border-line px-4 py-3 text-sm text-ink-2 sm:px-6" role="status">
          {sourceState.loading ? "Loading the latest GitHub security advisories." : sourceState.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-line p-4 sm:px-6">
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto" role="group" aria-label="Filter by severity">
          {SEVERITIES.map((sev) => {
            const on = severitySet.has(sev);
            const cfg = severityConfig[sev];
            return (
              <button
                key={sev}
                type="button"
                onClick={() => toggleSeverity(sev)}
                aria-pressed={on}
                className={`btn justify-start px-3 ${on ? "btn-on" : ""}`}
              >
                <span className={`inline-flex items-center gap-2 ${on ? "" : cfg.text}`}>
                  <LevelBars filled={cfg.bars} />
                  {sev}
                </span>
                <span className={`tnum ml-auto pl-1 ${on ? "" : "text-ink-3"}`}>{severityCounts[sev] ?? 0}</span>
              </button>
            );
          })}
        </div>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="field min-w-0 flex-1 sm:flex-none" aria-label="Status">
          <option value="All">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)} className="field min-w-0 flex-1 sm:flex-none" aria-label="Type">
          <option value="All">All types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        {hasFilters && (
          <button type="button" onClick={onClear} className="btn w-full px-3 sm:w-auto">
            <FiX className="h-4 w-4" />
            Clear filters
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line p-4 sm:px-6">
        <span className="label mr-2">Presets</span>
        {presets.length === 0 && <span className="text-sm text-ink-3">None saved yet</span>}
        {presets.map((p) => (
          <span key={p.name} className="inline-flex">
            <button type="button" onClick={() => onApplyPreset(p)} className="btn rounded-r-none px-3" title="Apply preset">
              {p.name}
            </button>
            <button
              type="button"
              onClick={() => onDeletePreset(p.name)}
              className="btn btn-icon rounded-l-none border-l border-bg text-ink-3"
              aria-label={`Delete preset ${p.name}`}
            >
              <FiX className="h-4 w-4" />
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={onSavePreset}
          disabled={!hasFilters}
          className="btn px-3"
          title={hasFilters ? "Save the current filters as a preset" : "Set a filter first"}
        >
          <FiBookmark className="h-4 w-4" />
          Save current
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line p-4 sm:px-6">
        <p className="tnum w-full text-sm text-ink-2 sm:mr-auto sm:w-auto">
          Showing <span className="font-semibold text-ink">{resultCount}</span> of {totalCount}
        </p>

        <div className="flex gap-1" role="group" aria-label="Layout">
          <button type="button" onClick={() => setView("grid")} aria-pressed={view === "grid"} className={`btn btn-icon ${view === "grid" ? "btn-on" : ""}`} aria-label="Grid view" title="Grid view (g)">
            <FiGrid className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setView("list")} aria-pressed={view === "list"} className={`btn btn-icon ${view === "list" ? "btn-on" : ""}`} aria-label="List view" title="List view (l)">
            <FiList className="h-4 w-4" />
          </button>
        </div>

        <button type="button" onClick={onExportCSV} className="btn px-3" title="Download the filtered threats as CSV">
          <FiDownload className="h-4 w-4" />
          CSV
        </button>
        <button type="button" onClick={onExportJSON} className="btn px-3" title="Download the filtered threats as JSON">
          <FiDownload className="h-4 w-4" />
          JSON
        </button>
        <button type="button" onClick={doShare} className="btn btn-icon sm:w-auto sm:px-3" title="Copy a link to this view" aria-label="Share this view">
          {shared ? <FiCheck className="h-4 w-4" /> : <FiShare2 className="h-4 w-4" />}
          <span className="hidden sm:inline">{shared ? "Link copied" : "Share"}</span>
        </button>
      </div>
    </section>
  );
}
