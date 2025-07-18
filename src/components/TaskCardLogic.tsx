import { useMemo } from "react";
import useTodoStore from "../stores/todoStore";
import TaskCard from "./TaskCard";

interface TaskCardLogicProps {
  taskId: string;
}

export default function TaskCardLogic({ taskId }: TaskCardLogicProps) {
  const todoStore = useTodoStore();
  const task = useMemo(() => todoStore.getTaskById(taskId), [todoStore, taskId]);

  const handleToggleDone = () => {
    todoStore.updateTask(taskId, { completed: !task?.completed });

    navigator.vibrate(50);
  };

  const handleToggleImportant = () => {
    todoStore.updateTask(taskId, { isImportant: !task?.isImportant });
  };

  const handleEdit = () => {
    console.log("Edit Task", taskId);
    // Implement edit functionality here
  };

  return <TaskCard
    title={task?.title || ""}
    dueDate={task?.dueDate?.toDateString()}
    isImportant={task?.isImportant || false}
    isDone={task?.completed || false}

    onToggleImportant={handleToggleImportant}
    onToggleDone={handleToggleDone}
    onEdit={handleEdit}
    key={taskId}
  />
}