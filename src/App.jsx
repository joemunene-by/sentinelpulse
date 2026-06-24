import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Nav from "./components/Nav";
import Dashboard from "./components/Dashboard";
import ThreatDetail from "./components/ThreatDetail";
import useThreatFeed from "./hooks/useThreatFeed";

export default function App() {
  const feed = useThreatFeed();
  const [selected, setSelected] = useState(null);

  // Priority alerts surfaced in the nav bell: anything critical or active.
  const alerts = useMemo(
    () => feed.threats.filter((t) => t.severity === "Critical" || t.status === "Active").slice(0, 8),
    [feed.threats],
  );

  return (
    <div className="relative min-h-screen bg-surface text-slate-200">
      <div className="app-glow pointer-events-none fixed inset-0 -z-10" />
      <Nav
        live={feed.live}
        onToggleLive={feed.toggleLive}
        alerts={alerts}
        onSelect={setSelected}
        lastUpdated={feed.lastUpdated}
      />
      <Dashboard feed={feed} onSelect={setSelected} />
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-600">
        <p>
          SentinelPulse Threat Intelligence Dashboard &mdash; Built by CEO Joe Munene
        </p>
      </footer>
      <AnimatePresence>
        {selected && <ThreatDetail threat={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
