const db = require('../config/database');

class Feedback {
  static create(feedbackData, callback) {
    const { studentName, courseCode, comments, rating } = feedbackData;
    const sql = `INSERT INTO Feedback (studentName, courseCode, comments, rating) 
                 VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [studentName, courseCode, comments, rating], function(err) {
      callback(err, this.lastID);
    });
  }

  static getAll(callback) {
    const sql = `SELECT * FROM Feedback ORDER BY createdAt DESC`;
    db.all(sql, [], callback);
  }

  static delete(id, callback) {
    const sql = `DELETE FROM Feedback WHERE id = ?`;
    db.run(sql, [id], callback);
  }

  static getStats(callback) {
    const sql = `
      SELECT 
        COUNT(*) as totalFeedback,
        AVG(CAST(rating AS REAL)) as averageRating,
        COUNT(DISTINCT courseCode) as totalCourses
      FROM Feedback
    `;
    db.get(sql, [], (err, row) => {
      if (err) {
        return callback(err);
      }
      
      // Ensure proper number formatting
      const stats = {
        totalFeedback: row ? parseInt(row.totalFeedback) : 0,
        averageRating: row ? parseFloat(row.averageRating) : 0,
        totalCourses: row ? parseInt(row.totalCourses) : 0
      };
      
      callback(null, stats);
    });
  }

  static getCourseStats(callback) {
    const sql = `
      SELECT 
        courseCode,
        COUNT(*) as feedbackCount,
        AVG(CAST(rating AS REAL)) as averageRating,
        MAX(rating) as maxRating,
        MIN(rating) as minRating,
        COUNT(DISTINCT studentName) as uniqueStudents
      FROM Feedback 
      GROUP BY courseCode 
      ORDER BY averageRating DESC, feedbackCount DESC
    `;
    
    console.log('Executing course stats SQL:', sql);
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('SQL Error in getCourseStats:', err);
        return callback(err);
      }
      
      console.log('Raw course stats from DB:', rows);
      
      // Format the numbers properly
      const formattedRows = rows ? rows.map(row => ({
        courseCode: row.courseCode,
        feedbackCount: parseInt(row.feedbackCount) || 0,
        averageRating: parseFloat(row.averageRating) || 0,
        maxRating: parseInt(row.maxRating) || 0,
        minRating: parseInt(row.minRating) || 0,
        uniqueStudents: parseInt(row.uniqueStudents) || 0
      })) : [];
      
      console.log('Formatted course stats:', formattedRows);
      callback(null, formattedRows);
    });
  }
}

module.exports = Feedback;