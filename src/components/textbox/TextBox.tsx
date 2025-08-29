import { useState } from "react";

interface TextBoxProps {
  value?: string;
  onChange?: (newValue: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function TextBox({ value = "", onChange, placeholder, disabled = false, className }: TextBoxProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full typography-regular rounded-xl px-4 py-2 bg-secondary border-none outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-text-secondary ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
    />
  );
}