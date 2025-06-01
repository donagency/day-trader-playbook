export interface User {
  id: number
  email: string
  password: string
  name: string
  created_at: string
}

export interface Article {
  id: number
  title: string
  excerpt: string
  content: string
  tags: string[]
  status: "draft" | "published" | "scheduled"
  views: number
  created_at: string
  updated_at: string
  published_at?: string
  slug: string
}

export interface Indicator {
  id: number
  name: string
  description: string
  content: string
  categories: string[]
  complexity: "beginner" | "intermediate" | "advanced"
  slug: string
  created_at: string
  updated_at: string
}

export interface CreateArticleData {
  title: string
  excerpt: string
  content: string
  tags: string[]
  status: "draft" | "published" | "scheduled"
}

export interface CreateIndicatorData {
  name: string
  description: string
  content: string
  categories: string[]
  complexity: "beginner" | "intermediate" | "advanced"
}
