"use client";

import { Module } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar({ modules }: { modules: Module[] }) {
  const pathname = usePathname();

  // Filter for valid modules to prevent rendering errors
  const validModules = Array.isArray(modules)
    ? modules.filter((module) => module && module.name && Array.isArray(module.articles))
    : [];

  return (
    <aside className="w-72 bg-secondary flex-shrink-0 border-r border-border/60 hidden md:flex flex-col">
      {/* Logo/Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/60 flex-shrink-0">
        <h1 className="text-xl font-bold text-foreground">DTAPS Docs</h1>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {validModules.map((module) => (
          <div key={module.id}>
            <h2 className="px-4 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {module.name}
            </h2>
            <div className="space-y-1">
              {module.articles.map((article) => {
                const href = `/docs/${article.slug}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={article.id}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {article.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}