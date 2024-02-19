const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', activityController.getAllActivities);

module.exports = router; 