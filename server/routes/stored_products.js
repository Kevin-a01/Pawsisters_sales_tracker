/* const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const { error } = require('console');
const { title } = require('process');

const db = new Database(path.join(__dirname, '../db/pawsisters-saletracker.db'));
db.pragma('foreign_keys = ON');


router.post('/store', (req, res) => {

  try {
    console.log("Incoming request body for storing products:", req.body);

    const { conId, products } = req.body;

    if (!conId || !products || products.length === 0) {

      console.error("❌ Missing required fields:", req.body);
      return res.status(400).json({ error: "Missing conId or products" });

    }

    const conStmt = db.prepare("SELECT * FROM cons WHERE id = ?");
    const conDetails = conStmt.get(conId);

    const { title: conTitle, date: conDate } = conDetails;

    const stmt = db.prepare(`
        INSERT INTO stored_products (productId, conId, title, date, product, price, payment)
        VALUES(?, ?, ?, ?, ?, ?, ?)
        
        `);

    products.forEach((product) => {
      const { productId, price, payment } = product;

      const productStmt = db.prepare("SELECT product FROM products WHERE id = ?");
      const productDetails = productStmt.get(productId);


      if (!productDetails) {
        console.error(`❌ Product not found for ID: ${productId}`);
        return;
      }

      const productName = productDetails.product;


      if (!productId || !productName || !price || !payment) {
        console.error("❌ Missing required fields in product:", product);
        return;
      }

      stmt.run(productId, conId, conTitle, conDate, productName, price, payment);
      console.log(`✅ Product ID ${productId} stored successfully`)

    });





    db.prepare("DELETE FROM products WHERE conId = ?").run(conId);

    db.prepare("DELETE FROM cons WHERE id = ?").run(conId);

    res.status(201).json({ message: "Produkter har lagrats" });

  } catch (error) {
    console.error("Error storing products:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }

});

router.get("/:conId", (req, res) => {
  try {
    const { conId } = req.params;

    if (!conId) {
      return res.status(400).json({ error: "Missing conid" });
    }

    const stmt = db.prepare("SELECT DISTINCT title FROM stored_products WHERE conId = ? ")
    const conDetails = stmt.get(conId);

    if (!conDetails) {
      return res.status(404).json({ error: "Con not found for the given conId" })

    }

    const storedStmt = db.prepare("SELECT id, product, price, payment FROM stored_products WHERE conId = ?")

    const storedProducts = storedStmt.all(conId);

    res.json({
      title: conDetails.title,
      products: storedProducts

    })


  } catch (error) {

    console.error("Error fetching stored products:", error);
    res.status(500).json({ error: "Internal Server Error" });


  }
});

router.delete("/:conId", (req, res) => {
  try {
    const { conId } = req.params;
    const stmt = db.prepare("DELETE FROM stored_products WHERE conId = ?")
    const result = stmt.run(conId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Finns ingen data för detta konvent." })
    }
    res.json({ message: "All data har blivit raderad." });
  } catch (error) {
    console.error("Error deleting sales data:", error);
    res.status(500).json({ error: "Failed to delete sales data." })

  }


})

router.get("/", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM stored_products");
    const storedProducts = stmt.all();

    res.json(storedProducts);
  } catch (error) {
    console.error("Error fetching stored products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
 */


const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = require('../db');  // Använd samma pool som vi skapat i db.js

router.post('/store', async (req, res) => {
  try {
    const { conId, products } = req.body;

    if (!conId || !products || products.length === 0) {
      return res.status(400).json({ error: "Missing conId or products" });
    }

    // Hämtar konventionstiteln och -datum
    const conResult = await pool.query("SELECT title, date FROM cons WHERE id = $1", [conId]);
    const { title: conTitle, date: conDate } = conResult.rows[0];

    const insertStmt = `
            INSERT INTO stored_products (productId, conId, title, date, product, price, payment)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

    for (let product of products) {
      const { productId, price, payment } = product;

      // Hämtar produktens namn
      const productResult = await pool.query("SELECT product FROM products WHERE id = $1", [productId]);

      if (!productResult.rows.length) {
        console.error(`❌ Product not found for ID: ${productId}`);
        return;
      }

      const productName = productResult.rows[0].product;

      if (!productId || !productName || !price || !payment) {
        console.error("❌ Missing required fields in product:", product);
        return;
      }

      await pool.query(insertStmt, [productId, conId, conTitle, conDate, productName, price, payment]);
      console.log(`✅ Product ID ${productId} stored successfully`);
    }

    await pool.query("DELETE FROM products WHERE conId = $1", [conId]);
    await pool.query("DELETE FROM cons WHERE id = $1", [conId]);

    res.status(201).json({ message: "Produkter har lagrats" });
  } catch (error) {
    console.error("Error storing products:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

router.get("/:conId", async (req, res) => {
  try {
    const { conId } = req.params;

    const conResult = await pool.query("SELECT DISTINCT title FROM stored_products WHERE conId = $1", [conId]);

    if (!conResult.rows.length) {
      return res.status(404).json({ error: "Con not found for the given conId" });
    }

    const storedProductsResult = await pool.query("SELECT id, product, price, payment FROM stored_products WHERE conId = $1", [conId]);

    res.json({
      title: conResult.rows[0].title,
      products: storedProductsResult.rows
    });
  } catch (error) {
    console.error("Error fetching stored products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:conId", async (req, res) => {
  try {
    const { conId } = req.params;
    const result = await pool.query("DELETE FROM stored_products WHERE conId = $1", [conId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Finns ingen data för detta konvent." });
    }
    res.json({ message: "All data har blivit raderad." });
  } catch (error) {
    console.error("Error deleting sales data:", error);
    res.status(500).json({ error: "Failed to delete sales data." });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stored_products");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching stored products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
