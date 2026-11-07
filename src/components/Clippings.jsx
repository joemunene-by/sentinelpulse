import { format, parseISO } from "date-fns";
import { statusColors, attackFor } from "../lib/threatUtils";
import Severity from "./Severity";
import { sortThreats } from "./Wire";

// The same reports set as newspaper clippings in two ruled columns.
export default function Clippings({ threats, sort, onSelect }) {
  const sorted = sortThreats(threats, sort);
  return (
    <div className="pt-2 sm:columns-2 sm:gap-8 sm:[column-rule:1px_solid_var(--color-rule)]">
      {sorted.map((t) => {
        const tech = attackFor(t.type);
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t)}
            className={`mb-0 block w-full break-inside-avoid border-b border-rule py-4 text-left transition-colors hover:bg-paper-2 ${t.isNew ? "animate-arrive" : ""}`}
          >
            <span className="flex items-center gap-3 text-sm">
              <Severity level={t.severity} />
              <span className="font-mono text-xs text-ink-3">{t.id}</span>
              {tech && <span className="ml-auto font-mono text-xs text-ink-3" title={tech.name}>{tech.id}</span>}
            </span>
            <span className="head mt-2 block text-lg">{t.title}</span>
            <span className="mt-2 line-clamp-3 block text-sm text-ink-2 [overflow-wrap:anywhere]">{t.description}</span>
            <span className="mt-2 block truncate font-mono text-xs text-ink-2">{t.ioc}</span>
            <span className="mt-2 flex items-baseline gap-2 text-sm text-ink-3">
              <span className="font-mono text-xs">{format(parseISO(t.timestamp), "d MMM, HH:mm")}</span>
              <span className="truncate">{t.region}</span>
              <span className={`ml-auto whitespace-nowrap ${statusColors[t.status] || "text-ink-2"}`}>{t.status}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
