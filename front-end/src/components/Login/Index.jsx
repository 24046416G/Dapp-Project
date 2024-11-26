import React from 'react';
import CustomerLogin from './CustomerLogin.jsx';
import '../../css/login.css';

const Login = ({ onLogin }) => {
    return (
        <div className="login-container">
            <CustomerLogin onLogin={onLogin} />
        </div>
    );
};

export default Login; 