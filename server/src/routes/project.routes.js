const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { isProjectMember, isProjectAdmin } = require('../middleware/projectAuth');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);

router.get('/:projectId', isProjectMember, projectController.getProject);
router.put('/:projectId', isProjectAdmin, projectController.updateProject);
router.delete('/:projectId', isProjectAdmin, projectController.deleteProject);

// Member management routes
router.post('/:projectId/members', isProjectAdmin, projectController.addProjectMember);
router.put('/:projectId/members/:userId', isProjectAdmin, projectController.updateProjectMember);
router.delete('/:projectId/members/:userId', isProjectAdmin, projectController.removeProjectMember);

module.exports = router; 