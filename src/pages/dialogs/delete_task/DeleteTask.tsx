import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import Button from "../../../components/Button";
import FullScreenModal from "../../../components/modal/FullScreenModal";
import useTodoStore from "../../../stores/todoStore";

export default function DeleteTask() {
  const deleteTask = useTodoStore((state) => state.removeTask);
  const getTaskById = useTodoStore((state) => state.getTaskById);
  const [countdown, setCountdown] = useState(2);

  const param = useParams();
  const taskId = param.taskId;

  const task = useMemo(() => {
    return getTaskById(taskId || '');
  }, [getTaskById, taskId])

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!taskId || !task) {
    return (
      <Navigate to='/' />
    )
  }

  const handleDeleteTask = () => {
    deleteTask(taskId);
    navigate('/');
  }

  return (
    <FullScreenModal className="flex flex-col gap-4 p-4 bg-background">
      <div className="flex flex-row gap-2">
        <div className="typography-regular flex-1">Deleting Task</div>
        <Button variant="text" className="text-accent" onClick={() => navigate('/')}>Cancel</Button>
      </div>

      <div className="typography-large">Are you sure you wish to delete task '{task.title}'?</div>
      <div className="typography-regular text-red">This action cannot be reverted!</div>

      <div className="flex-1"></div>
      <div className="flex flex-row gap-2">
        <Button
          variant="danger"
          className="flex-1 !text-center"
          onClick={handleDeleteTask}
          disabled={countdown > 0}
        >
          Delete{countdown > 0 ? ` (${countdown}s)` : ''}
        </Button>
      </div>
    </FullScreenModal>
  )
}