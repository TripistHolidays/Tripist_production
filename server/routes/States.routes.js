const express = require("express");

const router = express.Router();

// In-memory cache, keyed by ISO2 country code
const cache = new Map(); // iso2 -> { data, fetchedAt }
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// GET /api/states/:iso2
// Returns a sorted array of state/province names for a country, fetched
// server-side from countrystatecity.in (free tier: 100 requests/day,
// requires an API key — sign up at https://app.countrystatecity.in).
//
// Set CSC_API_KEY in your environment. If it's not set, or the upstream
// call fails, this returns a 204 with no body so the frontend can fall
// back to its own static list / free-text input instead of erroring out.
router.get("/:iso2", async (req, res) => {
  const iso2 = (req.params.iso2 || "").toUpperCase();

  if (!iso2 || iso2.length !== 2) {
    return res.status(400).json({ error: "Invalid country code" });
  }

  if (!process.env.CSC_API_KEY) {
    // No key configured — let the frontend fall back gracefully.
    return res.status(204).end();
  }

  try {
    const cached = cache.get(iso2);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    const response = await fetch(
      `https://api.countrystatecity.in/v1/countries/${iso2}/states`,
      { headers: { "X-CSCAPI-KEY": process.env.CSC_API_KEY } }
    );

    if (!response.ok) {
      throw new Error(`Country State City API responded with ${response.status}`);
    }

    const data = await response.json();

    const names = Array.isArray(data)
      ? data.map((s) => s?.name).filter(Boolean).sort((a, b) => a.localeCompare(b))
      : [];

    cache.set(iso2, { data: names, fetchedAt: Date.now() });

    res.json(names);
  } catch (err) {
    console.error(`Get states error for ${iso2}:`, err);

    const cached = cache.get(iso2);
    if (cached) {
      return res.json(cached.data);
    }

    // Fail soft — let the frontend fall back rather than showing an error.
    res.status(204).end();
  }
});

module.exports = router;