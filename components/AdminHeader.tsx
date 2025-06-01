"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity } from "lucide-react"

export default function AdminHeader() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <header className="bg-slate-800 text-white py-4 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3 text-xl font-bold">
          <Activity className="w-6 h-6" />
          DayTraderPlaybook Admin
        </div>
        <nav className="flex gap-6">
          <Link
            href="/admin/articles"
            className={`text-slate-300 hover:text-white font-medium transition-colors ${
              pathname.startsWith("/admin/articles") ? "text-white" : ""
            }`}
          >
            Articles
          </Link>
          <Link
            href="/admin/indicators"
            className={`text-slate-300 hover:text-white font-medium transition-colors ${
              pathname.startsWith("/admin/indicators") ? "text-white" : ""
            }`}
          >
            Indicators
          </Link>
          <Link href="/" className="text-slate-300 hover:text-white font-medium transition-colors">
            View Site
          </Link>
          <button onClick={handleLogout} className="text-slate-300 hover:text-white font-medium transition-colors">
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}
