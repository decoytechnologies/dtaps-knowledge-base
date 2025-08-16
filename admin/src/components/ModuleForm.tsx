'use client';

import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast'; // Import toast

interface Module {
  id: number;
  name: string;
}

export default function ModuleForm({ modules, onModuleCreated }: { modules: Module[], onModuleCreated: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Use a loading toast to give user feedback
    const toastId = toast.loading('Creating module...');

    try {
      const response = await fetch('http://localhost:8080/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, parentId: parentId || null }),
      });
      if (!response.ok) throw new Error('Failed to create module');
      const newModule = await response.json();
      
      setName('');
      setDescription('');
      setParentId('');
      onModuleCreated();
      
      // Show a success toast
      toast.success(`Successfully created module: "${newModule.name}"`, { id: toastId });

    } catch (error) {
      console.error(error);
      // Show an error toast
      toast.error('An error occurred. Please try again.', { id: toastId });
    }
  };

  // This class string provides the correct styling for all form inputs
  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Module</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Module Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="parent" className="block text-sm font-medium text-gray-700 mb-1">Parent Module (Optional)</label>
          <select id="parent" value={parentId} onChange={(e) => setParentId(e.target.value)} className={inputClass}>
            <option value="">None (Top-level)</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>{module.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputClass} />
        </div>
        <div className="pt-4">
          <button type="submit" className="w-full inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">Create Module</button>
        </div>
      </form>
    </div>
  );
}
