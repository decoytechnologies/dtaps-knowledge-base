// This file defines the shape of the data we expect from Strapi.

export interface StrapiArticle {
  id: number;
  title: string;
  slug: string;
}

export interface Module {
  id: number;
  name: string;
  description: string;
  articles: StrapiArticle[];
}

export interface StrapiModuleResponse {
  data: Module[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// FIX: This type is now flat, with no 'attributes' property.
export interface StrapiSingleArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}