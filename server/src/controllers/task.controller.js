const pool = require('../config/database');
const { createActivity } = require('./activity.controller');
const { emitToProject, emitToUser } = require('../socket');

exports.getAllTasks = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE created_by = $1 OR assigned_to = $1 ORDER BY created_at DESC',
      [req.userData.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, project_id, assigned_to, due_date, priority } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tasks 
       (title, description, project_id, assigned_to, created_by, due_date, priority) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, description, project_id, assigned_to, req.userData.userId, due_date, priority]
    );

    const task = result.rows[0];

    const activity = await createActivity(
      req.userData.userId,
      'created',
      'task',
      task.id,
      task.title,
      { project_id }
    );

    if (project_id) {
      emitToProject(project_id, 'taskCreated', task);
    }
    if (assigned_to) {
      emitToUser(assigned_to, 'taskCreated', task);
    }
    emitToProject(project_id, 'newActivity', activity);

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, assigned_to, due_date, priority } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           assigned_to = COALESCE($4, assigned_to),
           due_date = COALESCE($5, due_date),
           priority = COALESCE($6, priority)
       WHERE id = $7 AND (created_by = $8 OR assigned_to = $8)
       RETURNING *`,
      [title, description, status, assigned_to, due_date, priority, id, req.userData.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    await createActivity(
      req.userData.userId,
      'updated',
      'task',
      result.rows[0].id,
      result.rows[0].title,
      { project_id: result.rows[0].project_id }
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND created_by = $2 RETURNING *',
      [id, req.userData.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    await createActivity(
      req.userData.userId,
      'deleted',
      'task',
      result.rows[0].id,
      result.rows[0].title,
      { project_id: result.rows[0].project_id }
    );

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 