import Database from "better-sqlite3"
import { hash } from "bcryptjs"
import path from "path"

const dbPath = path.join(process.cwd(), "database.sqlite")
const db = new Database(dbPath)

// Initialize database tables
export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Articles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      views INTEGER DEFAULT 0,
      slug TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      published_at DATETIME
    )
  `)

  // Indicators table
  db.exec(`
    CREATE TABLE IF NOT EXISTS indicators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      categories TEXT NOT NULL,
      complexity TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create default admin user if not exists
  const adminExists = db.prepare("SELECT id FROM users WHERE email = ?").get("admin@daytraderplaybook.com")

  if (!adminExists) {
    const hashedPassword = hash("admin123", 12)
    db.prepare(`
      INSERT INTO users (email, password, name)
      VALUES (?, ?, ?)
    `).run("admin@daytraderplaybook.com", hashedPassword, "Admin User")
  }

  // Insert sample data if tables are empty
  const articleCount = db.prepare("SELECT COUNT(*) as count FROM articles").get() as { count: number }

  if (articleCount.count === 0) {
    insertSampleData()
  }
}

function insertSampleData() {
  // Sample articles
  const sampleArticles = [
    {
      title: "NQ Futures Breakout Strategy: How I Caught the 21470 Level",
      excerpt:
        "Today's NQ session showed a perfect example of our cumulative TICK divergence setup. The market pushed through key resistance at 21470 with strong momentum...",
      content: `<h2>The Market Setup - Long Conditions Persist</h2>
<p>This morning's NQ session presented one of those textbook setups that every breakout trader dreams of. The market had been consolidating near the 21450-21470 resistance zone for several days, with multiple failed attempts to break higher.</p>
<p>What made today different was the underlying market internals, particularly the cumulative TICK behavior that I've been tracking throughout the week.</p>`,
      tags: JSON.stringify(["NQ", "Breakout", "TICK", "Support/Resistance"]),
      status: "published",
      slug: "nq-futures-breakout-strategy-21470-level",
      views: 1247,
      published_at: new Date().toISOString(),
    },
    {
      title: "Advanced/Decline Analysis: Why the NYSE TICK Matters for NQ Traders",
      excerpt:
        "Understanding the relationship between NYSE advance/decline data and NQ price action can give you a significant edge in your day trading...",
      content: `<h2>Understanding Market Breadth</h2>
<p>The NYSE TICK indicator provides crucial insights into market sentiment and internal strength...</p>`,
      tags: JSON.stringify(["NYSE", "TICK", "Analysis", "Market Structure"]),
      status: "published",
      slug: "advance-decline-analysis-nyse-tick-nq-traders",
      views: 956,
      published_at: new Date().toISOString(),
    },
  ]

  const insertArticle = db.prepare(`
    INSERT INTO articles (title, excerpt, content, tags, status, slug, views, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  sampleArticles.forEach((article) => {
    insertArticle.run(
      article.title,
      article.excerpt,
      article.content,
      article.tags,
      article.status,
      article.slug,
      article.views,
      article.published_at,
    )
  })

  // Sample indicators
  const sampleIndicators = [
    {
      name: "Cumulative TICK Indicator",
      description:
        "Master the most powerful market sentiment indicator used by professional NQ traders to identify momentum extremes and confirm breakout setups.",
      content: `<h2>What is the Cumulative TICK Indicator?</h2>
<p>The Cumulative TICK indicator is a running total of the NYSE TICK readings that provides a real-time measure of market sentiment and internal strength...</p>`,
      categories: JSON.stringify(["Market Breadth", "Sentiment"]),
      complexity: "intermediate",
      slug: "cumulative-tick-indicator",
    },
    {
      name: "Advance/Decline Line Analysis",
      description:
        "The classic measure of market breadth. Track the cumulative difference between advancing and declining stocks to assess the internal health and strength of market moves.",
      content: `<h2>Understanding the Advance/Decline Line</h2>
<p>The Advance/Decline Line is one of the most fundamental market breadth indicators...</p>`,
      categories: JSON.stringify(["Market Breadth"]),
      complexity: "beginner",
      slug: "advance-decline-line-analysis",
    },
  ]

  const insertIndicator = db.prepare(`
    INSERT INTO indicators (name, description, content, categories, complexity, slug)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  sampleIndicators.forEach((indicator) => {
    insertIndicator.run(
      indicator.name,
      indicator.description,
      indicator.content,
      indicator.categories,
      indicator.complexity,
      indicator.slug,
    )
  })
}

// Initialize database on import
initializeDatabase()

export default db
