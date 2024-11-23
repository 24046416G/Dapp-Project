import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/SideBar/Index.jsx';
import Inventory from './components/Inventory/Index.jsx';
import Login from './components/Login/Index.jsx';
import Store from './components/Store/Index.jsx';
import Collection from './components/Collection/Index.jsx';
import Record from './components/Record/Index.jsx';
import { USER_TYPES } from './constants/userTypes.js';

function App() {
    // 这里可以添加登录状态检查
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(USER_TYPES.CUSTOMER);

    // 模拟登录处理函数
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
                                        {/* 在这里添加其他路由 */}
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

