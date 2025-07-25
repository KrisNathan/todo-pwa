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
  onSelect?: (value: string | number) => void;
}

export default function Dropdown({ selectedValue, options, isOpen, onOpen, onClose, onSelect }: DropdownProps) {
  const findOptionByValue = (value: string | number) => {
    return options.find(option => option.value === value) || options[0];
  };

  const unselectedOptions = useMemo(() => {
    return options.filter(option => option.value !== selectedValue);
  }, [selectedValue, options]);


  const dropdownDivRef = useRef<HTMLDivElement>(null);
  const onCloseHandler = () => {
    if (!isOpen) return;
    dropdownDivRef.current?.classList.add("animate-(--anim-exit-slide-up)");
    setTimeout(() => {
      if (dropdownDivRef.current) {
        dropdownDivRef.current.classList.remove("animate-(--anim-exit-slide-up)");
      }
      onClose?.();
    }, 300); // Match the duration of the slide-up animation
  };

  return <Button
    className="relative"
    onClick={isOpen ? onCloseHandler : onOpen}
  >
    <div className="flex flex-row">
      <div className="flex-1">{selectedValue ? findOptionByValue(selectedValue).label : options[0].label}</div>
      <MdArrowDropDown size={24} />
    </div>

    {isOpen && (
      <>
        <div ref={dropdownDivRef} className="absolute top-12 left-0 bg-secondary rounded-xl w-full flex flex-col p-2 gap-1 animate-(--anim-enter-slide-down)">
          {unselectedOptions.map((option) => (
            <Button
              variant="secondary"
              key={option.value}
              className="p-2 hover:bg-secondary cursor-pointer"
              onClick={() => onSelect?.(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="inset-0" onClick={onClose}></div>
      </>
    )}

  </Button>
}