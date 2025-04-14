/* const express = require("express");
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const consRoutes = require('./routes/cons')
require("dotenv").config();
const fs = require("fs")
const path = require("path");
const Database = require("better-sqlite3");
const cors = require('cors');

const isRailway = !!process.env.RAILWAY_ENVIRONMENT;
const dbDir = isRailway ? "/data/db" : path.join(__dirname, "db");


if (!fs.existsSync(dbDir)) {
  console.log(`Creating database directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}


const dbPath = path.join(dbDir, "pawsisters-saletracker.db")
console.log(`Using database: ${dbPath}`);
let db;

try {
  db = new Database(dbPath, { verbose: console.log });
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
app.use(cors({ origin: "*" }));


app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/cons', consRoutes)
app.use('/api/stored_products', storedProductsRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
})


module.exports = db; */


const express = require("express");
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const consRoutes = require('./routes/cons');
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");  // Importera Pool från pg
const cors = require('cors');

// Kontrollera om miljön är Railway
const isRailway = !!process.env.RAILWAY_ENVIRONMENT;

// Anslutning till PostgreSQL med miljövariabeln DATABASE_URL från .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Hämta DATABASE_URL från .env
  ssl: {
    rejectUnauthorized: false,  // Om Railway använder SSL
  },
});

// Kontrollera om anslutningen fungerar och logga resultatet
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
    process.exit(1);  // Stoppa servern om anslutning misslyckas
  } else {
    console.log("Connected to PostgreSQL!");
  }
  release();  // Frigör anslutningen efter att vi är klara
});

// Skapa Express-app
const app = express();
const storedProductsRoutes = require("./routes/stored_products");

// Konfigurera port från .env eller använd standardporten 5000
const PORT = process.env.PORT || 5000;
app.use(express.json());  // Tillåt JSON-requests
app.use(cors({ origin: "*" }));  // Tillåt alla domäner för CORS

// Använd routerna för API
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/cons', consRoutes);
app.use('/api/stored_products', storedProductsRoutes);

// Starta servern och lyssna på vald port
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
});

// Exportera poolen för användning i andra delar av appen
module.exports = pool;

