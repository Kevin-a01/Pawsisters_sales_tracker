const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', (req, res) => {
  res.send('Calender Route is working!');
});



module.exports = router;