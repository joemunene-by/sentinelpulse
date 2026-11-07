import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LabelList, CartesianGrid } from "recharts";
import { countBy } from "../lib/threatUtils";
import { PanelHeader, ChartTip, axisTick, gridStroke } from "./ChartParts";

export default function RegionBar({ threats }) {
  const data = countBy(threats, "region").slice(0, 6);

  return (
    <section className="panel p-4 sm:p-6">
      <PanelHeader title="Threats by region" subtitle={`Top ${data.length} regions, count of threats in view`} />
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 32, top: 0, bottom: 0 }}>
            <CartesianGrid stroke={gridStroke} horizontal={false} />
            <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={120} tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "rgba(236,238,240,0.04)" }} content={<ChartTip />} />
            <Bar dataKey="value" name="Threats" fill="#a9aeb6" radius={[0, 2, 2, 0]} barSize={16} isAnimationActive={false}>
              <LabelList dataKey="value" position="right" fill="#eceef0" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
