/* const express = require('express')
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const { title } = require('process');

const db = new Database(path.join(__dirname, '../db/pawsisters-saletracker.db'));
db.pragma('foreign_keys = ON');

router.get("/", (req, res) => {
    res.json({ message: "Cons API is WORKING!!" })
});


router.post('/', (req, res) => {
    try {
        const { title } = req.body;
        const date = new Date().toISOString().split('T')[0];

        const stmt = db.prepare(`
            INSERT INTO cons (title, date)
            VALUES(?, ?)
            
            `);
        const result = stmt.run(title, date);

        res.status(201).json({ conId: result.lastInsertRowid });

    } catch (error) {

        console.error('Error creating convention:', error);
        res.status(500).json({ error: 'Failed to create convention' });
    }
});

router.get('/latest', (req, res) => {
    try {
        const row = db.prepare("SELECT id, title FROM cons ORDER BY id DESC LIMIT 1").get();
        if (row) {
            res.json({ conId: row.id, title: row.title });

        } else {
            res.json({ conId: null, title: null });

        }

    } catch (error) {
        console.error("Error fetching latest convention", error);
        res.status(500).json({ error: "Failed to fetch latest conventions" })


    }




});

router.post('/new', (req, res) => {
    try {
        const { title } = req.body;
        const date = new Date().toISOString().split('T')[0];

        const stmt = db.prepare("INSERT INTO cons (title, date) VALUES (?, ?,)");

        const result = stmt.run(title, date);

        res.status(201).json({ conId: result.lastInsertRowid });
    } catch (error) {
        console.error('Error creating convention:', error);
        res.status(500).json({ error: 'Failed creating convention' })



    }

});


module.exports = router; */


const express = require('express');
const router = express.Router();
const { Pool } = require('pg');  // Använd pg istället för SQLite
const pool = require('../db');  // Importera poolen från db.js

router.get("/", (req, res) => {
    res.json({ message: "Cons API is WORKING!!" });
});

// Här är den nya route `/new` för att skapa en ny "convention"
router.post('/new', async (req, res) => {
    try {
        const { title } = req.body;
        const date = new Date().toISOString().split('T')[0];

        const result = await pool.query(
            'INSERT INTO cons (title, date) VALUES ($1, $2) RETURNING id',
            [title, date]
        );

        res.status(201).json({ conId: result.rows[0].id });
    } catch (error) {
        console.error('Error creating convention:', error);
        res.status(500).json({ error: 'Failed to create convention' });
    }
});

// Här är den andra route för att hämta den senaste convention
router.get('/latest', async (req, res) => {
    try {
        const result = await pool.query("SELECT id, title FROM cons ORDER BY id DESC LIMIT 1");
        if (result.rows.length > 0) {
            res.json({ conId: result.rows[0].id, title: result.rows[0].title });
        } else {
            res.json({ conId: null, title: null });
        }
    } catch (error) {
        console.error("Error fetching latest convention", error);
        res.status(500).json({ error: "Failed to fetch latest conventions" });
    }
});

module.exports = router;
