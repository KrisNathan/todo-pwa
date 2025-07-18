import { useState } from "react";
import Button from "./Button";
import { MdCalendarToday } from "react-icons/md";

interface DateTimePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

export default function DateTimePicker({ value, onChange, label, placeholder = "Select date and time", disabled = false, clearable = true, className = '' }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
      <Button className={`bg-bg-secondary ${className}`} onClick={() => setIsOpen(!isOpen)} disabled={disabled}>
        <MdCalendarToday />
      </Button>

      {/* Dropdown */}
      {isOpen &&
        <>
          <div className="absolute top  right-0 bg-bg-secondary rounded-2xl shadow-lg p-4 z-50 animate-(--anim-slide-down)">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <Button className="bg-bg">
                  Today
                </Button>
                <Button className="bg-bg">
                  Tomorrow
                </Button>
              </div>
              <input
                type="date"
                className="rounded-2xl px-3 py-2 bg-bg"
              />
              <input
                type="time"
                className="rounded-2xl px-3 py-2 bg-bg"
              />
            </div>
          </div>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      }
    </div>
  )
}