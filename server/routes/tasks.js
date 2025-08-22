const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:date', async (req, res) => {
    const { date } = req.params;
    try {
        const result = await pool.query(`
            SELECT * FROM tasks WHERE date = $1
            `, [date]
        );
        res.status(200).json({ task: result.rows });

    } catch (err) {
        console.error("Error fetching tasks", err);
        res.status(500).json({ error: "Internal server error" });


    }

});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    try {
        const result = await pool.query(
            `UPDATE tasks SET completed = $1 WHERE task_id = $2 RETURNING * `, [completed, id]
        );

        res.status(200).json({ task: result.rows[0] });

    } catch (err) {
        console.error("Error updating task", err);
        res.status(500).json({ error: "Internal server error." });


    }

})

router.delete('/date/:date', async (req, res) => {

    const { date } = req.params;
    try {
        const result = await pool.query(`
            DELETE FROM tasks WHERE date = $1
            `, [date]);

        res.status(200).json({ task: result.rows });

    } catch (err) {
        console.error("Error deleting tasks", err);
        res.status(500).json({ error: "Internal server error." });
    }
});


router.post('/', async (req, res) => {

    try {
        const { task, date } = req.body


        if (!task || !date) {
            return res.status(400).json({ Error: "Missing required fields" });
        }

        const result = await pool.query(`
            INSERT INTO tasks (task, date) VALUES($1, $2)RETURNING *
            
            `, [task, date]
        );
        res.status(200).json({ message: "Uppgift sparad", task: result.rows[0] });
    } catch (err) {
        console.error("Error saving task", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete('/:task_id', async (req, res) => {
    const { task_id } = req.params;
    try {

        const result = await pool.query(`
            DELETE FROM tasks WHERE task_id = $1
            
            `, [task_id]);
        res.status(200).json({ task: result.rows });


    } catch (err) {
        console.error("Error deleting task", err);
        res.status(500).json({ error: "Internal Server Error." });
    }

});

module.exports = router;