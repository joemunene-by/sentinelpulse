import { useMemo, useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { format, parseISO } from "date-fns";
import { severityOrder, statusColors } from "../lib/threatUtils";
import Severity from "./Severity";

const comparators = {
  severity: (a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9),
  time: (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  title: (a, b) => a.title.localeCompare(b.title),
};

const sortOptions = [
  { value: "severity:1", label: "Severity, highest first" },
  { value: "severity:-1", label: "Severity, lowest first" },
  { value: "time:1", label: "Newest first" },
  { value: "time:-1", label: "Oldest first" },
  { value: "title:1", label: "Title, A to Z" },
  { value: "title:-1", label: "Title, Z to A" },
];

const th = "px-4 py-3 align-middle first:pl-6 last:pr-6 text-left font-semibold uppercase tracking-[0.04em] text-ink-3";

export default function ThreatTable({ threats, onSelect, empty }) {
  const [sort, setSort] = useState({ key: "severity", dir: 1 });

  const sorted = useMemo(() => {
    const cmp = comparators[sort.key] || comparators.severity;
    return [...threats].sort((a, b) => cmp(a, b) * sort.dir);
  }, [threats, sort]);

  const SortHeader = ({ label, k, className = "", align = "left" }) => {
    const active = sort.key === k;
    return (
      <th className={`${th} ${className}`} aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
        <button
          type="button"
          onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? -s.dir : 1 }))}
          className={`inline-flex items-center gap-1 align-middle uppercase transition-colors ${align === "right" ? "flex-row-reverse" : ""} ${
            active ? "text-ink" : "hover:text-ink"
          }`}
        >
          {label}
          {active ? (
            sort.dir === 1 ? <FiChevronDown className="h-3 w-3" /> : <FiChevronUp className="h-3 w-3" />
          ) : (
            <span className="inline-block w-3" />
          )}
        </button>
      </th>
    );
  };

  return (
    <section className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6">
        <h2 className="text-base font-semibold text-ink">Threat log</h2>
        <div className="flex items-center gap-3">
          <span className="tnum text-xs text-ink-3">{threats.length} shown</span>
          <select
            value={`${sort.key}:${sort.dir}`}
            onChange={(e) => {
              const [key, dir] = e.target.value.split(":");
              setSort({ key, dir: Number(dir) });
            }}
            className="field md:hidden"
            aria-label="Sort threats"
          >
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        empty
      ) : (
        <>
          <table className="hidden w-full table-fixed text-sm md:table">
            <thead>
              <tr className="border-b border-line text-xs">
                <th className={`${th} w-24 lg:w-28`}>ID</th>
                <SortHeader label="Threat" k="title" />
                <th className={`${th} w-36`}>Type</th>
                <SortHeader label="Severity" k="severity" className="w-32" />
                <th className={`${th} w-32`}>Status</th>
                <th className={`${th} hidden w-48 xl:table-cell`}>Source</th>
                <SortHeader label="Detected" k="time" className="w-36 text-right" align="right" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onSelect(t)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(t))}
                  tabIndex={0}
                  className={`cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-raised ${t.isNew ? "animate-arrive" : ""}`}
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-4 font-mono text-xs text-ink-3">{t.id}</td>
                  <td className="truncate px-4 py-3 font-medium text-ink">{t.title}</td>
                  <td className="truncate px-4 py-3 text-ink-2">{t.type}</td>
                  <td className="px-4 py-3"><Severity level={t.severity} /></td>
                  <td className={`whitespace-nowrap px-4 py-3 ${statusColors[t.status] || "text-ink-2"}`}>{t.status}</td>
                  <td className="hidden truncate px-4 py-3 text-ink-3 xl:table-cell">{t.source}</td>
                  <td className="tnum whitespace-nowrap py-3 pl-4 pr-6 text-right text-ink-2">{format(parseISO(t.timestamp), "MMM d, HH:mm")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="md:hidden">
            {sorted.map((t) => (
              <li key={t.id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  onClick={() => onSelect(t)}
                  className={`block w-full px-4 py-3 text-left transition-colors hover:bg-raised ${t.isNew ? "animate-arrive" : ""}`}
                >
                  <span className="flex items-center gap-3 text-xs">
                    <Severity level={t.severity} />
                    <span className="font-mono text-ink-3">{t.id}</span>
                    <span className="tnum ml-auto whitespace-nowrap text-ink-3">{format(parseISO(t.timestamp), "MMM d, HH:mm")}</span>
                  </span>
                  <span className="mt-1 block truncate text-sm font-medium text-ink">{t.title}</span>
                  <span className="mt-1 flex items-center gap-2 text-xs text-ink-3">
                    <span className="truncate">{t.type}</span>
                    <span>·</span>
                    <span className={statusColors[t.status] || "text-ink-2"}>{t.status}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
