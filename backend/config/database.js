const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

// Use in-memory database for production
let dbPath = ':memory:';

console.log('Using in-memory SQLite database');

const db = new Database(dbPath);

// Create Feedback table
db.exec(`
  CREATE TABLE IF NOT EXISTS Feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentName TEXT NOT NULL,
    courseCode TEXT NOT NULL,
    comments TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Feedback table ready');

module.exports = db;