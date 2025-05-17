import React from "react";

const Select = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  error,
  placeholder = "Select an option",
  className = "",
  ...rest
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-orange-500"
        >
          {label}
        </label>
      )}

      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full p-2 border rounded outline-none bg-transparent text-gray-500 focus:ring-2 focus:ring-orange-400 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Select;
