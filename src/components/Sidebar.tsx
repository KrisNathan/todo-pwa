import { useState } from 'react'
import IconBtn from './IconBtn'
import NavItem from './NavItem'
import CreateListModal from './CreateListModal'
import useTodoStore from '../stores/todoStore'
import './Sidebar.css'
import { MdAdd, MdStar, MdTaskAlt } from 'react-icons/md'

export default function Sidebar() {
  const { lists, addList } = useTodoStore();
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);

  const handleCreateList = (listData: { title: string; icon: string }) => {
    // Create new list with unique ID
    const newList = {
      id: crypto.randomUUID(),
      title: listData.title,
      icon: listData.icon
    };

    // Add to store
    addList(newList);
    
    // Close modal
    setIsCreateListModalOpen(false);
  };

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
        <IconBtn
          onClick={() => setIsCreateListModalOpen(true)}
          label='New List'
          icon={<MdAdd size={24} />}
        />

        <div className="list-items">
          {lists.map((list) => (
            <NavItem
              key={list.id}
              to={`/tasks/lists/${list.id}`}
              title={list.title}
              icon={list.icon}
            />
          ))}
        </div>
      </div>

      {/* Create List Modal */}
      <CreateListModal
        isOpen={isCreateListModalOpen}
        onClose={() => setIsCreateListModalOpen(false)}
        onCreateList={handleCreateList}
        existingLists={lists}
      />
    </div>
  )
}
