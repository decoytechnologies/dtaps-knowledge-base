'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Module, SingleArticle } from '@/lib/types';
import Link from 'next/link';

export default function Topbar({ articles, modules }: { articles: SingleArticle[], modules: Module[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ type: string; name: string; slug?: string; moduleName?: string }[]>([]);

  useEffect(() => {
    if (query.length > 2) {
      const lowerQuery = query.toLowerCase();
      const articleResults = articles
        .filter(a => a.title.toLowerCase().includes(lowerQuery) || a.content.toLowerCase().includes(lowerQuery))
        .map(a => ({ type: 'Article', name: a.title, slug: a.slug, moduleName: a.module.name }));
      
      const moduleResults = modules
        .filter(m => m.name.toLowerCase().includes(lowerQuery))
        .map(m => ({ type: 'Module', name: m.name }));

      setResults([...articleResults, ...moduleResults]);
    } else {
      setResults([]);
    }
  }, [query, articles, modules]);

  return (
    <header className="h-16 flex-shrink-0 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none"
        />
        {results.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg z-20">
            <ul>
              {results.map((result, index) => (
                <li key={index}>
                  {result.slug ? (
                    <Link href={`/docs/${result.slug}`} onClick={() => setQuery('')} className="block p-3 hover:bg-secondary">
                      <p className="font-semibold">{result.name}</p>
                      <p className="text-xs text-muted-foreground">{result.type} in {result.moduleName}</p>
                    </Link>
                  ) : (
                    <div className="p-3">
                      <p className="font-semibold">{result.name}</p>
                      <p className="text-xs text-muted-foreground">{result.type}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}