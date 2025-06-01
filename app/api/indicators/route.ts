import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import type { Indicator, CreateIndicatorData } from "@/types"

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const data: CreateIndicatorData = await request.json()

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    const now = new Date().toISOString()

    const result = db
      .prepare(`
      INSERT INTO indicators (name, description, content, categories, complexity, slug, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .run(data.name, data.description, data.content, JSON.stringify(data.categories), data.complexity, slug, now, now)

    const indicator = db.prepare("SELECT * FROM indicators WHERE id = ?").get(result.lastInsertRowid) as Indicator

    return NextResponse.json({
      ...indicator,
      categories: JSON.parse(indicator.categories as string),
    })
  } catch (error) {
    console.error("Error creating indicator:", error)
    return NextResponse.json({ error: "Failed to create indicator" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const indicators = db
      .prepare(`
      SELECT id, name, description, content, categories, complexity, slug, created_at, updated_at
      FROM indicators 
      ORDER BY created_at DESC
    `)
      .all() as Indicator[]

    // Parse categories JSON
    const indicatorsWithParsedCategories = indicators.map((indicator) => ({
      ...indicator,
      categories: JSON.parse(indicator.categories as string),
    }))

    return NextResponse.json(indicatorsWithParsedCategories)
  } catch (error) {
    console.error("Error fetching indicators:", error)
    return NextResponse.json({ error: "Failed to fetch indicators" }, { status: 500 })
  }
}
