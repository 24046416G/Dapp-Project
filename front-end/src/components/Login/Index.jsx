import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_TYPES, USER_ROUTES } from '../../constants/userTypes';
import '../../css/login.css';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState(USER_TYPES.CUSTOMER);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!isLogin && formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        // 调用登录回调
        onLogin(userType);

        // 获取当前用户类型的路由列表
        const userRoutes = USER_ROUTES[userType];
        
        // 如果存在路由，导航到第一个路由
        if (userRoutes && userRoutes.length > 0) {
            navigate(userRoutes[0].path);
        } else {
            // 如果没有找到路由，导航到默认路径
            navigate('/');
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
                    <button type="submit" className="submit-button">
                        {isLogin ? 'Login' : 'Register'}
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