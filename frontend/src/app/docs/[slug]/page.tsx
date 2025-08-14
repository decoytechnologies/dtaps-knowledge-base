import { getArticleBySlug } from "@/lib/strapi";
import { notFound } from "next/navigation";

// This is the final, simplified, and correct component definition.
// We define the type for the props directly in the function signature.
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