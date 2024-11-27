import React from 'react';
import '/src/css/button.css';

const Button = ({ onClick, children, className = '', type = 'primary' }) => {
    return (
        <button 
            onClick={onClick} 
            className={`common-button ${type} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;