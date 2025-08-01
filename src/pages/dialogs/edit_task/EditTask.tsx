import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Button from "../../../components/Button";
import FullScreenModal from "../../../components/modal/FullScreenModal";
import TextBox from "../../../components/textbox/TextBox";
import DateTimePicker from "../../../components/DateTimePicker";
import useTodoStore from "../../../stores/todoStore";

export default function EditTask() {
  const updateTask = useTodoStore((state) => state.updateTask);
  const getTaskById = useTodoStore((state) => state.getTaskById);

  const param = useParams();
  const taskId = param.taskId;

  const task = useMemo(() => {
    return getTaskById(taskId || '');
  }, [getTaskById, taskId])

  const navigate = useNavigate();
  const [taskTitle, setTaskTitle] = useState(task?.title || "");
  const [dueDate, setDueDate] = useState<Date | null>(task?.dueDate || null);

  if (!taskId || !task) {
    return (
      <Navigate to='/' />
    )
  }

  const handleEditTask = () => {
    updateTask(taskId, {
      title: taskTitle.trim(),
      dueDate: dueDate || undefined,
    });
    navigate('/');
  }

  return (
    <FullScreenModal className="flex flex-col gap-4 p-4 bg-background">
      <div className="flex flex-row gap-2">
        <div className="typography-regular flex-1">Edit Task</div>
        <Button variant="text" className="text-red" onClick={() => navigate('/')}>Cancel</Button>
      </div>

      <div className="typography-large">What should your task be renamed to? 🗿❓</div>
      <TextBox
        placeholder="Do something"
        value={taskTitle}
        onChange={setTaskTitle}
      />

      <div className="typography-large">How about the due? ⏰</div>
      <DateTimePicker
        placeholder="Select due date and time (optional)"
        value={dueDate}
        onChange={setDueDate}
      />

      <div className="flex-1"></div>
      <div className="flex flex-row gap-2">
        <Button
          variant="primary"
          className="flex-1 !text-center"
          onClick={handleEditTask}
        >
          Done
        </Button>
      </div>
    </FullScreenModal>
  )
}