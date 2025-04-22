import { useEffect, useState } from "react"
import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import AddProduct from "./pages/AddProduct";
import HomePage from "./HomePage";
import SalesDetail from "./pages/SalesDetail";
import ToggleTheme from "./components/ToggleTheme";

function App() {    
  return (
    
    <Router>
      <ToggleTheme/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/add-product" element={<AddProduct/>}/>
        <Route path="/sales-details/:conId" element={<SalesDetail/>}/>
      </Routes>
    </Router>
  )
}

export default App
