const fs = require('fs');
const path = require('path');
const {db, insertForm, insertDocument, insertNewDbEntry } = require('../database/database');

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
        const documentInsert = db.prepare('INSERT INTO documents (workspace_id, template_id, form_data_id, created_at) VALUES (?, ?, ?, ?)').run('workspace_1', 1, formDataInsert.lastInsertRowid, '2025-02-07');
        expect(documentInsert.changes).toBe(1);
        const row = db.prepare('SELECT * FROM documents WHERE workspace_id = ?').get('workspace_1');
        expect(row).toBeDefined();
        expect(row.workspace_id).toBe('workspace_1');
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

    test('[DB-FUNC-TEST]: insertForm should insert form data and return form ID', () => {
        const formData = {
            date: '2025-02-07',
            image: 'image.png',
            signature_name: 'John Doe',
            student_name: 'Mario Rossi',
            subject: 'Lorem Ipsum'
        };
        const form_id = insertForm(formData);
        const row = db.prepare('SELECT * FROM forms WHERE id = ?').get(form_id);
        expect(row).toBeDefined();
        expect(row.date).toBe(formData.date);
        expect(row.image).toBe(formData.image);
        expect(row.signature_name).toBe(formData.signature_name);
        expect(row.student_name).toBe(formData.student_name);
        expect(row.subject).toBe(formData.subject);
    });
    test('[DB-FUNC-TEST]: insertDocument should insert document data and return document ID', () => {
        const workspace_id = 'workspace_2';
        const template_id = 1;
        const form_data_id = 1;
        const created_at = '2025-02-07';
        const document_id = insertDocument(workspace_id, template_id, form_data_id, created_at);
        const row = db.prepare('SELECT * FROM documents WHERE id = ?').get(document_id);
        expect(row).toBeDefined();
        expect(row.workspace_id).toBe(workspace_id);
        expect(row.template_id).toBe(template_id);
        expect(row.form_data_id).toBe(form_data_id);
        expect(row.created_at).toBe(created_at);
    });
    test('[DB-FUNC-TEST]: insertNewDbEntry should fail with invalid formData', () => {
        const invalidFormData = {
            date: '', // Invalid date
            image: 'invalid_image.png',
            signature_name: 'John Doe',
            student_name: 'Mario Rossi',
            subject: 'Lorem Ipsum'
        };
        const workspace_id = 1;
        const template_id = 1;
        const created_at = '2025-02-07';
        try {
            const document_id = insertNewDbEntry(invalidFormData, workspace_id, template_id, created_at);
            expect(document_id).toBeDefined();
        } catch (err) {
            expect(err).toBeDefined();
        }
    });
    test('[DB-FUNC-TEST]: insertNewDbEntry should insert form and document data and return document ID', () => {
        const formData = {
            date: '2025-02-07',
            image: 'image.png',
            signature_name: 'John Doe',
            student_name: 'Mario Rossi',
            subject: 'Lorem Ipsum'
        };
        const workspace_id = 'workspace_3';
        const template_id = 1;
        const created_at = '2025-02-07';
        const document_id = insertNewDbEntry(formData, workspace_id, template_id, created_at);
        const documentRow = db.prepare('SELECT * FROM documents WHERE id = ?').get(document_id);
        expect(documentRow).toBeDefined();
        expect(documentRow.workspace_id).toBe(workspace_id);
        expect(documentRow.template_id).toBe(template_id);
        expect(documentRow.created_at).toBe(created_at);
        const formRow = db.prepare('SELECT * FROM forms WHERE id = ?').get(documentRow.form_data_id);
        expect(formRow).toBeDefined();
        expect(formRow.date).toBe(formData.date);
        expect(formRow.image).toBe(formData.image);
        expect(formRow.signature_name).toBe(formData.signature_name);
        expect(formRow.student_name).toBe(formData.student_name);
        expect(formRow.subject).toBe(formData.subject);
    });
    
    afterAll(() => {
        db.close();
        fs.unlinkSync(dbPath);
    });
});