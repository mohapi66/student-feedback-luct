import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../services/api';

const FeedbackList = ({ refresh }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await feedbackAPI.getAllFeedback();
      setFeedback(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch feedback';
      setError(errorMessage);
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackAPI.deleteFeedback(id);
        setFeedback(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to delete feedback';
        alert(`Error: ${errorMessage}`);
        console.error('Error deleting feedback:', err);
      }
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return <div className="loading">Loading feedback...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchFeedback} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-list">
      <h2>Course Feedback</h2>
      {feedback.length === 0 ? (
        <div className="no-feedback">
          <p>No feedback submitted yet.</p>
          <p>Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="feedback-items">
          {feedback.map((item) => (
            <div key={item.id} className="feedback-item">
              <div className="feedback-header">
                <h3>{item.courseCode}</h3>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="delete-btn"
                  aria-label="Delete feedback"
                  title="Delete feedback"
                >
                  ×
                </button>
              </div>
              <div className="feedback-meta">
                <span className="student-name">By: {item.studentName}</span>
                <span className="rating" title={`Rating: ${item.rating}/5`}>
                  {renderStars(item.rating)} ({item.rating}/5)
                </span>
                <span className="date">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="comments">{item.comments}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;