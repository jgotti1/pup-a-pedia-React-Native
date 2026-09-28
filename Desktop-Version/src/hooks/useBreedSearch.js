import { useCallback, useEffect, useRef, useState } from "react";
import { searchBreeds } from "../lib/api";

/**
 * Owns the search lifecycle: status, results, the term the results belong to,
 * and cancellation of superseded requests.
 * status: "idle" | "loading" | "success" | "empty" | "error"
 */
export function useBreedSearch() {
  const [status, setStatus] = useState("idle");
  const [results, setResults] = useState([]);
  const [activeTerm, setActiveTerm] = useState("");
  const [error, setError] = useState(null);
  const requestRef = useRef(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  const run = useCallback(async (term) => {
    const query = term.trim();
    if (!query) return;

    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    setStatus("loading");
    setError(null);
    setActiveTerm(query);

    try {
      const data = await searchBreeds(query, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setResults(data);
      setStatus(data.length ? "success" : "empty");
    } catch (err) {
      if (err?.name === "AbortError") return;
      setResults([]);
      setError(err);
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    requestRef.current?.abort();
    setStatus("idle");
    setResults([]);
    setActiveTerm("");
    setError(null);
  }, []);

  return { status, results, activeTerm, error, search: run, reset };
}
