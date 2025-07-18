import useTodoStore from "../stores/todoStore";
import TaskCardLogic from "../components/TaskCardLogic";

export default function ImportantTasks() {
  const todoStore = useTodoStore();
  const importantTasks = todoStore.getImportantTasks();
  return (
    <div>
      <h1 className="title select-none">Important Tasks</h1>
      <div className="flex flex-col gap-1">
        {importantTasks.map(task => (
          <TaskCardLogic key={task.id} taskId={task.id} />
        ))}
      </div>
    </div>
  )
}