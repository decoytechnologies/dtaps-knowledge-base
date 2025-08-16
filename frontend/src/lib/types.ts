export interface ArticleLink {
  id: number;
  title: string;
  slug: string;
}

export interface Module {
  id: number;
  name: string;
  description: string;
  articles: ArticleLink[];
}

export interface ApiResponse {
  data: Module[];
}

export interface SingleArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  author: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  module: {
    id: number;
    name: string;
  };
}