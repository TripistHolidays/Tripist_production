const express = require("express");
const router = express.Router();

const db = require("../db");
const pool = db.pool || db;

// ============================================================
// HELPER - PostgreSQL text arrays
// ============================================================

function toPgArray(val) {
  if (!val) return [];

  if (Array.isArray(val)) {
    return val
      .map((item) =>
        typeof item === "object" && item !== null
          ? item.name ||
            item.attraction_name ||
            JSON.stringify(item)
          : String(item).trim()
      )
      .filter(Boolean);
  }

  if (typeof val === "string") {
    return val
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [String(val)];
}

// ============================================================
// COUNTRY DATA CONFIGURATION
//
// Uses countries.dev - a free, keyless country-data API with no
// signup and no rate-limit tiers (https://countries.dev/docs).
// ============================================================

const COUNTRIES_DEV_BASE = "https://countries.dev";

// ============================================================
// GET ALL COUNTRIES
// GET /api/destinations/countries
// ============================================================

router.get("/countries", async (req, res) => {
  try {
    const url =
      `${COUNTRIES_DEV_BASE}/countries?fields=name`;

    console.log("Loading countries from countries.dev...");

    const response = await fetch(url);
    const result = await response.json();

    console.log(
      "countries.dev list status:",
      response.status
    );

    if (!response.ok || !Array.isArray(result)) {
      console.error(
        "countries.dev list error:",
        result
      );

      return res.status(200).json({
        success: false,
        countries: [],
        message: "Country list unavailable",
      });
    }

    const countries = result
      .map((country) => country?.name || null)
      .filter(Boolean)
      .sort((a, b) =>
        a.localeCompare(b)
      );

    return res.status(200).json({
      success: true,
      count: countries.length,
      countries,
    });

  } catch (error) {
    console.error(
      "Country list server error:",
      error.message
    );

    return res.status(200).json({
      success: false,
      countries: [],
      message: "Country list unavailable",
    });
  }
});

// ============================================================
// GET COUNTRY DETAILS
// GET /api/destinations/countries/:name
// ============================================================

router.get("/countries/:name", async (req, res) => {
  try {
    const countryName =
      decodeURIComponent(req.params.name);

    if (!countryName) {
      return res.status(200).json({
        success: false,
        country: null,
      });
    }

    console.log(
      "Fetching country details:",
      countryName
    );

    const url =
      `${COUNTRIES_DEV_BASE}/name/` +
      `${encodeURIComponent(countryName)}`;

    const response = await fetch(url);

    console.log(
      "countries.dev country status:",
      response.status
    );

    if (response.status === 404) {
      return res.status(200).json({
        success: false,
        country: null,
      });
    }

    const objects = await response.json();

    if (!response.ok || !Array.isArray(objects) || objects.length === 0) {
      console.error(
        "countries.dev country error:",
        objects
      );

      return res.status(200).json({
        success: false,
        country: null,
      });
    }

    const country =
      objects.find(
        (item) =>
          (item?.name || "").toLowerCase() ===
          countryName.toLowerCase()
      ) || objects[0];

    const name =
      country?.name || countryName;

    const capital =
      country?.capital || "";

    let currency = "";

    const firstCurrency =
      Array.isArray(country?.currencies)
        ? country.currencies[0]
        : null;

    if (firstCurrency) {
      const currencyCode =
        firstCurrency.code || "";

      const currencyName =
        firstCurrency.name || "";

      currency =
        currencyName && currencyCode
          ? `${currencyName} (${currencyCode})`
          : currencyName || currencyCode;
    }

    const languages =
      Array.isArray(country?.languages)
        ? country.languages
            .map((language) =>
              typeof language === "string"
                ? language
                : language?.name
            )
            .filter(Boolean)
        : [];

    const timeZone =
      Array.isArray(country?.timezones) &&
      country.timezones.length > 0
        ? country.timezones[0]
        : "UTC";

    const callingCode =
      Array.isArray(country?.callingCodes) &&
      country.callingCodes.length > 0
        ? `+${country.callingCodes[0]}`
        : "";

    const drivingSide = "";

    return res.status(200).json({
      success: true,

      country: {
        name: name,
        official_name: name,
        capital: capital,
        currency: currency,
        languages_spoken: languages,
        time_zone: timeZone,
        driving_side: drivingSide,
        calling_code: callingCode,
      },
    });

  } catch (error) {
    console.error(
      "Country details server error:",
      error.message
    );

    return res.status(200).json({
      success: false,
      country: null,
    });
  }
});

// ============================================================
// GET DESTINATIONS
// GET /api/destinations
// ============================================================

router.get("/", async (req, res) => {
  try {
    const { type, top } = req.query;

    let query =
      `SELECT * FROM destinations`;

    const params = [];
    const conditions = [];

    if (type) {
      conditions.push(
        `LOWER(destination_type) = $${params.length + 1}`
      );

      params.push(
        type.toLowerCase()
      );
    }

    if (
      top === "true" ||
      top === "1"
    ) {
      conditions.push(
        `is_top_destination = true`
      );
    }

    if (conditions.length > 0) {
      query +=
        ` WHERE ` +
        conditions.join(" AND ");
    }

    query +=
      ` ORDER BY created_at DESC`;

    const result =
      await pool.query(
        query,
        params
      );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      destinations: result.rows,
    });

  } catch (error) {
    console.error(
      "Get destinations error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// GET SINGLE DESTINATION BY ID
// GET /api/destinations/:id
// ============================================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result =
      await pool.query(
        `SELECT * FROM destinations WHERE id = $1`,
        [id]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        error: "Destination not found",
      });
    }

    return res.status(200).json({
      success: true,
      destination:
        result.rows[0],
    });

  } catch (error) {
    console.error(
      "Get destination by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// CREATE DESTINATION
// POST /api/destinations
// ============================================================

router.post("/", async (req, res) => {
  try {
    const body = req.body;

    const name =
      body.name ||
      body.destinationName;

    if (!name) {
      return res.status(400).json({
        success: false,
        error:
          "Destination name is required",
      });
    }

    const capital =
      body.capital ||
      body.location ||
      null;

    const currency =
      body.currency ||
      null;

    const climate =
      body.climate ||
      null;

    const bestSeason =
      body.best_season_to_visit ||
      body.bestSeason ||
      null;

    const languagesSpoken =
      toPgArray(
        body.languages_spoken ||
        body.languagesSpoken
      );

    const timeZone =
      body.time_zone ||
      body.timeZone ||
      null;

    const drivingSide =
      body.driving_side ||
      body.drivingSide ||
      null;

    const callingCode =
      body.calling_code ||
      body.callingCode ||
      null;

    const heroSliderImages =
      toPgArray(
        body.hero_slider_images ||
        body.heroSliderImages ||
        body.coverImage
      );

    const aboutText =
      body.about_text ||
      body.aboutText ||
      body.description ||
      null;

    const travelTips =
      toPgArray(
        body.travel_tips ||
        body.travelTips
      );

    const destinationType = (
      body.destination_type ||
      body.destinationType ||
      "domestic"
    ).toLowerCase();

    const isTopDestination =
      body.is_top_destination !== undefined
        ? Boolean(
            body.is_top_destination
          )
        : body.isTopDestination !== undefined
        ? Boolean(
            body.isTopDestination
          )
        : false;

    let attractionNames = [];
    let attractionImages = [];

    if (
      Array.isArray(
        body.attractions
      )
    ) {
      attractionNames =
        body.attractions
          .map(
            (a) =>
              a.attraction_name ||
              a.name
          )
          .filter(Boolean);

      attractionImages =
        body.attractions
          .map(
            (a) => a.image
          )
          .filter(Boolean);

    } else {
      attractionNames =
        toPgArray(
          body.attraction_names ||
          body.attractionNames
        );

      attractionImages =
        toPgArray(
          body.attraction_images ||
          body.attractionImages
        );
    }

    // ========================================================
    // INSERT (country column removed)
    // ========================================================

    const result =
      await pool.query(
        `
        INSERT INTO destinations (
          name,
          capital,
          currency,
          climate,
          best_season_to_visit,
          languages_spoken,
          time_zone,
          driving_side,
          calling_code,
          hero_slider_images,
          about_text,
          travel_tips,
          attraction_names,
          attraction_images,
          destination_type,
          is_top_destination
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          $15,
          $16
        )
        RETURNING *
        `,
        [
          name,
          capital,
          currency,
          climate,
          bestSeason,
          languagesSpoken,
          timeZone,
          drivingSide,
          callingCode,
          heroSliderImages,
          aboutText,
          travelTips,
          attractionNames,
          attractionImages,
          destinationType,
          isTopDestination,
        ]
      );

    return res.status(201).json({
      success: true,
      message:
        "Destination created successfully",
      destination:
        result.rows[0],
    });

  } catch (error) {
    console.error(
      "Create destination error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// UPDATE DESTINATION
// PUT /api/destinations/:id
// ============================================================

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const existing =
      await pool.query(
        `SELECT * FROM destinations WHERE id = $1`,
        [id]
      );

    if (
      existing.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        error:
          "Destination not found",
      });
    }

    const ex =
      existing.rows[0];

    const body =
      req.body;

    const name =
      body.name ||
      body.destinationName ||
      ex.name;

    const capital =
      body.capital !== undefined
        ? body.capital
        : body.location !== undefined
        ? body.location
        : ex.capital;

    const currency =
      body.currency !== undefined
        ? body.currency
        : ex.currency;

    const climate =
      body.climate !== undefined
        ? body.climate
        : ex.climate;

    const bestSeason =
      body.best_season_to_visit !== undefined
        ? body.best_season_to_visit
        : body.bestSeason !== undefined
        ? body.bestSeason
        : ex.best_season_to_visit;

    const languagesSpoken =
      body.languages_spoken !== undefined ||
      body.languagesSpoken !== undefined
        ? toPgArray(
            body.languages_spoken ||
            body.languagesSpoken
          )
        : ex.languages_spoken;

    const timeZone =
      body.time_zone !== undefined
        ? body.time_zone
        : body.timeZone !== undefined
        ? body.timeZone
        : ex.time_zone;

    const drivingSide =
      body.driving_side !== undefined
        ? body.driving_side
        : body.drivingSide !== undefined
        ? body.drivingSide
        : ex.driving_side;

    const callingCode =
      body.calling_code !== undefined
        ? body.calling_code
        : body.callingCode !== undefined
        ? body.callingCode
        : ex.calling_code;

    const heroSliderImages =
      body.hero_slider_images !== undefined ||
      body.heroSliderImages !== undefined
        ? toPgArray(
            body.hero_slider_images ||
            body.heroSliderImages
          )
        : ex.hero_slider_images;

    const aboutText =
      body.about_text !== undefined
        ? body.about_text
        : body.aboutText !== undefined
        ? body.aboutText
        : body.description !== undefined
        ? body.description
        : ex.about_text;

    const travelTips =
      body.travel_tips !== undefined ||
      body.travelTips !== undefined
        ? toPgArray(
            body.travel_tips ||
            body.travelTips
          )
        : ex.travel_tips;

    const destinationType = (
      body.destination_type !== undefined
        ? body.destination_type
        : body.destinationType !== undefined
        ? body.destinationType
        : ex.destination_type ||
          "domestic"
    ).toLowerCase();

    const isTopDestination =
      body.is_top_destination !== undefined
        ? Boolean(
            body.is_top_destination
          )
        : body.isTopDestination !== undefined
        ? Boolean(
            body.isTopDestination
          )
        : ex.is_top_destination;

    let attractionNames =
      ex.attraction_names;

    let attractionImages =
      ex.attraction_images;

    if (
      Array.isArray(
        body.attractions
      )
    ) {
      attractionNames =
        body.attractions
          .map(
            (a) =>
              a.attraction_name ||
              a.name
          )
          .filter(Boolean);

      attractionImages =
        body.attractions
          .map(
            (a) => a.image
          )
          .filter(Boolean);

    } else {
      if (
        body.attraction_names !==
          undefined ||
        body.attractionNames !==
          undefined
      ) {
        attractionNames =
          toPgArray(
            body.attraction_names ||
            body.attractionNames
          );
      }

      if (
        body.attraction_images !==
          undefined ||
        body.attractionImages !==
          undefined
      ) {
        attractionImages =
          toPgArray(
            body.attraction_images ||
            body.attractionImages
          );
      }
    }

    // ========================================================
    // UPDATE (country column removed)
    // ========================================================

    const result =
      await pool.query(
        `
        UPDATE destinations
        SET
          name = $1,
          capital = $2,
          currency = $3,
          climate = $4,
          best_season_to_visit = $5,
          languages_spoken = $6,
          time_zone = $7,
          driving_side = $8,
          calling_code = $9,
          hero_slider_images = $10,
          about_text = $11,
          travel_tips = $12,
          attraction_names = $13,
          attraction_images = $14,
          destination_type = $15,
          is_top_destination = $16,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $17
        RETURNING *
        `,
        [
          name,
          capital,
          currency,
          climate,
          bestSeason,
          languagesSpoken,
          timeZone,
          drivingSide,
          callingCode,
          heroSliderImages,
          aboutText,
          travelTips,
          attractionNames,
          attractionImages,
          destinationType,
          isTopDestination,
          id,
        ]
      );

    return res.status(200).json({
      success: true,
      message:
        "Destination updated successfully",
      destination:
        result.rows[0],
    });

  } catch (error) {
    console.error(
      "Update destination error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// DELETE DESTINATION
// DELETE /api/destinations/:id
// ============================================================

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result =
      await pool.query(
        `DELETE FROM destinations WHERE id = $1 RETURNING *`,
        [id]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        error:
          "Destination not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Destination deleted successfully",
      destination:
        result.rows[0],
    });

  } catch (error) {
    console.error(
      "Delete destination error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;