const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require("../middleware/upload");


router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM inventory"
    )
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Kunde inte hämta alla produkter:", err });
  }
});




router.post('/', upload.single("image"), async (req, res) => {

  try {
    const { product_code, name, quantity, category } = req.body;
    const imageUrl = req.file.path;

    if (!product_code || !name || !quantity || !category) {
      return res.status(400).json({ error: "Missing required fields" }, error);
    }

    const result = await pool.query(
      `
      INSERT INTO inventory (product_code, name, quantity, category, image)
      VALUES($1, $2, $3, $4, $5) RETURNING *
      `, [product_code, name, quantity, category, imageUrl]
    )
    res.status(201).json({ message: "Produkt är sparad", product: result.rows[0], image: imageUrl });

  } catch (err) {
    console.error('Error adding to inventory', err);
    res.status(500).json({ error: "Kunde inte lägga till produkt i inventering." });
  }

})

module.exports = router;