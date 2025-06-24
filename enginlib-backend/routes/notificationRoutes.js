const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

// GET all notifications for the current user
router.get('/', authMiddleware, notificationController.getUserNotifications);

module.exports = router;
