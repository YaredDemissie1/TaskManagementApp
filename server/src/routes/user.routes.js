const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/search', userController.searchUsers);
router.get('/project/:projectId/members', userController.getProjectMembers);

module.exports = router; 