import React from 'react';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    error,
}) => {
    return (
        <div className="flex flex-col space-y-1">
            {label && (
                <label
                    htmlFor={name}
                    className="text-sm font-semibold text-orange-500 text-[16px]"
                >
                    {label}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`px-4 py-2 transition duration-150 bg-white text-gray-800 placeholder-gray-400 border shadow-sm rounded-md focus:outline-none focus:ring-2 ${error
                        ? 'border-red-500 focus:ring-red-300'
                        : 'border-gray-300 focus:ring-orange-500'
                    } focus:border-transparent`}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
