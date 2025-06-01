import { notFound } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Calendar, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import db from "@/lib/db"
import type { Article } from "@/types"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const article = db.prepare("SELECT * FROM articles WHERE slug = ? AND status = 'published'").get(slug) as
      | Article
      | undefined

    if (!article) return null

    // Increment view count
    db.prepare("UPDATE articles SET views = views + 1 WHERE id = ?").run(article.id)

    return {
      ...article,
      tags: JSON.parse(article.tags as string),
    }
  } catch (error) {
    console.error("Error fetching article:", error)
    return null
  }
}

async function getRelatedArticles(currentId: number, tags: string[]): Promise<Article[]> {
  try {
    const articles = db
      .prepare(`
      SELECT id, title, excerpt, created_at, slug
      FROM articles 
      WHERE status = 'published' AND id != ?
      ORDER BY created_at DESC
      LIMIT 4
    `)
      .all(currentId) as Article[]

    return articles
  } catch (error) {
    console.error("Error fetching related articles:", error)
    return []
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.id, article.tags)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <main className="flex-1 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
              Home
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
              Day Trading
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-sm text-gray-900">{article.title}</span>
          </nav>

          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>

          {/* Article Header */}
          <header className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-6">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
              <Eye className="w-4 h-4 ml-4" />
              <span>{article.views.toLocaleString()} views</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-6">{article.excerpt}</p>

            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        </main>

        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0">
          {/* Trading Indicators */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded"></div>
              My Trading Indicators
            </h4>

            <div className="space-y-4">
              {[
                { name: "Cumulative TICK", desc: "NYSE TICK cumulative indicator for market sentiment" },
                { name: "Advance/Decline", desc: "NYSE advancing vs declining issues ratio" },
                { name: "Volume Profile", desc: "Price level volume analysis for key levels" },
                { name: "Market Internals", desc: "Comprehensive market breadth indicators" },
              ].map((indicator) => (
                <div key={indicator.name} className="border-l-4 border-blue-600 pl-4">
                  <div className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
                    {indicator.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{indicator.desc}</div>
                </div>
              ))}
            </div>

            <Link
              href="/indicators"
              className="block w-full mt-4 bg-gray-100 text-gray-700 py-2 text-center rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              View All Indicators
            </Link>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Related Articles</h4>
              <div className="space-y-4">
                {relatedArticles.map((relatedArticle) => (
                  <div key={relatedArticle.id} className="pb-4 border-b border-gray-100 last:border-b-0">
                    <Link
                      href={`/articles/${relatedArticle.slug}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer text-sm leading-tight"
                    >
                      {relatedArticle.title}
                    </Link>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(relatedArticle.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <Footer />
    </div>
  )
}
