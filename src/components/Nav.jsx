import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShield, FiActivity, FiBell, FiVolume2, FiVolumeX } from "react-icons/fi";
import { severityConfig, relativeTime } from "../lib/threatUtils";

export default function Nav({ live, onToggleLive, alerts = [], onSelect, lastUpdated, soundOn, onToggleSound }) {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(() => new Set());

  // Alerts the user hasn't opened the panel for yet.
  const unread = alerts.reduce((n, a) => (seen.has(a.id) ? n : n + 1), 0);

  const togglePanel = () =>
    setOpen((v) => {
      const willOpen = !v;
      if (willOpen) {
        setSeen((prev) => {
          const next = new Set(prev);
          alerts.forEach((a) => next.add(a.id));
          return next;
        });
      }
      return willOpen;
    });

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20"
            whileHover={{ scale: 1.05 }}
          >
            <FiShield className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Sentinel<span className="text-primary">Pulse</span>
            </h1>
            <p className="hidden text-[10px] uppercase tracking-widest text-slate-500 sm:block">
              Threat Intelligence
            </p>
          </div>
        </div>

        {/* Status + notifications */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-surface-card/80 px-3 py-1.5 text-xs sm:flex">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-green-400" />
            <span className="text-slate-400">Systems Operational</span>
          </div>

          <button
            type="button"
            onClick={onToggleLive}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors ${
              live ? "bg-sev-low/10 text-sev-low" : "bg-surface-card/80 text-slate-400 hover:text-white"
            }`}
            title={live ? "Live feed running — click to pause" : "Feed paused — click to resume"}
          >
            <FiActivity className={`h-3.5 w-3.5 ${live ? "animate-pulse" : ""}`} />
            <span className="hidden sm:inline">{live ? "Live Feed" : "Paused"}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            className={`rounded-lg p-2 transition-colors ${
              soundOn ? "bg-secondary/10 text-secondary" : "bg-surface-card/80 text-slate-400 hover:text-white"
            }`}
            title={soundOn ? "Alert sound on" : "Alert sound off"}
            aria-label="Toggle alert sound"
          >
            {soundOn ? <FiVolume2 className="h-4 w-4" /> : <FiVolumeX className="h-4 w-4" />}
          </button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePanel}
              className="relative rounded-lg bg-surface-card/80 p-2 text-slate-400 transition-colors hover:text-white"
              aria-label="Notifications"
            >
              <FiBell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sev-critical px-1 text-[9px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {open && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="glass-card absolute right-0 z-20 mt-2 w-80 overflow-hidden p-0"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Priority Alerts
                      </span>
                      {lastUpdated ? (
                        <span className="text-[10px] text-slate-500">{relativeTime(lastUpdated)}</span>
                      ) : null}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {alerts.length === 0 ? (
                        <p className="px-4 py-6 text-center text-xs text-slate-500">No priority alerts.</p>
                      ) : (
                        alerts.map((a) => {
                          const sev = severityConfig[a.severity] || severityConfig.Medium;
                          return (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => { onSelect?.(a); setOpen(false); }}
                              className="flex w-full items-start gap-2 border-b border-white/[0.03] px-4 py-3 text-left transition-colors hover:bg-white/[0.03]"
                            >
                              <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${sev.dot}`} />
                              <span className="min-w-0">
                                <span className="block truncate text-xs font-medium text-white">{a.title}</span>
                                <span className="text-[10px] text-slate-500">
                                  {a.severity} · {a.region} · {relativeTime(a.timestamp)}
                                </span>
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
