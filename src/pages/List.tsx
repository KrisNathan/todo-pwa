import { useParams } from "react-router-dom";

export default function List() {
  const params = useParams();

  return (
    <div>
      <h1>{params.listName}</h1>
      <p>Here you can view all your tasks.</p>
    </div>
  );
}