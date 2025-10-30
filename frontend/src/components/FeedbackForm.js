import React, { useState } from 'react';
import { feedbackAPI } from '../services/api';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    courseCode: '',
    comments: '',
    rating: 5
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState({
    studentName: false,
    courseCode: false,
    comments: false,
    rating: false
  });

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'studentName':
        if (!value.trim()) {
          newErrors.studentName = 'Student name is required';
        } else if (/\d/.test(value)) {
          newErrors.studentName = 'Student name cannot contain numbers';
        } else if (value.length > 100) {
          newErrors.studentName = 'Student name too long (max 100 characters)';
        } else {
          delete newErrors.studentName;
        }
        break;

      case 'courseCode':
        if (!value.trim()) {
          newErrors.courseCode = 'Course code is required';
        } else if (value.length > 20) {
          newErrors.courseCode = 'Course code too long (max 20 characters)';
        } else {
          delete newErrors.courseCode;
        }
        break;

      case 'comments':
        if (!value.trim()) {
          newErrors.comments = 'Comments are required';
        } else if (value.length > 500) {
          newErrors.comments = 'Comments too long (max 500 characters)';
        } else {
          delete newErrors.comments;
        }
        break;

      case 'rating':
        if (!value || value < 1 || value > 5) {
          newErrors.rating = 'Please select a valid rating';
        } else {
          delete newErrors.rating;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field]);
    });

    // Mark all fields as touched to show errors
    setTouched({
      studentName: true,
      courseCode: true,
      comments: true,
      rating: true
    });

    return Object.keys(errors).length === 0;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent numbers in student name field
    if (name === 'studentName' && /\d/.test(value)) {
      return;
    }

    const newValue = name === 'rating' ? parseInt(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Real-time validation for touched fields
    if (touched[name]) {
      validateField(name, newValue);
    }

    // Clear message when user makes changes
    if (message) {
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Mark all fields as touched
    setTouched({
      studentName: true,
      courseCode: true,
      comments: true,
      rating: true
    });

    if (!validateForm()) {
      setMessage('Please fix the errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      await feedbackAPI.submitFeedback(formData);
      setMessage('Feedback submitted successfully!');
      setFormData({
        studentName: '',
        courseCode: '',
        comments: '',
        rating: 5
      });
      // Reset touched state
      setTouched({
        studentName: false,
        courseCode: false,
        comments: false,
        rating: false
      });
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to submit feedback';
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.studentName.trim() && 
           formData.courseCode.trim() && 
           formData.comments.trim() && 
           formData.rating && 
           Object.keys(errors).length === 0;
  };

  return (
    <div className="feedback-form">
      <h2>Submit Feedback</h2>
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="studentName">Student Name</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.studentName && errors.studentName ? 'error' : ''}
            placeholder="Enter your name"
            maxLength="100"
            required
          />
          {touched.studentName && errors.studentName && (
            <span className="error-text">{errors.studentName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="courseCode">Course Code</label>
          <input
            type="text"
            id="courseCode"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.courseCode && errors.courseCode ? 'error' : ''}
            placeholder="Enter course code"
            maxLength="20"
            required
          />
          {touched.courseCode && errors.courseCode && (
            <span className="error-text">{errors.courseCode}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="4"
            className={touched.comments && errors.comments ? 'error' : ''}
            placeholder="Share your feedback about the course"
            maxLength="500"
            required
          />
          {touched.comments && errors.comments && (
            <span className="error-text">{errors.comments}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.rating && errors.rating ? 'error' : ''}
            required
          >
            <option value="">Select a rating</option>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
          {touched.rating && errors.rating && (
            <span className="error-text">{errors.rating}</span>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || !isFormValid()}
          className={!isFormValid() ? 'disabled' : ''}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;