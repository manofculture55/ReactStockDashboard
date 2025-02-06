import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import StockDashboard from "./components/StockDashboard";
import Holdings from "./components/Holdings";

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Stock Dashboard</Link> | 
                <Link to="/holdings">Holdings</Link>
            </nav>
            <Routes>
                <Route path="/" element={<StockDashboard />} />
                <Route path="/holdings" element={<Holdings />} />
            </Routes>
        </Router>
    );
}

export default App;
