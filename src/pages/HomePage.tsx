import WorkspaceDropdown from "../components/dropdown/WorkspaceDropdown";
import CenteredMessage from "../components/CenteredMessage";
import { MdAdd } from "react-icons/md";
import FloatingActionButton from "../components/FloatingActionButton";
import { useNavigate } from "react-router-dom";
import useTodoStore from "../stores/todoStore";
import { useMemo } from "react";
import TaskCard from "../components/TaskCard";

export default function HomePage() {
  const navigate = useNavigate();

  const { tasks } = useTodoStore();

  // Tasks with:
  // dueDate earlier than now
  // completed is false
  const overdueTasks = useMemo(() => {
    return tasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date() && !task.completed);
  }, [tasks]);

  // Tasks with:
  // dueDate later than now
  // earlier than tomorrow
  // completed is false
  const todayTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter(task => task.dueDate &&
      new Date(task.dueDate).toDateString() === now.toDateString() &&
      new Date(task.dueDate) >= now &&
      !task.completed
    );
  }, [tasks]);

  // Tasks with:
  // dueDate later than tomorrow
  // completed is false
  const futureTasks = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(now.getDate() + 1);
    return tasks.filter(task => task.dueDate ? 
      new Date(task.dueDate) >= tomorrow && !task.completed : 
      !task.completed
    );
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks.filter(task => task.completed);
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