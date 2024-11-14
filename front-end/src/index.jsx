import React from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Sidebar from './components/SideBar/Index.jsx';
import Inventory from './components/Inventory/Index.jsx';

function main(){
    const root = createRoot(document.getElementById("app"));
    root.render(
        <Router>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ marginLeft: '25%', padding: '20px', width: '75%' }}>
                    <Routes>
                        <Route path="/" element={<Inventory />} />
                        <Route path="/inventory" element={<Inventory />} />
                    </Routes>
                </div>
            </div> 
        </Router>
    );
}

main()

