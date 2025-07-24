import { Outlet } from "react-router-dom";
import Titlebar from "../components/Titlebar";

export default function PageLayout() {
  return (
    <div className="flex flex-col h-full w-full p-4 gap-4">
      <Titlebar />
      <Outlet />
    </div>
  );
}