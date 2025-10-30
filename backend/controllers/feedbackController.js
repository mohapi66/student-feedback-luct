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

    Feedback.create({ studentName, courseCode, comments, rating }, (err, id) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to submit feedback' });
      }
      res.status(201).json({ message: 'Feedback submitted successfully', id });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllFeedback = (req, res) => {
  try {
    Feedback.getAll((err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch feedback' });
      }
      res.json(rows || []);
    });
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
    Feedback.delete(id, (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete feedback' });
      }
      res.json({ message: 'Feedback deleted successfully' });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDashboardStats = (req, res) => {
  try {
    Feedback.getStats((err, stats) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
      }
      
      const safeStats = {
        totalFeedback: parseInt(stats?.totalFeedback) || 0,
        averageRating: parseFloat(stats?.averageRating) || 0,
        totalCourses: parseInt(stats?.totalCourses) || 0
      };
      
      res.json(safeStats);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCourseStats = (req, res) => {
  try {
    Feedback.getCourseStats((err, courseStats) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch course statistics' });
      }
      
      res.json(courseStats || []);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};