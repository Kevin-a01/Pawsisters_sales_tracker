const express = require("express");
const cors = require("cors");
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const consRoutes = require('./routes/cons')
require("dotenv").config();
const path = require("path");
const Database = require("better-sqlite3");


const isProduction = process.env.NODE_ENV === "production";
const dbPath = isProduction
  ? "/app/db/pawsisters-saletracker.db" // Railway path
  : path.join(__dirname, "./db/pawsisters-saletracker.db"); // Local path
const db = new Database(dbPath);

const app = express();
const storedProductsRoutes = require("./routes/stored_products");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/cons', consRoutes)
app.use('/api/stored_products', storedProductsRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
})


module.exports = db;