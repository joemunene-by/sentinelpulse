import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { countBy } from "../lib/threatUtils";

function BarTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <span className="font-semibold text-white">{payload[0].payload.name}</span>
      <span className="ml-2 text-slate-400">{payload[0].value} threats</span>
    </div>
  );
}

export default function RegionBar({ threats }) {
  const data = countBy(threats, "region").slice(0, 7);

  return (
    <div className="glass-card p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Threats by Region
      </h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={96}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<BarTip />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
              {data.map((_, i) => (
                <Cell key={i} fill="#d946ef" fillOpacity={Math.max(0.35, 0.9 - i * 0.09)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
