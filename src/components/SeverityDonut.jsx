import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { severityDistribution } from "../lib/threatUtils";

function DonutTip({ active, payload, total }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  const pct = total ? Math.round((d.value / total) * 100) : 0;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <span className="font-semibold text-white">{d.name}</span>
      <span className="ml-2 text-slate-400">
        {d.value} ({pct}%)
      </span>
    </div>
  );
}

export default function SeverityDonut({ threats }) {
  const data = severityDistribution(threats).filter((d) => d.value > 0);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-card p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Severity Mix
      </h2>
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.hex} />
              ))}
            </Pie>
            <Tooltip content={<DonutTip total={total} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-white">{total}</span>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Threats</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((d) => (
          <span key={d.name} className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.hex }} />
            {d.name} <span className="text-slate-600">{d.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
