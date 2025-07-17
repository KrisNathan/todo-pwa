import './NavItem.css'
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface NavItemProps {
  to: string;
  title: string;
  icon: React.ReactNode;
}

export default function NavItem({ to, title, icon }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`active:animate-(--anim-click) cursor-pointer select-none ${isActive ? "active" : ""} flex flex-row gap-3 py-3 px-4 rounded-2xl hover:bg-bg-secondary-hover transition-colors duration-200 animate-(--anim-slide-up)`}>
      {icon}
      <div>
        {title}
      </div>
    </Link>
  )
}