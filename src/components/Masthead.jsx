import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { FiPause, FiPlay, FiBell, FiVolume2, FiVolumeX, FiMoon, FiSun, FiRefreshCw } from "react-icons/fi";
import { relativeTime } from "../lib/threatUtils";
import { useTheme } from "../hooks/useTheme";
import Severity from "./Severity";

export function Mark({ size = 28 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="shrink-0">
      <rect width="24" height="24" rx="2" style={{ fill: "var(--color-ink)" }} />
      <path
        d="M4 15h4l2-6 4 9 2-6h4"
        fill="none"
        style={{ stroke: "var(--color-paper)" }}
        strokeWidth="2.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

const SPEED_NOTE = { slow: "9s", normal: "4.5s", fast: "2s" };

function useNow(ms = 30000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

function FeedSelect({ source, speed, onChange, className = "" }) {
  return (
    <select
      value={source === "github" ? "github" : `sim:${speed}`}
      onChange={(e) => onChange(e.target.value)}
      className={`field ${className}`}
      aria-label="Feed"
      title="Where the bulletin gets its reports"
    >
      <option value="sim:slow">Simulated, every 9s</option>
      <option value="sim:normal">Simulated, every 4.5s</option>
      <option value="sim:fast">Simulated, every 2s</option>
      <option value="github">GitHub advisories</option>
    </select>
  );
}

function Alerts({ alerts, onSelect, lastUpdated }) {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(() => new Set());
  const unread = alerts.reduce((n, a) => (seen.has(a.id) ? n : n + 1), 0);

  const toggle = () =>
    setOpen((v) => {
      if (!v) setSeen((prev) => new Set([...prev, ...alerts.map((a) => a.id)]));
      return !v;
    });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        className={`btn btn-quiet gap-1 px-2 sm:px-3 ${open ? "bg-paper-2" : ""}`}
        aria-label={unread ? `Priority alerts, ${unread} unread` : "Priority alerts"}
        aria-expanded={open}
        title="Priority alerts"
      >
        <FiBell className="h-4 w-4" />
        {unread > 0 && <span className="tnum text-sm font-semibold">{unread > 9 ? "9+" : unread}</span>}
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
              className="fixed inset-x-4 top-16 z-20 overflow-hidden rounded-md bg-sheet shadow-pop sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-[380px]"
            >
              <div className="flex items-baseline justify-between border-b-2 border-ink px-4 pb-2 pt-3">
                <span className="head text-lg">Priority alerts</span>
                {lastUpdated ? <span className="text-xs text-ink-3">Updated {relativeTime(lastUpdated)}</span> : null}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-ink-2">No critical or active threats right now.</p>
                ) : (
                  alerts.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => { onSelect?.(a); setOpen(false); }}
                      className="block w-full border-b border-rule px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-paper-2"
                    >
                      <span className="block truncate text-base font-semibold text-ink">{a.title}</span>
                      <span className="mt-1 flex items-center gap-2 text-sm text-ink-3">
                        <Severity level={a.severity} />
                        <span>{a.region}</span>
                        <span className="ml-auto whitespace-nowrap font-mono text-xs">{relativeTime(a.timestamp)}</span>
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
  );
}

export default function Masthead({
  live, onToggleLive, alerts = [], onSelect, lastUpdated, soundOn, onToggleSound,
  source, speed, onFeedChange, onRefresh, loading,
}) {
  const now = useNow();
  const { theme, toggle } = useTheme();
  const github = source === "github";

  const state = github
    ? loading ? "Fetching advisories" : `Advisories, fetched ${relativeTime(lastUpdated)}`
    : live ? `Live, a report every ${SPEED_NOTE[speed] || "4.5s"}` : "Paused";

  const feedButton = github ? (
    <button type="button" onClick={onRefresh} disabled={loading} className="btn btn-icon sm:w-auto sm:px-3" title="Fetch the latest advisories">
      <FiRefreshCw className="h-4 w-4" />
      <span className="hidden sm:inline">{loading ? "Refreshing" : "Refresh"}</span>
    </button>
  ) : (
    <button
      type="button"
      onClick={onToggleLive}
      className="btn btn-icon sm:w-auto sm:px-3"
      aria-pressed={!live}
      aria-label={live ? "Pause the feed" : "Resume the feed"}
      title={live ? "Pause the feed (p)" : "Resume the feed (p)"}
    >
      {live ? <FiPause className="h-4 w-4" /> : <FiPlay className="h-4 w-4" />}
      <span className="hidden sm:inline">{live ? "Pause" : "Resume"}</span>
    </button>
  );

  return (
    <header className="mx-auto max-w-[1440px] px-4 lg:px-8">
      <div className="flex items-center justify-between gap-4 pb-3 pt-4 lg:pb-4 lg:pt-6">
        <a href="./" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="SentinelPulse, reload the bulletin">
          <Mark size={24} />
          <span className="head truncate text-lg leading-none sm:text-xl sm:leading-none lg:text-2xl lg:leading-none">SentinelPulse</span>
        </a>

        <div className="flex items-center gap-1 lg:gap-2">
          <div className="mr-4 hidden text-right xl:block">
            <p className="label">{format(now, "EEEE d MMMM yyyy, HH:mm")}</p>
            <p className={`mt-1 text-sm ${live || github ? "font-semibold text-ink" : "text-ink-3"}`} role="status">{state}</p>
          </div>
          <FeedSelect source={source} speed={speed} onChange={onFeedChange} className="hidden w-52 lg:block" />
          {feedButton}
          <button
            type="button"
            onClick={onToggleSound}
            className="btn btn-icon btn-quiet"
            title={soundOn ? "Sound on for new critical threats" : "Sound off for new critical threats"}
            aria-label="Sound for new critical threats"
            aria-pressed={soundOn}
          >
            {soundOn ? <FiVolume2 className="h-4 w-4" /> : <FiVolumeX className="h-4 w-4 text-ink-3" />}
          </button>
          <Alerts alerts={alerts} onSelect={onSelect} lastUpdated={lastUpdated} />
          <button
            type="button"
            onClick={toggle}
            className="btn btn-icon btn-quiet"
            aria-label={theme === "dark" ? "Switch to light paper" : "Switch to dark paper"}
            title={theme === "dark" ? "Light paper" : "Dark paper"}
          >
            {theme === "dark" ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="nameplate-rule" />

      <div className="flex items-center justify-between gap-4 py-2 xl:hidden">
        <div className="min-w-0">
          <p className="label truncate">{format(now, "EEE d MMM, HH:mm")}</p>
          <p className={`truncate text-sm ${live || github ? "font-semibold text-ink" : "text-ink-3"}`}>{state}</p>
        </div>
        <FeedSelect source={source} speed={speed} onChange={onFeedChange} className="w-[196px] shrink-0 lg:hidden" />
      </div>
      <div className="border-b border-rule xl:hidden" />
    </header>
  );
}
