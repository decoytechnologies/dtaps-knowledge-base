'use client';

import { Edit, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Define the shape of our nested module data
export interface NestedModule {
  id: number;
  name: string;
  description: string | null;
  children: NestedModule[];
}

// A single draggable item in the list
const SortableModuleItem = ({ module, onEdit, onDelete, isSubmodule = false }: { module: NestedModule, onEdit: (module: NestedModule) => void, onDelete: (id: number) => void, isSubmodule?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: module.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={`bg-white rounded-lg flex flex-col`}>
        <div className={`flex items-center gap-4 p-4 border border-gray-200 rounded-lg ${isSubmodule ? 'ml-8' : ''}`}>
            <button {...attributes} {...listeners} className="cursor-grab text-gray-400 touch-none"><GripVertical /></button>
            <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{module.name}</h3>
                <p className="text-sm text-gray-500">{module.description}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => onEdit(module)} className="p-2 text-gray-500 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(module.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
        </div>
        {/* --- NEW: Recursively render children (sub-modules) --- */}
        {module.children && module.children.length > 0 && (
            <div className="pl-8 pt-2 space-y-2">
                {module.children.map(child => (
                    <SortableModuleItem key={child.id} module={child} onEdit={onEdit} onDelete={onDelete} isSubmodule={true} />
                ))}
            </div>
        )}
    </div>
  );
};

export default function ModuleList({ modules, setModules, onEdit, onDelete }: { modules: NestedModule[], setModules: (modules: NestedModule[]) => void, onEdit: (module: NestedModule) => void, onDelete: (id: number) => void }) {
  const sensors = useSensors(useSensor(PointerSensor, {
    // Require the mouse to move by 10 pixels before activating a drag
    activationConstraint: {
      distance: 10,
    },
  }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);
      setModules(arrayMove(modules, oldIndex, newIndex));
    }
  };

  if (modules.length === 0) {
    return <p className="text-sm text-gray-500">No modules created yet.</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage & Reorder Modules</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {modules.map((module) => (
              <SortableModuleItem key={module.id} module={module} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
