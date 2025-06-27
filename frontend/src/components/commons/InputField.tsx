import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  min,
  max,
  step,
}) => {
  return (
    <div className="mb-2">
      <label className="floating-label">
        <span>{label} </span>
        <input
          type={type}
          name={name}
          placeholder=""
          className="input input-bordered w-full"
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
          step={step}
        />
      </label>
    </div>
  );
};

export default InputField;
