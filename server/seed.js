require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./db");

async function seed() {
  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const password = process.env.SEED_ADMIN_PASSWORD || "password123";

  const existing = await db.query(
    "SELECT id FROM admin_users WHERE username = $1",
    [username]
  );

  if (existing.rows.length > 0) {
    console.log(`Admin user "${username}" already exists. Skipping seed.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.query(
    "INSERT INTO admin_users (username, password_hash, role) VALUES ($1, $2, 'superadmin')",
    [username, passwordHash]
  );

  console.log(`Created admin user "${username}". Please log in and change the password.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
