import { useCallback, useEffect, useRef, useState } from "react";
import { mockThreats, makeRandomThreat } from "../data/mockThreats";

const MAX_THREATS = 60; // cap the list so the simulated feed stays bounded
const TICK_MS = 4500;

// Owns the live threat list and the simulated real-time feed. When `live`,
// a synthetic threat is prepended on each tick and the oldest is dropped.
export default function useThreatFeed() {
  const [threats, setThreats] = useState(() => mockThreats.map((t) => ({ ...t })));
  const [live, setLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(() => Date.now());
  const timer = useRef(null);

  const addThreat = useCallback(() => {
    setThreats((prev) => [
      makeRandomThreat(),
      ...prev.map((t) => (t.isNew ? { ...t, isNew: false } : t)),
    ].slice(0, MAX_THREATS));
    setLastUpdated(Date.now());
  }, []);

  useEffect(() => {
    if (!live) return undefined;
    timer.current = setInterval(addThreat, TICK_MS);
    return () => clearInterval(timer.current);
  }, [live, addThreat]);

  const toggleLive = useCallback(() => setLive((v) => !v), []);

  return { threats, live, toggleLive, lastUpdated, addThreat };
}
