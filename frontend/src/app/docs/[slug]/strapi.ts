import { StrapiModuleResponse, StrapiSingleArticle } from "./types";

export async function getModulesWithArticles(): Promise<StrapiModuleResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  
  if (!apiUrl) {
    console.error("STRAPI_API_URL is not defined in environment variables.");
    return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
  }

  const url = new URL("/api/modules", apiUrl);
  url.searchParams.set("populate[articles][fields][0]", "title");
  url.searchParams.set("populate[articles][fields][1]", "slug");

  try {
    // FIX: Change caching strategy for production builds
    const response = await fetch(url.toString(), { next: { revalidate: 60 } });

    if (!response.ok) {
      console.error(`Strapi API Error: ${response.status} ${response.statusText}`);
      return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.data)) {
      console.error("Malformed data received from Strapi:", data);
      return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
    }
    return data as StrapiModuleResponse;
  } catch (error) {
    console.error("Failed to fetch modules from Strapi:", error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
  }
}

export async function getArticleBySlug(slug: string): Promise<StrapiSingleArticle | null> {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!apiUrl) {
    throw new Error("STRAPI_API_URL is not defined.");
  }

  const url = new URL("/api/articles", apiUrl);
  url.searchParams.set("filters[slug][$eq]", slug);
  url.searchParams.set("populate", "*");

  try {
    // FIX: Change caching strategy for production builds
    const response = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data[0] as StrapiSingleArticle;
    }
    return null;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }
}

export async function getAllArticleSlugs(): Promise<{ slug: string }[]> {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!apiUrl) { return []; }

  const url = new URL("/api/articles", apiUrl);
  url.searchParams.set("fields[0]", "slug");
  url.searchParams.set("pagination[pageSize]", "100");

  try {
    // FIX: Change caching strategy for production builds
    const response = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!response.ok) { return []; }
    
    const data = await response.json();
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((item: { slug: string }) => ({ slug: item.slug }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching article slugs:", error);
    return [];
  }
}