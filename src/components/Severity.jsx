import { severityConfig } from "../lib/threatUtils";

// Four ascending bars, filled up to the level, so severity reads without colour.
export function LevelBars({ filled, size = 1, className = "" }) {
  return (
    <svg viewBox="0 0 14 12" width={14 * size} height={12 * size} aria-hidden="true" className={`shrink-0 ${className}`}>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 4}
          y={9 - i * 3}
          width="2.5"
          height={3 + i * 3}
          style={{ fill: i < filled ? "currentColor" : "var(--color-rule)" }}
        />
      ))}
    </svg>
  );
}

export default function Severity({ level, className = "" }) {
  const cfg = severityConfig[level] || severityConfig.Medium;
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap ${cfg.text} ${className}`}>
      <LevelBars filled={cfg.bars} />
      {level}
    </span>
  );
}
