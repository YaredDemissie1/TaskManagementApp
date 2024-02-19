const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');
const projectRoutes = require('./project.routes');
const activityRoutes = require('./activity.routes');
const userRoutes = require('./user.routes');

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/projects', projectRoutes);
router.use('/activities', activityRoutes);
router.use('/users', userRoutes);

module.exports = router; 