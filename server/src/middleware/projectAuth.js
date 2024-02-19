const pool = require('../config/database');

exports.isProjectMember = async (req, res, next) => {
  const projectId = req.params.projectId || req.body.project_id;
  const userId = req.userData.userId;

  try {
    const result = await pool.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    req.userProjectRole = result.rows[0].role;
    next();
  } catch (error) {
    console.error('Project auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.isProjectAdmin = async (req, res, next) => {
  const projectId = req.params.projectId || req.body.project_id;
  const userId = req.userData.userId;

  try {
    const result = await pool.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2 AND role = $3',
      [projectId, userId, 'admin']
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Admin privileges required' });
    }

    next();
  } catch (error) {
    console.error('Project admin auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 