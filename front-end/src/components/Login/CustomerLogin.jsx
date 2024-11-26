import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_TYPES } from '../../constants/userTypes.js';

const CustomerLogin = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!formData.username || !formData.password || (!isLogin && (!formData.email || !formData.confirmPassword))) {
            alert('Please fill in all fields');
            return;
        }

        if (!isLogin) {
            // 注册时的验证
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address');
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        customerName: formData.username,
                        customerId: formData.email,
                        password: formData.password,
                        role: USER_TYPES.CUSTOMER
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration successful! Please login.');
                    setIsLogin(true);  // 切换到登录界面
                    setFormData({  // 清空表单
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    });
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed. Please try again later.');
            }
        } else {
            // 登录逻辑保持不变
            onLogin(USER_TYPES.JEWELER);
            navigate('/');
        }
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
            <h2>{isLogin ? 'Customer Login' : 'Customer Register'}</h2>
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
            {!isLogin && (
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="text-input"
                        placeholder="your@email.com"
                    />
                </div>
            )}
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
            {!isLogin && (
                <div className="input-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="text-input"
                    />
                </div>
            )}
            <button onClick={handleSubmit} className="login-button">
                {isLogin ? 'Login' : 'Register'}
            </button>
            <p className="switch-mode" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </p>
        </div>
    );
};

export default CustomerLogin; 