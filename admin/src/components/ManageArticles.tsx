'use client';

import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  published: boolean;
  updatedAt: string;
  module: {
    name: string;
  };
}

export default function ManageArticles({ articles, onEdit, onDelete }: { articles: Article[], onEdit: (id: number) => void, onDelete: (id: number) => void }) {
  if (articles.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-10">No articles created yet. Select "New Article" to get started.</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Articles</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.module.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {article.published ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <XCircle className="w-3 h-3" /> Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(article.updatedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(article.id)} className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(article.id)} className="p-2 text-gray-500 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}