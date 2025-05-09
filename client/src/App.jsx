import { useEffect, useState } from "react"
import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import AddProduct from "./pages/AddProduct";
import HomePage from "./StartPage";
import SalesDetail from "./pages/SalesDetail";
import SalesTracker from "./SalesTracker";
import BurgerMenu from "./components/BurgerMenu";
import Inventory from "./pages/Inventory";
import StartPage from "./StartPage";
import CalendarDetailPage from "./pages/CalendarDetailPage";
import AddMonthlyNotes from "./pages/AddMonthlyNotes";
import AddEvent from "./pages/AddEvent";



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
        <Route path="/calendar/:date" element={<CalendarDetailPage/>}/>
        <Route path="/add-monthly-note" element={<AddMonthlyNotes/>} />
        <Route path="/calendar/:date/add-event" element= {<AddEvent/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
