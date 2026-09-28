import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "pup-a-pedia:compare";

/** Four columns is the most that stays readable on a laptop without scrolling. */
export const COMPARE_LIMIT = 4;

/** Breed names are unique in this dataset, so they serve as the identity. */
export const breedId = (breed) => breed?.name ?? "";

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.slice(0, COMPARE_LIMIT) : [];
  } catch {
    return [];
  }
};

/**
 * The compare tray. Holds whole breed records rather than references into the
 * current results, because the point is to compare breeds found in different
 * searches. Persisted so a reload does not discard a half-built comparison.
 */
export function useCompare() {
  const [items, setItems] = useState(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* private browsing - the tray still works for this session */
    }
  }, [items]);

  const ids = useMemo(() => new Set(items.map(breedId)), [items]);

  const isSelected = useCallback((breed) => ids.has(breedId(breed)), [ids]);

  const toggle = useCallback((breed) => {
    setItems((current) => {
      const id = breedId(breed);
      if (current.some((item) => breedId(item) === id)) {
        return current.filter((item) => breedId(item) !== id);
      }
      if (current.length >= COMPARE_LIMIT) return current;
      return [...current, breed];
    });
  }, []);

  const remove = useCallback((breed) => {
    const id = breedId(breed);
    setItems((current) => current.filter((item) => breedId(item) !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return {
    items,
    isSelected,
    toggle,
    remove,
    clear,
    isFull: items.length >= COMPARE_LIMIT,
    canCompare: items.length >= 2,
  };
}
