import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/SideBar/Index.jsx';
import Inventory from './components/Inventory/Index.jsx';
import Login from './components/Login/Index.jsx';
import Store from './components/Store/Index.jsx';
import Collection from './components/Collection/Index.jsx';
import Record from './components/Record/Index.jsx';
import AvailableStones from './components/AvailableStones/Index.jsx';
import BuyRawStones from './components/BuyRawStones/Index.jsx';
import MiningHistory from './components/MiningHistory/Index.jsx';
import { USER_TYPES } from './constants/userTypes.js';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(USER_TYPES.CUSTOMER);

    const handleLogin = (type) => {
        setIsAuthenticated(true);
        setUserType(type);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route
                    path="/*"
                    element={
                        isAuthenticated ? (
                            <div style={{ display: 'flex' }}>
                                <Sidebar userType={userType} />
                                <div style={{ marginLeft: '250px', padding: '20px', width: 'calc(100% - 250px)' }}>
                                    <Routes>
                                        <Route path="/store" element={<Store />} />
                                        <Route path="/inventory" element={<Inventory />} />
                                        <Route path="/collections" element={<Collection />} />
                                        <Route path="/record" element={<Record userType={userType} />} />
                                        <Route path="/" element={<Store />} />
                                        <Route path="/available-stones" element={<AvailableStones />} />
                                        <Route path="/buy-raw-stones" element={<BuyRawStones />} />
                                        <Route path="/mining-history" element={<MiningHistory />} />
                                    </Routes>
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

function main() {
    const root = createRoot(document.getElementById("app"));
    root.render(<App />);
}

main();

