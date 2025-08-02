import React from "react";

interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  as?: "input" | "textarea";
  error?: string | boolean;
  value?: string;
  onChange?: any;
  onBlur?: any;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  as = "input",
  error,
  value,
  onChange,
  onBlur,
}) => {
  const baseStyles =
    "w-full border border-[#CCCCCC6B] rounded-[8px] py-2 px-[19px] placeholder:text-[#5D5D5DD1]";

  return (
    <div className="relative w-full">
      <label htmlFor={name} className="block text-base text-[#323232] mb-[6px]">
        {label}
      </label>

      {as === "textarea" ? (
        <textarea
          id={name}
          placeholder={placeholder}
          className={`${baseStyles} resize-none min-h-[120px]`}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className={baseStyles}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}

      {error ? (
        <p className="absolute text-red-500 text-[10px] mt-[2px]">{error}</p>
      ) : null}
    </div>
  );
};
