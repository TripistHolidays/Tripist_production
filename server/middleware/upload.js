const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDir = "/var/www/tripist-admin/uploads";

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = crypto.randomBytes(16).toString("hex") + ext;
    cb(null, uniqueName);
  },
});

// Added .jfif, .avif, and .svg to the allowed formats
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".jfif", ".avif"]);

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED.has(ext)) {
    return cb(new Error("Only image files (jpg, jpeg, png, webp, gif, jfif, avif) are allowed"));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  // Increased limit to 30MB (30 * 1024 * 1024)
  limits: { fileSize: 30 * 1024 * 1024 }, 
});

module.exports = upload;
