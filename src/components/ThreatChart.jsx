import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { threatTrendData } from "../data/mockThreats";
import { severityConfig } from "../lib/threatUtils";
import { PanelHeader, LegendRow, ChartTip, axisTick, gridStroke } from "./ChartParts";

const series = [
  { key: "critical", name: "Critical", width: 2 },
  { key: "high", name: "High", width: 1.5 },
  { key: "medium", name: "Medium", width: 1.5 },
  { key: "low", name: "Low", width: 1.5 },
].map((s) => ({ ...s, color: severityConfig[s.name].hex }));

const windowTotal = threatTrendData.reduce((sum, d) => sum + d.critical + d.high + d.medium + d.low, 0);
const span = threatTrendData.length
  ? `${threatTrendData[0].date} to ${threatTrendData[threatTrendData.length - 1].date}`
  : "";

export default function ThreatChart() {
  return (
    <section className="panel h-full p-4 sm:p-6">
      <PanelHeader
        title="Threat activity"
        subtitle={`Detections per 3-day interval by severity, ${span}`}
        aside={
          <>
            <p className="tnum text-xl font-semibold text-ink">{windowTotal.toLocaleString()}</p>
            <p className="text-xs text-ink-3">detections</p>
          </>
        }
      />
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={threatTrendData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid stroke={gridStroke} vertical={false} />
            <XAxis dataKey="date" tick={axisTick} axisLine={{ stroke: gridStroke }} tickLine={false} minTickGap={24} dy={4} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} width={48} />
            <Tooltip content={<ChartTip />} cursor={{ stroke: "#363b43" }} />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={s.width}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0, fill: s.color }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <LegendRow items={series} line />
    </section>
  );
}
