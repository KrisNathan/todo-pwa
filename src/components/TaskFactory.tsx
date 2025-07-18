import { useMemo, useState } from "react";
import useTodoStore from "../stores/todoStore";
import { MdAdd } from "react-icons/md";
import FloatingActionButton from "./FloatingActionButton";
import DateTimePicker from "./DateTimePicker";

export default function TaskFactory() {
  const todoStore = useTodoStore();

  const [title, setTitle] = useState("");
  const trimmedTitle = useMemo(() => title.trim(), [title]);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const handleCreateTask = () => {
    if (trimmedTitle) {
      todoStore.addTask({
        listId: todoStore.lists.length > 0 ? todoStore.lists[0].id : "",
        title: trimmedTitle,
        dueDate: dueDate ? dueDate : undefined,
        isImportant: false,
        completed: false,
      });
      setTitle("");
      setDueDate(null);
    }
  };

  return (
    <>
      <FloatingActionButton
        onClick={handleCreateTask}
        icon={<MdAdd size={24} />}
        label="Add Task"
        position="bottom-right"
        variant="primary"
        size="lg"
        className="md:hidden"
      />
      <div className="hidden md:flex w-full flex-row gap-2">
        <input
          type="text"
          placeholder="Create a new task"
          className="flex-1 p-4 rounded-2xl bg-bg-secondary text-text-default placeholder:text-text-secondary"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateTask();
            }
          }}
        />
        <DateTimePicker 
          value={dueDate}
          onChange={setDueDate}
          placeholder="Select due date"
          clearable={true}
          disabled={false}
          className="w-12 h-12 rounded-full items-center justify-center"
        />
        <button
          className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full bg-bg-primary hover:bg-bg-primary-hover transition-colors  cursor-pointer active:animate-(--anim-click)"
          onClick={handleCreateTask}
          style={{ aspectRatio: "1 / 1" }}
        >
          <MdAdd size={24} />
        </button>
      </div>
    </>
  )
}