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
    <button className={`icon-btn active:animate-(--anim-click) select-none ${className}`} onClick={onClick} aria-label={label} tabIndex={0} disabled={disabled}>
      {icon}
      {label}
    </button>
  )
}