import Button from "./Button";

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function IconButton({ icon, label, className = '', disabled = false, onClick }: IconButtonProps) {
  return (
    <Button onClick={onClick} ariaLabel={label} className={className} disabled={disabled}>
      {icon}
      {label}
    </Button>
  )
}