const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let db;

const initializeDatabase = async () => {
  try {
    const SQL = await initSqlJs();
    
    // Always use in-memory database for simplicity
    db = new SQL.Database();
    
    console.log('Using in-memory SQLite database with sql.js');
    
    // Create Feedback table
    db.run(`
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
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Initialize database immediately
initializeDatabase().catch(console.error);

module.exports = {
  getDB: () => db,
  initializeDatabase
};