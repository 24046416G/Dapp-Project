import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_TYPES, USER_ROUTES } from '../../constants/userTypes.js';

const AdminLogin = ({ onLogin, MOCK_USERS }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState(USER_TYPES.MINER);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        businessId: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (isLogin) {
                const user = MOCK_USERS[formData.email];
                
                if (!user || user.type === USER_TYPES.CUSTOMER) {
                    alert('Invalid business account!');
                    return;
                }

                if (user.password !== formData.password) {
                    alert('Incorrect password!');
                    return;
                }

                onLogin(user.type);
                const userRoutes = USER_ROUTES[user.type];
                if (userRoutes?.length > 0) {
                    navigate(userRoutes[0].path);
                }
            } else {
                // 注册逻辑，添加公司验证等...
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-box admin-login">
            <div className="login-header">
                <h2>{isLogin ? 'Business Login' : 'Business Registration'}</h2>
                <p>Access your business dashboard</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Business Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                </div>
                {!isLogin && (
                    <>
                        <div className="form-group">
                            <input
                                type="text"
                                name="companyName"
                                placeholder="Company Name"
                                value={formData.companyName}
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="businessId"
                                placeholder="Business ID"
                                value={formData.businessId}
                                onChange={(e) => setFormData({...formData, businessId: e.target.value})}
                                required
                            />
                        </div>
                    </>
                )}
                <div className="form-group">
                    <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="user-type-select"
                    >
                        <option value={USER_TYPES.MINER}>Mining Company</option>
                        <option value={USER_TYPES.JEWELER}>Jewelry Company</option>
                        <option value={USER_TYPES.GRADING}>Grading Lab</option>
                        <option value={USER_TYPES.CUTTING}>Cutting Factory</option>
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
                    {isLogin ? "Don't have a business account?" : "Already have an account?"}
                    <button
                        className="toggle-button"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin; 