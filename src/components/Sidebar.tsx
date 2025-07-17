import { useState } from 'react'
import IconBtn from './IconBtn'
import NavItem from './NavItem'
import Modal from './Modal'
import './Sidebar.css'
import { MdAdd, MdStar, MdTaskAlt, MdSave, MdCancel } from 'react-icons/md'

export default function Sidebar() {
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [listName, setListName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📝');

  const defaultEmojis = [
    '📝', '📋', '✅', '📌', '🎯', '💼', '🏠', '🛒', 
    '🎵', '📚', '💡', '🎨', '🏃‍♂️', '🍕', '✈️', '🎮',
    '💻', '📱', '🎬', '🧘‍♀️', '🌟', '🔥', '💎', '🌈'
  ];

  const handleCreateList = () => {
    // TODO: Implement list creation logic
    console.log('Creating list:', { 
      name: listName, 
      icon: selectedEmoji 
    });
    
    // Reset form and close modal
    setListName('');
    setSelectedEmoji('📝');
    setIsCreateListModalOpen(false);
  };

  const handleModalClose = () => {
    setListName('');
    setSelectedEmoji('📝');
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
          <NavItem to='/tasks/lists/Moai' title="Moai" icon="📝" />
        </div>
      </div>

      {/* Create List Modal */}
      <Modal
        isOpen={isCreateListModalOpen}
        onClose={handleModalClose}
        title="Create New List"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Icon
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl bg-bg-secondary-hover rounded-lg p-2 border border-border">
                  {selectedEmoji}
                </div>
                <span className="text-sm text-text-secondary">Selected icon</span>
              </div>
              <div className="grid grid-cols-8 gap-2 p-3 bg-bg-secondary rounded-lg border border-border max-h-32 overflow-y-auto">
                {defaultEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-xl p-2 rounded-lg transition-colors duration-200 hover:bg-bg-secondary-hover
                              ${selectedEmoji === emoji ? 'bg-blue-500/20 border border-blue-500' : 'border border-transparent'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              List Name *
            </label>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-text-primary placeholder-text-secondary"
              placeholder="Enter list name..."
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleModalClose}
              className="px-4 py-2 text-text-secondary hover:bg-bg-secondary-hover rounded-lg 
                         transition-colors duration-200 flex items-center gap-2"
            >
              <MdCancel size={20} />
              Cancel
            </button>
            <button
              onClick={handleCreateList}
              disabled={!listName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                         transition-colors duration-200 flex items-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
            >
              <MdSave size={20} />
              Create List
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
