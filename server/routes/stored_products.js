const express = require('express');
const router = express.Router(); // Add this line to initialize the router
const pool = require('../db');  // Import the pool from your database connection file (if needed)

// Your existing route definition
router.post('/store', async (req, res) => {
  try {
    const { conId, products } = req.body;

    // Check if conId or products are missing or empty
    if (!conId || !products || products.length === 0) {
      console.error('❌ Missing conId or products in request body');
      return res.status(400).json({ error: "Missing conId or products" });
    }

    // Fetch convention title and date based on conId
    const conResult = await pool.query("SELECT title, date FROM cons WHERE id = $1", [conId]);
    if (!conResult.rows.length) {
      console.error(`❌ Con not found for conId: ${conId}`);
      return res.status(404).json({ error: "Con not found" });
    }

    const { title: conTitle, date: conDate } = conResult.rows[0];
    console.log(`Found convention: ${conTitle}, Date: ${conDate}`);

    // Insert query for storing products
    const insertStmt = `
      INSERT INTO stored_products ("productId", "conId", title, date, product, price, payment)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    // Iterate over the products array and store each product
    for (let product of products) {
      const { productId, price, payment } = product;

      // Fetch product name by productId
      const productResult = await pool.query("SELECT product FROM products WHERE id = $1", [productId]);

      if (!productResult.rows.length) {
        console.error(`❌ Product not found for ID: ${productId}`);
        return res.status(404).json({ error: `Product not found for ID: ${productId}` });
      }

      const productName = productResult.rows[0].product;

      // Validate required fields in the product object
      if (!productId || !productName || !price || !payment) {
        console.error("❌ Missing required fields in product:", product);
        return res.status(400).json({ error: "Missing required fields in product" });
      }

      // Insert the product into the stored_products table
      await pool.query(insertStmt, [productId, conId, conTitle, conDate, productName, price, payment]);
      console.log(`✅ Product ID ${productId} stored successfully`);
    }

    // After storing, clean up by deleting the associated products and cons
    await pool.query("DELETE FROM products WHERE conId = $1", [conId]);
    await pool.query("DELETE FROM cons WHERE id = $1", [conId]);

    // Success response
    res.status(201).json({ message: "Produkter har lagrats" });

  } catch (error) {
    // Log the error and return an appropriate response
    console.error("Error storing products:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stored_products ORDER BY date DESC");
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stored products:', error);
    res.status(500).json({ error: "Internal Server Error" })


  }

})

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM stored_products WHERE "conId" = $1 ORDER BY date desc',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No stored products found for this con!" })
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stored products by conId:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }

});

router.delete('/:conId', async (req, res) => {
  const { conId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM stored_products WHERE "conId" = $1',
      [conId]
    );

    res.status(200).json({ message: 'Bortaggning lyckades' });


  } catch (err) {
    console.error('Error deleting stored products:', err);
    res.status(500).json({ error: 'Internal Server Error' });

  }


})

// Export the router so it can be used in your main server file
module.exports = router;
