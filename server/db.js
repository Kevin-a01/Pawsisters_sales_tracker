/* const Database = require('better-sqlite3');

// Open database connection
const db = new Database('./db/pawsisters-saletracker.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS cons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT NOT NULL,
    price REAL NOT NULL,
    payment TEXT NOT NULL,
    conId INTEGER,
    FOREIGN KEY (conId) REFERENCES cons(id)
  );
`);

module.exports = db; // Export database connection */
