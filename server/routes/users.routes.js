const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { requireAuth, requireSuperAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/users - list all admin users (password hashes never returned)
router.get("/", requireAuth, async (req, res) => {
  const result = await db.query(
    "SELECT id, username, role, created_at FROM admin_users ORDER BY created_at ASC"
  );
  res.json(result.rows);
});

// POST /api/users - add a new admin user
router.post("/", requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const existing = await db.query("SELECT id FROM admin_users WHERE username = $1", [
      username,
    ]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO admin_users (username, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id, username, role, created_at`,
      [username, passwordHash, role === "superadmin" ? "superadmin" : "admin"]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Add user error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// DELETE /api/users/:id - remove an admin user
router.delete("/:id", requireAuth, requireSuperAdmin, async (req, res) => {
  const { id } = req.params;

  if (Number(id) === req.user.id) {
    return res.status(400).json({ error: "You cannot delete your own account" });
  }

  const countResult = await db.query("SELECT COUNT(*)::int AS count FROM admin_users");
  if (countResult.rows[0].count <= 1) {
    return res.status(400).json({ error: "At least one admin user must remain" });
  }

  await db.query("DELETE FROM admin_users WHERE id = $1", [id]);
  res.json({ message: "User deleted" });
});

module.exports = router;
