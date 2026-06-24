import { motion } from "framer-motion";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import useCountUp from "../hooks/useCountUp";

// Summary metric tile. Numeric values count up on change; string values
// (e.g. the threat-level label) render as-is. `delta` shows movement since
// the last window.
export default function StatCard({ label, value, icon: Icon, color, bg, hint, delta, index = 0 }) {
  const numeric = typeof value === "number";
  const animated = useCountUp(numeric ? value : 0);
  const showDelta = typeof delta === "number" && delta !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass-card relative flex items-center gap-4 overflow-hidden p-5"
    >
      {showDelta && (
        <span className="absolute right-3 top-3 flex items-center gap-0.5 text-[10px] text-slate-400">
          {delta > 0 ? <FiArrowUp className="h-3 w-3" /> : <FiArrowDown className="h-3 w-3" />}
          {Math.abs(delta)}
        </span>
      )}
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
        <p className={`text-2xl font-bold tabular-nums ${color}`}>
          {numeric ? animated.toLocaleString() : value}
        </p>
        {hint ? <p className="text-[10px] text-slate-600">{hint}</p> : null}
      </div>
    </motion.div>
  );
}
