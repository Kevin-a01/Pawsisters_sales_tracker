import { useEffect, useState } from "react"
import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import AddProduct from "./pages/AddProduct";
import HomePage from "./HomePage";

function App() {
  /* const saveSalesForToday = () => {

    const date = new Date().toISOString().split("T")[0];

    const newSales = products.map((product) => ({
      ...product,
      date,
    }));

    setSales((prevSales) => ({

      ...prevSales,
      [date]: [...(prevSales[date] || []), ...newSales],
    }));

    setProducts([]);
    alert("Sales saved for " + date);

  } */
    

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/add-product" element={<AddProduct/>}/>
      </Routes>
    </Router>
  )
}

export default App
