import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import Masthead from "./components/Masthead";
import Dashboard from "./components/Dashboard";
import ThreatDetail from "./components/ThreatDetail";
import Toasts from "./components/Toasts";
import useThreatFeed from "./hooks/useThreatFeed";
import usePersistentState from "./hooks/usePersistentState";
import { ThemeContext, useThemeState } from "./hooks/useTheme";

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
  const themeState = useThemeState();
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

  const changeFeed = (value) => {
    if (value === "github") {
      if (feed.source !== "github") feed.setSource("github");
      return;
    }
    const speed = value.split(":")[1] || "normal";
    if (feed.source !== "sim") feed.setSource("sim");
    feed.setSpeed(speed);
  };

  return (
    <ThemeContext.Provider value={themeState}>
      <MotionConfig reducedMotion="user">
        <div className="relative min-h-screen bg-paper text-ink">
          <Masthead
            live={feed.live}
            onToggleLive={feed.toggleLive}
            alerts={alerts}
            onSelect={setSelected}
            lastUpdated={feed.lastUpdated}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((v) => !v)}
            source={feed.source}
            speed={feed.speed}
            onFeedChange={changeFeed}
            onRefresh={feed.refresh}
            loading={feed.sourceState.loading}
          />
          <Dashboard feed={feed} onSelect={setSelected} onUpdate={updateThreat} />
          <footer className="mx-auto max-w-[1440px] px-4 pb-8 lg:px-8">
            <div className="flex flex-wrap justify-between gap-x-8 gap-y-2 border-t-2 border-ink pt-3 text-sm text-ink-3">
              <p>SentinelPulse, a threat bulletin. Built by CEO Joe Munene.</p>
              <p>
                {feed.source === "github"
                  ? "Reports from the public GitHub Security Advisory database."
                  : "Simulated reports for demonstration. Switch the feed to GitHub advisories for real ones."}
              </p>
            </div>
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
      </MotionConfig>
    </ThemeContext.Provider>
  );
}
