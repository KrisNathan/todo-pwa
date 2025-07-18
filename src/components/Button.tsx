interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
}

export default function Button({ children, ariaLabel, className = '', disabled = false, onClick }: ButtonProps) {
  return (
    <button className={`active:animate-(--anim-click) cursor-pointer select-none ${className} flex flex-row gap-3 px-4 py-3 rounded-2xl hover:bg-bg-secondary-hover transition-colors duration-200 text-text-default`} onClick={onClick} aria-label={ariaLabel} tabIndex={0} disabled={disabled}>
      {children}
    </button>
  )
}