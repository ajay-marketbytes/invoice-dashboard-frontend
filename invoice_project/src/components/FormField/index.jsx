import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FormField = ({
  label,
  name,
  register,
  type = "text",
  error,
  placeholder,
  options,
  onChange,
  required,
  readOnly,
  value,
  ...props
}) => {
  const [dateValue, setDateValue] = useState(value || null);

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === "select" ? (
        <div className="relative">
          <select
            id={name}
            {...register(name, { required: required && "This field is required" })}
            onChange={onChange}
            className="w-full p-2 border rounded bg-gray-100 text-gray-800 appearance-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-200"
            disabled={readOnly}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
            ▼
          </span>
        </div>
      ) : type === "date" || type === "datetime-local" ? (
        <DatePicker
          selected={dateValue}
          onChange={(date) => {
            setDateValue(date);
            const formattedDate = date?.toISOString().split("T")[0];
            if (onChange) onChange(formattedDate);
            register(name).onChange({ target: { name, value: formattedDate } });
          }}
          showTimeSelect={type === "datetime-local"}
          dateFormat={type === "datetime-local" ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd"}
          placeholderText={placeholder}
          className="w-full p-2 border rounded bg-gray-100 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-400"
          required={required}
        />
      ) : type === "radio" ? (
        <div className="flex space-x-4">
          {options.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                {...register(name, { required: required && "This field is required" })}
                value={option.value}
                onChange={onChange}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name, { required: required && "This field is required" })}
          onChange={onChange}
          className="w-full p-2 border rounded bg-gray-100 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-200"
          readOnly={readOnly}
          value={value}
          {...props}
        />
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  );
};

export default FormField;
