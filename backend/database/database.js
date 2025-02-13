const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbFile = process.env.NODE_ENV === 'test' ? 'db-test.sqlite' : 'app.sqlite';

const dbPath = path.join(__dirname, dbFile);
const dbExists = fs.existsSync(dbPath);

const db = new Database(dbPath, { verbose: console.log });

if(!dbExists) {
    db.pragma('foreign_keys = ON');
    
    // Forms
    db.prepare(`
        CREATE TABLE IF NOT EXISTS forms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            image TEXT NOT NULL,
            signature_name TEXT NOT NULL,
            student_name TEXT NOT NULL,
            subject TEXT
        )
    `).run();

    // Documents
    db.prepare(`
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workspace_id INTEGER NOT NULL,
            template_id INTEGER NOT NULL,
            form_data_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (form_data_id) REFERENCES forms(id)
        )
    `).run();
}

module.exports = db;