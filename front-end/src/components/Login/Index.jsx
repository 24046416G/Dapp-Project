import React, { useState } from 'react';
import { USER_TYPES } from '../../constants/userTypes';
import BusinessLogin from './BusinessLogin.jsx';
import CustomerLogin from './CustomerLogin.jsx';
import '../../css/login.css';

// 模拟用户数据库
const MOCK_USERS = {
    'miner@test.com': { password: '123456', type: USER_TYPES.MINER },
    'jeweler@test.com': { password: '123456', type: USER_TYPES.JEWELER },
    'customer@test.com': { password: '123456', type: USER_TYPES.CUSTOMER },
    'grading@test.com': { password: '123456', type: USER_TYPES.GRADING },
    'cutting@test.com': { password: '123456', type: USER_TYPES.CUTTING }
};

const Login = ({ onLogin }) => {
    const [isAdminView, setIsAdminView] = useState(false);

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-type-toggle">
                    <button 
                        className={`toggle-tab ${!isAdminView ? 'active' : ''}`}
                        onClick={() => setIsAdminView(false)}
                    >
                        Customer
                    </button>
                    <button 
                        className={`toggle-tab ${isAdminView ? 'active' : ''}`}
                        onClick={() => setIsAdminView(true)}
                    >
                        Business Partner
                    </button>
                </div>
                {isAdminView ? (
                    <BusinessLogin onLogin={onLogin} MOCK_USERS={MOCK_USERS} />
                ) : (
                    <CustomerLogin onLogin={onLogin} MOCK_USERS={MOCK_USERS} />
                )}
            </div>
        </div>
    );
};

export default Login; 