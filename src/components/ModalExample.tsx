import { useState } from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';
import { MdSave, MdCancel } from 'react-icons/md';

// Example usage of the Modal component
export default function ModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Modal Component Examples</h1>
      
      {/* Trigger buttons */}
      <div className="space-x-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Open Modal
        </button>
        
        <button
          onClick={() => setIsConfirmModalOpen(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Open Confirm Modal
        </button>
      </div>

      {/* Basic Modal Example */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New List"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              List Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter list name..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter description..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-text-secondary hover:bg-bg-secondary-hover rounded-lg transition-colors flex items-center gap-2"
            >
              <MdCancel size={20} />
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle save logic here
                setIsModalOpen(false);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <MdSave size={20} />
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Structured Modal Example using Modal components */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        size="sm"
        showCloseButton={false}
      >
        <ModalHeader>
          <h3 className="text-lg font-semibold text-text-primary">Confirm Delete</h3>
        </ModalHeader>
        
        <ModalBody>
          <p className="text-text-secondary">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
        </ModalBody>
        
        <ModalFooter>
          <button
            onClick={() => setIsConfirmModalOpen(false)}
            className="px-4 py-2 text-text-secondary hover:bg-bg-secondary-hover rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Handle delete logic here
              setIsConfirmModalOpen(false);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
