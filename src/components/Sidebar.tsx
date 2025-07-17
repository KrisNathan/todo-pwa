import IconBtn from './IconBtn'
import NavItem from './NavItem'
import './Sidebar.css'
import { MdAdd, MdStar, MdTaskAlt} from 'react-icons/md'

export default function Sidebar() {
  return (
    <div className="sidebar-content">
      {/* Header */}
      <div className="sidebar-header">
        <h1 className="title select-none">To Do</h1>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        <NavItem to='/tasks/all' title="All Tasks" icon={<MdTaskAlt size={24} />} />
        <NavItem to='/tasks/important' title="Important" icon={<MdStar size={24} />} />
      </div>

      {/* Lists Section */}
      <div className="sidebar-section">
        <h3 className="subtitle select-none">Lists</h3>
        <IconBtn onClick={() => {}} label='New List' icon={<MdAdd size={24} />} />
        
        <div className="list-items">
          <NavItem to='/tasks/lists/Moai' title="Moai" icon="📝" />
        </div>
      </div>
    </div>
  )
}
