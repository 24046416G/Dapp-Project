import React from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/SideBar/Index.jsx';
import Inventory from './components/Inventory/Index.jsx';
import Login from './components/Login/Index.jsx';

function App() {
    // 这里可以添加登录状态检查
    const isAuthenticated = True; // 临时变量，之后可以通过状态管理来处理

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/*"
                    element={
                        isAuthenticated ? (
                            <div style={{ display: 'flex' }}>
                                <Sidebar />
                                <div style={{ marginLeft: '250px', padding: '20px', width: 'calc(100% - 250px)' }}>
                                    <Routes>
                                        <Route path="/inventory" element={<Inventory />} />
                                        <Route path="/" element={<Inventory />} />
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

