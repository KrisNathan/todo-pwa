import './TaskCard.css'
import { useState, useEffect, useRef } from 'react'
import { MdCheckBox, MdCheckBoxOutlineBlank, MdStar, MdStarOutline } from 'react-icons/md'

export interface TaskCardProps {
  title: string;
  dueDate: string;
  isImportant: boolean;
  isDone?: boolean;
  onDelete?: () => void;
  onToggleImportant?: () => void;
  onToggleDone?: () => void;
  onEdit?: () => void;
}

export default function TaskCard({
  title,
  dueDate,
  isImportant,
  isDone = false,
  onToggleImportant,
  onToggleDone,
  onEdit
}: TaskCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleMenuClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEdit = () => {
    setIsDropdownOpen(false);
    onEdit?.();
  };

  const handleDelete = () => {
    setIsDropdownOpen(false);
    // Add delete functionality here if needed
  };

  return (
    <div className='task-card'>
      <div className='task-card-checkbox'>
        <span onClick={onToggleDone} className='cursor-pointer'>
          <MdCheckBox size={24} color='var(--text-primary)' className={`${isDone ? 'scale-100' : 'scale-0 rotate-180 h-0'} transition-all`} />
          <MdCheckBoxOutlineBlank size={24} color='var(--text-primary)' className={`${isDone ? 'scale-0 rotate-180 h-0' : 'scale-100'} transition-all`} />
        </span>
      </div>
      <div className='task-card-content'>
        <div className='standard-bold'>{title}</div>
        <div className='standard-sub'>{dueDate}</div>
      </div>
      <div className='task-card-actions'>
        <span onClick={onToggleImportant} className='cursor-pointer'>
          {isImportant ?
            <MdStar size={24} color='#ffa500' />
            :
            <MdStarOutline size={24} color='var(--text-secondary)' />
          }
        </span>

        <div className='task-card-menu-container' ref={dropdownRef}>
          <div className='task-card-menu' onClick={handleMenuClick}>
          </div>
          {isDropdownOpen && (
            <div className='dropdown-menu'>
              <div className='dropdown-item' onClick={handleEdit}>
                Edit
              </div>
              <div className='dropdown-item' onClick={handleDelete}>
                Delete
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}