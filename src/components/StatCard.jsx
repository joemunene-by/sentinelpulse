import useCountUp from "../hooks/useCountUp";
import { LevelBars } from "./Severity";

function deltaText(delta) {
  if (typeof delta !== "number") return null;
  if (delta === 0) return "No change in 30s";
  return `${delta > 0 ? "+" : "−"}${Math.abs(delta)} in 30s`;
}

// One cell of the metric strip. Numbers count up on change; the threat level
// renders as a word with its level bars.
export default function StatCard({ label, value, valueClass = "text-ink", bars, hint, delta }) {
  const numeric = typeof value === "number";
  const animated = useCountUp(numeric ? value : 0);
  const change = deltaText(delta);

  return (
    <div className="min-w-0 p-4 sm:p-6">
      <p className="label">{label}</p>
      <p className={`tnum mt-2 flex items-center gap-3 text-2xl sm:text-stat font-semibold tracking-[-0.01em] ${valueClass}`}>
        {numeric ? animated.toLocaleString() : value}
        {bars ? <LevelBars filled={bars} className="h-4 w-[19px]" /> : null}
      </p>
      <p className="tnum mt-1 text-xs text-ink-3">
        {[hint, change].filter(Boolean).join(" · ")}
      </p>
    </div>
  );
}
