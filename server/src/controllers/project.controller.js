const pool = require('../config/database');

exports.getAllProjects = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, array_agg(pm.user_id) as member_ids
       FROM projects p
       LEFT JOIN project_members pm ON p.id = pm.project_id
       WHERE p.created_by = $1 OR pm.user_id = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [req.userData.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProject = async (req, res) => {
  const { name, description } = req.body;

  try {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const projectResult = await client.query(
        'INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
        [name, description, req.userData.userId]
      );

      const project = projectResult.rows[0];

      // Add creator as project member with 'admin' role
      await client.query(
        'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
        [project.id, req.userData.userId, 'admin']
      );

      await client.query('COMMIT');
      res.status(201).json(project);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    // Check if user has admin rights
    const memberCheck = await pool.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2 AND role = $3',
      [id, req.userData.userId, 'admin']
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized to update project' });
    }

    const result = await pool.query(
      'UPDATE projects SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
      [name, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user has admin rights
    const memberCheck = await pool.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2 AND role = $3',
      [id, req.userData.userId, 'admin']
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized to delete project' });
    }

    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addProjectMember = async (req, res) => {
  const { projectId } = req.params;
  const { userId, role } = req.body;

  try {
    // Check if user exists
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if member already exists
    const memberCheck = await pool.query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (memberCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Add member
    const result = await pool.query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) RETURNING *',
      [projectId, userId, role || 'member']
    );

    await createActivity(
      req.userData.userId,
      'added_member',
      'project',
      projectId,
      userCheck.rows[0].username
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add project member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProjectMember = async (req, res) => {
  const { projectId, userId } = req.params;
  const { role } = req.body;

  try {
    const result = await pool.query(
      'UPDATE project_members SET role = $1 WHERE project_id = $2 AND user_id = $3 RETURNING *',
      [role, projectId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update project member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeProjectMember = async (req, res) => {
  const { projectId, userId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING *',
      [projectId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove project member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 