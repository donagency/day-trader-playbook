import { notFound } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ArrowLeft, Clock, BarChart3 } from "lucide-react"
import Link from "next/link"
import db from "@/lib/db"
import type { Indicator } from "@/types"

interface IndicatorPageProps {
  params: {
    slug: string
  }
}

async function getIndicator(slug: string): Promise<Indicator | null> {
  try {
    const indicator = db.prepare("SELECT * FROM indicators WHERE slug = ?").get(slug) as Indicator | undefined

    if (!indicator) return null

    return {
      ...indicator,
      categories: JSON.parse(indicator.categories as string),
    }
  } catch (error) {
    console.error("Error fetching indicator:", error)
    return null
  }
}

async function getRelatedIndicators(currentId: number): Promise<Indicator[]> {
  try {
    const indicators = db
      .prepare(`
      SELECT id, name, description, complexity, slug
      FROM indicators 
      WHERE id != ?
      ORDER BY created_at DESC
      LIMIT 3
    `)
      .all(currentId) as Indicator[]

    return indicators.map((indicator) => ({
      ...indicator,
      categories: JSON.parse(indicator.categories as string),
    }))
  } catch (error) {
    console.error("Error fetching related indicators:", error)
    return []
  }
}

export default async function IndicatorPage({ params }: IndicatorPageProps) {
  const indicator = await getIndicator(params.slug)

  if (!indicator) {
    notFound()
  }

  const relatedIndicators = await getRelatedIndicators(indicator.id)

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
            Home
          </Link>
          <span className="mx-2 text-gray-400">›</span>
          <Link href="/indicators" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
            Indicators
          </Link>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-sm text-gray-900">{indicator.name}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/indicators"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Indicators
        </Link>

        {/* Indicator Header */}
        <header className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {indicator.categories.map((category) => (
              <span key={category} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {category}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{indicator.name}</h1>

          <p className="text-xl text-gray-600 leading-relaxed mb-8">{indicator.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <div
                className={`text-lg font-bold text-gray-900 mb-1 ${getComplexityColor(indicator.complexity)} inline-block px-3 py-1 rounded-full text-sm`}
              >
                {indicator.complexity.charAt(0).toUpperCase() + indicator.complexity.slice(1)}
              </div>
              <div className="text-xs text-gray-600 font-medium">Complexity</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1">Real-time</div>
              <div className="text-xs text-gray-600 font-medium">Updates</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1">NYSE</div>
              <div className="text-xs text-gray-600 font-medium">Data Source</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />5 min
              </div>
              <div className="text-xs text-gray-600 font-medium">Read Time</div>
            </div>
          </div>
        </header>

        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {/* Table of Contents */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                What You'll Learn
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#what-is" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                    What is the {indicator.name}?
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                    How It Works & Calculation
                  </a>
                </li>
                <li>
                  <a
                    href="#trading-applications"
                    className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                  >
                    Trading Applications
                  </a>
                </li>
                <li>
                  <a href="#examples" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                    Real Trading Examples
                  </a>
                </li>
              </ul>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                dangerouslySetInnerHTML={{ __html: indicator.content }}
              />
            </div>
          </main>

          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0">
            {/* Related Indicators */}
            {relatedIndicators.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Related Indicators</h4>
                <div className="space-y-4">
                  {relatedIndicators.map((relatedIndicator) => (
                    <div key={relatedIndicator.id} className="pb-4 border-b border-gray-100 last:border-b-0">
                      <Link
                        href={`/indicators/${relatedIndicator.slug}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer text-sm leading-tight"
                      >
                        {relatedIndicator.name}
                      </Link>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{relatedIndicator.description}</p>
                      <span
                        className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${getComplexityColor(relatedIndicator.complexity)}`}
                      >
                        {relatedIndicator.complexity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Apply This Indicator</h4>
              <p className="text-sm text-gray-600 mb-4">
                See how this indicator is used in real-time NQ analysis and trading setups.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                <BarChart3 className="w-4 h-4" />
                View Daily Analysis
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}
