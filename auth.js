import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { login, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    'INSERT INTO users (login, password) VALUES ($1, $2)',
    [login, hash]
  );

  res.json({ success: true });
});

router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  const user = await pool.query(
    'SELECT * FROM users WHERE login=$1',
    [login]
  );

  if (!user.rows.length) return res.sendStatus(401);

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) return res.sendStatus(401);

  const token = jwt.sign(
    { id: user.rows[0].id },
    process.env.JWT_SECRET
  );

  res.json({ token });
});

export default router;
