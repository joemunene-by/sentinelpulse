import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertOctagon, FiX } from "react-icons/fi";

function Toast({ toast, onSelect, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.toastId), 6000);
    return () => clearTimeout(t);
  }, [toast.toastId, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="glass-card flex w-80 items-start gap-3 border-l-4 border-l-sev-critical p-4 shadow-xl"
    >
      <FiAlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-sev-critical" />
      <button
        type="button"
        onClick={() => { onSelect(toast); onDismiss(toast.toastId); }}
        className="min-w-0 flex-1 text-left"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-sev-critical">
          New critical threat
        </p>
        <p className="truncate text-sm font-semibold text-white">{toast.title}</p>
        <p className="truncate text-[11px] text-slate-500">
          {toast.type} · {toast.region}
        </p>
      </button>
      <button
        type="button"
        onClick={() => onDismiss(toast.toastId)}
        className="shrink-0 text-slate-500 transition-colors hover:text-white"
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
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.toastId} toast={t} onSelect={onSelect} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
