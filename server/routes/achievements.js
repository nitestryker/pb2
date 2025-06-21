import express from 'express';
import pool from '../database/connection.js';

const router = express.Router();

// Get unlocked achievements for a user
router.get('/users/:id/achievements', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { rows } = await pool.query(
      `SELECT a.* FROM achievements a
       JOIN user_achievements ua ON ua.achievement_id = a.id
       WHERE ua.user_id = $1`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch user achievements error:', err);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Get full list of achievements with status for a user
router.get('/achievements', async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId, 10) : null;
    const achRes = await pool.query('SELECT * FROM achievements');
    let unlockedIds = [];
    if (userId) {
      const { rows } = await pool.query(
        'SELECT achievement_id FROM user_achievements WHERE user_id = $1',
        [userId]
      );
      unlockedIds = rows.map((r) => r.achievement_id);
    }
    const list = achRes.rows.map((ach) => ({
      ...ach,
      unlocked: unlockedIds.includes(ach.id),
    }));
    res.json(list);
  } catch (err) {
    console.error('Fetch achievements error:', err);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

export default router;
