import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiX, FiCopy, FiCheck } from "react-icons/fi";
import { format, parseISO } from "date-fns";
import { statusColors, attackFor } from "../lib/threatUtils";
import Severity from "./Severity";

function Meta({ label, value, valueClass = "text-ink", full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <dt className="label">{label}</dt>
      <dd className={`mt-1 text-sm ${valueClass}`}>{value}</dd>
    </div>
  );
}

// Centered modal showing the full record for one threat, with a one-click
// IOC copy. Closes on backdrop click or Escape.
export default function ThreatDetail({ threat, onClose, onUpdate }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!threat) return null;
  const tech = attackFor(threat.type);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(threat.ioc);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable; ignore */
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        className="relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-lg border border-line bg-raised shadow-modal sm:max-w-xl sm:rounded-lg"
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        exit={{ y: 8 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="threat-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-4 sm:p-6">
          <div className="min-w-0">
            <p className="flex items-center gap-3 text-xs">
              <Severity level={threat.severity} />
              <span className="font-mono text-ink-3">{threat.id}</span>
            </p>
            <h3 id="threat-title" className="mt-2 text-lg font-semibold text-ink sm:text-xl">{threat.title}</h3>
          </div>
          <button onClick={onClose} className="btn btn-icon -mr-2 -mt-2 shrink-0 bg-transparent" aria-label="Close">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto p-4 sm:p-6">
          <p className="text-base text-ink-2">{threat.description}</p>

          <div>
            <p className="label">Indicator of compromise</p>
            <div className="mt-2 flex items-center gap-2 border-y border-line py-2">
              <code className="min-w-0 flex-1 break-all font-mono text-sm text-ink">{threat.ioc}</code>
              <button onClick={copy} className="btn shrink-0 px-3" aria-label="Copy indicator">
                {copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Meta label="Status" value={threat.status} valueClass={statusColors[threat.status] || "text-ink"} />
            <Meta label="Type" value={threat.type} />
            <Meta label="Region" value={threat.region} />
            <Meta label="Detected" value={format(parseISO(threat.timestamp), "MMM d, yyyy, HH:mm")} valueClass="tnum text-ink" />
            {tech && (
              <Meta
                label="MITRE ATT&CK"
                value={<><span className="font-mono">{tech.id}</span> <span className="text-ink-2">{tech.name}</span></>}
                full
              />
            )}
            <Meta label="Source" value={threat.source} full />
          </dl>
        </div>

        {onUpdate && (
          <div className="flex gap-2 border-t border-line p-4 sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={() => onUpdate(threat.id, { status: "Investigating", isNew: false })}
              disabled={threat.status === "Investigating"}
              className="btn flex-1 bg-hover sm:flex-none"
            >
              {threat.status === "Investigating" ? "Acknowledged" : "Acknowledge"}
            </button>
            <button
              type="button"
              onClick={() => onUpdate(threat.id, { status: "Mitigated", isNew: false })}
              disabled={threat.status === "Mitigated"}
              className="btn btn-primary flex-1 sm:flex-none"
            >
              {threat.status === "Mitigated" ? "Mitigated" : "Mark mitigated"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
