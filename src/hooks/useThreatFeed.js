import { useCallback, useEffect, useRef, useState } from "react";
import { mockThreats, makeRandomThreat } from "../data/mockThreats";
import { fetchGithubAdvisories } from "../lib/dataSources";

const MAX_THREATS = 40; // visible window; the running total is tracked separately
const SPEED_MS = { slow: 9000, normal: 4500, fast: 2000 };

// Owns the live threat list and the simulated real-time feed. When `live`,
// a synthetic threat is prepended on each tick and the oldest is dropped.
export default function useThreatFeed() {
  const [threats, setThreats] = useState(() => mockThreats.map((t) => ({ ...t })));
  // Running total of everything detected. The visible list is capped for
  // performance, but this keeps climbing so the headline metric stays live.
  const [totalDetected, setTotalDetected] = useState(mockThreats.length);
  const [live, setLive] = useState(true);
  const [speed, setSpeed] = useState("normal");
  const [source, setSource] = useState("sim");
  const [sourceState, setSourceState] = useState({ loading: false, error: "" });
  const [lastUpdated, setLastUpdated] = useState(() => Date.now());
  const timer = useRef(null);

  const addThreat = useCallback(() => {
    setThreats((prev) => [
      makeRandomThreat(),
      ...prev.map((t) => (t.isNew ? { ...t, isNew: false } : t)),
    ].slice(0, MAX_THREATS));
    setTotalDetected((n) => n + 1);
    setLastUpdated(Date.now());
  }, []);

  // The synthetic ticker only runs for the simulated source.
  useEffect(() => {
    if (!live || source !== "sim") return undefined;
    timer.current = setInterval(addThreat, SPEED_MS[speed] ?? SPEED_MS.normal);
    return () => clearInterval(timer.current);
  }, [live, speed, source, addThreat]);

  const toggleLive = useCallback(() => setLive((v) => !v), []);

  // Patch a threat in place (used by the detail modal's status actions).
  const updateThreat = useCallback((id, patch) => {
    setThreats((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  // Pull live data from GitHub Security Advisories.
  const loadGithub = useCallback(async () => {
    setSourceState({ loading: true, error: "" });
    try {
      const items = await fetchGithubAdvisories(30);
      setThreats(items);
      setTotalDetected(items.length);
      setLastUpdated(Date.now());
      setSourceState({ loading: false, error: "" });
    } catch (e) {
      setSourceState({ loading: false, error: e.message || "Failed to load advisories." });
    }
  }, []);

  const changeSource = useCallback(
    (src) => {
      setSource(src);
      if (src === "github") {
        loadGithub();
      } else {
        setThreats(mockThreats.map((t) => ({ ...t })));
        setTotalDetected(mockThreats.length);
        setLastUpdated(Date.now());
        setSourceState({ loading: false, error: "" });
      }
    },
    [loadGithub],
  );

  return {
    threats, totalDetected, live, toggleLive, speed, setSpeed, lastUpdated,
    addThreat, updateThreat, source, setSource: changeSource, sourceState, refresh: loadGithub,
  };
}
