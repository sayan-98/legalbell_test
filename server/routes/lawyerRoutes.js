import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { pool } from "../db.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Register
router.post("/register", upload.single("photo"), async (req, res) => {
  const { name, email, phone, dob, expertise, address, password } = req.body;
  const photo = req.file ? req.file.filename : null;

  try {
    const existing = await pool.query("SELECT * FROM lawyers WHERE email=$1", [
      email,
    ]);
    if (existing.rows.length)
      return res.status(400).json({ message: "Lawyer exists" });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO lawyers (name,email,phone,dob,photo,expertise,address,password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [name, email, phone, dob, photo, expertise, address, hashed]
    );
    res.json({ message: "Registered successfully, please login." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM lawyers WHERE email=$1", [
      email,
    ]);
    if (!user.rows.length)
      return res.status(404).json({ message: "Lawyer not found" });

    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.rows[0].id, role: "lawyer" },
      "secretkey",
      { expiresIn: "1h" }
    );
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


import { verifyToken } from "../middleware/authMiddleware.js";

// Lawyer profile (fetch name & photo)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name, photo FROM lawyers WHERE id = $1",
      [req.user.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Lawyer not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
