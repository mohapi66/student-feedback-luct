const db = require('../config/database');

class Feedback {
  static create(feedbackData) {
    const { studentName, courseCode, comments, rating } = feedbackData;
    const stmt = db.prepare(`
      INSERT INTO Feedback (studentName, courseCode, comments, rating) 
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(studentName, courseCode, comments, rating);
    return result.lastInsertRowid;
  }

  static getAll() {
    const stmt = db.prepare('SELECT * FROM Feedback ORDER BY createdAt DESC');
    return stmt.all();
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM Feedback WHERE id = ?');
    return stmt.run(id);
  }

  static getStats() {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as totalFeedback,
        AVG(CAST(rating AS REAL)) as averageRating,
        COUNT(DISTINCT courseCode) as totalCourses
      FROM Feedback
    `);
    return stmt.get();
  }

  static getCourseStats() {
    const stmt = db.prepare(`
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
    `);
    return stmt.all();
  }
}

module.exports = Feedback;