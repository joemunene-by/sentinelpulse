import { format, parseISO } from "date-fns";
import { attackFor, isOpen, levelConfig, postureSentence } from "../lib/threatUtils";
import { LevelBars } from "./Severity";

function Fact({ label, children, className = "" }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="label">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{children}</dd>
    </div>
  );
}

function LeadActions({ lead, onUpdate, onSelect, onNext }) {
  const acked = lead.status === "Investigating";
  const done = lead.status === "Mitigated";
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onUpdate(lead.id, { status: "Mitigated", isNew: false })}
        disabled={done}
        className="btn btn-primary flex-1 sm:flex-none"
      >
        {done ? "Mitigated" : "Mark mitigated"}
      </button>
      <button
        type="button"
        onClick={() => onUpdate(lead.id, { status: "Investigating", isNew: false })}
        disabled={acked || done}
        className="btn flex-1 sm:flex-none"
      >
        {acked ? "Acknowledged" : "Acknowledge"}
      </button>
      <button type="button" onClick={() => onSelect(lead)} className="btn btn-quiet flex-1 underline decoration-rule-strong underline-offset-4 sm:flex-none">
        Full record
      </button>
      {onNext && (
        <button type="button" onClick={onNext} className="btn btn-quiet flex-1 underline decoration-rule-strong underline-offset-4 sm:flex-none">
          Next lead
        </button>
      )}
    </div>
  );
}

function LeadSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading the lead story">
      <span className="block h-3 w-40 bg-paper-3" />
      <span className="mt-4 block h-12 w-full bg-paper-3" />
      <span className="mt-2 block h-12 w-2/3 bg-paper-3" />
      <span className="mt-6 block h-4 w-full bg-paper-3" />
      <span className="mt-2 block h-4 w-5/6 bg-paper-3" />
    </div>
  );
}

function Glance({ threats, totalDetected }) {
  const open = threats.filter(isOpen).length;
  const rows = [
    ["Reports since you opened the bulletin", totalDetected],
    ["Still open", open],
    ["Closed", threats.length - open],
    ["Critical and active", threats.filter((t) => t.severity === "Critical" && t.status === "Active").length],
  ];
  return (
    <dl className="border-t border-ink lg:mt-6">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline justify-between gap-4 border-b border-rule py-2 text-sm">
          <dt className="text-ink-2">{label}</dt>
          <dd className="tnum font-semibold text-ink">{value.toLocaleString()}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Headline({ threats, totalDetected, level, lead, loading, onUpdate, onSelect, onNext }) {
  const cfg = levelConfig[level] || levelConfig.LOW;
  const tech = lead ? attackFor(lead.type) : null;
  const leadIsCritical = lead?.severity === "Critical";

  return (
    <section aria-label="Headline" className="grid grid-cols-1 gap-y-8 py-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-0 lg:py-12">
      <div className="lg:col-span-4 lg:border-r lg:border-rule lg:pr-8">
        <h1 className="head text-xl sm:text-2xl lg:text-3xl">
          Threat level:{" "}
          <span className={`whitespace-nowrap ${cfg.text}`}>
            {cfg.word}
            <LevelBars filled={cfg.bars} size={2.2} className="ml-3 inline-block align-baseline" />
          </span>
        </h1>
        <p className="mt-3 text-md text-ink-2 lg:mt-4">{loading ? "Fetching the latest advisories." : postureSentence(threats)}</p>
      </div>

      <div className="order-last lg:order-none lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:border-r lg:border-rule lg:pr-8">
        <Glance threats={threats} totalDetected={totalDetected} />
        <p className="mt-3 text-sm text-ink-3">The level weighs every report in view by severity.</p>
      </div>

      <article className="border-t-2 border-ink pt-4 lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1 lg:border-t-0 lg:pt-0" aria-labelledby="lead-title">
        {loading || !lead ? (
          loading ? <LeadSkeleton /> : <p className="text-md text-ink-2">No reports yet. The lead story appears here when the first one arrives.</p>
        ) : (
          <>
            <p className={`text-base font-semibold ${leadIsCritical ? "text-signal" : "text-ink"}`}>
              Lead report · {lead.severity} · {lead.status}
            </p>
            <h2 id="lead-title" className="head mt-3 text-2xl lg:text-4xl">
              <button type="button" onClick={() => onSelect(lead)} className="text-left hover:underline hover:decoration-2 hover:underline-offset-[6px]">
                {lead.title}
              </button>
            </h2>
            <p className="measure mt-4 line-clamp-6 text-md text-ink-2 [overflow-wrap:anywhere]">{lead.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-rule pt-4 sm:grid-cols-4">
              <Fact label="Indicator" className="col-span-2">
                <span className="block break-all font-mono text-sm">{lead.ioc}</span>
              </Fact>
              <Fact label="ATT&CK">
                {tech ? <><span className="font-mono">{tech.id}</span> <span className="text-ink-2">{tech.name}</span></> : <span className="text-ink-3">Not mapped</span>}
              </Fact>
              <Fact label="Detected">
                <span className="font-mono">{format(parseISO(lead.timestamp), "d MMM, HH:mm")}</span>
                <span className="block text-ink-2">{lead.region}</span>
              </Fact>
            </dl>

            <LeadActions lead={lead} onUpdate={onUpdate} onSelect={onSelect} onNext={onNext} />
          </>
        )}
      </article>
    </section>
  );
}
