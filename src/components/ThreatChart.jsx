import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { threatTrendData } from "../data/mockThreats";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card px-4 py-3 text-xs">
      <p className="mb-2 font-semibold text-white">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="capitalize text-slate-400">{entry.name}:</span>
          <span className="font-mono text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ThreatChart() {
  return (
    <div className="glass-card p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Threat Activity Trend
      </h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={threatTrendData}>
            <defs>
              <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradMedium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eab308" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#eab308" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradLow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="critical"
              stroke="#ef4444"
              fill="url(#gradCritical)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="high"
              stroke="#f97316"
              fill="url(#gradHigh)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="medium"
              stroke="#eab308"
              fill="url(#gradMedium)"
              strokeWidth={1.5}
            />
            <Area
              type="monotone"
              dataKey="low"
              stroke="#22c55e"
              fill="url(#gradLow)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
