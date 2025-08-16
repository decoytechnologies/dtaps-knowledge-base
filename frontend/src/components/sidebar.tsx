'use client';

import { Module } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar({ modules }: { modules: Module[] }) {
  const pathname = usePathname();
  const [openModules, setOpenModules] = useState<number[]>([]);

  useEffect(() => {
    const currentArticleSlug = pathname.split('/docs/')[1];
    if (currentArticleSlug) {
      const activeModule = modules.find(m => m.articles.some(a => a.slug === currentArticleSlug));
      if (activeModule && !openModules.includes(activeModule.id)) {
        setOpenModules(prev => [...prev, activeModule.id]);
      }
    }
  }, [pathname, modules, openModules]);

  const toggleModule = (id: number) => {
    setOpenModules(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-80 bg-card border-r border-border flex-shrink-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold text-card-foreground">DTAPS Docs</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {modules.map(module => {
          const isOpen = openModules.includes(module.id);
          return (
            <div key={module.id}>
              <button onClick={() => toggleModule(module.id)} className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-muted-foreground rounded-lg hover:bg-secondary">
                <span>{module.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  {module.articles.map(article => {
                    const href = `/docs/${article.slug}`;
                    const isActive = pathname === href;
                    return (
                      <Link key={article.id} href={href} className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-secondary'}`}>
                        <Book className="w-4 h-4" />
                        <span>{article.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}