const express = require("express");
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const consRoutes = require('./routes/cons')
require("dotenv").config();
const fs = require("fs")
const path = require("path");
const Database = require("better-sqlite3");

const isRailway = !!process.env.RAILWAY_ENVIRONMENT;
const dbDir = isRailway ? "/data/db" : path.join(__dirname, "db");


if (!fs.existsSync(dbDir)) {
  console.log(`Creating database directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}


const dbPath = path.join(dbDir, "pawsisters-saletracker.db")
console.log(`Using database: ${dbPath}`);

try {
  const db = new Database(dbPath, { verbose: console.log });
  module.exports = db;
} catch (error) {
  console.error("Error opening database:", error);
  process.exit(1);
}

const app = express();
const storedProductsRoutes = require("./routes/stored_products");
const { verbose } = require("sqlite3");
const PORT = process.env.PORT || 5000;
app.use(express.json());


app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/cons', consRoutes)
app.use('/api/stored_products', storedProductsRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
})


module.exports = db;