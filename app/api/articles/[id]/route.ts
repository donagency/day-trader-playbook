import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import type { Article, CreateArticleData } from "@/types"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()

    const data: CreateArticleData = await request.json()
    const articleId = Number.parseInt(params.id)

    // Generate slug from title if needed
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    const now = new Date().toISOString()
    const publishedAt = data.status === "published" ? now : null

    db.prepare(`
      UPDATE articles 
      SET title = ?, excerpt = ?, content = ?, tags = ?, status = ?, slug = ?, updated_at = ?, published_at = ?
      WHERE id = ?
    `).run(
      data.title,
      data.excerpt,
      data.content,
      JSON.stringify(data.tags),
      data.status,
      slug,
      now,
      publishedAt,
      articleId,
    )

    const article = db.prepare("SELECT * FROM articles WHERE id = ?").get(articleId) as Article

    return NextResponse.json({
      ...article,
      tags: JSON.parse(article.tags as string),
    })
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()

    const articleId = Number.parseInt(params.id)
    db.prepare("DELETE FROM articles WHERE id = ?").run(articleId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
