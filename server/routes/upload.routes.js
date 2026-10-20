const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp"); // Make sure you ran `npm install sharp`
const upload = require("../middleware/upload");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const uploadDir = "/var/www/tripist-admin/uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    // 1. Generate unique name just like your old middleware, but force .webp
    const uniqueName = crypto.randomBytes(16).toString("hex") + ".webp";
    const filePath = path.join(uploadDir, uniqueName);

    // 2. Compress the image
    await sharp(req.file.buffer)
      .resize({ width: 1920, withoutEnlargement: true }) // Shrink huge images to max 1920px wide
      .webp({ quality: 75 }) // Convert to WebP (massive size reduction)
      .toFile(filePath);

    // 3. Grant world-read permissions so Nginx can serve it
    try {
      fs.chmodSync(filePath, 0o644);
    } catch (err) {
      console.error("Failed to set permissions on uploaded file:", err);
    }

    // 4. Generate URL
    const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const url = `${base}/uploads/${uniqueName}`;
    
    // 5. Send URL back to React to be saved in DB
    res.status(201).json({ url });

  } catch (err) {
    console.error("Image processing error:", err);
    res.status(500).json({ error: "Failed to process image" });
  }
});

module.exports = router;