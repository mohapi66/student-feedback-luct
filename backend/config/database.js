const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// For production, use in-memory database to avoid file system issues
// For development, use file-based database
let dbPath;

if (process.env.NODE_ENV === 'production') {
  dbPath = ':memory:'; // In-memory for production (Render)
  console.log('Using in-memory SQLite database for production');
} else {
  dbPath = path.join(__dirname, '..', 'feedback.db'); // File-based for development
  console.log('Using file-based SQLite database for development:', dbPath);
}

console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    // Don't exit - continue without database for production
  } else {
    console.log('Connected to SQLite database');
    
    // Create Feedback table
    db.run(`CREATE TABLE IF NOT EXISTS Feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentName TEXT NOT NULL,
      courseCode TEXT NOT NULL,
      comments TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Feedback table ready');
      }
    });
  }
});

module.exports = db;