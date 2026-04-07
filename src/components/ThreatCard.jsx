import { motion } from "framer-motion";
import { FiClock, FiMapPin, FiTag, FiAlertTriangle } from "react-icons/fi";
import { format, parseISO } from "date-fns";

const severityConfig = {
  Critical: {
    bg: "bg-sev-critical/15",
    text: "text-sev-critical",
    border: "border-sev-critical/30",
    dot: "bg-sev-critical",
  },
  High: {
    bg: "bg-sev-high/15",
    text: "text-sev-high",
    border: "border-sev-high/30",
    dot: "bg-sev-high",
  },
  Medium: {
    bg: "bg-sev-medium/15",
    text: "text-sev-medium",
    border: "border-sev-medium/30",
    dot: "bg-sev-medium",
  },
  Low: {
    bg: "bg-sev-low/15",
    text: "text-sev-low",
    border: "border-sev-low/30",
    dot: "bg-sev-low",
  },
};

const statusColors = {
  Active: "text-sev-critical",
  Monitoring: "text-secondary",
  Investigating: "text-sev-medium",
  Mitigated: "text-sev-low",
  Remediated: "text-slate-400",
  Patched: "text-slate-400",
};

export default function ThreatCard({ threat, index }) {
  const sev = severityConfig[threat.severity] || severityConfig.Medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass-card group overflow-hidden p-5 transition-all hover:glow-primary"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono text-[10px] text-slate-500">
              {threat.id}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${sev.bg} ${sev.text} ${sev.border}`}
            >
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${sev.dot}`} />
              {threat.severity}
            </span>
          </div>
          <h3 className="text-sm font-semibold leading-snug text-white group-hover:text-primary transition-colors">
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
    </motion.div>
  );
}
