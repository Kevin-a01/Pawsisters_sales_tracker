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
            'INSERT INTO cons (title, date, is_completed) VALUES ($1, $2, $3) RETURNING id',
            [title, date, false]
        );

        res.status(201).json({ conId: result.rows[0].id });
    } catch (error) {
        console.error('Error creating convention:', error);
        res.status(500).json({ error: 'Failed to create convention' });
    }
});

router.get('/active', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, title FROM cons WHERE is_completed = FALSE ORDER BY id DESC')
        res.json(result.rows);

    } catch (err) {
        console.error("Error fetching active cons:", err);
        res.status(500).json({ err: "Internal Server Error." })


    }

})

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

router.delete('/:conId', async (req, res) => {
    const conId = parseInt(req.params.conId);
    if (isNaN(conId)) {
        return res.status(400).json({ error: "Invalid conId" });
    }

    try {
        const result = await pool.query('DELETE FROM cons WHERE id = $1', [conId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Convention not found' });
        }
        res.json({ message: `Convention ${conId} deleted` });
    } catch (error) {
        console.error('Error deleting convention:', error);
        res.status(500).json({ error: 'Failed to delete convention' });
    }
});

module.exports = router;
