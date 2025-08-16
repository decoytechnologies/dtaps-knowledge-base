'use client';

import { Edit, Trash2 } from 'lucide-react';

interface Module {
  id: number;
  name: string;
  description: string | null;
}

export default function ModuleList({ modules, onEdit, onDelete }: { modules: Module[], onEdit: (module: Module) => void, onDelete: (id: number) => void }) {
  if (modules.length === 0) {
    return <p className="text-sm text-gray-500">No modules created yet.</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Existing Modules</h2>
      <ul className="space-y-4">
        {modules.map((module) => (
          <li key={module.id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">{module.name}</h3>
              <p className="text-sm text-gray-500">{module.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit(module)} className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
              <button onClick={() => onDelete(module.id)} className="p-2 text-gray-500 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}