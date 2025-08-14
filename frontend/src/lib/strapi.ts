import { StrapiModuleResponse, StrapiSingleArticle } from "./types";

// (The getModulesWithArticles function remains the same, no changes needed here)
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
    const response = await fetch(url.toString(), { cache: "no-cache" });
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

// FIX: This function is now corrected to handle the API response properly.
export async function getArticleBySlug(slug: string): Promise<StrapiSingleArticle | null> {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!apiUrl) {
    throw new Error("STRAPI_API_URL is not defined.");
  }

  const url = new URL("/api/articles", apiUrl);
  url.searchParams.set("filters[slug][$eq]", slug);
  // Populate all fields for the article
  url.searchParams.set("populate", "*");

  try {
    const response = await fetch(url.toString(), { cache: "no-cache" });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    // When filtering, the API returns an array. We need the first item.
    if (data.data && data.data.length > 0) {
      return data.data[0] as StrapiSingleArticle;
    }
    return null;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }
}