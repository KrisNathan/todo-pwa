import './NavItem.css';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface NavItemProps {
  to: string;
  title: string;
  icon: React.ReactNode;
}

export default function NavItem({to, title, icon }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`nav-item active:animate-(--anim-click) ${isActive ? "active" : ""}`}>
      {icon}
      {title}
    </Link>
  )
}