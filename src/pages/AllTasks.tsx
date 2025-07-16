import "./AllTasks.css"
import TaskCard from "../components/TaskCard";

import { useState } from "react";

export default function AllTasks() {

  const [isTaskImportant, setIsTaskImportant] = useState(false);
  const [isTaskDone, setIsTaskDone] = useState(false);
  return (
    <div className="all-tasks-container">
      <div className="all-tasks-header">
        <div className="title select-none">All Tasks</div>
        <div className="subtitle select-none">Hello User!</div>
      </div>
      <div className="flex flex-col gap-1">

        <TaskCard
          title="Sample Task"
          dueDate="2023-10-31"
          isImportant={isTaskImportant}
          onToggleImportant={() => setIsTaskImportant(!isTaskImportant)}
          isDone={isTaskDone}
          onToggleDone={() => setIsTaskDone(!isTaskDone)}
          onEdit={() => console.log("Edit Task")}
        />
        <TaskCard
          title="Sample Task"
          dueDate="2023-10-31"
          isImportant={isTaskImportant}
          onToggleImportant={() => setIsTaskImportant(!isTaskImportant)}
          isDone={isTaskDone}
          onToggleDone={() => setIsTaskDone(!isTaskDone)}
          onEdit={() => console.log("Edit Task")}
        />
      </div>
    </div>
  );
}