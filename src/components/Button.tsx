import { useBatterySaver } from '../hooks/useBatterySaver';

export type ButtonVariant = "primary" | "secondary" | "text" | "danger";
interface ButtonProps {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
}

const getVariantClass = (variant: ButtonVariant) => {
  switch (variant) {
    case "primary":
      return "bg-primary hover:bg-primary-hover";
    case "secondary":
      return "bg-secondary hover:bg-secondary-hover";
    case "text":
      return "bg-transparent hover:bg-secondary-hover";
    case "danger":
      return "bg-red hover:bg-red-hover text-white";
    default:
      return "";
  }
};

export default function Button({ children, onClick, className, variant = "primary", disabled = false }: ButtonProps) {
  const { isBatterySaverMode } = useBatterySaver();

  const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    event.stopPropagation();
    
    // Only vibrate if not in battery saver mode and vibration is supported
    if (!isBatterySaverMode && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    onClick?.(event);
  };
  return (
    <button
      className={`px-4 py-2 rounded-xl text-left select-none transition-all ${
        disabled 
          ? 'cursor-not-allowed opacity-50' 
          : 'cursor-pointer active:animate-(--anim-click)'
      } typography-regular ${getVariantClass(variant)} ${className}`}
      onClick={onClickHandler}
      disabled={disabled}
    >
      {children}
    </button>
  );
}