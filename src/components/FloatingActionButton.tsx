import Button from "./Button";

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
}

export default function FloatingActionButton({onClick, icon, className}: FloatingActionButtonProps) {
  return (
    <Button
      className={`fixed bottom-22 right-4 z-50! p-3! rounded-full! bg-primary text-white shadow-lg hover:bg-primary-dark transition-colors ${className}`}
      onClick={onClick}
    >
      {icon}
    </Button>
  );
}