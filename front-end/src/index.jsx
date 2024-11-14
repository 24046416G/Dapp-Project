import React from 'react'
import { createRoot } from 'react-dom/client';
import LoginTable from "./components/LoginTable/Index.jsx"
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Sidebar from './components/SideBar/Index.jsx';

function main(){
    const root = createRoot(document.getElementById("app"));
    root.render(
        <Router>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                    <div style={{ marginLeft: '200px', padding: '20px', width: '100%' }}>
                        <Routes>
                            <Route exact path="/" component={<LoginTable />} />
                        </Routes>
                    </div>
            </div> 
        </Router>
    );
}

main()

