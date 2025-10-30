import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0,
    totalCourses: 0
  });
  const [courseStats, setCourseStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching dashboard data...');
      
      // Fetch both general stats and course stats
      const [statsResponse, courseStatsResponse] = await Promise.all([
        feedbackAPI.getDashboardStats(),
        feedbackAPI.getCourseStats()
      ]);
      
      console.log('Stats response:', statsResponse.data);
      console.log('Course stats response:', courseStatsResponse.data);
      
      // Set general stats
      const safeStats = {
        totalFeedback: Number(statsResponse.data.totalFeedback) || 0,
        averageRating: Number(statsResponse.data.averageRating) || 0,
        totalCourses: Number(statsResponse.data.totalCourses) || 0
      };
      setStats(safeStats);
      
      // Set course stats
      setCourseStats(courseStatsResponse.data || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', error.response?.data);
      
      // Check if it's a 404 error for course-stats
      if (error.response?.status === 404 && error.config?.url?.includes('course-stats')) {
        setError('Course statistics feature not available yet. Please try again later.');
      } else {
        setError('Failed to load dashboard statistics');
      }
      
      // Set default values on error
      setStats({
        totalFeedback: 0,
        averageRating: 0,
        totalCourses: 0
      });
      setCourseStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating);
    return '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#2ecc71'; // Green
    if (rating >= 3) return '#f39c12'; // Orange
    return '#e74c3c'; // Red
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Feedback Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Feedback</h3>
          <div className="stat-value">{stats.totalFeedback}</div>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <div className="stat-value">
            {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}/5
          </div>
        </div>
        <div className="stat-card">
          <h3>Courses Reviewed</h3>
          <div className="stat-value">{stats.totalCourses}</div>
        </div>
      </div>

      {/* Course Statistics Table */}
      <div className="course-stats-section">
        <h3>Course Performance</h3>
        {courseStats.length === 0 ? (
          <div className="no-data">
            <p>No course feedback data available yet.</p>
            <p>Submit feedback to see course statistics.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="course-stats-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Average Rating</th>
                  <th>Rating Distribution</th>
                  <th>Max Rating</th>
                  <th>Min Rating</th>
                  <th>Feedback Count</th>
                  <th>Unique Students</th>
                </tr>
              </thead>
              <tbody>
                {courseStats.map((course, index) => (
                  <tr key={index} className="course-row">
                    <td className="course-code">{course.courseCode}</td>
                    <td className="average-rating">
                      <div className="rating-display">
                        <span 
                          className="rating-value"
                          style={{ color: getRatingColor(course.averageRating) }}
                        >
                          {course.averageRating.toFixed(1)}
                        </span>
                        <span className="rating-stars">
                          {renderStars(course.averageRating)}
                        </span>
                      </div>
                    </td>
                    <td className="rating-range">
                      <div className="range-display">
                        <span className="min-rating">{course.minRating}</span>
                        <span className="range-separator">-</span>
                        <span className="max-rating">{course.maxRating}</span>
                      </div>
                    </td>
                    <td className="max-rating-cell">
                      <span className="rating-badge high">{course.maxRating}</span>
                    </td>
                    <td className="min-rating-cell">
                      <span className="rating-badge low">{course.minRating}</span>
                    </td>
                    <td className="feedback-count">
                      {course.feedbackCount}
                    </td>
                    <td className="unique-students">
                      {course.uniqueStudents}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Additional Insights */}
      {courseStats.length > 0 && (
        <div className="insights-section">
          <h3>Key Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>Highest Rated Course</h4>
              <p>
                {courseStats[0]?.courseCode} - {courseStats[0]?.averageRating.toFixed(1)}/5
              </p>
            </div>
            <div className="insight-card">
              <h4>Most Reviewed Course</h4>
              <p>
                {[...courseStats].sort((a, b) => b.feedbackCount - a.feedbackCount)[0]?.courseCode} - 
                {[...courseStats].sort((a, b) => b.feedbackCount - a.feedbackCount)[0]?.feedbackCount} reviews
              </p>
            </div>
            <div className="insight-card">
              <h4>Overall Satisfaction</h4>
              <p>
                {stats.averageRating >= 4 ? 'Excellent' : 
                 stats.averageRating >= 3 ? 'Good' : 
                 'Needs Improvement'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;