import { format, parseISO } from "date-fns";
import { statusColors, attackFor } from "../lib/threatUtils";
import Severity from "./Severity";

// A single threat tile. Clicking opens the detail modal via onSelect.
export default function ThreatCard({ threat, onSelect }) {
  const tech = attackFor(threat.type);

  return (
    <button
      type="button"
      onClick={() => onSelect(threat)}
      className={`panel flex h-full w-full flex-col p-4 text-left transition-colors hover:bg-raised ${
        threat.isNew ? "animate-arrive border-line-strong" : ""
      }`}
    >
      <div className="flex items-center gap-3 text-xs">
        <Severity level={threat.severity} />
        <span className="font-mono text-ink-3">{threat.id}</span>
        {threat.isNew && <span className="font-semibold uppercase tracking-[0.04em] text-ink">New</span>}
        {tech && <span className="ml-auto font-mono text-ink-3" title={tech.name}>{tech.id}</span>}
      </div>

      <h3 className="mt-3 line-clamp-2 text-base font-semibold text-ink">{threat.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-ink-2">{threat.description}</p>

      <p className="mb-3 mt-3 flex min-w-0 items-baseline gap-2 text-xs">
        <span className="label shrink-0">IOC</span>
        <span className="truncate font-mono text-ink-2">{threat.ioc}</span>
      </p>

      <div className="mt-auto flex items-center gap-2 border-t border-line pt-3 text-xs text-ink-3">
        <span className="tnum whitespace-nowrap">{format(parseISO(threat.timestamp), "MMM d, HH:mm")}</span>
        <span>·</span>
        <span className="truncate">{threat.region}</span>
        <span>·</span>
        <span className="truncate">{threat.type}</span>
        <span className={`ml-auto whitespace-nowrap ${statusColors[threat.status] || "text-ink-2"}`}>{threat.status}</span>
      </div>
    </button>
  );
}
