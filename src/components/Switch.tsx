import { useState } from 'react';
import { useBatterySaver } from '../hooks/useBatterySaver';

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function Switch({ 
  checked = false, 
  onChange, 
  disabled = false, 
  className = '' 
}: SwitchProps) {
    const { isBatterySaverMode } = useBatterySaver();
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (!isBatterySaverMode && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    onChange?.(newChecked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleToggle}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full 
        transition-all duration-200 ease-in-out cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
        ${isChecked 
          ? 'bg-green' 
          : 'bg-red hover:bg-red-hover'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 rounded-full bg-black
          transition-transform duration-200 ease-in-out
          ${isChecked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}
