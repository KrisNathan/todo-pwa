import { useState } from "react";
import Button from "./Button";
import { MdCalendarToday } from "react-icons/md";

interface DateTimePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

export default function DateTimePicker({ value, onChange, placeholder, disabled = false, clearable = true, className = '' }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const date = value;
  const setDate = onChange
  // const [date, setDate] = useState<Date | null>(null);

  const setToToday = () => {
    const today = new Date();
    setDate(today);
    onChange(today);
  }

  const setToTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow);
    onChange(tomorrow);
  }

  const clear = () => {
    setDate(null);
  }

  return (
    <div className='relative'>
      <Button className={`bg-bg-secondary ${className}`} onClick={() => setIsOpen(!isOpen)} disabled={disabled}>
        <MdCalendarToday />
        {date ? date.toLocaleString() : placeholder}
      </Button>

      {/* Dropdown */}
      {isOpen &&
        <>
          <div className="absolute top  right-0 bg-bg-secondary rounded-2xl shadow-lg p-4 z-50 animate-(--anim-slide-down)">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <Button className="bg-bg" onClick={setToToday}>
                  Today
                </Button>
                <Button className="bg-bg" onClick={setToTomorrow}>
                  Tomorrow
                </Button>
              </div>
              <input
                type="date"
                className="rounded-2xl px-3 py-2 bg-bg"
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  setDate(selectedDate);
                  onChange(selectedDate);
                }}
                value={date ? date.toISOString().slice(0, 10) : ''}
              />
              <input
                type="time"
                className="rounded-2xl px-3 py-2 bg-bg"
                onChange={(e) => {
                  if (date) {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const updatedDate = new Date(date);
                    updatedDate.setHours(hours, minutes);
                    setDate(updatedDate);
                    onChange(updatedDate);
                  }
                }}
                value={date ? date.toTimeString().slice(0, 5) : ''}
              />
            </div>
            {clearable && date &&
              <button className="mt-2 text-red-500 hover:text-red-700" onClick={clear} >
                Clear
              </button>
            }
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