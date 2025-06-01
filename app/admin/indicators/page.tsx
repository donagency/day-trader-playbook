"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, MoreVertical } from "lucide-react"
import type { Indicator } from "@/types"

export default function AdminIndicatorsPage() {
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIndicators()
  }, [])

  const fetchIndicators = async () => {
    try {
      const response = await fetch("/api/indicators")
      const data = await response.json()
      setIndicators(data)
    } catch (error) {
      console.error("Failed to fetch indicators:", error)
    } finally {
      setLoading(false)
    }
  }

  const getComplexityBadge = (complexity: string) => {
    const styles = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[complexity as keyof typeof styles]}`}
      >
        <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
        {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Indicators</h1>
        <Link
          href="/admin/indicators/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Indicator
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-slate-900 mb-1">{indicators.length}</div>
          <div className="text-gray-600 text-sm font-medium">Total Indicators</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-slate-900 mb-1">
            {indicators.filter((i) => i.complexity === "beginner").length}
          </div>
          <div className="text-gray-600 text-sm font-medium">Beginner Level</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-slate-900 mb-1">
            {indicators.filter((i) => i.complexity === "advanced").length}
          </div>
          <div className="text-gray-600 text-sm font-medium">Advanced Level</div>
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {indicators.map((indicator) => (
          <div key={indicator.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-wrap gap-2">
                {indicator.categories.map((category) => (
                  <span key={category} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {category}
                  </span>
                ))}
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">{indicator.name}</h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{indicator.description}</p>

            <div className="flex justify-between items-center">
              {getComplexityBadge(indicator.complexity)}
              <div className="text-xs text-gray-500">Created {new Date(indicator.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
