'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ModuleForm from '@/components/ModuleForm';
import ModuleList from '@/components/ModuleList';
import EditModuleModal from '@/components/EditModuleModal';
import ManageArticles from '@/components/ManageArticles';
import { FilePlus, PenSquare, LayoutList, BookOpen } from 'lucide-react';

const ArticleForm = dynamic(() => import('@/components/ArticleForm'), { 
  ssr: false,
  loading: () => <p className="p-8 text-center text-gray-500">Loading Editor...</p> 
});

// Define types for our data
interface Module {
  id: number;
  name: string;
  description: string | null;
}

interface Article {
  id: number;
  title: string;
  published: boolean;
  updatedAt: string;
  module: {
    name: string;
  };
}

// Sidebar component with all navigation tabs
const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => (
  <aside className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
    <div className="h-16 flex items-center px-6">
      <h1 className="text-xl font-bold text-gray-800">Creator Hub</h1>
    </div>
    <nav className="px-4 py-4 space-y-2">
      <p className="px-4 text-xs font-semibold text-gray-500 uppercase">Create</p>
      <button onClick={() => setActiveTab('new-module')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'new-module' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
        <FilePlus className="w-5 h-5" />
        New Module
      </button>
      <button onClick={() => setActiveTab('new-article')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'new-article' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
        <PenSquare className="w-5 h-5" />
        New Article
      </button>
      <p className="px-4 pt-4 text-xs font-semibold text-gray-500 uppercase">Manage</p>
      <button onClick={() => setActiveTab('manage-modules')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'manage-modules' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
        <LayoutList className="w-5 h-5" />
        Manage Modules
      </button>
      <button onClick={() => setActiveTab('manage-articles')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'manage-articles' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
        <BookOpen className="w-5 h-5" />
        Manage Articles
      </button>
    </nav>
  </aside>
);

export default function CreatorDashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState('manage-articles');
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
      const [modulesRes, articlesRes] = await Promise.all([
        fetch('http://localhost:8080/api/admin/modules'),
        fetch('http://localhost:8080/api/admin/articles')
      ]);
      if (!modulesRes.ok || !articlesRes.ok) throw new Error("Failed to fetch data");
      const modulesData = await modulesRes.json();
      const articlesData = await articlesRes.json();
      setModules(modulesData);
      setArticles(articlesData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleEditModule = (module: Module) => setEditingModule(module);

  const handleDeleteModule = async (id: number) => {
    if (confirm('Are you sure you want to delete this module? This cannot be undone.')) {
      try {
        await fetch(`http://localhost:8080/api/modules/${id}`, { method: 'DELETE' });
        fetchAllData();
      } catch (error) {
        alert('Failed to delete module.');
      }
    }
  };

  const handleEditArticle = (id: number) => {
    setEditingArticleId(id);
    setActiveTab('edit-article');
  };

  const handleDeleteArticle = async (id: number) => {
    if (confirm('Are you sure you want to delete this article? This cannot be undone.')) {
      try {
        await fetch(`http://localhost:8080/api/articles/${id}`, { method: 'DELETE' });
        fetchAllData();
      } catch (error) {
        alert('Failed to delete article.');
      }
    }
  };

  const handleFormSubmit = () => {
    fetchAllData();
    setActiveTab('manage-articles');
    setEditingArticleId(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'new-module':
        return <ModuleForm onModuleCreated={fetchAllData} />;
      case 'new-article':
        return <ArticleForm modules={modules} articleIdToEdit={null} onFormSubmit={handleFormSubmit} />;
      case 'edit-article':
        return <ArticleForm modules={modules} articleIdToEdit={editingArticleId} onFormSubmit={handleFormSubmit} />;
      case 'manage-modules':
        return <ModuleList modules={modules} onEdit={handleEditModule} onDelete={handleDeleteModule} />;
      case 'manage-articles':
      default:
        return <ManageArticles articles={articles} onEdit={handleEditArticle} onDelete={handleDeleteArticle} />;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 p-8 bg-gray-50">{renderContent()}</div>
      </main>
      <EditModuleModal module={editingModule} onClose={() => setEditingModule(null)} onModuleUpdated={fetchAllData} />
    </div>
  );
}