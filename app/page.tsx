"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Search, Calendar, Eye } from "lucide-react"
import type { Article } from "@/types"
import type { Indicator } from "@/types"
import Link from "next/link"

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentArticles, setCurrentArticles] = useState(0)
  const articlesPerLoad = 6
  const [indicators, setIndicators] = useState<Indicator[]>([])

  const fetchData = async () => {
    try {
      const [articlesResponse, indicatorsResponse] = await Promise.all([
        fetch("/api/articles"),
        fetch("/api/indicators"),
      ])
      const articlesData = await articlesResponse.json()
      const indicatorsData = await indicatorsResponse.json()

      setArticles(articlesData)
      setFilteredArticles(articlesData)
      setCurrentArticles(Math.min(articlesPerLoad, articlesData.length))
      setIndicators(indicatorsData.slice(0, 4)) // Get latest 4 indicators
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const searchArticles = (query: string) => {
    setSearchQuery(query.toLowerCase().trim())

    if (query === "") {
      setFilteredArticles(articles)
    } else {
      const filtered = articles.filter((article) => {
        const titleMatch = article.title.toLowerCase().includes(query)
        const excerptMatch = article.excerpt.toLowerCase().includes(query)
        const tagsMatch = article.tags.some((tag) => tag.toLowerCase().includes(query))
        return titleMatch || excerptMatch || tagsMatch
      })
      setFilteredArticles(filtered)
    }
    setCurrentArticles(Math.min(articlesPerLoad, filteredArticles.length))
  }

  const loadMoreArticles = () => {
    const newCount = Math.min(currentArticles + articlesPerLoad, filteredArticles.length)
    setCurrentArticles(newCount)
  }

  const displayedArticles = filteredArticles.slice(0, currentArticles)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-blue-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent responsive-text-4xl">
            Professional NQ Day Trading Insights
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto responsive-text-xl">
            Daily analysis, proven strategies, and technical indicators for serious NQ futures traders
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8 responsive-flex">
        <main className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Latest Trading Analysis</h3>
            <div className="text-sm text-gray-600">Updated daily at market close</div>
          </div>

          {/* Search Box */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none transition-all"
                placeholder="Search articles by title, content, or tags..."
                onChange={(e) => searchArticles(e.target.value)}
              />
            </div>
            {searchQuery && (
              <div className="mt-4 text-sm text-gray-600 font-medium">
                Found {filteredArticles.length} article{filteredArticles.length === 1 ? "" : "s"} matching "
                {searchQuery}"
              </div>
            )}
          </div>

          {/* Articles Grid */}
          <div className="articles-masonry">
            {displayedArticles.map((article) => (
              <div key={article.id} className="article-card">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  <Eye className="w-3.5 h-3.5 ml-2" />
                  <span>{article.views.toLocaleString()}</span>
                </div>

                <Link href={`/articles/${article.slug}`}>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 cursor-pointer hover:text-blue-600 transition-colors leading-tight">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-slate-600 text-sm leading-relaxed mb-5">{article.excerpt}</p>

                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-md text-xs font-medium border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {currentArticles < filteredArticles.length && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreArticles}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Load More Articles
              </button>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0 responsive-sidebar">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded"></div>
              My Trading Indicators
            </h4>

            <div className="space-y-4">
              {indicators.map((indicator) => (
                <Link key={indicator.id} href={`/indicators/${indicator.slug}`}>
                  <div className="border-l-4 border-blue-600 pl-4 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
                      {indicator.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{indicator.description}</div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/indicators"
              className="block w-full mt-4 bg-gray-100 text-gray-700 py-2 text-center rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              View All Indicators
            </Link>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  )
}
