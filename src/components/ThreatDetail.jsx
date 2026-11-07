import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiX, FiCopy, FiCheck } from "react-icons/fi";
import { format, parseISO } from "date-fns";
import { statusColors, attackFor } from "../lib/threatUtils";
import Severity from "./Severity";

function Meta({ label, children, full }) {
  return (
    <div className={`border-t border-rule pt-2 ${full ? "col-span-2" : ""}`}>
      <dt className="label">{label}</dt>
      <dd className="mt-1 text-base text-ink">{children}</dd>
    </div>
  );
}

// The full record for one report. Closes on backdrop click or Escape.
export default function ThreatDetail({ threat, onClose, onUpdate }) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    return () => prev?.focus?.();
  }, []);

  if (!threat) return null;
  const tech = attackFor(threat.type);
  const acked = threat.status === "Investigating";
  const done = threat.status === "Mitigated";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(threat.ioc);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable; the indicator stays selectable */
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
      <div className="absolute inset-0 bg-[rgb(22_21_15/0.45)]" onClick={onClose} />
      <motion.div
        className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-md bg-sheet shadow-modal sm:max-w-2xl sm:rounded-md"
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        exit={{ y: 8 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="threat-title"
      >
        <div className="flex items-start justify-between gap-4 px-4 pt-4 sm:px-8 sm:pt-6">
          <div className="min-w-0">
            <p className="flex items-center gap-3 text-sm">
              <Severity level={threat.severity} />
              <span className="font-mono text-xs text-ink-3">{threat.id}</span>
              <span className={statusColors[threat.status] || "text-ink-2"}>{threat.status}</span>
            </p>
            <h2 id="threat-title" className="head mt-3 text-xl sm:text-2xl">{threat.title}</h2>
          </div>
          <button ref={closeRef} onClick={onClose} className="btn btn-icon btn-quiet -mr-2 -mt-1 shrink-0" aria-label="Close">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-4 pb-6 pt-4 sm:px-8">
          <p className="text-md text-ink-2 [overflow-wrap:anywhere]">{threat.description}</p>

          <div className="mt-6 border-y-2 border-ink py-3">
            <p className="label">Indicator of compromise</p>
            <div className="mt-2 flex items-center gap-3">
              <code className="min-w-0 flex-1 break-all font-mono text-base text-ink">{threat.ioc}</code>
              <button onClick={copy} className="btn shrink-0 px-3" aria-label="Copy indicator">
                {copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
            <Meta label="Type">{threat.type}</Meta>
            <Meta label="Region">{threat.region}</Meta>
            <Meta label="Detected"><span className="font-mono text-sm">{format(parseISO(threat.timestamp), "d MMM yyyy, HH:mm")}</span></Meta>
            <Meta label="ATT&CK">
              {tech ? <><span className="font-mono text-sm">{tech.id}</span> <span className="text-ink-2">{tech.name}</span></> : <span className="text-ink-3">Not mapped</span>}
            </Meta>
            <Meta label="Source" full>{threat.source}</Meta>
          </dl>
        </div>

        {onUpdate && (
          <div className="flex gap-2 border-t border-rule px-4 py-4 sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={() => onUpdate(threat.id, { status: "Investigating", isNew: false })}
              disabled={acked || done}
              className="btn flex-1 sm:flex-none"
            >
              {acked ? "Acknowledged" : "Acknowledge"}
            </button>
            <button
              type="button"
              onClick={() => onUpdate(threat.id, { status: "Mitigated", isNew: false })}
              disabled={done}
              className="btn btn-primary flex-1 sm:flex-none"
            >
              {done ? "Mitigated" : "Mark mitigated"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
