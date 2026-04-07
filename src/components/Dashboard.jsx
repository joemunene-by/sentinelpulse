import { motion } from "framer-motion";
import {
  FiShield,
  FiAlertOctagon,
  FiMonitor,
  FiTrendingUp,
} from "react-icons/fi";
import { mockThreats, summaryStats } from "../data/mockThreats";
import ThreatChart from "./ThreatChart";
import ThreatCard from "./ThreatCard";

const cards = [
  {
    label: "Total Threats",
    value: summaryStats.totalThreats.toLocaleString(),
    icon: FiShield,
    color: "text-primary",
    bg: "bg-primary/10",
    glow: "glow-primary",
  },
  {
    label: "Critical Alerts",
    value: summaryStats.criticalAlerts,
    icon: FiAlertOctagon,
    color: "text-sev-critical",
    bg: "bg-sev-critical/10",
    glow: "",
  },
  {
    label: "Active Monitors",
    value: summaryStats.activeMonitors,
    icon: FiMonitor,
    color: "text-secondary",
    bg: "bg-secondary/10",
    glow: "glow-secondary",
  },
  {
    label: "Threat Level",
    value: summaryStats.threatLevel,
    icon: FiTrendingUp,
    color: "text-sev-high",
    bg: "bg-sev-high/10",
    glow: "",
  },
];

const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };

const SeverityBadge = ({ severity }) => {
  const styles = {
    Critical: "bg-sev-critical/15 text-sev-critical border-sev-critical/30",
    High: "bg-sev-high/15 text-sev-high border-sev-high/30",
    Medium: "bg-sev-medium/15 text-sev-medium border-sev-medium/30",
    Low: "bg-sev-low/15 text-sev-low border-sev-low/30",
  };
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${styles[severity] || styles.Medium}`}
    >
      {severity}
    </span>
  );
};

export default function Dashboard() {
  const sortedThreats = [...mockThreats].sort(
    (a, b) =>
      (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9)
  );

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className={`glass-card flex items-center gap-4 p-5 ${card.glow}`}
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500">
                {card.label}
              </p>
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <ThreatChart />
      </motion.div>

      {/* Recent threats table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="glass-card overflow-hidden"
      >
        <div className="border-b border-white/5 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Recent Threats
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Threat</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Severity</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Source
                </th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">
                  Region
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedThreats.slice(0, 10).map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-slate-500">
                    {t.id}
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-3 font-medium text-white">
                    {t.title}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-slate-400">
                    {t.type}
                  </td>
                  <td className="px-5 py-3">
                    <SeverityBadge severity={t.severity} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-slate-400">
                    {t.status}
                  </td>
                  <td className="hidden max-w-[180px] truncate px-5 py-3 text-slate-500 md:table-cell">
                    {t.source}
                  </td>
                  <td className="hidden whitespace-nowrap px-5 py-3 text-slate-500 lg:table-cell">
                    {t.region}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Threat cards grid */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Threat Intelligence Feed
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedThreats.map((threat, i) => (
            <ThreatCard key={threat.id} threat={threat} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
