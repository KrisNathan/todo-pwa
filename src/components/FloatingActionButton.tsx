import type { ReactNode } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  className?: string;
  disabled?: boolean;
  showTooltip?: boolean;
}

const positionClasses = {
  'bottom-right': 'fixed bottom-6 right-6',
  'bottom-left': 'fixed bottom-6 left-6',
  'top-right': 'fixed top-6 right-6',
  'top-left': 'fixed top-6 left-6'
};

const sizeClasses = {
  sm: 'w-12 h-12 text-lg',
  md: 'w-14 h-14 text-xl',
  lg: 'w-16 h-16 text-2xl'
};

const variantClasses = {
  primary: 'bg-bg-primary hover:bg-bg-primary-hover text-white shadow-blue-500/25',
  secondary: 'bg-bg-secondary hover:bg-bg-secondary-hover text-text-primary shadow-black/10',
  success: 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/25',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25'
};

export default function FloatingActionButton({
  onClick,
  icon,
  label,
  position = 'bottom-right',
  size = 'md',
  variant = 'primary',
  className = '',
  disabled = false,
  showTooltip = true
}: FloatingActionButtonProps) {
  return (
    <div className={`${positionClasses[position]} z-50 group`}>
      {/* Tooltip */}
      {showTooltip && label && (
        <div className={`
          absolute ${position.includes('right') ? 'right-full mr-3' : 'left-full ml-3'} 
          top-1/2 transform -translate-y-1/2
          px-3 py-2 bg-gray-900 text-white text-sm rounded-lg
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          pointer-events-none whitespace-nowrap
          before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-1/2
          ${position.includes('right') 
            ? 'before:left-full before:border-l-gray-900 before:border-l-4 before:border-y-transparent before:border-y-4 before:border-r-0' 
            : 'before:right-full before:border-r-gray-900 before:border-r-4 before:border-y-transparent before:border-y-4 before:border-l-0'
          }
        `}>
          {label}
        </div>
      )}
      
      {/* Button */}
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-200 ease-out
          active:animate-(--anim-click)
          hover:shadow-xl hover:scale-105
          focus:outline-none focus:ring-4 focus:ring-blue-500/30
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${className}
        `}
        aria-label={label}
      >
        {icon}
      </button>
    </div>
  );
}

// Extended FAB with text label (for larger screens)
interface ExtendedFABProps extends Omit<FloatingActionButtonProps, 'showTooltip'> {
  extended?: boolean;
}

export function ExtendedFloatingActionButton({
  onClick,
  icon,
  label,
  position = 'bottom-right',
  size = 'md',
  variant = 'primary',
  className = '',
  disabled = false,
  extended = false
}: ExtendedFABProps) {
  if (!extended) {
    return (
      <FloatingActionButton
        onClick={onClick}
        icon={icon}
        label={label}
        position={position}
        size={size}
        variant={variant}
        className={className}
        disabled={disabled}
      />
    );
  }

  const extendedSizeClasses = {
    sm: 'h-12 px-4 text-sm',
    md: 'h-14 px-6 text-base',
    lg: 'h-16 px-8 text-lg'
  };

  return (
    <div className={`${positionClasses[position]} z-50`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          ${extendedSizeClasses[size]}
          ${variantClasses[variant]}
          rounded-full shadow-lg
          flex items-center justify-center gap-3
          transition-all duration-200 ease-out
          active:animate-(--anim-click)
          hover:shadow-xl hover:scale-105
          focus:outline-none focus:ring-4 focus:ring-blue-500/30
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${className}
        `}
        aria-label={label}
      >
        {icon}
        {label && <span className="font-medium">{label}</span>}
      </button>
    </div>
  );
}
