import { MdCheckBox, MdCheckBoxOutlineBlank, MdDelete, MdEdit } from "react-icons/md";
import type { Task } from "../interfaces/task";
import ContextMenu from "./ContextMenu";
import { useCallback, useRef, useState } from "react";
import useTodoStore from "../stores/todoStore";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  task: Task;

}

export default function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate();
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  const { updateTask } = useTodoStore();

  const toggleCompletion = useCallback(() => {
    navigator.vibrate(50);
    updateTask(task.id, { completed: !task.completed });
  }, [task.id, task.completed, updateTask]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContextMenuOpen(true);
    mousePosition.current = { x: e.clientX, y: e.clientY };
    navigator.vibrate(75);
  };

  const handleEdit = () => { navigate(`/task/edit/${task.id}`) }

  const handleDelete = () => { navigate(`/task/delete/${task.id}`) }

  return (
    <>
      <button
        onClick={toggleCompletion}
        onContextMenu={handleContextMenu}
        className="flex flex-row gap-1 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-hover transition-colors items-center text-left"
      >
        <div className="flex-1 flex flex-col">
          <div className={`typography-regular text-text-primary ${task.completed ? 'line-through text-text-secondary' : ''}`}>
            {task.title}
          </div>
          <div className={`typography-small text-accent ${task.completed ? 'line-through text-text-secondary' : ''}`}>
            {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date set'}
          </div>
        </div>
        {task.completed ?
          <MdCheckBox size={24} color="var(--fun-color-primary)" />
          :
          <MdCheckBoxOutlineBlank size={24} color="var(--fun-color-primary)" />
        }
      </button>
      <ContextMenu
        position={mousePosition.current}
        isOpen={isContextMenuOpen}
        onClose={() => {
          setIsContextMenuOpen(false);
        }}
        items={[
          { label: 'Edit', onClick: handleEdit, icon: <MdEdit size={20} /> },
          { label: 'Delete', onClick: handleDelete, icon: <MdDelete size={20} /> },
        ]}
      />
    </>
  )
}