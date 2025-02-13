const fs = require('fs');
const path = require('path');
const db = require('../database/database');

process.env.NODE_ENV = 'test';

const dbPath = path.join(__dirname, '../database/db-test.sqlite');

describe('SQLite Database Tests', () => {
    test('[DB-TEST]: Database file should be created', () => {
        expect(fs.existsSync(dbPath)).toBe(true);
    });
    test('[DB-TEST]: Table (forms) should exist in test DB', () => {
        const formsTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='forms'").get();
        expect(formsTable).toBeDefined();
    });
    test('[DB-TEST]: Table (documents) should exist in test DB', () => {
        const documentsTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='documents'").get();
        expect(documentsTable).toBeDefined();
    });
    test('[DB-TEST]: Insert and retrieve data from (forms) table', () => {
        const insert = db.prepare('INSERT INTO forms (date, image, signature_name, student_name, subject) VALUES (?, ?, ?, ?, ?)').run('2025-02-07', 'image.png', 'John Doe', 'Mario Rossi', 'Lorem Ipsum');
        expect(insert.changes).toBe(1);
        const row = db.prepare('SELECT * FROM forms WHERE subject = ?').get('Lorem Ipsum');
        expect(row).toBeDefined();
        expect(row.subject).toBe('Lorem Ipsum');
        expect(row.date).toBe('2025-02-07');
        expect(row.image).toBe('image.png');
    });
    test('[DB-TEST]: Insert and retrieve data from (documents) table', () => {
        const formDataInsert = db.prepare('INSERT INTO forms (date, image, signature_name, student_name, subject) VALUES (?, ?, ?, ?, ?)').run('2025-02-07', 'image.png', 'John Doe', 'Mario Rossi', 'Lorem Ipsum');
        const documentInsert = db.prepare('INSERT INTO documents (workspace_id, template_id, form_data_id, created_at) VALUES (?, ?, ?, ?)').run(1, 1, formDataInsert.lastInsertRowid, '2025-02-07');
        expect(documentInsert.changes).toBe(1);
        const row = db.prepare('SELECT * FROM documents WHERE workspace_id = ?').get(1);
        expect(row).toBeDefined();
        expect(row.workspace_id).toBe(1);
        expect(row.template_id).toBe(1);
        expect(row.form_data_id).toBe(formDataInsert.lastInsertRowid);
        expect(row.created_at).toBe('2025-02-07');
    });
    test('[DB-TEST]: Foreign key constraint should fail for invalid form_data_id in documents', () => {
        try {
            db.prepare('INSERT INTO documents (workspace_id, template_id, form_data_id, created_at) VALUES (?, ?, ?, ?)').run(1, 1, 9999, '2025-02-07');
        } catch (err) {
            expect(err.message).toMatch(/FOREIGN KEY constraint failed/);
        }
    });

    afterAll(() => {
        db.close();
        fs.unlinkSync(dbPath);
    });
});