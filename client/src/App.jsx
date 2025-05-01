import { useEffect, useState } from "react"
import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import AddProduct from "./pages/AddProduct";
import HomePage from "./StartPage";
import SalesDetail from "./pages/SalesDetail";
import SalesTracker from "./SalesTracker";
import BurgerMenu from "./components/BurgerMenu";
import Inventory from "./pages/Inventory";
import StartPage from "./StartPage";


function App() {    
  return (
    <>
    
    <Router>
      <Routes>
        <Route path="/" element={<StartPage/>}/>
        <Route path="/sales-tracker" element={<SalesTracker/>}/>
        <Route path="/add-product" element={<AddProduct/>}/>
        <Route path="/sales-details/:conId" element={<SalesDetail/>}/>
        <Route path="/inventory" element={<Inventory/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
