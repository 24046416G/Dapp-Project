import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_TYPES, USER_ROUTES } from '../../constants/userTypes.js';

const BusinessLogin = ({ onLogin, MOCK_USERS }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

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
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-box business-login">
            <div className="login-header">
                <h2>Business Login</h2>
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
                <button 
                    type="submit" 
                    className={`submit-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="button-content">
                            <span className="spinner"></span>
                            <span>Logging in...</span>
                        </div>
                    ) : (
                        'Login'
                    )}
                </button>
            </form>
            <div className="login-footer">
                <p>
                    For business account registration, please contact our support team.
                </p>
            </div>
        </div>
    );
};

export default BusinessLogin; 