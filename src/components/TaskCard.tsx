import './TaskCard.css'
import { useState, useEffect, useRef } from 'react'
import { MdCheckBox, MdCheckBoxOutlineBlank, MdDelete, MdEdit, MdStar, MdStarOutline } from 'react-icons/md'
import ContextMenu from './ContextMenu';

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


  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const handleMenuClick = () => {
    // setIsDropdownOpen(!isDropdownOpen);
    // setMousePosition({ x: window.event?.clientX || 0, y: window.event?.clientY || 0 });
    setIsContextMenuOpen(!isContextMenuOpen);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    mousePosition.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div className='task-card' onMouseMove={onMouseMove}>
      <ContextMenu
        position={mousePosition.current}
        isOpen={isContextMenuOpen}
        onClose={() => {
          setIsContextMenuOpen(false);
        }}
        items={[
          { label: 'Edit', onClick: onEdit || (() => { }), icon: <MdEdit size={20} /> },
          { label: 'Delete', onClick: () => console.log('Delete Task'), icon: <MdDelete size={20} /> },
        ]}
      />
      <button
        onClick={onToggleDone}
        onContextMenu={(e) => {
          e.preventDefault();
          handleMenuClick();
        }}
        className='text-left flex flex-row flex-1 p-0 m-0 cursor-pointer'
      >
        <div className='task-card-checkbox'>
          <span className='cursor-pointer'>
            <MdCheckBox size={24} color='var(--text-primary)' className={`${isDone ? 'scale-100' : 'scale-0 rotate-180 h-0'} transition-all`} />
            <MdCheckBoxOutlineBlank size={24} color='var(--text-primary)' className={`${isDone ? 'scale-0 rotate-180 h-0' : 'scale-100'} transition-all`} />
          </span>
        </div>
        <div className='task-card-content'>
          <div className='standard-bold'>{title}</div>
          <div className='standard-sub'>{dueDate}</div>
        </div>
      </button>

      <div className='task-card-actions'>
        <span onClick={onToggleImportant} className='cursor-pointer'>
          {isImportant ?
            <MdStar size={24} color='#ffa500' />
            :
            <MdStarOutline size={24} color='var(--text-secondary)' />
          }
        </span>

      </div>
    </div>
  )
}