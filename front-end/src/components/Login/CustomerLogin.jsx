import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_TYPES, USER_ROUTES } from '../../constants/userTypes.js';

const CustomerLogin = ({ onLogin, MOCK_USERS }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (isLogin) {
                const user = MOCK_USERS[formData.email];
                
                if (!user || user.type !== USER_TYPES.CUSTOMER) {
                    alert('User not found!');
                    return;
                }

                if (user.password !== formData.password) {
                    alert('Incorrect password!');
                    return;
                }

                onLogin(USER_TYPES.CUSTOMER);
                const userRoutes = USER_ROUTES[USER_TYPES.CUSTOMER];
                if (userRoutes?.length > 0) {
                    navigate(userRoutes[0].path);
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    alert("Passwords don't match!");
                    return;
                }

                if (MOCK_USERS[formData.email]) {
                    alert('Email already registered!');
                    return;
                }

                MOCK_USERS[formData.email] = {
                    password: formData.password,
                    type: USER_TYPES.CUSTOMER
                };

                alert('Registration successful! Please login.');
                setIsLogin(true);
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-box customer-login">
            <div className="login-header">
                <h2>{isLogin ? 'Welcome Back' : 'Customer Registration'}</h2>
                <p>Explore our diamond collection</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
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
                    <div className="form-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            required
                        />
                    </div>
                )}
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
    );
};

export default CustomerLogin; 