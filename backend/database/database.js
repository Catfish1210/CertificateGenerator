const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbFile = process.env.NODE_ENV === 'test' ? 'db-test.sqlite' : 'app.sqlite';

const dbPath = path.join(__dirname, dbFile);
const dbExists = fs.existsSync(dbPath);

const db = new Database(dbPath, { verbose: console.log });

if(!dbExists) {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            subject TEXT NOT NULL
        )
    `).run();
}

module.exports = db;