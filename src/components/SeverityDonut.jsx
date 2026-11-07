import { severityDistribution } from "../lib/threatUtils";
import { PanelHeader } from "./ChartParts";
import Severity from "./Severity";

// A 100% stacked bar plus a labelled breakdown: every value is readable
// without hovering. `total` is the running count of everything detected.
export default function SeverityDonut({ threats, total }) {
  const data = severityDistribution(threats);
  const windowTotal = data.reduce((s, d) => s + d.value, 0);
  const pct = (v) => (windowTotal ? Math.round((v / windowTotal) * 100) : 0);

  return (
    <section className="panel h-full p-4 sm:p-6">
      <PanelHeader
        title="Severity mix"
        subtitle={`Share of the ${windowTotal} threats in view`}
        aside={
          <>
            <p className="tnum text-xl font-semibold text-ink">{(total ?? windowTotal).toLocaleString()}</p>
            <p className="text-xs text-ink-3">detected in total</p>
          </>
        }
      />

      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-sm bg-raised" role="img" aria-label="Severity share">
        {data.filter((d) => d.value > 0).map((d) => (
          <span key={d.name} style={{ width: `${(d.value / windowTotal) * 100}%`, backgroundColor: d.hex }} />
        ))}
      </div>

      <table className="mt-4 w-full text-sm">
        <thead className="sr-only">
          <tr><th>Severity</th><th>Count</th><th>Share</th></tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.name} className="border-b border-line last:border-b-0">
              <td className="py-2"><Severity level={d.name} /></td>
              <td className="tnum py-2 text-right text-ink">{d.value}</td>
              <td className="tnum w-16 py-2 text-right text-ink-3">{pct(d.value)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
