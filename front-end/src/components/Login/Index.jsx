import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button/Index';
import '../../css/login.css';
import { USER_TYPES } from '../../constants/userTypes';
const Login = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isCustomer, setIsCustomer] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!isCustomer) {
            setIsLogin(true);
        }
    }, [isCustomer]);

    const handleSubmit = async () => {
        if (!formData.username || !formData.password || (!isLogin && (!formData.email || !formData.confirmPassword))) {
            alert('Please fill in all fields');
            return;
        }

        if (!isLogin) {
            // 注册逻辑
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
            // 登录逻辑
            try {
                const response = await fetch('http://localhost:3000/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        [isCustomer ? 'customerId' : 'companyId']: formData.username,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // 登录成功
                    alert('Login successful!');
                    // 保存用户信息到本地存储
                    localStorage.setItem('user', JSON.stringify(data.user));
                    // 更新登录状态
                    onLogin(data.user.role);
                    // 跳转到首页
                    navigate('/');
                } else {
                    // 登录失败
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed. Please try again later.');
            }
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
        <div className="login-container">
            <div className="login-card">
                <div className="login-type-selector">
                    <button 
                        className={`type-button ${isCustomer ? 'active' : ''}`}
                        onClick={() => setIsCustomer(true)}
                    >
                        Customer
                    </button>
                    <button 
                        className={`type-button ${!isCustomer ? 'active' : ''}`}
                        onClick={() => setIsCustomer(false)}
                    >
                        Business Partner
                    </button>
                </div>

                <h2>{isLogin ? `${isCustomer ? 'Customer' : 'Business Partner'} Login` : 'Customer Register'}</h2>
                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="text-input"
                        placeholder={!isCustomer ? "Company ID" : "Username"}
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
                <Button 
                    onClick={handleSubmit} 
                    className="login-button"
                >
                    {isLogin ? 'Login' : 'Register'}
                </Button>
                {isCustomer && (
                    <p className="switch-mode" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login; 