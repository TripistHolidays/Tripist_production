const express = require("express");
const fs = require("fs"); // Import fs
const upload = require("../middleware/upload");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// POST /api/upload - field name "image"
router.post("/", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Grant world-read permissions to the newly uploaded file so Nginx can read it
  try {
    fs.chmodSync(req.file.path, 0o644);
  } catch (err) {
    console.error("Failed to set permissions on uploaded file:", err);
  }

  const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  const url = `${base}/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

module.exports = router;
