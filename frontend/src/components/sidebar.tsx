'use client';

import { Module, ArticleLink } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, ChevronRight, Folder } from "lucide-react";
import { useState, useEffect } from "react";

// A single, recursive component for rendering modules and their children
const ModuleItem = ({ module, currentSlug }: { module: Module, currentSlug: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Check if any article within this module or its sub-modules is active
  const containsActiveArticle = (mod: Module): boolean => {
    if (mod.articles.some(a => a.slug === currentSlug)) return true;
    // FIX: Add a check to ensure mod.children exists before calling .some()
    return mod.children && mod.children.some(child => containsActiveArticle(child));
  };

  // Automatically open the module if it contains the active article
  useEffect(() => {
    if (containsActiveArticle(module)) {
      setIsOpen(true);
    }
  }, [currentSlug, module]);


  const hasContent = module.articles.length > 0 || (module.children && module.children.length > 0);

  return (
    <div>
      <button 
        onClick={() => hasContent && setIsOpen(!isOpen)} 
        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${hasContent ? 'cursor-pointer' : 'cursor-default'} ${isOpen ? 'text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
      >
        <div className="flex items-center gap-3">
          <Folder className="w-4 h-4" />
          <span>{module.name}</span>
        </div>
        {hasContent && <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />}
      </button>
      
      {isOpen && (
        <div className="pl-5 border-l-2 border-gray-200 dark:border-gray-700 ml-5 mt-1 space-y-1">
          {/* Render sub-modules recursively */}
          {module.children && module.children.map(child => (
            <ModuleItem key={child.id} module={child} currentSlug={currentSlug} />
          ))}
          {/* Render articles */}
          {module.articles.map(article => {
            const href = `/docs/${article.slug}`;
            const isActive = currentSlug === article.slug;
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
};


export default function Sidebar({ modules }: { modules: Module[] }) {
  const pathname = usePathname();
  const currentSlug = pathname.split('/docs/')[1] || '';

  return (
    <aside className="w-80 bg-card border-r border-border flex-shrink-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold text-card-foreground">DTAPS Docs</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {modules.map(module => (
          <ModuleItem key={module.id} module={module} currentSlug={currentSlug} />
        ))}
      </nav>
    </aside>
  );
}
