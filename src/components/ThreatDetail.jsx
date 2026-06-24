import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiX, FiCopy, FiCheck, FiClock, FiMapPin, FiTag, FiRadio, FiActivity,
} from "react-icons/fi";
import { format, parseISO } from "date-fns";
import { severityConfig, statusColors } from "../lib/threatUtils";

function Meta({ icon: Icon, label, value, valueClass = "text-slate-200", full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="mb-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-500">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className={`font-medium ${valueClass}`}>{value}</p>
    </div>
  );
}

// Centered modal showing the full record for one threat, with a one-click
// IOC copy. Closes on backdrop click or Escape.
export default function ThreatDetail({ threat, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!threat) return null;
  const sev = severityConfig[threat.severity] || severityConfig.Medium;

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
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="glass-card relative z-10 w-full max-w-lg overflow-hidden"
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        role="dialog"
        aria-modal="true"
      >
        <div className={`border-l-4 ${sev.ring}`}>
          <div className="flex items-start justify-between gap-4 border-b border-white/5 p-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-500">{threat.id}</span>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${sev.bg} ${sev.text} ${sev.border}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} />
                  {threat.severity}
                </span>
              </div>
              <h3 className="text-lg font-semibold leading-snug text-white">{threat.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 p-5">
            <p className="text-sm leading-relaxed text-slate-300">{threat.description}</p>

            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-500">
                Indicator of Compromise
              </p>
              <div className="flex items-center gap-2 rounded-md bg-surface/60 px-3 py-2">
                <code className="flex-1 truncate font-mono text-xs text-secondary">{threat.ioc}</code>
                <button
                  onClick={copy}
                  className="shrink-0 rounded p-1 text-slate-400 transition-colors hover:text-white"
                  aria-label="Copy indicator"
                >
                  {copied ? <FiCheck className="h-3.5 w-3.5 text-sev-low" /> : <FiCopy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <Meta icon={FiActivity} label="Status" value={threat.status} valueClass={statusColors[threat.status] || "text-slate-200"} />
              <Meta icon={FiTag} label="Type" value={threat.type} />
              <Meta icon={FiMapPin} label="Region" value={threat.region} />
              <Meta icon={FiClock} label="Detected" value={format(parseISO(threat.timestamp), "MMM d, yyyy HH:mm")} />
              <Meta icon={FiRadio} label="Source" value={threat.source} full />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
