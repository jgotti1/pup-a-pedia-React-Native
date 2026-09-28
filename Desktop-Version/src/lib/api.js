const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export class BreedSearchError extends Error {
  constructor(message, { kind = "network" } = {}) {
    super(message);
    this.name = "BreedSearchError";
    this.kind = kind;
  }
}

/**
 * Search the dog breed endpoint by name.
 * `signal` lets a newer search abort an in-flight older one.
 */
export async function searchBreeds(query, { signal } = {}) {
  const term = query.trim();

  if (!API_URL || !API_KEY) {
    throw new BreedSearchError(
      "The breed service is not configured. Add VITE_API_URL and VITE_API_KEY to your .env file.",
      { kind: "config" }
    );
  }

  let response;
  try {
    response = await fetch(`${API_URL}=${encodeURIComponent(term)}&offset=0`, {
      method: "GET",
      headers: { "X-Api-Key": API_KEY },
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new BreedSearchError(
      "We couldn't reach the breed service. Check your connection and try again.",
      { kind: "network" }
    );
  }

  if (response.status === 401 || response.status === 403) {
    throw new BreedSearchError("The breed service rejected our API key.", { kind: "auth" });
  }

  if (response.status === 429) {
    throw new BreedSearchError("Too many searches in a row. Give it a moment, then retry.", {
      kind: "rate-limit",
    });
  }

  if (!response.ok) {
    throw new BreedSearchError(
      `The breed service returned an unexpected error (${response.status}).`,
      { kind: "server" }
    );
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
