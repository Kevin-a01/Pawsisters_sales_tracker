
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = require('../db');

router.post('/', async (req, res) => {
  try {
    let { product, price, payment, conId, maker } = req.body;

    if (!product || !price || !payment || !maker) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      'INSERT INTO products (product, price, payment, conId , maker) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [product, price, payment, conId || null, maker]
    );

    const productName = typeof product === 'string' ? product : product.name
    console.log("Reducing quantity for:",productName);
    

    await pool.query(`
      UPDATE inventory
      SET quantity = quantity - 1
      WHERE TRIM(LOWER(name)) = TRIM(LOWER($1)) AND quantity > 0
      RETURNING *
      `, [productName]);

    console.log("Product inserted, ID:", result.rows[0].id);
    res.status(201).json({ productId: result.rows[0].id });

  } catch (error) {

    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { conId } = req.query;

    let result;

    if (conId) {
      const parsedConId = parseInt(conId);
      if (isNaN(parsedConId)) {
        console.log('Invalid conId', conId);
        return res.status(400).json({ error: "Invalid conId" })
      }
      console.log('Fetching products for conId:', parsedConId);
      result = await pool.query(`
      SELECT * FROM products WHERE conid = $1
      `, [parsedConId]);
    } else {
      /* console.log("No conId provided - fetching all products"); */
      result = await pool.query("SELECT * FROM products")
    }
    res.json(result.rows);



    /* const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
 */
  } catch (error) {

    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.delete('/cons/:conId', async (req, res) => {

  const conId = parseInt(req.params.conId);
  if (isNaN(conId)) {
    return res.status(400).json({ error: "Invalid conId" });
  }
  try {
    const result = await pool.query(`DELETE FROM products WHERE conId = $1`, [conId]);
    res.json({ message: `Deleted ${result.rowCount} products for conId ${conId}` });

  } catch (err) {
    console.error("Error deleting products by conId", err);

    res.status(500).json({ error: "Failed to delete products for this con." });
  }

})

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
