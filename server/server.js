const express = require("express");
const cors = require("cors");
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);

app.listen(PORT, () => {

  console.log(`Server is running on http://localhost:${PORT}`);


})
