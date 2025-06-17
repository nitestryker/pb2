import express from 'express';
import pool from '../database/connection.js';

const router = express.Router();

// Get user profile by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const result = await pool.query(`
      SELECT 
        u.*,
        COUNT(DISTINCT p.id) as paste_count,
        COUNT(DISTINCT pr.id) as project_count
      FROM users u
      LEFT JOIN pastes p ON u.id = p.author_id AND p.is_private = FALSE
      LEFT JOIN projects pr ON u.id = pr.author_id AND pr.is_public = TRUE
      WHERE u.username = $1
      GROUP BY u.id
    `, [username]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    
    res.json({
      id: user.id.toString(),
      username: user.username,
      avatar: user.avatar_url,
      bio: user.bio,
      website: user.website,
      location: user.location,
      isAdmin: user.is_admin,
      joinDate: user.created_at.toISOString(),
      followers: 0, // TODO: Implement
      following: 0, // TODO: Implement
      pasteCount: parseInt(user.paste_count),
      projectCount: parseInt(user.project_count)
    });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user's public pastes
router.get('/:username/pastes', async (req, res) => {
  try {
    const { username } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.content,
        p.syntax_language,
        p.view_count,
        p.created_at,
        p.updated_at,
        COALESCE(
          JSON_AGG(
            CASE WHEN pt.tag IS NOT NULL 
            THEN pt.tag 
            ELSE NULL END
          ) FILTER (WHERE pt.tag IS NOT NULL), 
          '[]'
        ) as tags
      FROM pastes p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN paste_tags pt ON p.id = pt.paste_id
      WHERE u.username = $1
        AND p.is_private = FALSE 
        AND p.is_zero_knowledge = FALSE 
        AND (p.expiration IS NULL OR p.expiration > NOW())
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT $2
    `, [username, limit]);
    
    const pastes = result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      content: row.content,
      language: row.syntax_language,
      views: row.view_count,
      forks: 0,
      stars: 0,
      tags: row.tags || [],
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
      isPublic: true
    }));
    
    res.json(pastes);
  } catch (error) {
    console.error('Error fetching user pastes:', error);
    res.status(500).json({ error: 'Failed to fetch user pastes' });
  }
});

export default router;