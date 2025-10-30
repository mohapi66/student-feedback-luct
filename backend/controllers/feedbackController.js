const Feedback = require('../models/Feedback');

exports.submitFeedback = (req, res) => {
  try {
    const { studentName, courseCode, comments, rating } = req.body;

    if (!studentName || !courseCode || !comments || !rating) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const id = Feedback.create({ studentName, courseCode, comments, rating });
    res.status(201).json({ message: 'Feedback submitted successfully', id });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllFeedback = (req, res) => {
  try {
    const feedback = Feedback.getAll();
    res.json(feedback);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteFeedback = (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Valid ID is required' });
    }
    Feedback.delete(id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDashboardStats = (req, res) => {
  try {
    const stats = Feedback.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCourseStats = (req, res) => {
  try {
    const courseStats = Feedback.getCourseStats();
    res.json(courseStats);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};