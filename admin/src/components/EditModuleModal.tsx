'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Module {
  id: number;
  name: string;
  description: string | null;
}

export default function EditModuleModal({
  module,
  onClose,
  onModuleUpdated,
}: {
  module: Module | null;
  onClose: () => void;
  onModuleUpdated: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // When a module is selected for editing, populate the form fields
  useEffect(() => {
    if (module) {
      setName(module.name);
      setDescription(module.description || '');
    }
  }, [module]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!module) return;

    try {
      const response = await fetch(`http://localhost:8080/api/modules/${module.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update module');
      }

      onModuleUpdated(); // Tell the dashboard to refresh the list
      onClose(); // Close the modal
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    }
  };

  if (!module) {
    return null; // Don't render anything if no module is being edited
  }

  return (
    // This is the modal overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Module</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Module Name</label>
            <input
              type="text"
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="pt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}