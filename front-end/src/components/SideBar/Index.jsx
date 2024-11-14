import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/sidebar.css'

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/inventory">Inventory</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;