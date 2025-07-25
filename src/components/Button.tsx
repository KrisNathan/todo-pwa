import { useBatterySaver } from '../hooks/useBatterySaver';

type Variant = "primary" | "secondary";
interface ButtonProps {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: Variant;
}

const getVariantClass = (variant: Variant) => {
  switch (variant) {
    case "primary":
      return "bg-primary hover:bg-primary-hover";
    case "secondary":
      return "bg-secondary hover:bg-secondary-hover";
    default:
      return "";
  }
};

export default function Button({ children, onClick, className, variant = "primary" }: ButtonProps) {
  const { isBatterySaverMode } = useBatterySaver();

  const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    
    // Only vibrate if not in battery saver mode and vibration is supported
    if (!isBatterySaverMode && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    onClick?.(event);
  };
  return (
    <button
      className={`px-4 py-2 rounded-xl text-left cursor-pointer select-none transition-all active:animate-(--anim-click) ${getVariantClass(variant)} ${className}`}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
}