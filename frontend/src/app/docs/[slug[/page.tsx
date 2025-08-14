import { getArticleBySlug } from "@/lib/strapi";
import { notFound } from "next/navigation";

// Define the shape of the page's props for clarity and type safety.
interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// This is the final, correct structure for the page component.
// It receives the props object and safely accesses the slug inside.
export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  // If the API doesn't find an article for the given slug, show a 404 page.
  if (!article) {
    return notFound();
  }

  // Access the title and content directly from the flat article object.
  const { title, content } = article;

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}