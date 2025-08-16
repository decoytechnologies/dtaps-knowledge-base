import { getAllArticles } from "@/lib/api";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const articles = await getAllArticles();
  const topArticles = articles.slice(0, 6); // Show the 6 most recent articles

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-card border border-border rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-card-foreground mb-6">Top Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topArticles.map(article => (
            <Link href={`/docs/${article.slug}`} key={article.id} className="block p-6 bg-secondary rounded-lg hover:bg-primary/10 transition-colors">
              <BookOpen className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-card-foreground mb-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground">In {article.module.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}