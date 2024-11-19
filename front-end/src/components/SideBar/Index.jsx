import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBoxes, FaCog } from 'react-icons/fa';
import '../../css/sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        {
            path: '/',
            name: 'Home',
            icon: <FaHome className="sidebar-icon" />
        },
        {
            path: '/inventory',
            name: 'Inventory',
            icon: <FaBoxes className="sidebar-icon" />
        },
        {
            path: '/settings',
            name: 'Settings',
            icon: <FaCog className="sidebar-icon" />
        }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1>Diamond App</h1>
            </div>
            <ul>
                {menuItems.map((item) => (
                    <li 
                        key={item.path}
                        className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <Link to={item.path}>
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;