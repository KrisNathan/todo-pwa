import "./AllTasks.css"
import TaskCardLogic from "../components/TaskCardLogic";
import TaskFactory from "../components/TaskFactory";
import useTodoStore from "../stores/todoStore";

export default function AllTasks() {
  const todoStore = useTodoStore();
  const tasks = todoStore.tasks;
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="all-tasks-header">
        <div className="title select-none">All Tasks</div>
        <div className="subtitle select-none">Hello User!</div>
      </div>
      <TaskFactory />
      <div className="flex flex-col gap-1 flex-1">
        {tasks.map((task) => (
          <TaskCardLogic
            key={task.id}
            taskId={task.id}
          />
        ))}
      </div>
    </div>
  );
}