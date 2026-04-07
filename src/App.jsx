import Nav from "./components/Nav";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-surface text-slate-200">
      <Nav />
      <Dashboard />
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-600">
        <p>
          SentinelPulse Threat Intelligence Dashboard &mdash; Built by CEO Joe
          Munene
        </p>
      </footer>
    </div>
  );
}
