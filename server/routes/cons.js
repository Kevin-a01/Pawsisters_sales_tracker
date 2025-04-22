const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = require('../db');

router.get("/", (req, res) => {
    res.json({ message: "Cons API is WORKING!!" });
});

router.post('/', async (req, res) => {
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
