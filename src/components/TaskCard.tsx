import './TaskCard.css'
import { useState, useEffect, useRef } from 'react'
import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md'

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
          {isDone ? <MdCheckBox size={24} color='var(--text-primary)' /> : <MdCheckBoxOutlineBlank size={24} color='var(--text-primary)' />}
        </span>
      </div>
      <div className='task-card-content'>
        <div className='standard-bold'>{title}</div>
        <div className='standard-sub'>{dueDate}</div>
      </div>
      <div className='task-card-actions'>
        <div 
          className='star-icon'
          onClick={onToggleImportant}
          style={{ color: isImportant ? '#ffa500' : 'var(--text-secondary)' }}
        >
          {isImportant ? '★' : '☆'}
        </div>
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