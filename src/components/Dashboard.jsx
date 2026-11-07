import { useEffect, useMemo, useRef, useState } from "react";
import {
  computeStats, severityCounts, matchesQuery, pickLead,
  threatsToCSV, threatsToJSON, downloadFile,
} from "../lib/threatUtils";
import usePersistentState from "../hooks/usePersistentState";
import Headline from "./Headline";
import Controls from "./Controls";
import Wire from "./Wire";
import Clippings from "./Clippings";
import Rail from "./Rail";

export default function Dashboard({ feed, onSelect, onUpdate }) {
  const { threats, toggleLive, sourceState, refresh, source } = feed;

  const [query, setQuery] = usePersistentState("sp:query", "");
  const [severityArr, setSeverityArr] = usePersistentState("sp:sev", []);
  const [status, setStatus] = usePersistentState("sp:status", "All");
  const [type, setType] = usePersistentState("sp:type", "All");
  const [view, setView] = usePersistentState("sp:layout", "list");
  const [sort, setSort] = usePersistentState("sp:order", "time:1");
  const [presets, setPresets] = usePersistentState("sp:presets", []);
  const [pinnedId, setPinnedId] = useState(null);
  const searchRef = useRef(null);

  const severitySet = useMemo(() => new Set(severityArr), [severityArr]);
  const stats = useMemo(() => computeStats(threats), [threats]);
  const sevCounts = useMemo(() => severityCounts(threats), [threats]);
  const types = useMemo(() => [...new Set(threats.map((t) => t.type))].sort(), [threats]);
  const statuses = useMemo(() => [...new Set(threats.map((t) => t.status))].sort(), [threats]);

  // The lead stays put after it is acted on, so the reader sees the result before moving on.
  const autoLead = useMemo(() => pickLead(threats), [threats]);
  const pinned = pinnedId ? threats.find((t) => t.id === pinnedId) : null;
  const lead = pinned || autoLead;
  const updateLead = (id, patch) => {
    setPinnedId(id);
    onUpdate(id, patch);
  };
  const nextLead = pinned && autoLead && autoLead.id !== pinned.id ? () => setPinnedId(null) : null;

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

  const hasFilters = Boolean(query) || severityArr.length > 0 || status !== "All" || type !== "All";

  const toggleSeverity = (sev) =>
    setSeverityArr((prev) => (prev.includes(sev) ? prev.filter((s) => s !== sev) : [...prev, sev]));

  const clearFilters = () => {
    setQuery("");
    setSeverityArr([]);
    setStatus("All");
    setType("All");
  };

  const savePreset = () => {
    const name = window.prompt("Name this preset");
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
    setView(p.view || "list");
  };
  const deletePreset = (name) => setPresets((prev) => prev.filter((p) => p.name !== name));

  const stamp = new Date().toISOString().slice(0, 10);
  const exportCSV = () => downloadFile(`sentinelpulse-${stamp}.csv`, threatsToCSV(filtered), "text/csv");
  const exportJSON = () => downloadFile(`sentinelpulse-${stamp}.json`, threatsToJSON(filtered), "application/json");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if ([...p.keys()].length === 0) return;
    if (p.has("q")) setQuery(p.get("q") || "");
    if (p.has("sev")) setSeverityArr((p.get("sev") || "").split(",").filter(Boolean));
    if (p.has("status")) setStatus(p.get("status") || "All");
    if (p.has("type")) setType(p.get("type") || "All");
    if (p.has("view")) setView(p.get("view") === "grid" ? "grid" : "list");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareView = async () => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (severityArr.length) p.set("sev", severityArr.join(","));
    if (status !== "All") p.set("status", status);
    if (type !== "All") p.set("type", type);
    if (view !== "list") p.set("view", view);
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

  // "/" focuses search, g and l switch layout, p pauses or resumes the feed.
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return;
      if (document.querySelector("[role=dialog]")) return;
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

  const loading = sourceState.loading;

  const empty = (
    <div className="py-12">
      <p className="head text-lg">{hasFilters ? "Nothing on the wire matches these filters." : "The wire is quiet."}</p>
      <p className="mt-2 text-base text-ink-2">
        {hasFilters
          ? "Widen the search or clear the filters to see every report."
          : "New reports appear here as the feed delivers them."}
      </p>
      {hasFilters && <button type="button" onClick={clearFilters} className="btn btn-primary mt-4">Clear filters</button>}
    </div>
  );

  let results;
  if (loading) {
    results = (
      <ul aria-busy="true" aria-label="Loading GitHub advisories">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <li key={i} className="grid grid-cols-[56px_1fr] gap-4 border-b border-rule py-4 sm:grid-cols-[64px_104px_1fr]">
            <span className="h-3 bg-paper-3" />
            <span className="hidden h-3 bg-paper-3 sm:block" />
            <span className="h-3 bg-paper-3" style={{ width: `${90 - i * 9}%` }} />
          </li>
        ))}
      </ul>
    );
  } else if (filtered.length === 0) {
    results = empty;
  } else if (view === "grid") {
    results = <Clippings threats={filtered} sort={sort} onSelect={onSelect} />;
  } else {
    results = <Wire threats={filtered} sort={sort} onSelect={onSelect} />;
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 lg:px-8">
      <Headline
        threats={threats}
        totalDetected={feed.totalDetected}
        level={stats.level}
        lead={lead}
        loading={loading}
        onUpdate={updateLead}
        onSelect={onSelect}
        onNext={nextLead}
      />

      <div className="grid grid-cols-1 gap-y-12 pb-16 lg:grid-cols-12 lg:gap-x-8">
        <section aria-labelledby="wire-title" className="min-w-0 lg:col-span-8">
          <div className="rule-top flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-2">
            <h2 id="wire-title" className="head text-xl">The wire</h2>
            <p className="tnum text-sm text-ink-3">
              {loading ? "Loading" : <>Showing <span className="font-semibold text-ink">{filtered.length}</span> of {threats.length}</>}
              {source === "github" ? " GitHub advisories" : " reports"}
            </p>
          </div>

          {sourceState.error && (
            <div className="mt-3 flex flex-wrap items-center gap-3 border-y-2 border-ink py-3" role="alert">
              <p className="min-w-0 flex-1 text-base text-ink">{sourceState.error}</p>
              <button type="button" onClick={refresh} className="btn btn-primary">Try again</button>
            </div>
          )}

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
            sort={sort}
            setSort={setSort}
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
        </section>

        <div className="min-w-0 lg:col-span-4 lg:border-l lg:border-rule lg:pl-8">
          <Rail threats={threats} github={source === "github"} />
        </div>
      </div>
    </main>
  );
}
