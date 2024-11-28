import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../SideBar/Index.jsx';
import Inventory from '../Inventory/Index.jsx';
import Login from '../Login/Index.jsx';
import Store from '../Store/Index.jsx';
import PersonalCenter from '../PersonalCenter/Index.jsx';
import Record from '../Record/Index.jsx';
import AvailableStones from '../AvailableStones/Index.jsx';
import BuyRawStones from '../BuyRawStones/Index.jsx';
import MiningHistory from '../MiningHistory/Index.jsx';
import WaitToGrade from '../WaitToGrade/Index.jsx';
import JewelryInventory from '../JewelryInventory/Index.jsx';
import { USER_TYPES, USER_ROUTES } from '../../constants/userTypes.js';

function AppContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(USER_TYPES.CUSTOMER);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            setIsAuthenticated(true);
            setUserType(user.role);
            
            if (location.pathname === '/') {
                const defaultRoute = USER_ROUTES[user.role]?.[0]?.path;
                console.log('Navigating to default route:', defaultRoute);
                if (defaultRoute) {
                    navigate(defaultRoute);
                }
            }
        }
    }, [navigate, location.pathname]);

    const handleLogin = (role) => {
        setIsAuthenticated(true);
        setUserType(role);
        const defaultRoute = USER_ROUTES[role]?.[0]?.path;
        console.log('defaultRoute', defaultRoute);
        if (defaultRoute) {
            navigate(defaultRoute);
        }
    };

    return (
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
                                    <Route path="/personal" element={<PersonalCenter userType={userType} />} />
                                    <Route path="/store" element={<Store userType={userType} />} />
                                    <Route path="/inventory" element={<Inventory />} />
                                    <Route path="/record" element={<Record userType={userType} />} />
                                    <Route path="/available-stones" element={<AvailableStones />} />                                     
                                    <Route path="/mining-history" element={<MiningHistory />} />
                                    <Route path="/wait-to-grade" element={<WaitToGrade />} />
                                    <Route path="/wallet" element={<BuyRawStones />} />
                                    <Route path="/jewelry-inventory" element={<JewelryInventory />} />
                                </Routes>
                            </div>  
                        </div>
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App; 