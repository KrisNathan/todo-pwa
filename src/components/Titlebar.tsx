import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { MdCheckCircle, MdCheckCircleOutline, MdLocalFireDepartment } from "react-icons/md";

export default function Titlebar() {
  const location = useLocation();

  const title = useMemo(() => {
    switch (location.pathname) {
      case "/home":
        return "To Do";
      case "/stats":
        return "Stats";
      case "/settings":
        return "Settings";
      default:
        return "To Do";
    }
  }, [location.pathname]);

  return (
    <div className="w-full flex flex-row gap-4 typography-regular">
      <h1 className="select-none flex-1">{title}</h1>
      <div className="flex flex-row gap-1">
        <MdCheckCircleOutline size={24} color="var(--color-red)" />
        <span className="text-red">0</span>
      </div>
      <div className="flex flex-row gap-1">
        <MdCheckCircle size={24} color="var(--color-green)" />
        <span className="text-green">0</span>
      </div>
      <div className="flex flex-row gap-1">
        <MdLocalFireDepartment size={24} color="var(--color-yellow)" />
        <span className="text-yellow">0</span>
      </div>
    </div>
  );
}