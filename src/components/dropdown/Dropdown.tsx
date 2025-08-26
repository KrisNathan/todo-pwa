import { useRef } from "react";
import Button, { type ButtonVariant } from "../Button";

export type DropdownAlignment = "left" | "right";

interface DropdownProps {
  children: React.ReactNode;
  label: React.ReactNode;
  isOpen?: boolean;
  onOpen: () => void;
  onClose: () => void;
  buttonVariant?: ButtonVariant;
  className?: string;
  isFitContent?: boolean;
  alignment?: DropdownAlignment;
}

export default function Dropdown({ children, label, isOpen, onOpen, onClose, className, buttonVariant, isFitContent, alignment }: DropdownProps) {
  const dropdownDivRef = useRef<HTMLDivElement>(null);

  const onCloseHandler = async () => {
    if (!isOpen) return;
    dropdownDivRef.current?.classList.add("animate-(--anim-exit-slide-up)");
    await new Promise(resolve => setTimeout(resolve, 400)); // 100ms longer than anim duration to prevent flicker
    if (dropdownDivRef.current) {
      dropdownDivRef.current.classList.remove("animate-(--anim-exit-slide-up)");
    }
    onClose?.();
  }

  const buttonOnClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isOpen) {
      onCloseHandler();
    } else {
      onOpen?.();
    }
  };

  const outsideClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onCloseHandler();
  };

  return <div className={`relative ${className}`}>
    <Button
      variant={buttonVariant}
      onClick={buttonOnClickHandler}
      className="w-full"
    >
      <div className="flex flex-row">
        {label}
      </div>
    </Button>

    {isOpen && (
      <div ref={dropdownDivRef} className={`absolute top-12 bg-secondary rounded-xl flex flex-col p-2 gap-1 animate-(--anim-enter-slide-down) z-50 ${isFitContent ? 'w-fit' : 'w-full'} ${alignment === 'right' ? 'right-0' : 'left-0'}`}>
        {children}
      </div>
    )}

    {isOpen && (
      <div className="fixed inset-0 z-40 cursor-default" onClick={outsideClickHandler}></div>
    )}
  </div>
}