import './IconBtn.css'

interface IconBtnProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function IconBtn({ icon, label, className = '', disabled = false, onClick }: IconBtnProps) {
  return (
    <button className={`active:animate-(--anim-click) cursor-pointer select-none ${className} flex flex-row gap-3 px-4 py-3 rounded-2xl hover:bg-bg-secondary-hover transition-colors duration-200`} onClick={onClick} aria-label={label} tabIndex={0} disabled={disabled}>
      {icon}
      {label}
    </button>
  )
}