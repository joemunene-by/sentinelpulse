import { useState } from "react";
import { FiSearch, FiDownload, FiX, FiShare2, FiCheck, FiChevronDown } from "react-icons/fi";
import { SEVERITIES, severityConfig } from "../lib/threatUtils";
import { SORTS } from "./Wire";

// The wire's filter and output line: plain controls on the paper, split by hairlines.
export default function Controls(props) {
  const {
    query, setQuery, inputRef,
    severitySet, toggleSeverity, severityCounts,
    status, setStatus, statuses,
    type, setType, types,
    view, setView, sort, setSort,
    hasFilters, onClear, onExportCSV, onExportJSON, onShare,
    presets, onSavePreset, onApplyPreset, onDeletePreset,
  } = props;

  const [shared, setShared] = useState(false);
  const [more, setMore] = useState(false);
  const doShare = async () => {
    const ok = await onShare();
    if (ok) {
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    }
  };

  return (
    <div aria-label="Filters" role="region">
      <div className="flex flex-wrap items-center gap-2 border-b border-rule py-3">
        <label className="relative min-w-0 flex-[1_1_100%] xl:flex-[1_1_200px]">
          <span className="sr-only">Search threats</span>
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, IOCs, ATT&CK IDs"
            title="Matches ID, title, type, source, region, IOC, status and ATT&CK technique"
            className="field w-full pl-9 pr-10 text-md outline-none sm:text-base"
          />
          <span className="kbd pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 sm:inline">/</span>
        </label>

        <div className="grid w-full grid-cols-4 gap-1 sm:flex sm:w-auto" role="group" aria-label="Filter by severity">
          {SEVERITIES.map((sev) => {
            const on = severitySet.has(sev);
            const cfg = severityConfig[sev];
            return (
              <button
                key={sev}
                type="button"
                onClick={() => toggleSeverity(sev)}
                aria-pressed={on}
                title={`${on ? "Remove" : "Show only"} ${sev}`}
                className={`btn gap-1.5 px-2 sm:px-2.5 ${on ? "btn-on" : "btn-quiet"}`}
              >
                <span className={on ? "" : cfg.text}>{sev}</span>
                <span className={`tnum ${on ? "" : "text-ink-3"}`}>{severityCounts[sev] ?? 0}</span>
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
          <button type="button" onClick={onClear} className="btn btn-quiet w-full px-3 sm:w-auto">
            <FiX className="h-4 w-4" />
            Clear filters
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setMore((v) => !v)}
        aria-expanded={more}
        aria-controls="wire-options"
        className="flex h-11 w-full items-center justify-between border-b border-rule text-sm text-ink-2 sm:hidden"
      >
        <span>Presets, order, layout and export</span>
        <FiChevronDown className={`h-4 w-4 transition-transform ${more ? "rotate-180" : ""}`} />
      </button>

      <div id="wire-options" className={`${more ? "flex" : "hidden"} flex-wrap items-center gap-x-2 gap-y-2 border-b border-rule py-3 sm:flex`}>
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 lg:w-auto lg:flex-1">
          <span className="label mr-1">Presets</span>
          {presets.length === 0 && <span className="text-sm text-ink-3">None saved yet.</span>}
          {presets.map((p) => (
            <span key={p.name} className="inline-flex">
              <button type="button" onClick={() => onApplyPreset(p)} className="btn rounded-r-none px-3" title="Apply preset">
                {p.name}
              </button>
              <button
                type="button"
                onClick={() => onDeletePreset(p.name)}
                className="btn btn-icon rounded-l-none border-l border-paper text-ink-3 hover:text-ink"
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
            className="btn btn-quiet px-3 underline decoration-rule-strong underline-offset-4 disabled:no-underline"
            title={hasFilters ? "Save the current filters as a preset" : "Set a filter first"}
          >
            Save current
          </button>
        </div>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="field min-w-0 flex-1 sm:flex-none" aria-label="Order">
          {SORTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <div className="flex" role="group" aria-label="Layout">
          <button type="button" onClick={() => setView("list")} aria-pressed={view === "list"} className={`btn rounded-r-none px-3 ${view === "list" ? "btn-on" : ""}`} title="Wire layout (l)">
            Wire
          </button>
          <button type="button" onClick={() => setView("grid")} aria-pressed={view === "grid"} className={`btn rounded-l-none px-3 ${view === "grid" ? "btn-on" : ""}`} title="Clippings layout (g)">
            Clippings
          </button>
        </div>

        <span className="flex w-full gap-2 sm:w-auto">
          <button type="button" onClick={onExportCSV} className="btn btn-quiet flex-1 px-3" title="Download the filtered threats as CSV">
            <FiDownload className="h-4 w-4" />
            CSV
          </button>
          <button type="button" onClick={onExportJSON} className="btn btn-quiet flex-1 px-3" title="Download the filtered threats as JSON">
            <FiDownload className="h-4 w-4" />
            JSON
          </button>
          <button type="button" onClick={doShare} className="btn btn-quiet flex-1 px-3" title="Copy a link to this view" aria-label="Share this view">
            {shared ? <FiCheck className="h-4 w-4" /> : <FiShare2 className="h-4 w-4" />}
            {shared ? "Link copied" : "Share"}
          </button>
        </span>
      </div>
    </div>
  );
}
