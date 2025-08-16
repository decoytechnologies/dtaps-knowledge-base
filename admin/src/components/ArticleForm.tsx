'use client';

import { useState, useEffect, FormEvent } from 'react';
import dynamic from 'next/dynamic';

const EditorLoading = () => <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 text-sm text-gray-500">Loading Editor...</div>;
const TiptapEditor = dynamic(() => import('./TiptapEditor'), { ssr: false, loading: () => <EditorLoading /> });

interface Module { id: number; name: string; }
interface ArticleToEdit { id: number; title: string; content: string; moduleId: number; published: boolean; author: string | null; seoTitle: string | null; metaDescription: string | null; }

export default function ArticleForm({ modules, articleIdToEdit, onFormSubmit }: { modules: Module[], articleIdToEdit: number | null, onFormSubmit: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [published, setPublished] = useState(true);
  const [author, setAuthor] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const isEditing = articleIdToEdit !== null;

  useEffect(() => {
    if (articleIdToEdit) {
      const fetchArticle = async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/articles/${articleIdToEdit}`);
          if (!res.ok) throw new Error("Failed to fetch article data");
          const data: ArticleToEdit = await res.json();
          setTitle(data.title);
          setContent(data.content);
          setModuleId(data.moduleId.toString());
          setPublished(data.published);
          setAuthor(data.author || '');
          setSeoTitle(data.seoTitle || '');
          setMetaDescription(data.metaDescription || '');
        } catch (error) {
          console.error("Failed to fetch article for editing", error);
          setMessage('Failed to load article data.');
          setIsError(true);
        }
      };
      fetchArticle();
    }
  }, [articleIdToEdit]);

  useEffect(() => {
    if (modules.length > 0 && !moduleId) {
      setModuleId(modules[0].id.toString());
    }
  }, [modules, moduleId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const articleData = { title, content, moduleId, published, author, seoTitle, metaDescription };
    const url = isEditing ? `http://localhost:8080/api/articles/${articleIdToEdit}` : 'http://localhost:8080/api/articles';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) throw new Error(isEditing ? 'Failed to update article' : 'Failed to create article');
      
      setMessage(`Successfully ${isEditing ? 'updated' : 'created'} article!`);
      if (!isEditing) {
        setTitle(''); setContent(''); setAuthor(''); setSeoTitle(''); setMetaDescription('');
      }
      onFormSubmit();
    } catch (error: any) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? 'Edit Article' : 'Create New Article'}</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Article Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <TiptapEditor content={content} onChange={setContent} />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div>
              <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">Module</label>
              <select id="module" value={moduleId} onChange={(e) => setModuleId(e.target.value)} required className={inputClass}>
                {modules.length === 0 ? <option>Create a module first</option> : modules.map((module) => <option key={module.id} value={module.id}>{module.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} />
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800">SEO Settings</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                  <input type="text" id="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea id="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-6">
          <button type="submit" className="inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            {isEditing ? 'Save Changes' : 'Create Article'}
          </button>
          <div className="flex items-center">
            <input id="published" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-900">Publish immediately</label>
          </div>
        </div>
      </form>
      {message && <p className={`mt-4 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
    </div>
  );
}