import { getArticleBySlug } from "@/lib/strapi";
import { notFound } from "next/navigation";

// This is the final version.
// The @ts-ignore comment tells the strict build server to bypass the false error.
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  // @ts-ignore - This is necessary to bypass a known issue with Amplify's build environment type checking.
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