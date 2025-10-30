const { getDB } = require('../config/database');

class Feedback {
  static create(feedbackData) {
    const db = getDB();
    if (!db) throw new Error('Database not initialized');
    
    const { studentName, courseCode, comments, rating } = feedbackData;
    
    const stmt = db.prepare(`
      INSERT INTO Feedback (studentName, courseCode, comments, rating) 
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run([studentName, courseCode, comments, rating]);
    stmt.free();
    
    return db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
  }

  static getAll() {
    const db = getDB();
    if (!db) throw new Error('Database not initialized');
    
    const result = db.exec(`
      SELECT * FROM Feedback ORDER BY createdAt DESC
    `);
    
    if (result.length === 0) return [];
    
    const columns = result[0].columns;
    return result[0].values.map(row => {
      const obj = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });
  }

  static delete(id) {
    const db = getDB();
    if (!db) throw new Error('Database not initialized');
    
    const stmt = db.prepare('DELETE FROM Feedback WHERE id = ?');
    stmt.run([id]);
    stmt.free();
    
    return true;
  }

  static getStats() {
    const db = getDB();
    if (!db) throw new Error('Database not initialized');
    
    const result = db.exec(`
      SELECT 
        COUNT(*) as totalFeedback,
        AVG(CAST(rating AS REAL)) as averageRating,
        COUNT(DISTINCT courseCode) as totalCourses
      FROM Feedback
    `);
    
    if (result.length === 0) {
      return { totalFeedback: 0, averageRating: 0, totalCourses: 0 };
    }
    
    const row = result[0].values[0];
    return {
      totalFeedback: parseInt(row[0]) || 0,
      averageRating: parseFloat(row[1]) || 0,
      totalCourses: parseInt(row[2]) || 0
    };
  }

  static getCourseStats() {
    const db = getDB();
    if (!db) throw new Error('Database not initialized');
    
    const result = db.exec(`
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
    
    if (result.length === 0) return [];
    
    const columns = result[0].columns;
    return result[0].values.map(row => {
      const obj = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      
      // Ensure numbers are properly formatted
      return {
        courseCode: obj.courseCode,
        feedbackCount: parseInt(obj.feedbackCount) || 0,
        averageRating: parseFloat(obj.averageRating) || 0,
        maxRating: parseInt(obj.maxRating) || 0,
        minRating: parseInt(obj.minRating) || 0,
        uniqueStudents: parseInt(obj.uniqueStudents) || 0
      };
    });
  }
}

module.exports = Feedback;