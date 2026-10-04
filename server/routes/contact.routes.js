const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/contact
router.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM contact_info WHERE id = 1");
  res.json(result.rows[0] || {});
});

// PUT /api/contact
router.put("/", requireAuth, async (req, res) => {
  try {
    const { phone, email, address, instagram, facebook, youtube, linkedin } = req.body;
    const result = await db.query(
      `INSERT INTO contact_info (id, phone, email, address, instagram, facebook, youtube, linkedin, updated_at)
       VALUES (1, $1,$2,$3,$4,$5,$6,$7, now())
       ON CONFLICT (id) DO UPDATE SET
         phone=$1, email=$2, address=$3, instagram=$4, facebook=$5, youtube=$6, linkedin=$7, updated_at=now()
       RETURNING *`,
      [phone, email, address, instagram, facebook, youtube, linkedin]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update contact error:", err);
    res.status(500).json({ error: "Failed to update contact info" });
  }
});

module.exports = router;
