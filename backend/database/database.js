const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbFile = process.env.NODE_ENV === 'test' ? 'db-test.sqlite' : 'app.sqlite';

const dbPath = path.join(__dirname, dbFile);
const dbExists = fs.existsSync(dbPath);

const db = new Database(dbPath, { verbose: console.log });

if(!dbExists) {
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
            workspace_id TEXT NOT NULL,
            template_id INTEGER NOT NULL,
            form_data_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (form_data_id) REFERENCES forms(id)
        )
    `).run();
}

const insertNewDbEntry = (formData, workspace_id, template_id, created_at) => {
    const form_id = insertForm(formData);
    const document_id = insertDocument(workspace_id, template_id, form_id, created_at);

    return document_id;
}

const insertForm = (formData) => {
    const insert = db.prepare(`
        INSERT INTO forms (date, image, signature_name, student_name, subject)
        VALUES (?, ?, ?, ?, ?)
    `).run(formData.date, formData.image, formData.signature_name, formData.student_name, formData.subject);

    return insert.lastInsertRowid;
}

const insertDocument = (workspace_id, template_id, form_data_id, created_at) => {
    const insert = db.prepare(`
        INSERT INTO documents (workspace_id, template_id, form_data_id, created_at)
        VALUES (?, ?, ?, ?)
    `).run(workspace_id, template_id, form_data_id, created_at);
    
    return insert.lastInsertRowid;
}

module.exports = {db, insertDocument, insertForm, insertNewDbEntry};