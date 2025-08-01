import { useState } from "react";

interface DateTimePickerProps {
  value?: Date | null;
  onChange?: (newValue: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function DateTimePicker({ value, onChange, placeholder = "Select date and time", disabled = false, className }: DateTimePickerProps) {
  const [inputValue, setInputValue] = useState(
    value ? formatDateTimeLocal(value) : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue) {
      const date = new Date(newValue);
      onChange?.(date);
    } else {
      onChange?.(null);
    }
  };

  return (
    <input
      type="datetime-local"
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

// Helper function to format Date to datetime-local input format
function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
