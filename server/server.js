require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const packageRoutes = require("./routes/packages.routes");
const contactRoutes = require("./routes/contact.routes");
const noticeRoutes = require("./routes/notice.routes");
const uploadRoutes = require("./routes/upload.routes");
const emailRoutes = require("./routes/email.routes");
const destinationRoutes = require("./routes/destinationRoutes");
const countriesRoutes = require("./routes/Countries,routes");
const statesroutes = require("./routes/States.routes");

const app = express();
app.set("trust proxy", 1); // required for correct client IPs behind proxy (rate limiting)

const UPLOAD_DIR = process.env.UPLOADS_DIR;

/* ------------------------- Security Headers (Helmet) ------------------------- */
// Hides X-Powered-By and sets safe HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow static assets to be served cross-origin
  })
);
app.disable("x-powered-by");

/* ------------------------------- CORS Config -------------------------------- */
const cleanOrigin = (url) => (url ? url.replace(/\/$/, "") : "");

const allowedOrigins = [
  cleanOrigin(process.env.CLIENT_ORIGIN),
  // IP access
  "http://187.127.171.250",
  "https://187.127.171.250",
  // Domain access (both HTTP and HTTPS)
  "http://tripistholidays.com",
  "https://tripistholidays.com",
  "http://www.tripistholidays.com",
  "https://www.tripistholidays.com",
  // Local development
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Clean trailing slash from incoming browser origin if present
      const formattedOrigin = origin ? cleanOrigin(origin) : origin;

      if (!formattedOrigin || allowedOrigins.includes(formattedOrigin)) {
        callback(null, true);
      } else {
        console.error(`Blocked CORS Origin: ${origin}`); // Logs blocked origins in PM2/server logs
        callback(new Error("CORS policy error: Origin not allowed"));
      }
    },
    credentials: true,
  })
);

/* ----------------------------- Rate Limiting -------------------------------- */
// Global limiter: broad protection against abusive traffic
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true, // return RateLimit-* headers
  legacyHeaders: false, // disable X-RateLimit-* headers
  message: { error: "Too many requests, please try again later." },
});

// Strict limiter for auth endpoints to block brute-force login attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // only 10 login attempts per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
  skipSuccessfulRequests: true, // only count failed attempts
});

app.use(globalLimiter);

/* ------------------------------- Static Files ------------------------------- */
app.use("/api/static-assets", express.static("/var/www/tripist-assets/images"));
app.use("/uploads", express.static(UPLOAD_DIR));

/* ----------------------------- Body Parsers --------------------------------- */
// 10mb JSON limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* --------------------------------- Health ----------------------------------- */
app.get("/health", (req, res) => res.json({ status: "ok" }));

/* --------------------------------- Routes ----------------------------------- */
// Auth routes protected by strict brute-force limiter
app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/countries", countriesRoutes);
app.use("/api/states", statesroutes);

/* --------------------------- Error Handler ---------------------------------- */
// Multer / generic error handler
app.use((err, req, res, next) => {
  if (err) {
    console.error(err);

    // Handle multer file-size errors specifically
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File too large. Max allowed size is 15MB." });
    }

    // Handle CORS errors
    if (err.message && err.message.includes("CORS")) {
      return res.status(403).json({ error: err.message });
    }

    return res.status(400).json({ error: err.message || "Something went wrong" });
  }
  next();
});

/* --------------------------------- Server ----------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Tripist Admin API running on http://localhost:${PORT}`);
});