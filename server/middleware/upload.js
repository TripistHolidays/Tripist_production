const multer = require("multer");

// Switch from diskStorage to memoryStorage so we can compress it
const storage = multer.memoryStorage();

// Your exact allowed formats
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".jfif", ".avif"]);

function fileFilter(req, file, cb) {
  const path = require("path");
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!ALLOWED.has(ext)) {
    return cb(new Error("Only image files (jpg, jpeg, png, webp, gif, jfif, avif) are allowed"));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // Keep your 30MB limit
});

module.exports = upload;