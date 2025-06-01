import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import type { Article, CreateArticleData } from "@/types"

export async function GET() {
  try {
    const articles = db
      .prepare(`
      SELECT id, title, excerpt, content, tags, status, views, slug, created_at, updated_at, published_at
      FROM articles 
      WHERE status = 'published'
      ORDER BY created_at DESC
    `)
      .all() as Article[]

    // Parse tags JSON
    const articlesWithParsedTags = articles.map((article) => ({
      ...article,
      tags: JSON.parse(article.tags as string),
    }))

    return NextResponse.json(articlesWithParsedTags)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const data: CreateArticleData = await request.json()

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    const now = new Date().toISOString()
    const publishedAt = data.status === "published" ? now : null

    const result = db
      .prepare(`
      INSERT INTO articles (title, excerpt, content, tags, status, slug, created_at, updated_at, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .run(data.title, data.excerpt, data.content, JSON.stringify(data.tags), data.status, slug, now, now, publishedAt)

    const article = db.prepare("SELECT * FROM articles WHERE id = ?").get(result.lastInsertRowid) as Article

    return NextResponse.json({
      ...article,
      tags: JSON.parse(article.tags as string),
    })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
