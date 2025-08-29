import { Outlet } from "react-router-dom";
import Titlebar from "../components/Titlebar";

export default function PageLayout() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4">
        <Titlebar />
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        <Outlet />
      </div>
    </div>
  );
}