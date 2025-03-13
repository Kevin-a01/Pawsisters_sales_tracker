const express = require('express');
const router = express.Router();

// Define your sales routes
router.get('/', (req, res) => {
  res.send('Sales list');
});

// You can add more routes for sales here

module.exports = router; // Make sure to export the router