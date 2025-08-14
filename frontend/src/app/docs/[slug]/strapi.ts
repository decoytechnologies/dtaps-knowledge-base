// Add this new function to the end of the file

// This function fetches a single article by its slug.
export async function getArticleBySlug(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!apiUrl) {
    throw new Error("STRAPI_API_URL is not defined.");
  }

  // Find the article where the 'slug' field matches the one provided.
  const url = new URL("/api/articles", apiUrl);
  url.searchParams.set("filters[slug][$eq]", slug);

  try {
    const response = await fetch(url.toString(), { cache: "no-cache" });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    // The API returns an array, so we return the first item.
    if (data.data && data.data.length > 0) {
      return data.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }
}