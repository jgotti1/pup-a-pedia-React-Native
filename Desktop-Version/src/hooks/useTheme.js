import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pup-a-pedia:theme";

const readStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
};

const systemPreference = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";

/** Theme state persisted per visitor, seeded from the OS preference. */
export function useTheme() {
  const [theme, setTheme] = useState(() => readStored() ?? systemPreference());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private browsing - the in-memory theme still works */
    }
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    []
  );

  return { theme, toggleTheme };
}
