import express from 'express';
import fetch from 'node-fetch';
import { pool } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { fio, userId } = req.body;

  const url = `https://ru.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(fio)}&format=json`;

  const response = await fetch(url);
  const data = await response.json();

  await pool.query(
    'INSERT INTO searches (user_id, query, result) VALUES ($1,$2,$3)',
    [userId, fio, JSON.stringify(data)]
  );

  res.json(data);
});

export default router;
