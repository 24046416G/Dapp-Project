import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    FaChartLine, FaBoxes, FaUsers, FaCog, 
    FaGem, FaUser, FaHammer, FaShoppingCart,
    FaStore, FaShoppingBag, FaSignOutAlt, FaWallet,
    FaHistory, FaHourglassHalf, FaRocketchat
} from 'react-icons/fa';
import { USER_TYPES, USER_ROUTES } from '../../constants/userTypes.js';
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
    FaShoppingBag,
    FaWallet,
    FaHistory,
    FaHourglassHalf,
    FaRocketchat
};

const Sidebar = ({ userType = USER_TYPES.CUSTOMER }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const menuItems = USER_ROUTES[userType] || [];

    useEffect(() => {
        console.log('location.pathname', location.pathname);
        console.log('menuItems', menuItems);
        if (menuItems.length > 0) {
            navigate(menuItems[0].path);
        }
    }, [location.pathname, menuItems, navigate]);

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
            <div className="sidebar-content">
                <ul className="menu-items">
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
                </ul>
                <div className="logout-container">
                    <Link to="/login" className="logout-link">
                        <FaSignOutAlt className="sidebar-icon" />
                        <span>Logout</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;