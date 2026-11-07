import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { PALETTE } from "../lib/palette";

const KEY = "sp:theme";

function readStored() {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function systemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Follows the OS setting until the reader picks a theme, then remembers the pick.
export function useThemeState() {
  const [stored, setStored] = useState(readStored);
  const [system, setSystem] = useState(systemTheme);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return undefined;
    const onChange = () => setSystem(mq.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const theme = stored || system;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setStored(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable; the choice lasts for this visit */
    }
  }, [theme]);

  return { theme, toggle, palette: PALETTE[theme] };
}

export const ThemeContext = createContext({ theme: "light", toggle: () => {}, palette: PALETTE.light });

export function useTheme() {
  return useContext(ThemeContext);
}
