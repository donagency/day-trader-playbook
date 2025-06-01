import Link from "next/link"
import { Activity } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">DayTraderPlaybook</h1>
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Day Trading
          </Link>
          <Link href="/indicators" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Indicators
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Get in Touch
          </Link>
        </nav>
      </div>
    </header>
  )
}
