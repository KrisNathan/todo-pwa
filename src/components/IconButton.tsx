import { useBatterySaver } from "../hooks/useBatterySaver";

type Variant = "primary" | "secondary";
interface IconButtonProps {
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

export default function IconButton({ children, onClick, className, variant = "primary" }: IconButtonProps) {
  const { isBatterySaverMode } = useBatterySaver();

  const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isBatterySaverMode && 'vibrate' in navigator) {
      navigator.vibrate(40);
    }
    onClick?.(event);
  };
  return (
    <button
      className={`p-2 rounded-xl text-left cursor-pointer select-none transition-all active:animate-(--anim-click) ${getVariantClass(variant)} ${className}`}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
}