import Button from "./Button";

interface IconBtnProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function IconBtn({ icon, label, className = '', disabled = false, onClick }: IconBtnProps) {
  return (
    <Button onClick={onClick} ariaLabel={label} className={className} disabled={disabled}>
      {icon}
      {label}
    </Button>
  )
}