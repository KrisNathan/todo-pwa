type Variant = "primary" | "secondary";
interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
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
  const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigator.vibrate(50);
    onClick?.();
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