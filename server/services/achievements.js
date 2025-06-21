import pool from '../database/connection.js';

export async function awardAchievement(userId, code) {
  const { rows } = await pool.query('SELECT id FROM achievements WHERE code = $1', [code]);
  if (rows.length === 0) return;
  const achievementId = rows[0].id;

  const exists = await pool.query(
    'SELECT 1 FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
    [userId, achievementId]
  );
  if (exists.rows.length > 0) return;

  await pool.query(
    'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)',
    [userId, achievementId]
  );
}

export async function checkPasteCreated(userId) {
  const { rows } = await pool.query('SELECT COUNT(*) FROM pastes WHERE author_id = $1', [userId]);
  const count = parseInt(rows[0].count, 10);
  if (count === 1) await awardAchievement(userId, 'first_paste');
  if (count === 10) await awardAchievement(userId, 'paste_creator_10');
}

export async function checkPasteViewed(pasteId, authorId) {
  const { rows } = await pool.query('SELECT view_count FROM pastes WHERE id = $1', [pasteId]);
  if (rows.length === 0) return;
  const views = parseInt(rows[0].view_count, 10);
  if (views >= 100 && authorId) {
    await awardAchievement(authorId, 'popular_paste_100');
  }
}
