import WorkspaceDropdown from "../components/dropdown/WorkspaceDropdown";
import CenteredMessage from "../components/CenteredMessage";
import { MdAdd } from "react-icons/md";
import FloatingActionButton from "../components/FloatingActionButton";
import { useNavigate } from "react-router-dom";
import useTodoStore from "../stores/todoStore";
import { useMemo } from "react";
import TaskCard from "../components/TaskCard";
import TodoFilter from "../utils/todoFilter";

export default function HomePage() {
  const navigate = useNavigate();

  const allTasks = useTodoStore((state) => state.tasks);
  const currentWorkspaceId = useTodoStore((state) => state.currentWorkspaceId);
  const tasks = useMemo(() => {
    return TodoFilter.byWorkspaceId(allTasks, currentWorkspaceId);
  }, [allTasks, currentWorkspaceId]);

  const overdueTasks = useMemo(() => {
    return TodoFilter.overdue(tasks);
  }, [tasks]);

  const todayTasks = useMemo(() => {
    return TodoFilter.today(tasks);
  }, [tasks]);

  const futureTasks = useMemo(() => {
    return TodoFilter.future(tasks);
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return TodoFilter.completed(tasks);
  }, [tasks]);

  const handleNewTask = () => {
    navigate('/task/new');
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <WorkspaceDropdown />
      {tasks.length == 0 ?
        <CenteredMessage icon='😴' message="No tasks yet!" />
        :
        <>
          {overdueTasks.length > 0 &&
            <div className="typography-medium text-red text-center select-none">Overdue</div>
          }
          {overdueTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}

          {todayTasks.length > 0 &&
            <div className="typography-medium text-center select-none">Today</div>
          }
          {todayTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}

          {futureTasks.length > 0 &&
            <div className="typography-medium text-text-secondary text-center select-none">Future</div>
          }
          {futureTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}

          {completedTasks.length > 0 &&
            <div className="typography-medium text-text-secondary text-center select-none">Completed</div>
          }
          {completedTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </>
      }

      <FloatingActionButton
        onClick={handleNewTask}
        icon={<MdAdd className="w-6 h-6" />}
        className="bg-primary hover:bg-primary-dark"
      />
    </div>
  )
}