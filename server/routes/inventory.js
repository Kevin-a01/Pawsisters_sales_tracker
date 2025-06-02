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
    const { name, quantity, category, maker, price } = req.body;
    const file = req.file;

    if (!name || !quantity || !category || !file || !maker || !price) {
      return res.status(400).json({ error: " Missing required fields" });
    }

    const imageUrl = file.path

    const result = await pool.query(
      `
      INSERT INTO inventory ( name, quantity, category, image, maker, price)
      VALUES($1, $2, $3, $4 , $5, $6) RETURNING *
      `, [name, quantity, category, imageUrl, maker, price]
    )
    res.status(201).json({ message: "Produkt är sparad", product: result.rows[0], image: imageUrl });

  } catch (err) {
    console.error('Error adding to inventory', err);
    res.status(500).json({ err: "Kunde inte lägga till produkt i inventering." });
  }

});

router.put('/:id', async (req, res) => {

  const { id } = req.params;
  const { quantity, price } = req.body;


  if (quantity === undefined) {
    return res.status(400).json({ error: "Missing quantity parameters" });
  }

  try {
    const result = await pool.query(
      "UPDATE inventory SET quantity  = $1, price = $2 WHERE id = $3 RETURNING *",
      [quantity, price, id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: "Produkt hittades inte." })
    }
    res.status(200).json({ product: result.rows[0] });

  } catch (err) {
    console.error("Error updating quantity", err);
    res.status(500).json({ error: "Serverfel vid uppdaterande." })
  }

});


router.delete('/:id', async (req, res) => {

  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM inventory WHERE id = $1", [id]
    )


    res.status(200).json({ message: "Borttagning lyckades!" })
  } catch (err) {
    console.error("Misslyckades att ta bort inventerings produkt", err);
    res.status(500).json({ err: "Internal Server Error." });
  }
});

module.exports = router;