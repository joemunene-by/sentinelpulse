import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { severityOrder, statusColors, attackFor } from "../lib/threatUtils";
import Severity from "./Severity";

const comparators = {
  time: (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  severity: (a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9) || new Date(b.timestamp) - new Date(a.timestamp),
  title: (a, b) => a.title.localeCompare(b.title),
};

export const SORTS = [
  { value: "time:1", label: "Newest first" },
  { value: "time:-1", label: "Oldest first" },
  { value: "severity:1", label: "Most severe first" },
  { value: "severity:-1", label: "Least severe first" },
  { value: "title:1", label: "Title, A to Z" },
  { value: "title:-1", label: "Title, Z to A" },
];

export function sortThreats(threats, sort) {
  const [key, dir] = sort.split(":");
  const cmp = comparators[key] || comparators.time;
  return [...threats].sort((a, b) => cmp(a, b) * Number(dir || 1));
}

function Row({ t, onSelect, showDate }) {
  const tech = attackFor(t.type);
  const when = parseISO(t.timestamp);
  const status = <span className={`text-right text-sm ${statusColors[t.status] || "text-ink-2"}`}>{t.status}</span>;
  return (
    <li className="border-b border-rule">
      <button
        type="button"
        onClick={() => onSelect(t)}
        className={`grid w-full grid-cols-1 gap-x-4 py-3 text-left transition-colors hover:bg-paper-2 sm:grid-cols-[64px_96px_1fr_auto] ${t.isNew ? "animate-arrive" : ""}`}
      >
        <span className="flex items-baseline gap-3 sm:hidden">
          <span className="font-mono text-xs text-ink-2">{format(when, showDate ? "d MMM, HH:mm" : "HH:mm")}</span>
          <span className="text-sm"><Severity level={t.severity} /></span>
          <span className="ml-auto">{status}</span>
        </span>
        <span className="hidden pt-0.5 font-mono text-xs text-ink-2 sm:block">
          {format(when, "HH:mm")}
          {showDate && <span className="block text-ink-3">{format(when, "d MMM")}</span>}
        </span>
        <span className="hidden text-sm sm:block"><Severity level={t.severity} /></span>
        <span className="mt-1 min-w-0 sm:mt-0">
          <span className="block text-base font-semibold text-ink sm:truncate">{t.title}</span>
          <span className="mt-0.5 block truncate text-sm text-ink-3">
            {t.region} · {t.type} · <span className="font-mono text-xs">{t.id}</span>
            {tech ? <> · <span className="font-mono text-xs">{tech.id}</span></> : null}
          </span>
        </span>
        <span className="hidden sm:block">{status}</span>
      </button>
    </li>
  );
}

// The chronological log of every report in view, grouped by day when sorted by time.
export default function Wire({ threats, sort, onSelect }) {
  const sorted = useMemo(() => sortThreats(threats, sort), [threats, sort]);
  const byDay = sort.startsWith("time:");

  const groups = useMemo(() => {
    if (!byDay) return [{ day: null, items: sorted }];
    const out = [];
    for (const t of sorted) {
      const day = format(parseISO(t.timestamp), "EEEE d MMMM");
      if (!out.length || out[out.length - 1].day !== day) out.push({ day, items: [] });
      out[out.length - 1].items.push(t);
    }
    return out;
  }, [sorted, byDay]);

  return (
    <div>
      {groups.map((g) => (
        <section key={g.day || "all"} aria-label={g.day || "Reports"}>
          {g.day && (
            <h3 className="dateline flex items-baseline justify-between border-b border-ink pb-1 pt-6 text-ink">
              {g.day}
              <span className="text-ink-3">{g.items.length} {g.items.length === 1 ? "report" : "reports"}</span>
            </h3>
          )}
          <ul>
            {g.items.map((t) => <Row key={t.id} t={t} onSelect={onSelect} showDate={!byDay} />)}
          </ul>
        </section>
      ))}
    </div>
  );
}
