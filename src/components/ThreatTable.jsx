import { useMemo, useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { format, parseISO } from "date-fns";
import { severityOrder, severityConfig } from "../lib/threatUtils";

const SeverityBadge = ({ severity }) => {
  const s = severityConfig[severity] || severityConfig.Medium;
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${s.bg} ${s.text} ${s.border}`}>
      {severity}
    </span>
  );
};

const comparators = {
  severity: (a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9),
  time: (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  title: (a, b) => a.title.localeCompare(b.title),
};

export default function ThreatTable({ threats, onSelect }) {
  const [sort, setSort] = useState({ key: "severity", dir: 1 });

  const sorted = useMemo(() => {
    const cmp = comparators[sort.key] || comparators.severity;
    return [...threats].sort((a, b) => cmp(a, b) * sort.dir);
  }, [threats, sort]);

  const SortHeader = ({ label, k, className = "" }) => {
    const active = sort.key === k;
    return (
      <th className={`px-5 py-3 font-medium ${className}`}>
        <button
          type="button"
          onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? -s.dir : 1 }))}
          className={`flex items-center gap-1 uppercase tracking-wider transition-colors ${active ? "text-slate-300" : "text-slate-500 hover:text-slate-300"}`}
        >
          {label}
          {active && (sort.dir === 1 ? <FiChevronUp className="h-3 w-3" /> : <FiChevronDown className="h-3 w-3" />)}
        </button>
      </th>
    );
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Threat Log</h2>
        <span className="text-[11px] text-slate-600">{threats.length} shown</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/5 text-[11px]">
              <th className="px-5 py-3 font-medium uppercase tracking-wider text-slate-500">ID</th>
              <SortHeader label="Threat" k="title" />
              <th className="px-5 py-3 font-medium uppercase tracking-wider text-slate-500">Type</th>
              <SortHeader label="Severity" k="severity" />
              <th className="px-5 py-3 font-medium uppercase tracking-wider text-slate-500">Status</th>
              <th className="hidden px-5 py-3 font-medium uppercase tracking-wider text-slate-500 md:table-cell">Source</th>
              <SortHeader label="Detected" k="time" className="hidden lg:table-cell" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => (
              <tr
                key={t.id}
                onClick={() => onSelect(t)}
                className={`cursor-pointer border-b border-white/[0.03] transition-colors hover:bg-white/[0.03] ${t.isNew ? "animate-flash" : ""}`}
              >
                <td className="whitespace-nowrap px-5 py-3 font-mono text-slate-500">{t.id}</td>
                <td className="max-w-[260px] truncate px-5 py-3 font-medium text-white">{t.title}</td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-400">{t.type}</td>
                <td className="px-5 py-3"><SeverityBadge severity={t.severity} /></td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-400">{t.status}</td>
                <td className="hidden max-w-[180px] truncate px-5 py-3 text-slate-500 md:table-cell">{t.source}</td>
                <td className="hidden whitespace-nowrap px-5 py-3 text-slate-500 lg:table-cell">{format(parseISO(t.timestamp), "MMM d, HH:mm")}</td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                  No threats match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
