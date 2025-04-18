const { Pool } = require('pg');
require("dotenv").config();  // Ladda miljövariabler från .env-filen

// Skapa en Pool-instans för att hantera PostgreSQL-anslutningar
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Anslut till PostgreSQL via miljövariabeln
  ssl: {
    rejectUnauthorized: false,  // Railway kräver SSL-anslutningar
  },
});

// Kontrollera om anslutningen fungerar och logga resultatet
pool.on('connect', () => {
  console.log('');
});

// Exportera poolen så att den kan användas i andra delar av applikationen
module.exports = pool;
