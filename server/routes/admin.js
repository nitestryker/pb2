import express from 'express';
import pool from '../database/connection.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication and admin check to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM pastes) as total_pastes,
        (SELECT COUNT(*) FROM pastes WHERE is_private = FALSE) as public_pastes,
        (SELECT COUNT(*) FROM pastes WHERE is_private = TRUE) as private_pastes,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT SUM(view_count) FROM pastes) as total_views,
        (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '24 hours') as new_users_today,
        (SELECT COUNT(*) FROM pastes WHERE created_at > NOW() - INTERVAL '24 hours') as new_pastes_today
    `);
    
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const result = await pool.query(`
      SELECT 
        u.*,
        COUNT(DISTINCT p.id) as paste_count,
        COUNT(DISTINCT pr.id) as project_count
      FROM users u
      LEFT JOIN pastes p ON u.id = p.author_id
      LEFT JOIN projects pr ON u.id = pr.author_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    const users = result.rows.map(row => ({
      id: row.id.toString(),
      username: row.username,
      email: row.email,
      avatar: row.avatar_url,
      bio: row.bio,
      website: row.website,
      location: row.location,
      isAdmin: row.is_admin,
      joinDate: row.created_at.toISOString(),
      pasteCount: parseInt(row.paste_count),
      projectCount: parseInt(row.project_count)
    }));
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get language statistics
router.get('/languages', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        syntax_language,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
      FROM pastes
      WHERE is_private = FALSE 
        AND is_zero_knowledge = FALSE 
        AND (expiration IS NULL OR expiration > NOW())
      GROUP BY syntax_language
      ORDER BY count DESC
      LIMIT 10
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching language stats:', error);
    res.status(500).json({ error: 'Failed to fetch language statistics' });
  }
});

export default router;