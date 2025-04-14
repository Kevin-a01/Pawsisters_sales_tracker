/* const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const { error } = require('console');

const dbPath = path.resolve(__dirname, '../db/pawsisters-saletracker.db');
console.log("Using database:", dbPath);

const db = new Database(dbPath);



router.post('/', (req, res) => {
  try {
    const { product, price, payment, conId } = req.body;

    if (!product || !price || !payment || !conId) {

      return res.status(400).json({ error: "Missing required fields" });
    }
    const stmt = db.prepare(`
      INSERT INTO products (product, price, payment, conId)
      VALUES (?, ?, ?, ?)
      
      `);
    const result = stmt.run(product, price, payment, conId)
    console.log("Product inserted, ID:", result.lastInsertRowid);

    res.status(201).json({ productId: result.lastInsertRowid });

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });

  }

});

router.get('/', (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM products")
    const products = stmt.all();

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" })



  }

});

router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    console.log("Deleting product wiht ID:", id, "Type:", typeof id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" })


    }


    const stmt = db.prepare("DELETE FROM products WHERE id = ?")
    const result = stmt.run(Number(id));

    if (result.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });


  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" })


  }


})




module.exports = router; */


const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = require('../db');  // Använd samma pool som vi skapat i db.js

router.post('/', async (req, res) => {
  try {
    const { product, price, payment, conId } = req.body;

    if (!product || !price || !payment || !conId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      'INSERT INTO products (product, price, payment, conId) VALUES ($1, $2, $3, $4) RETURNING id',
      [product, price, payment, conId]
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
