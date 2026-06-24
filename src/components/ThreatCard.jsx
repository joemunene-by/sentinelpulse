import { motion } from "framer-motion";
import { FiClock, FiMapPin, FiTag, FiAlertTriangle } from "react-icons/fi";
import { format, parseISO } from "date-fns";
import { severityConfig, statusColors } from "../lib/threatUtils";

// A single threat tile. Clicking opens the detail modal via onSelect.
export default function ThreatCard({ threat, index, onSelect }) {
  const sev = severityConfig[threat.severity] || severityConfig.Medium;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(threat)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.35 }}
      whileHover={{ y: -3 }}
      className={`glass-card group block w-full overflow-hidden border-l-4 p-5 text-left transition-shadow hover:glow-primary ${sev.ring} ${threat.isNew ? "ring-1 ring-secondary/40" : ""}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono text-[10px] text-slate-500">{threat.id}</span>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${sev.bg} ${sev.text} ${sev.border}`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${sev.dot}`} />
              {threat.severity}
            </span>
            {threat.isNew && (
              <span className="rounded-full bg-secondary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-secondary">
                New
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold leading-snug text-white transition-colors group-hover:text-primary">
            {threat.title}
          </h3>
        </div>
        <FiAlertTriangle className={`mt-1 h-4 w-4 shrink-0 ${sev.text}`} />
      </div>

      {/* Description */}
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-400">
        {threat.description}
      </p>

      {/* IOC */}
      <div className="mb-3 rounded-md bg-surface/60 px-3 py-2">
        <p className="truncate font-mono text-[10px] text-slate-500">
          <span className="text-secondary">IOC:</span> {threat.ioc}
        </p>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <FiClock className="h-3 w-3" />
          {format(parseISO(threat.timestamp), "MMM d, HH:mm")}
        </span>
        <span className="flex items-center gap-1">
          <FiMapPin className="h-3 w-3" />
          {threat.region}
        </span>
        <span className="flex items-center gap-1">
          <FiTag className="h-3 w-3" />
          {threat.type}
        </span>
        <span className={`ml-auto font-semibold ${statusColors[threat.status] || "text-slate-400"}`}>
          {threat.status}
        </span>
      </div>
    </motion.button>
  );
}
