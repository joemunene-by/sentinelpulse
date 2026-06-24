import { useEffect, useRef, useState } from "react";

// useState backed by localStorage. `serialize`/`deserialize` let non-JSON
// values round-trip if needed; defaults handle plain JSON.
export default function usePersistentState(
  key,
  initial,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {},
) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? deserialize(raw) : initial;
    } catch {
      return initial;
    }
  });

  // Keep serializers stable across renders so the effect only runs on change.
  const serializeRef = useRef(serialize);
  serializeRef.current = serialize;

  useEffect(() => {
    try {
      localStorage.setItem(key, serializeRef.current(value));
    } catch {
      /* storage unavailable; ignore */
    }
  }, [key, value]);

  return [value, setValue];
}
