import { useParams } from "react-router-dom";
import useTodoStore from "../stores/todoStore";

export default function List() {
  const params = useParams();
  const listId = params.listId || 'default';

  const todoStore = useTodoStore();
  const list = todoStore.getListById(listId);

  return (
    <div>
      <h1 className="title select-none">{list?.icon} {list?.title}</h1>
    </div>
  );
}