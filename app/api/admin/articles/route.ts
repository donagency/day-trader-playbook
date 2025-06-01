import { NextResponse } from "next/server"
import db from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import type { Article } from "@/types"

export async function GET() {
  try {
    await requireAuth()

    const articles = db
      .prepare(`
      SELECT id, title, excerpt, content, tags, status, views, slug, created_at, updated_at, published_at
      FROM articles 
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
    console.error("Error fetching admin articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
