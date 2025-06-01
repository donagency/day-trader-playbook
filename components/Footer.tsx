import { Activity } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-400" />
          <span className="text-lg font-bold">DayTraderPlaybook</span>
        </div>
        <div className="text-sm text-gray-400">© 2025 DayTraderPlaybook. Professional NQ trading insights.</div>
      </div>
    </footer>
  )
}
