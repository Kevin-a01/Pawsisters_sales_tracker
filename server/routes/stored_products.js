const express = require('express');
const router = express.Router();
const pool = require('../db');


router.post('/store', async (req, res) => {
  try {
    const { conId, products, conTitle, conDate } = req.body;


    if (!conId || !products || products.length === 0) {
      console.error('❌ Missing conId or products in request body');
      return res.status(400).json({ error: "Missing conId or products" });
    }

    let title = conTitle;


    if (!title) {
      const storedConResult = await pool.query(`
        SELECT title FROM stored_products WHERE "conId" = $1 LIMIT 1
        `, [conId]
      );
      if (storedConResult.rows.length > 0) {
        title = storedConResult.rows[0].title;
      } else {

        title = "Con..."

      }
      if (!title) {
        title = "Con...";
      }

    }
    let date;
    try {
      date = conDate ? new Date(conDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    } catch (err) {
      console.error('Invalid date format for conDate', conDate);
      date = new Date().toISOString().split('T')[0];


    }


    console.log(`Using convention: ${title}, Date: ${date}`);







    // Insert query for storing products
    const insertStmt = `
      INSERT INTO stored_products ("productId", "conId", title, date, product, price, payment, maker)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    // Iterate over the products array and store each product
    for (let product of products) {
      const { productId, price, payment } = product;

      // Fetch product name by productId
      const productResult = await pool.query("SELECT product, maker FROM products WHERE id = $1", [productId]);

      if (!productResult.rows.length) {
        console.error(`❌ Product not found for ID: ${productId}`);
        return res.status(404).json({ error: `Product not found for ID: ${productId}` });
      }

      const productName = productResult.rows[0].product;
      const maker = productResult.rows[0].maker;

      // Validate required fields in the product object
      if (!productId || !productName || !price || !payment || !maker) {
        console.error("❌ Missing required fields in product:", product);
        return res.status(400).json({ error: "Missing required fields in product" });
      }

      // Insert the product into the stored_products table
      await pool.query(insertStmt, [productId, conId, title, conDate, productName, price, payment, maker]);
      console.log(`✅ Product ID ${productId} stored successfully`);
    }

    // Attempt to delete from products where conId is provided
    /* console.log(`Attempting to delete from products where conId = ${conId}`);
    const deleteProductsResult = await pool.query("DELETE FROM products WHERE conId = $1", [conId]);
    console.log(`Deleted ${deleteProductsResult.rowCount} rows from products`); */

    const deleteAllResult = await pool.query("DELETE FROM products");
    console.log(`Deleted ${deleteAllResult.rowCount} rows from products`);




    // Delete the con from the cons table based on the provided conId
    console.log(`Cleaning up: deleting con with conId = ${conId}`);
    const deleteConsResult = await pool.query("DELETE FROM cons WHERE id = $1", [conId]);
    console.log(`Deleted ${deleteConsResult.rowCount} rows from cons`);

    console.log(`Deleted ${deleteConsResult.rowCount} rows from cons`);

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

router.get('/top-products/:conId', async (req, res) => {
  console.log('Fetching top products...');
  try {
    const { conId } = req.params

    const parsedConId = parseInt(conId);
    if (isNaN(parsedConId)) {
      return res.status(400).json({ err: "Ogiltigt conid" });

    }

    const result = await pool.query(
      `
      SELECT product, COUNT(*) AS total_sold
      FROM stored_products
      WHERE "conId" = $1
      GROUP BY product
      ORDER BY total_sold DESC
      LIMIT 5;
      
      `,
      [parsedConId]
    );


    console.log('Query result:', result.rows);
    res.json(result.rows)
  } catch (err) {
    console.error("Hämtning av top produkter misslyckades:", err);
    res.status(500).json({ err: 'Server Error.' });

  }

});

router.get('/cons', async (req, res) => {

  try {
    const result = await pool.query(`
      SELECT DISTINCT "conId" AS id, title
      FROM stored_products
      ORDER BY "conId" DESC
      `);
    res.json(result.rows);

  } catch (err) {
    console.error('Error fetching cons', err);
    res.status(500).json({ err: 'Failed to fetch stored cons' });
  }
});



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
  /*  const { password } = req.body;
 
   const DELETE_PASSWORD = process.env.DELETE_PASSWORD;
 
   if (!password || password !== DELETE_PASSWORD) {
     return res.status(401).json({ error: "Fel lösenord" });
 
   } */


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


});






module.exports = router;
