interface FullScreenModalProps {
  children: React.ReactNode;
  className?: string;
}

export default function FullScreenModal({ children, className }: FullScreenModalProps) {
  return (
    <div className={`fixed inset-0 z-50 select-none ${className}`}>
      {children}
    </div>
  );
}