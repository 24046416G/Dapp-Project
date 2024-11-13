import React from 'react'
import { createRoot } from 'react-dom/client';
import LoginTable from "./components/LoginTable/Index.jsx"
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function main(){
    const root = createRoot(document.getElementById("app"));
    root.render(
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Login</Link>
                        </li>
                        <li>
                            <Link to="/">Nothing</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<LoginTable/>} />
                </Routes>
            </div>
        </Router>
    );
}

main()

