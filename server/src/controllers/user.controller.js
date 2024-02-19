const pool = require('../config/database');

exports.searchUsers = async (req, res) => {
  const { query } = req.query;
  const currentUserId = req.userData.userId;

  try {
    const result = await pool.query(
      `SELECT id, username, email 
       FROM users 
       WHERE (username ILIKE $1 OR email ILIKE $1)
       AND id != $2
       LIMIT 10`,
      [`%${query}%`, currentUserId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjectMembers = async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, pm.role
       FROM users u
       JOIN project_members pm ON u.id = pm.user_id
       WHERE pm.project_id = $1`,
      [projectId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get project members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 