const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../db/pawsisters-saletracker.db'))


router.post('/', (req, res) => {
  try {
    const { product, price, payment, conId } = req.body;

    if(!product || !price || !payment || !conId) {

      return res.status(400).json({error: "Missing required fields"});
    }
    const stmt = db.prepare(`
      INSERT INTO products (product, price, payment, conId)
      VALUES (?, ?, ?, ?)
      
      `);
      const result = stmt.run(product, price, payment, conId)

      res.status(201).json({productId: result.lastInsertRowid});
  }catch(error){
    console.error('Error adding product:', error);
    res.status(500).json({error: 'Failed to add product'});
    
  }

});

router.get('/', (req, res) => {
  try{
    const stmt = db.prepare("SELECT * FROM products")
    const products = stmt.all();

    res.json(products);
  }catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({error: "Failed to fetch products"})
    


  }

})




module.exports = router;