import { getArticleBySlug, getAllArticleSlugs } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { User, Clock, Share2 } from 'lucide-react';
import AiSummary from "@/components/AiSummary";

export const dynamic = 'force-dynamic'; // Ensures page is rendered dynamically

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Not Found" };
  return {
    title: article.seoTitle || article.title,
    description: article.metaDescription || "Knowledge base article for DTAPS",
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return notFound();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <article className="bg-card p-8 sm:p-12 rounded-2xl border border-border">
            <header className="mb-10">
              <p className="text-base font-semibold text-primary">{article.module.name}</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-card-foreground sm:text-5xl">
                {article.title}
              </h1>
            </header>
            <AiSummary content={article.content} />
            <div
              className="prose prose-lg dark:prose-invert max-w-none mt-8 prose-img:rounded-xl prose-img:shadow-lg prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        </div>
        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            <div className="bg-card p-6 rounded-2xl border border-border">
              <h3 className="font-semibold text-card-foreground mb-4">Article Info</h3>
              <dl className="space-y-4 text-sm text-muted-foreground">
                {article.author && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <dd>{article.author}</dd>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <dd>Updated on {new Date(article.updatedAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border">
              <h3 className="font-semibold text-card-foreground mb-4">Share this article</h3>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-transparent rounded-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}