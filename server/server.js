const express = require("express");
const cors = require("cors");
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const consRoutes = require('./routes/cons')

const app = express();
const storedProductsRoutes = require("./routes/stored_products");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/cons', consRoutes)
app.use('/api/stored_products', storedProductsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})


