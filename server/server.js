const express = require("express");
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const consRoutes = require('./routes/cons');
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const cors = require('cors');


const isRailway = !!process.env.RAILWAY_ENVIRONMENT;


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
    process.exit(1);
  } else {
  }
  release();
});


const app = express();
const storedProductsRoutes = require("./routes/stored_products");


const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({ origin: "*" }));


app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/cons', consRoutes);
app.use('/api/stored_products', storedProductsRoutes);


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
});


module.exports = pool;

