const express = require("express");

const router = express.Router();

// Simple in-memory cache so we don't hit the upstream API on every request
let cache = {
  data: null,
  fetchedAt: 0,
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours — country lists rarely change

// GET /api/countries
// Returns a sorted array of country names, fetched server-side from
// countries.dev (a free, keyless replacement for the old restcountries.com
// v3.1/all endpoint, which was retired — the new restcountries v5 API
// requires a paid account and a Bearer API key).
// Server-to-server requests are never subject to browser CORS, so this
// also sidesteps any "blocked by CORS" error you'd get calling a
// third-party API directly from the frontend.
router.get("/", async (req, res) => {
  try {
    const isFresh = cache.data && Date.now() - cache.fetchedAt < CACHE_TTL_MS;

    if (isFresh) {
      return res.json(cache.data);
    }

    const response = await fetch(
      "https://countries.dev/countries?fields=name,alpha2Code&sort=name"
    );

    if (!response.ok) {
      throw new Error(`countries.dev responded with ${response.status}`);
    }

    const data = await response.json();

    const countries = Array.isArray(data)
      ? data
          .map((c) => ({ name: c?.name, iso2: c?.alpha2Code }))
          .filter((c) => c.name && c.iso2)
      : [];

    if (countries.length === 0) {
      throw new Error("countries.dev returned no usable data");
    }

    cache = { data: countries, fetchedAt: Date.now() };

    res.json(countries);
  } catch (err) {
    console.error("Get countries error:", err);

    // Serve stale cache if we have it rather than failing outright
    if (cache.data) {
      return res.json(cache.data);
    }

    res.status(502).json({ error: "Failed to fetch countries" });
  }
});

module.exports = router;