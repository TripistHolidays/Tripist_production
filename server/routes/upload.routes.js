const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp"); 
const upload = require("../middleware/upload");
const { requireAuth } = require("../middleware/auth");


const router = express.Router();

const uploadDir = process.env.UPLOADS_DIR;

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Validate that the uploaded file is actually an image
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ error: "Only image files are allowed" });
  }

  try {
    // 1. Generate unique name and force .webp extension
    const uniqueName = crypto.randomBytes(16).toString("hex") + ".webp";
    const filePath = path.join(uploadDir, uniqueName);

    // 2. Compress the image using Sharp
    await sharp(req.file.buffer)
      .resize({ width: 1920, withoutEnlargement: true }) // Max width 1920px
      .webp({ quality: 75 })                             // Convert to WebP
      .toFile(filePath);

    // 3. Grant world-read permissions so Nginx can serve it
    try {
      fs.chmodSync(filePath, 0o644);
    } catch (chmodErr) {
      console.error("Failed to set permissions:", chmodErr);
    }

    // 4. Generate full URL
    const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const url = `${base}/uploads/${uniqueName}`;
    
    // 5. Send URL back to React
    res.status(201).json({ url });

  } catch (err) {
    console.error("Image processing error:", err);
    res.status(500).json({ error: "Failed to process image" });
  }
});

module.exports = router;