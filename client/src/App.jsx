import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProduct from "./pages/AddProduct";
import SalesDetail from "./pages/SalesDetail";
import SalesTracker from "./SalesTracker";
import Inventory from "./pages/Inventory";
import StartPage from "./StartPage";
import CalendarDetailPage from "./pages/CalendarDetailPage";
import AddMonthlyNotes from "./pages/AddMonthlyNotes";
import AddEvent from "./pages/AddEvent";
import AddTask from "./pages/AddTask";
import AddInvItem from "./pages/AddInvItem";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/sales-tracker" element={<SalesTracker />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/sales-details/:conId" element={<SalesDetail />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/calendar/:date" element={<CalendarDetailPage />} />
          <Route path="/add-monthly-note" element={<AddMonthlyNotes />} />
          <Route path="/calendar/:date/add-event" element={<AddEvent />} />
          <Route path={`/add-task/:date`} element={<AddTask />} />
          <Route path="/add-new-item" element={<AddInvItem />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
