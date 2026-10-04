const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/notice
router.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM notices WHERE id = 1");
  res.json(result.rows[0] || {});
});

// PUT /api/notice
router.put("/", requireAuth, async (req, res) => {
  try {
    const { message, startDate, startTime, duration, isActive } = req.body;
    const result = await db.query(
      `INSERT INTO notices (id, message, start_date, start_time, duration, is_active, updated_at)
       VALUES (1, $1,$2,$3,$4,$5, now())
       ON CONFLICT (id) DO UPDATE SET
         message=$1, start_date=$2, start_time=$3, duration=$4, is_active=$5, updated_at=now()
       RETURNING *`,
      [message, startDate || null, startTime || null, duration, isActive ?? true]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update notice error:", err);
    res.status(500).json({ error: "Failed to update notice" });
  }
});

module.exports = router;
