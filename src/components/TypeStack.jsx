import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { typeSeverityData, severityConfig, SEVERITIES } from "../lib/threatUtils";
import { PanelHeader, LegendRow, ChartTip, axisTick, gridStroke } from "./ChartParts";

const legend = SEVERITIES.map((s) => ({ name: s, color: severityConfig[s].hex }));

export default function TypeStack({ threats }) {
  const data = typeSeverityData(threats).slice(0, 8);

  return (
    <section className="panel p-4 sm:p-6">
      <PanelHeader title="Attack types by severity" subtitle={`Top ${data.length} types, count of threats in view`} />
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
            <CartesianGrid stroke={gridStroke} horizontal={false} />
            <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="type" width={124} tick={axisTick} axisLine={false} tickLine={false} interval={0} />
            <Tooltip cursor={{ fill: "rgba(236,238,240,0.04)" }} content={<ChartTip total />} />
            {SEVERITIES.map((sev) => (
              <Bar key={sev} dataKey={sev} stackId="s" fill={severityConfig[sev].hex} barSize={14} stroke="#131518" strokeWidth={1} isAnimationActive={false} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <LegendRow items={legend} />
    </section>
  );
}
