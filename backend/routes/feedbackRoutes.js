const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Feedback routes
router.post('/feedback', feedbackController.submitFeedback);
router.get('/feedback', feedbackController.getAllFeedback);
router.delete('/feedback/:id', feedbackController.deleteFeedback);

// Dashboard routes
router.get('/dashboard/stats', feedbackController.getDashboardStats);
router.get('/dashboard/course-stats', feedbackController.getCourseStats);

module.exports = router;