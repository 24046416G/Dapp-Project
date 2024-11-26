import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from '../SideBar/Index.jsx';
import Inventory from '../Inventory/Index.jsx';
import Login from '../Login/Index.jsx';
import Store from '../Store/Index.jsx';
import PersonalCenter from '../PersonalCenter/Index.jsx';
import Record from '../Record/Index.jsx';
import AvailableStones from '../AvailableStones/Index.jsx';
import BuyRawStones from '../BuyRawStones/Index.jsx';
import { USER_TYPES } from '../../constants/userTypes.js';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(USER_TYPES.CUSTOMER);

    useEffect(() => {
        console.log('Authentication status:', isAuthenticated);
        console.log('Current route:', window.location.pathname);
    }, [isAuthenticated]);

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
                                <div style={{ marginLeft: '250px', width: 'calc(100% - 250px)' }}>
                                    <Routes>
                                        <Route path="/personal" element={<PersonalCenter />} />
                                        <Route path="/store" element={<Store userType={userType} />} />
                                        <Route path="/inventory" element={<Inventory />} />
                                        <Route path="/record" element={<Record userType={userType} />} />
                                        <Route path="/available-stones" element={<AvailableStones />} />
                                        <Route path="/buy-raw-stones" element={<BuyRawStones />} />
                                        <Route path="/wallet" element={<BuyRawStones />} />
                                        <Route path="/" element={<Navigate to="/store" replace />} />
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

export default App; 