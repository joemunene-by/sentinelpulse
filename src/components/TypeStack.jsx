import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { typeSeverityData, severityConfig, SEVERITIES } from "../lib/threatUtils";

function StackTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="mb-1 font-semibold text-white">{label}</p>
      {payload
        .filter((p) => p.value > 0)
        .map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-slate-400">{p.name}</span>
            <span className="ml-auto font-mono text-white">{p.value}</span>
          </div>
        ))}
      <p className="mt-1 border-t border-white/5 pt-1 text-slate-500">Total {total}</p>
    </div>
  );
}

export default function TypeStack({ threats }) {
  const data = typeSeverityData(threats).slice(0, 8);

  return (
    <div className="glass-card p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Attack Types by Severity
      </h2>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="type"
              width={104}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<StackTip />} />
            <Legend wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} iconType="circle" iconSize={7} />
            {SEVERITIES.map((sev) => (
              <Bar key={sev} dataKey={sev} stackId="s" fill={severityConfig[sev].hex} barSize={14} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
