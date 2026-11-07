import { useEffect, useState } from "react";
import { relativeTime } from "../lib/threatUtils";

// Relative time that keeps itself current even when nothing else re-renders.
export default function Ago({ time, className = "" }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, []);
  return <span className={`tnum ${className}`}>{relativeTime(time)}</span>;
}
