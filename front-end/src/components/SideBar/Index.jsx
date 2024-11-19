import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FaChartLine, FaBoxes, FaUsers, FaCog, 
    FaGem, FaUser, FaHammer, FaShoppingCart,
    FaStore, FaShoppingBag
} from 'react-icons/fa';
import { USER_TYPES, USER_ROUTES } from '../../constants/userTypes';
import '../../css/sidebar.css';

const ICONS = {
    FaChartLine,
    FaBoxes,
    FaUsers,
    FaCog,
    FaGem,
    FaUser,
    FaHammer,
    FaShoppingCart,
    FaStore,
    FaShoppingBag
};

const Sidebar = ({ userType = USER_TYPES.CUSTOMER }) => {
    const location = useLocation();
    const menuItems = USER_ROUTES[userType] || [];

    const getIcon = (iconName) => {
        const IconComponent = ICONS[iconName];
        return IconComponent ? <IconComponent className="sidebar-icon" /> : null;
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1>Diamond App</h1>
                <p className="user-type">{userType}</p>
            </div>
            <ul>
                {menuItems.map((item) => (
                    <li 
                        key={item.path}
                        className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <Link to={item.path}>
                            {getIcon(item.icon)}
                            <span>{item.name}</span>
                        </Link>
                    </li>
                ))}
                <li className="sidebar-item">
                    <Link to="/login" className="logout-link">
                        <FaUser className="sidebar-icon" />
                        <span>Logout</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;