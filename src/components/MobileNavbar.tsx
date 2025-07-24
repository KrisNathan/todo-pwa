import { MdHome, MdInsertChart, MdInsertChartOutlined, MdOutlineHome, MdOutlineSettings, MdSettings } from "react-icons/md"
import { Link, useLocation } from "react-router-dom"
import "../animations.css"

interface NavLinkProps {
  to: string;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
}

function NavLink({ to, activeIcon, inactiveIcon }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className="flex flex-1 items-center justify-center rounded-lg py-2 transition-all"
    >
      {isActive ? activeIcon : inactiveIcon}
    </Link>
  );
}

export default function MobileNavbar() {
  return (
    <nav className="w-full flex flex-row py-4">
      <NavLink 
        to="/stats"
        activeIcon={<MdInsertChart size={24} />}
        inactiveIcon={<MdInsertChartOutlined size={24} />}
      />
      <NavLink 
        to="/home"
        activeIcon={<MdHome size={24} />}
        inactiveIcon={<MdOutlineHome size={24} />}
      />
      <NavLink 
        to="/settings"
        activeIcon={<MdSettings size={24} />}
        inactiveIcon={<MdOutlineSettings size={24} />}
      />
    </nav>
  )
}