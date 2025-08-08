import { MdArrowDropDown } from "react-icons/md";
import Button from "../Button";
import { useMemo, useRef } from "react";

export interface DropdownOption {
  label: string;
  value: string | number;
}

interface DropdownProps {
  selectedValue?: string | number;
  options: DropdownOption[];
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onSelect?: (value: string | number) => void; // do not setIsOpen(false) here, let onClose handle it
  className?: string;
  children?: React.ReactNode
}

export default function Dropdown({ selectedValue, options, isOpen, onOpen, onClose, onSelect, className, children }: DropdownProps) {
  const findOptionByValue = (value: string | number) => {
    return options.find(option => option.value === value) || options[0];
  };

  const unselectedOptions = useMemo(() => {
    return options.filter(option => option.value !== selectedValue);
  }, [selectedValue, options]);


  const dropdownDivRef = useRef<HTMLDivElement>(null);

  const onCloseHandler = async () => {
    if (!isOpen) return;
    dropdownDivRef.current?.classList.add("animate-(--anim-exit-slide-up)");
    await new Promise(resolve => setTimeout(resolve, 300)); // Match the duration of the slide-up animation
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

  const onSelectHandler = async (value: string | number) => {
    await onCloseHandler();
    onSelect?.(value);
  };


  return <div className={`relative ${className}`}>
    <Button
      onClick={buttonOnClickHandler}
      className="w-full"
    >
      <div className="flex flex-row">
        <div className="flex-1">{selectedValue ? findOptionByValue(selectedValue).label : options[0].label}</div>
        <MdArrowDropDown size={24} />
      </div>
    </Button>
    
    {isOpen && (
      <div ref={dropdownDivRef} className="absolute top-12 left-0 bg-secondary rounded-xl w-full flex flex-col p-2 gap-1 animate-(--anim-enter-slide-down) z-50">
        {unselectedOptions.map((option) => (
          <Button
            variant="secondary"
            key={option.value}
            className="p-2 hover:bg-secondary cursor-pointer"
            onClick={() => onSelectHandler(option.value)}
          >
            {option.label}
          </Button>
        ))}
        {children}
      </div>
    )}

    {isOpen && (
      <div className="fixed inset-0 z-40 cursor-default" onClick={outsideClickHandler}></div>
    )}
  </div>
}