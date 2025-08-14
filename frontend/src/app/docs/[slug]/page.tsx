import { getArticleBySlug, getAllArticleSlugs } from "@/lib/strapi";
import { notFound } from "next/navigation";

// This function tells Next.js which pages to pre-build.
// It is a best practice and solves the build-time type error.
export async function generateStaticParams() {
  const articles = await getAllArticleSlugs();

  // Ensure we have a valid array before mapping
  if (!articles || !Array.isArray(articles)) {
    return [];
  }

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// This is the final, robust component definition.
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return notFound();
  }

  const { title, content } = article;

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}