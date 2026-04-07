import { motion } from "framer-motion";
import { FiShield, FiActivity, FiBell } from "react-icons/fi";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20"
            whileHover={{ scale: 1.05 }}
          >
            <FiShield className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Sentinel<span className="text-primary">Pulse</span>
            </h1>
            <p className="hidden text-[10px] uppercase tracking-widest text-slate-500 sm:block">
              Threat Intelligence
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full bg-surface-card/80 px-3 py-1.5 text-xs sm:flex">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-green-400" />
            <span className="text-slate-400">Systems Operational</span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-surface-card/80 px-3 py-1.5 text-xs">
            <FiActivity className="h-3.5 w-3.5 text-secondary" />
            <span className="text-slate-400">Live Feed</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative rounded-lg bg-surface-card/80 p-2 text-slate-400 transition-colors hover:text-white"
            aria-label="Notifications"
          >
            <FiBell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sev-critical text-[9px] font-bold text-white">
              3
            </span>
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
