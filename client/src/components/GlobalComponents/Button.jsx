// src/components/UI/Button.jsx
import React from 'react';

const Button = ({
    children,
    type = 'button',
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`w-full py-2 font-semibold text-white transition duration-200 bg-orange-600 shadow hover:bg-orange-700 rounded-md disabled:opacity-50  ${className} p`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
