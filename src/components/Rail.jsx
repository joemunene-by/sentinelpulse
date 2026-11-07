import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { threatTrendData } from "../data/mockThreats";
import { SEVERITIES, countBy, severityDistribution } from "../lib/threatUtils";
import { severityFill } from "../lib/palette";
import { useTheme } from "../hooks/useTheme";
import Severity from "./Severity";

function RailSection({ title, aside, children }) {
  return (
    <section className="rule-top pb-8 pt-2">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="head text-lg">{title}</h2>
        {aside ? <p className="text-sm text-ink-3">{aside}</p> : null}
      </div>
      {children}
    </section>
  );
}

function BarRow({ label, value, max, share, fill = "var(--color-ink-3)" }) {
  return (
    <li className="grid grid-cols-[minmax(0,7.5rem)_1fr_2rem] items-center gap-x-3 border-b border-rule py-2 text-sm last:border-b-0 sm:grid-cols-[minmax(0,8.5rem)_1fr_2rem_2.5rem]">
      <span className="truncate">{label}</span>
      <span className="h-1.5" aria-hidden="true">
        <span className="block h-full" style={{ width: `${max ? (value / max) * 100 : 0}%`, backgroundColor: fill }} />
      </span>
      <span className="tnum text-right text-ink">{value}</span>
      {share !== undefined && <span className="tnum hidden text-right text-ink-3 sm:block">{share}%</span>}
    </li>
  );
}

const FILL_VAR = { Critical: "var(--color-signal)", High: "var(--color-ink)", Medium: "var(--color-ink-3)", Low: "var(--color-rule-strong)" };

function ActivityTip({ active, payload, label, github }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="min-w-40 rounded-md bg-sheet px-3 py-2 text-sm shadow-pop">
      <p className="mb-1 font-semibold text-ink">{github ? label : `Three days to ${label}`}</p>
      {[...payload].reverse().map((p) => (
        <p key={p.name} className="flex justify-between gap-4 text-ink-2">
          <span>{p.name}</span><span className="tnum text-ink">{p.value}</span>
        </p>
      ))}
      <p className="mt-1 flex justify-between border-t border-rule pt-1 text-ink-3">
        <span>Total</span><span className="tnum text-ink">{total}</span>
      </p>
    </div>
  );
}

const simulated = threatTrendData.map((d) => ({ date: d.date, Critical: d.critical, High: d.high, Medium: d.medium, Low: d.low }));

// Advisories bucketed by publish day, oldest first, so the chart shows the real feed.
function perDay(threats) {
  const map = new Map();
  for (const t of [...threats].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))) {
    const date = format(parseISO(t.timestamp), "MMM d");
    if (!map.has(date)) map.set(date, { date, Critical: 0, High: 0, Medium: 0, Low: 0 });
    map.get(date)[t.severity] += 1;
  }
  return [...map.values()];
}

function Activity({ threats, github }) {
  const { palette } = useTheme();
  const chartData = github ? perDay(threats) : simulated;
  const windowTotal = chartData.reduce((s, d) => s + d.Critical + d.High + d.Medium + d.Low, 0);
  const span = chartData.length ? `${chartData[0].date} to ${chartData[chartData.length - 1].date}` : "";
  const xTicks = chartData.length ? [...new Set([chartData[0].date, chartData[Math.floor(chartData.length / 2)].date, chartData[chartData.length - 1].date])] : [];
  const unit = github ? "advisories, counted by publish day" : "detections, counted every 3 days";
  const tick = { fill: palette.ink3, fontSize: 12, fontFamily: "IBM Plex Mono, ui-monospace, monospace" };
  return (
    <RailSection title="Activity" aside={span}>
      <p className="flex items-baseline gap-2">
        <span className="head tnum text-2xl">{windowTotal.toLocaleString()}</span>
        <span className="text-sm text-ink-2">{unit}</span>
      </p>
      <div className="mt-3 h-44" role="img" aria-label={`${windowTotal} ${unit}, ${span}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} barCategoryGap="20%">
            <CartesianGrid stroke={palette.rule} vertical={false} />
            <XAxis dataKey="date" tick={tick} axisLine={{ stroke: palette.ink }} tickLine={false} ticks={xTicks} interval={0} dy={4} />
            <YAxis tick={tick} axisLine={false} tickLine={false} allowDecimals={false} width={32} />
            <Tooltip content={<ActivityTip github={github} />} cursor={{ fill: palette.rule, opacity: 0.5 }} />
            {[...SEVERITIES].reverse().map((s) => (
              <Bar key={s} dataKey={s} stackId="a" fill={severityFill(palette, s)} isAnimationActive={false} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-3">
        {SEVERITIES.map((s) => (
          <span key={s} className="inline-flex items-center gap-2">
            <span className="inline-block h-2 w-2" style={{ backgroundColor: FILL_VAR[s] }} aria-hidden="true" />
            {s}
          </span>
        ))}
      </p>
    </RailSection>
  );
}

export default function Rail({ threats, github }) {
  const dist = severityDistribution(threats);
  const n = threats.length;
  const maxSev = Math.max(1, ...dist.map((d) => d.value));
  const regions = countBy(threats, "region").slice(0, 6);
  const types = countBy(threats, "type").slice(0, 6);
  const maxRegion = Math.max(1, ...regions.map((r) => r.value));
  const maxType = Math.max(1, ...types.map((r) => r.value));

  return (
    <aside aria-label="Summary" className="space-y-0">
      <RailSection title="Severity mix" aside={`${n} in view`}>
        <ul>
          {dist.map((d) => (
            <BarRow
              key={d.name}
              label={<Severity level={d.name} />}
              value={d.value}
              max={maxSev}
              share={n ? Math.round((d.value / n) * 100) : 0}
              fill={FILL_VAR[d.name]}
            />
          ))}
        </ul>
        <p className="sr-only">{dist.map((d) => `${d.name} ${d.value}`).join(", ")}</p>
      </RailSection>

      <Activity threats={threats} github={github} />

      <RailSection title="Regions" aside={`Top ${regions.length}`}>
        {regions.length ? (
          <ul>{regions.map((r) => <BarRow key={r.name} label={<span className="text-ink-2">{r.name}</span>} value={r.value} max={maxRegion} />)}</ul>
        ) : <p className="text-sm text-ink-3">No reports in view.</p>}
      </RailSection>

      <RailSection title="Attack types" aside={`Top ${types.length}`}>
        {types.length ? (
          <ul>{types.map((r) => <BarRow key={r.name} label={<span className="text-ink-2">{r.name}</span>} value={r.value} max={maxType} />)}</ul>
        ) : <p className="text-sm text-ink-3">No reports in view.</p>}
      </RailSection>
    </aside>
  );
}
