const fs = require('fs');
const path = require('path');
const db = require('../database/database');

process.env.NODE_ENV = 'test';

const dbPath = path.join(__dirname, '../database/db-test.sqlite');

describe('SQLite Database Tests', () => {
    test('[DB-TEST]: Database file should be created', () => {
        expect(fs.existsSync(dbPath)).toBe(true);
    });
    test('[DB-TEST]: Table (entries) should exist in test DB', () => {
        const entriesTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='entries'").get();
        expect(entriesTable).toBeDefined();
    });
    test('[DB-TEST]: Insert and retrieve data from (entries) table', () => {
        const insert = db.prepare('INSERT INTO entries (date, subject) VALUES (?, ?)').run('10-02-2025', 'Physics');
        expect(insert.changes).toBe(1);
        const row = db.prepare('SELECT * FROM entries WHERE subject = ?').get('Physics');
        expect(row).toBeDefined();
        expect(row.subject).toBe('Physics');
        expect(row.date).toBe('10-02-2025');
    });
    
    afterAll(() => {
        db.close();
        fs.unlinkSync(dbPath);
    });
});