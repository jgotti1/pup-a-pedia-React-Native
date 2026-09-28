/**
 * Breed search client.
 *
 * In production the request goes to /api/breeds, a serverless function that
 * holds the API key server-side. Nothing secret is ever shipped to the browser.
 *
 * For local `npm run dev` (plain Vite, no serverless runtime) the request falls
 * back to calling the upstream API directly using VITE_ variables from .env.
 * Those only exist on a developer machine; they are deliberately NOT set in the
 * hosting environment, so a production build inlines nothing.
 */
const PROXY_ENDPOINT = "/api/breeds";
const DEV_API_URL = import.meta.env.VITE_API_URL;
const DEV_API_KEY = import.meta.env.VITE_API_KEY;
const useDirectUpstream = import.meta.env.DEV && Boolean(DEV_API_URL && DEV_API_KEY);

export class BreedSearchError extends Error {
  constructor(message, { kind = "network" } = {}) {
    super(message);
    this.name = "BreedSearchError";
    this.kind = kind;
  }
}

/**
 * Search breeds by name.
 * `signal` lets a newer search abort an in-flight older one.
 */
export async function searchBreeds(query, { signal } = {}) {
  const term = query.trim();

  const request = useDirectUpstream
    ? {
        url: `${DEV_API_URL}=${encodeURIComponent(term)}&offset=0`,
        init: { method: "GET", headers: { "X-Api-Key": DEV_API_KEY }, signal },
      }
    : {
        url: `${PROXY_ENDPOINT}?name=${encodeURIComponent(term)}`,
        init: { method: "GET", signal },
      };

  let response;
  try {
    response = await fetch(request.url, request.init);
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new BreedSearchError(
      "We couldn't reach the breed service. Check your connection and try again.",
      { kind: "network" }
    );
  }

  if (response.status === 401 || response.status === 403) {
    throw new BreedSearchError("The breed service rejected our credentials.", { kind: "auth" });
  }

  if (response.status === 429) {
    throw new BreedSearchError("Too many searches in a row. Give it a moment, then retry.", {
      kind: "rate-limit",
    });
  }

  if (response.status === 500 || response.status === 404) {
    // A missing/misconfigured proxy is a setup problem, not a transient one.
    throw new BreedSearchError(
      useDirectUpstream
        ? "The breed service is not configured. Check VITE_API_URL and VITE_API_KEY in .env."
        : "The breed service is not configured on the server. Set DOG_API_URL and DOG_API_KEY.",
      { kind: "config" }
    );
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
