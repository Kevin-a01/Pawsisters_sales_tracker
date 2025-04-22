
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = require('../db');

router.post('/', async (req, res) => {
  try {
    const { product, price, payment, conId, maker } = req.body;

    if (!product || !price || !payment || !conId || !maker) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      'INSERT INTO products (product, price, payment, conId , maker) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [product, price, payment, conId, maker]
    );

    console.log("Product inserted, ID:", result.rows[0].id);
    res.status(201).json({ productId: result.rows[0].id });

  } catch (error) {

    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);

  } catch (error) {

    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
