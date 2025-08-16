import { ApiResponse, SingleArticle } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function getModules(): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_URL}/api/modules`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch modules");
    return res.json();
  } catch (error) {
    console.error("Error fetching modules:", error);
    return { data: [] };
  }
}

export async function getArticleBySlug(slug: string): Promise<SingleArticle | null> {
  try {
    const res = await fetch(`${API_URL}/api/articles/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Error fetching article by slug (${slug}):`, error);
    return null;
  }
}

export async function getAllArticleSlugs(): Promise<{ slug: string }[]> {
  try {
    const res = await fetch(`${API_URL}/api/article-slugs`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching article slugs:", error);
    return [];
  }
}

// New function to get all articles for the homepage
export async function getAllArticles(): Promise<SingleArticle[]> {
    try {
        const res = await fetch(`${API_URL}/api/admin/articles`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Error fetching all articles:", error);
        return [];
    }
}