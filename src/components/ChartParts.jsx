export const axisTick = { fill: "#80868f", fontSize: 12, fontFamily: "IBM Plex Sans, system-ui, sans-serif" };
export const gridStroke = "#262a30";

export function PanelHeader({ title, subtitle, aside }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs text-ink-3">{subtitle}</p> : null}
      </div>
      {aside ? <div className="shrink-0 text-right">{aside}</div> : null}
    </div>
  );
}

export function Swatch({ color, line = false }) {
  return (
    <span
      aria-hidden="true"
      className={line ? "inline-block h-0.5 w-3" : "inline-block h-2 w-2"}
      style={{ backgroundColor: color }}
    />
  );
}

export function LegendRow({ items, line = false }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
      {items.map((i) => (
        <span key={i.name} className="inline-flex items-center gap-2">
          <Swatch color={i.color} line={line} />
          {i.name}
        </span>
      ))}
    </div>
  );
}

export function ChartTip({ active, payload, label, total }) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter((p) => p.value > 0 || payload.length === 1);
  return (
    <div className="min-w-40 rounded-lg border border-line bg-raised px-3 py-2 text-xs shadow-pop">
      {label ? <p className="mb-1 font-semibold text-ink">{label}</p> : null}
      {rows.map((p) => (
        <div key={p.name} className="flex items-center gap-2 py-px">
          <Swatch color={p.color || p.payload?.fill} />
          <span className="capitalize text-ink-2">{p.name}</span>
          <span className="tnum ml-auto pl-4 font-medium text-ink">{p.value}</span>
        </div>
      ))}
      {total ? (
        <p className="tnum mt-1 flex border-t border-line pt-1 text-ink-3">
          Total<span className="ml-auto text-ink-2">{rows.reduce((s, p) => s + (p.value || 0), 0)}</span>
        </p>
      ) : null}
    </div>
  );
}
