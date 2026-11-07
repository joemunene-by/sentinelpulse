import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiActivity, FiPause, FiBell, FiVolume2, FiVolumeX } from "react-icons/fi";
import { relativeTime } from "../lib/threatUtils";
import Severity from "./Severity";

export function Mark({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" className={className}>
      <rect width="24" height="24" rx="6" fill="var(--color-ink)" />
      <polyline
        points="4 13 8.5 13 10.5 7.5 13.5 17 15.5 11 20 11"
        fill="none"
        stroke="var(--color-on-ink)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Nav({ live, onToggleLive, alerts = [], onSelect, lastUpdated, soundOn, onToggleSound }) {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(() => new Set());

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
    <nav className="sticky top-0 z-50 border-b border-line bg-bg">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Mark />
          <span className="text-lg font-semibold tracking-tight text-ink">SentinelPulse</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLive}
            className={`btn px-3 ${live ? "" : "text-ink-3"}`}
            title={live ? "Live feed running. Click to pause." : "Feed paused. Click to resume."}
            aria-pressed={live}
          >
            {live ? <FiActivity className="h-4 w-4" /> : <FiPause className="h-4 w-4" />}
            {live ? "Live" : "Paused"}
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            className={`btn btn-icon ${soundOn ? "" : "text-ink-3"}`}
            title={soundOn ? "Alert sound on" : "Alert sound off"}
            aria-label="Toggle alert sound"
            aria-pressed={soundOn}
          >
            {soundOn ? <FiVolume2 className="h-4 w-4" /> : <FiVolumeX className="h-4 w-4" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={togglePanel}
              className={`btn btn-icon relative ${open ? "bg-hover" : ""}`}
              aria-label="Notifications"
              aria-expanded={open}
            >
              <FiBell className="h-4 w-4" />
              {unread > 0 && (
                <span className="tnum absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-sm bg-ink px-1 text-xs font-semibold leading-none text-on-ink">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            <AnimatePresence>
              {open && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-20 mt-2 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-lg border border-line bg-raised shadow-pop"
                  >
                    <div className="flex items-center justify-between border-b border-line px-4 py-3">
                      <span className="label">Priority alerts</span>
                      {lastUpdated ? (
                        <span className="text-xs text-ink-3">Updated {relativeTime(lastUpdated)}</span>
                      ) : null}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {alerts.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-ink-2">
                          No critical or active threats right now.
                        </p>
                      ) : (
                        alerts.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => { onSelect?.(a); setOpen(false); }}
                            className="block w-full border-b border-line px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-hover"
                          >
                            <span className="block truncate text-sm font-medium text-ink">{a.title}</span>
                            <span className="mt-1 flex items-center gap-2 text-xs text-ink-2">
                              <Severity level={a.severity} />
                              <span className="text-ink-3">·</span>
                              <span className="truncate">{a.region}</span>
                              <span className="text-ink-3">·</span>
                              <span className="tnum whitespace-nowrap">{relativeTime(a.timestamp)}</span>
                            </span>
                          </button>
                        ))
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
