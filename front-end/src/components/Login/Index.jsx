import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_TYPES, USER_ROUTES } from '../../constants/userTypes';
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
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState(USER_TYPES.CUSTOMER);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // 模拟API请求延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (isLogin) {
                // 登录逻辑
                const user = MOCK_USERS[formData.email];
                
                if (!user) {
                    alert('User not found!');
                    return;
                }

                if (user.password !== formData.password) {
                    alert('Incorrect password!');
                    return;
                }

                // 设置用户类型为数据库中的类型
                setUserType(user.type);
                
                // 登录成功
                onLogin(user.type);

                // 获取当前用户类型的路由列表
                const userRoutes = USER_ROUTES[user.type];
                
                // 如果存在路由，导航到第一个路由
                if (userRoutes && userRoutes.length > 0) {
                    navigate(userRoutes[0].path);
                } else {
                    navigate('/');
                }

            } else {
                // 注册逻辑
                if (formData.password !== formData.confirmPassword) {
                    alert("Passwords don't match!");
                    return;
                }

                if (MOCK_USERS[formData.email]) {
                    alert('Email already registered!');
                    return;
                }

                // 模拟添加新用户
                MOCK_USERS[formData.email] = {
                    password: formData.password,
                    type: userType
                };

                // 注册成功
                alert('Registration successful! Please login.');
                setIsLogin(true);
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
            }

        } catch (error) {
            console.error('Login/Register error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h2>{isLogin ? 'Login' : 'Register'}</h2>
                    <p>Welcome to Diamond App</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="user-type-select"
                        >
                            <option value={USER_TYPES.CUSTOMER}>Customer</option>
                            <option value={USER_TYPES.MINER}>Miner</option>
                            <option value={USER_TYPES.JEWELER}>Jeweler</option>
                            <option value={USER_TYPES.GRADING}>Grading</option>
                            <option value={USER_TYPES.CUTTING}>Cutting</option>
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        className={`submit-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="button-content">
                                <span className="spinner"></span>
                                <span>{isLogin ? 'Logging in...' : 'Registering...'}</span>
                            </div>
                        ) : (
                            isLogin ? 'Login' : 'Register'
                        )}
                    </button>
                </form>
                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            className="toggle-button"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login; 