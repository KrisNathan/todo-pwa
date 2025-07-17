import { useState } from 'react';
import Modal from './Modal';
import { MdSave, MdCancel } from 'react-icons/md';
import type { List } from '../stores/todoStore';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateList: (list: Omit<List, 'id'>) => void;
  existingLists: List[];
}

export default function CreateListModal({ 
  isOpen, 
  onClose, 
  onCreateList, 
  existingLists 
}: CreateListModalProps) {
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
    const nameExists = existingLists.some(list => list.title.toLowerCase() === normalizedName);
    
    if (nameExists) {
      setNameError('A list with this name already exists');
      return;
    }

    // Create new list
    const newList = {
      title: listName.trim(),
      icon: selectedEmoji
    };

    onCreateList(newList);
    
    // Reset form and close modal
    resetForm();
  };

  const resetForm = () => {
    setListName('');
    setSelectedEmoji('📝');
    setNameError('');
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
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
      const nameExists = existingLists.some(list => list.title.toLowerCase() === normalizedName);
      if (nameExists) {
        setNameError('A list with this name already exists');
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Create New List"
      size="md"
    >
      <div className="space-y-4">
        {/* Icon Selection */}
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
            <div className="flex flex-wrap gap-1  justify-center p-3 bg-bg-secondary rounded-lg border border-border max-h-32 overflow-y-auto">
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
        
        {/* List Name Input */}
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
        
        {/* Action Buttons */}
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
  );
}
