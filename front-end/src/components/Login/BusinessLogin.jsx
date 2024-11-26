import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_TYPES } from '../../constants/userTypes.js';

const BusinessLogin = ({ onLogin }) => {
    const [selectedType, setSelectedType] = useState(USER_TYPES.ADMIN);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!formData.username || !formData.password || !formData.email) {
            alert('Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address');
            return;
        }

        onLogin(selectedType);
        navigate('/');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="login-card">
            <h2>Business Login</h2>
            <div className="input-group">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="text-input"
                />
            </div>
            <div className="input-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="text-input"
                />
            </div>
            <button onClick={handleLogin} className="login-button">
                Login
            </button>
        </div>
    );
};

export default BusinessLogin; 