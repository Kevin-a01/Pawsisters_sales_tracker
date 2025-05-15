const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', (req, res) => {
  res.send('Calender Route is working!');
});

router.get('/events', async (req, res) => {

  const { start, end } = req.query;

  if (!start || !end) return res.status(400).json({ err: "Missing Month parameter" });

  try {
    const result = await pool.query(`
      SELECT * FROM calendar_events WHERE date BETWEEN $1 AND $2 ORDER BY date
      `, [start, end]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching events", err);
    res.status(500).json({ err: "Internal server error." })
  }
});

router.get('/monthly-note', async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) return res.status(400).json({ err: "Missing year or month parameters" });
  try {
    const result = await pool.query(`
       SELECT * FROM monthly_notes WHERE year = $1 AND month = $2 LIMIT 1
      `, [year, month])
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching monthly note:", err);
    res.status(500).json({ err: "Internal server error" })


  }
});

router.get('/details', async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ err: "Date parameter missing" });
  }

  try {
    const result = await pool.query(`
        SELECT * FROM calendar_events WHERE date = $1
        
        `, [date])

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "No events for this date." });

    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching event details:", err);
    res.status(500).json({ err: "Internal server error" })


  }
});

router.post('/monthly-note', async (req, res) => {
  const { year, month, date, note } = req.body;

  if (!year || !month || !date || !note) {
    return res.status(400).json({ err: "Missing required fields: year, month, date, note" });
  }
  try {
    const existingNote = await pool.query(`
      SELECT * FROM monthly_notes WHERE year = $1 AND month = $2 AND date = $3
      `, [year, month, date]);

    if (existingNote.rows.length > 0) {
      await pool.query(`
          INSERT INTO monthly_notes (year, month, date, note) VALUES ($1, $2, $3, $4)
          `, [year, month, date, note]
      );

    } else {
      await pool.query(`
           INSERT INTO monthly_notes (year, month, date, note) VALUES ($1, $2, $3, $4)
          `, [year, month, date, note]
      );
      return res.status(201).json({ message: 'Note added successfully' }
      );

    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal server error." })

  }


});

router.post('/events', async (req, res) => {
  const { date, title, description } = req.body;

  if (!date || !title) {
    return res.status(400).json({ err: "Missing required fields: date and title" });
  }
  try {
    await pool.query(`
      INSERT INTO calendar_events (date, title, description) VALUES ($1, $2, $3)`,
      [date, title, description]
    );
    res.status(201).json({ message: "Event created!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error."
    });


  }


});



module.exports = router;