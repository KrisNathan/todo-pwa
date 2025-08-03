import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Button from "../../../components/Button";
import FullScreenModal from "../../../components/modal/FullScreenModal";
import TextBox from "../../../components/textbox/TextBox";
import DateTimePicker from "../../../components/DateTimePicker";
import useTodoStore from "../../../stores/todoStore";

export default function NewTask() {
  const navigate = useNavigate();
  const addTask = useTodoStore((state) => state.addTask);
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const isValid = useMemo(() => taskTitle.trim().length > 0, [taskTitle]);

  const handleCreateTask = () => {
    if (taskTitle.trim()) {
      addTask({
        title: taskTitle.trim(),
        completed: false,
        dueDate: dueDate || undefined,
        isImportant: false,
        listId: "default" // You may want to get this from context or props
      });
      navigate('/');
    }
  };

  return (
    <FullScreenModal className="flex flex-col gap-4 p-4 bg-background">
      <div className="flex flex-row gap-2">
        <div className="typography-regular flex-1">New Task</div>
        <Button variant="text" className="text-red" onClick={() => navigate('/')}>Cancel</Button>
      </div>
      
      <div className="typography-large">What should your new task be called? 🗿❓</div>
      <TextBox 
        placeholder="Do something" 
        value={taskTitle}
        onChange={setTaskTitle}
      />
      
      <div className="typography-large">When is it due? ⏰</div>
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
          onClick={handleCreateTask}
          disabled={!isValid}
        >
          Done
        </Button>
      </div>
    </FullScreenModal>
  )
}