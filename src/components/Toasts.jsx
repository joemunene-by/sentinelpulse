import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { LevelBars } from "./Severity";

function Toast({ toast, onSelect, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.toastId), 6000);
    return () => clearTimeout(t);
  }, [toast.toastId, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.15 }}
      className="flex w-full items-start gap-2 rounded-lg border border-line bg-raised py-2 pl-4 pr-2 shadow-pop sm:w-80"
      role="status"
    >
      <button
        type="button"
        onClick={() => { onSelect(toast); onDismiss(toast.toastId); }}
        className="min-w-0 flex-1 py-1 text-left"
      >
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.04em] text-crit">
          <LevelBars filled={4} />
          New critical threat
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-ink">{toast.title}</p>
        <p className="truncate text-xs text-ink-3">
          {toast.type} · {toast.region}
        </p>
      </button>
      <button
        type="button"
        onClick={() => onDismiss(toast.toastId)}
        className="btn btn-icon shrink-0 bg-transparent text-ink-3 hover:text-ink"
        aria-label="Dismiss"
      >
        <FiX className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// Bottom-right stack of transient alerts for incoming critical threats.
export default function Toasts({ toasts, onSelect, onDismiss }) {
  return (
    <div className="fixed inset-x-4 bottom-4 z-[70] flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.toastId} toast={t} onSelect={onSelect} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
