import type { Metadata } from "next"
import { getIndicators } from "@/lib/data"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Indicators",
}

function getComplexityColor(complexity: string): string {
  switch (complexity) {
    case "easy":
      return "bg-green-50 text-green-700"
    case "medium":
      return "bg-yellow-50 text-yellow-700"
    case "hard":
      return "bg-red-50 text-red-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export default async function IndicatorsPage() {
  const indicators = await getIndicators()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Indicators</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {indicators.map((indicator) => (
          <Link key={indicator.id} href={`/indicators/${indicator.slug}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getComplexityColor(indicator.complexity)}`}
                >
                  {indicator.complexity.charAt(0).toUpperCase() + indicator.complexity.slice(1)}
                </span>
                <div className="text-xs text-gray-500">{new Date(indicator.created_at).toLocaleDateString()}</div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                {indicator.name}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{indicator.description}</p>

              <div className="flex flex-wrap gap-2">
                {indicator.categories.map((category) => (
                  <span key={category} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-medium">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
