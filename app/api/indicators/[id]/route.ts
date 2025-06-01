import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import type { Indicator, CreateIndicatorData } from "@/types"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()

    const data: CreateIndicatorData = await request.json()
    const indicatorId = Number.parseInt(params.id)

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    const now = new Date().toISOString()

    db.prepare(`
      UPDATE indicators 
      SET name = ?, description = ?, content = ?, categories = ?, complexity = ?, slug = ?, updated_at = ?
      WHERE id = ?
    `).run(
      data.name,
      data.description,
      data.content,
      JSON.stringify(data.categories),
      data.complexity,
      slug,
      now,
      indicatorId,
    )

    const indicator = db.prepare("SELECT * FROM indicators WHERE id = ?").get(indicatorId) as Indicator

    return NextResponse.json({
      ...indicator,
      categories: JSON.parse(indicator.categories as string),
    })
  } catch (error) {
    console.error("Error updating indicator:", error)
    return NextResponse.json({ error: "Failed to update indicator" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()

    const indicatorId = Number.parseInt(params.id)
    db.prepare("DELETE FROM indicators WHERE id = ?").run(indicatorId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting indicator:", error)
    return NextResponse.json({ error: "Failed to delete indicator" }, { status: 500 })
  }
}
