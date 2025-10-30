const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Determine database path based on environment
let dbPath;

if (process.env.NODE_ENV === 'production') {
  // For Render, use a path that definitely works
  dbPath = ':memory:'; // Use in-memory database for Render free tier
  console.log('Using in-memory SQLite database for production');
} else {
  // For development, use file-based database
  dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'feedback.db');
  console.log('Using file-based SQLite database for development:', dbPath);
}

console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    // For production, we'll continue anyway and create tables
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

// Handle database errors gracefully
db.on('error', (err) => {
  console.error('Database error:', err);
});

module.exports = db;