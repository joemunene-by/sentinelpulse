import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Nav from "./components/Nav";
import Dashboard from "./components/Dashboard";
import ThreatDetail from "./components/ThreatDetail";
import Toasts from "./components/Toasts";
import useThreatFeed from "./hooks/useThreatFeed";
import usePersistentState from "./hooks/usePersistentState";

// Short WebAudio chirp for incoming critical alerts (no asset needed).
function playBeep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    osc.start();
    osc.stop(ctx.currentTime + 0.26);
    osc.onended = () => ctx.close();
  } catch {
    /* audio unavailable; ignore */
  }
}

export default function App() {
  const feed = useThreatFeed();
  const [selected, setSelected] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [soundOn, setSoundOn] = usePersistentState("sp:sound", false);
  const lastTopId = useRef(null);

  // Priority alerts surfaced in the nav bell: anything critical or active.
  const alerts = useMemo(
    () => feed.threats.filter((t) => t.severity === "Critical" || t.status === "Active").slice(0, 8),
    [feed.threats],
  );

  // Raise a toast (and optional chirp) when a freshly-detected critical arrives.
  useEffect(() => {
    const top = feed.threats[0];
    if (!top || top.id === lastTopId.current) return;
    lastTopId.current = top.id;
    if (top.isNew && top.severity === "Critical") {
      setToasts((prev) => [{ ...top, toastId: top.id }, ...prev].slice(0, 3));
      if (soundOn) playBeep();
    }
  }, [feed.threats, soundOn]);

  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.toastId !== id));

  // Update a threat in the feed and keep the open modal in sync.
  const updateThreat = (id, patch) => {
    feed.updateThreat(id, patch);
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  };

  return (
    <div className="relative min-h-screen bg-surface text-slate-200">
      <div className="app-glow pointer-events-none fixed inset-0 -z-10" />
      <Nav
        live={feed.live}
        onToggleLive={feed.toggleLive}
        alerts={alerts}
        onSelect={setSelected}
        lastUpdated={feed.lastUpdated}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((v) => !v)}
      />
      <Dashboard feed={feed} onSelect={setSelected} />
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-600">
        <p>
          SentinelPulse Threat Intelligence Dashboard &mdash; Built by CEO Joe Munene
        </p>
      </footer>
      <Toasts toasts={toasts} onSelect={setSelected} onDismiss={dismissToast} />
      <AnimatePresence>
        {selected && (
          <ThreatDetail
            threat={selected}
            onClose={() => setSelected(null)}
            onUpdate={updateThreat}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
