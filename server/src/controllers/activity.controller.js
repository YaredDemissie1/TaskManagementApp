const pool = require('../config/database');

exports.getAllActivities = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.username as user_name
       FROM activities a
       JOIN users u ON a.user_id = u.id
       WHERE a.target_type IN (
         SELECT 'task' WHERE EXISTS (
           SELECT 1 FROM tasks t 
           WHERE t.id = a.target_id 
           AND (t.created_by = $1 OR t.assigned_to = $1)
         )
         UNION
         SELECT 'project' WHERE EXISTS (
           SELECT 1 FROM project_members pm 
           WHERE pm.project_id = a.target_id 
           AND pm.user_id = $1
         )
       )
       ORDER BY a.created_at DESC
       LIMIT 50`,
      [req.userData.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createActivity = async (userId, action, targetType, targetId, targetName, details = {}) => {
  try {
    const result = await pool.query(
      `INSERT INTO activities 
       (user_id, action, target_type, target_id, target_name, details)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, action, targetType, targetId, targetName, details]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Create activity error:', error);
    throw error;
  }
}; 