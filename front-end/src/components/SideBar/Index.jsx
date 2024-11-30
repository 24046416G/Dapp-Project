import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    const navigate = useNavigate();
    const location = useLocation();
    const menuItems = USER_ROUTES[userType] || [];

    const handleLogout = () => {
        try {
            // 清除本地存储的用户信息
            localStorage.clear();
            
            // 重定向到登录页面
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            alert('Error during logout. Please try again.');
        }
    };

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
                    <button onClick={handleLogout} className="logout-link">
                        <FaSignOutAlt className="sidebar-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;