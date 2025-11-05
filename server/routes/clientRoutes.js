import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { pool } from '../db.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ✅ Client Registration
router.post('/register', upload.single('photo'), async (req, res) => {
  const { name, email, phone, dob, password } = req.body;
  const photo = req.file ? req.file.filename : null;

  try {
    const existing = await pool.query('SELECT * FROM clients WHERE email=$1', [email]);
    if (existing.rows.length)
      return res.status(400).json({ message: 'Client already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO clients (name, email, phone, dob, photo, password)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, photo`,
      [name, email, phone, dob, photo, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: 'client' }, 'secretkey', {
      expiresIn: '1h',
    });

    res.json({
      message: 'Registered successfully',
      token,
      name: user.name,
      photo: user.photo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Client Login
// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM clients WHERE email=$1", [email]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Client not found" });

    const client = result.rows[0];
    const valid = await bcrypt.compare(password, client.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: client.id }, "secretkey", { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Profile Route
router.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    const user = await pool.query("SELECT name, photo FROM clients WHERE id=$1", [decoded.id]);
    if (user.rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
