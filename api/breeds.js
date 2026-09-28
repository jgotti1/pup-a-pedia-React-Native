/**
 * Server-side proxy for the breed lookup.
 *
 * The key lives only in this function's environment (DOG_API_KEY, no VITE_
 * prefix, so Vite never sees it and it is never inlined into the browser
 * bundle). The client calls /api/breeds?name=... and gets the JSON back
 * without the credential ever leaving the server.
 */
export default async function handler(req, res) {
  const name = String(req.query?.name ?? "").trim();

  if (!name) {
    return res.status(400).json({ error: "Missing 'name' query parameter." });
  }

  const apiUrl = process.env.DOG_API_URL;
  const apiKey = process.env.DOG_API_KEY;

  if (!apiUrl || !apiKey) {
    return res
      .status(500)
      .json({ error: "Breed service is not configured on the server." });
  }

  try {
    const upstream = await fetch(
      `${apiUrl}=${encodeURIComponent(name)}&offset=0`,
      { headers: { "X-Api-Key": apiKey } }
    );

    if (!upstream.ok) {
      // Never forward the upstream body; it can echo request details.
      return res
        .status(upstream.status === 429 ? 429 : 502)
        .json({ error: `Breed service returned ${upstream.status}.` });
    }

    const data = await upstream.json();
    // Results are stable; let the edge cache carry repeat lookups.
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).json(Array.isArray(data) ? data : []);
  } catch {
    return res.status(502).json({ error: "Could not reach the breed service." });
  }
}
