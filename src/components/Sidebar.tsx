import { useState } from 'react'
import IconBtn from './IconBtn'
import NavItem from './NavItem'
import Modal from './Modal'
import useTodoStore from '../stores/todoStore'
import './Sidebar.css'
import { MdAdd, MdStar, MdTaskAlt, MdSave, MdCancel } from 'react-icons/md'

export default function Sidebar() {
  const { lists, addList } = useTodoStore();
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [listName, setListName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📝');
  const [nameError, setNameError] = useState('');

  const defaultEmojis = [
    '📝', '📋', '✅', '📌', '🎯', '💼', '🏠', '🛒', 
    '🎵', '📚', '💡', '🎨', '🏃‍♂️', '🍕', '✈️', '🎮',
    '💻', '📱', '🎬', '🧘‍♀️', '🌟', '🔥', '💎', '🌈'
  ];

  const handleCreateList = () => {
    if (!listName.trim()) return;

    // Check if list name already exists (case-insensitive)
    const normalizedName = listName.trim().toLowerCase();
    const nameExists = lists.some(list => list.title.toLowerCase() === normalizedName);
    
    if (nameExists) {
      setNameError('A list with this name already exists');
      return;
    }

    // Create new list with unique ID
    const newList = {
      id: crypto.randomUUID(),
      title: listName.trim(),
      icon: selectedEmoji
    };

    // Add to store
    addList(newList);
    
    // Reset form and close modal
    setListName('');
    setSelectedEmoji('📝');
    setNameError('');
    setIsCreateListModalOpen(false);
  };

  const handleModalClose = () => {
    setListName('');
    setSelectedEmoji('📝');
    setNameError('');
    setIsCreateListModalOpen(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setListName(newName);
    
    // Clear error when user starts typing
    if (nameError) {
      setNameError('');
    }
    
    // Real-time validation for duplicate names
    if (newName.trim()) {
      const normalizedName = newName.trim().toLowerCase();
      const nameExists = lists.some(list => list.title.toLowerCase() === normalizedName);
      if (nameExists) {
        setNameError('A list with this name already exists');
        navigator.vibrate(50);
      }
    }
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
              onChange={handleNameChange}
              className={`w-full px-3 py-2 bg-bg-primary border rounded-lg 
                         focus:outline-none focus:ring-2 focus:border-transparent
                         text-text-primary placeholder-text-secondary
                         ${nameError 
                           ? 'border-red-500 focus:ring-red-500' 
                           : 'border-border focus:ring-blue-500'
                         }`}
              placeholder="Enter list name..."
              autoFocus
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <span>⚠️</span>
                {nameError}
              </p>
            )}
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
              disabled={!listName.trim() || !!nameError}
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
