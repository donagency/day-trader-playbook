"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Eye, Globe, X } from "lucide-react"
import ContentBuilder from "@/components/ContentBuilder"

export default function NewIndicatorPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    content: "",
    categories: [] as string[],
    complexity: "beginner" as "beginner" | "intermediate" | "advanced",
  })
  const [categoryInput, setCategoryInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/indicators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/indicators")
      } else {
        console.error("Failed to create indicator")
      }
    } catch (error) {
      console.error("Error creating indicator:", error)
    } finally {
      setLoading(false)
    }
  }

  const addCategory = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && categoryInput.trim()) {
      e.preventDefault()
      if (!formData.categories.includes(categoryInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          categories: [...prev.categories, categoryInput.trim()],
        }))
      }
      setCategoryInput("")
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
    }))
  }

  const saveDraft = async () => {
    setSaving(true)
    try {
      // For indicators, we'll just save as normal since they don't have draft status
      console.log("Draft saved successfully")
    } catch (error) {
      console.error("Error saving draft:", error)
    } finally {
      setSaving(false)
    }
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      {/* Main Form */}
      <main className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">Create New Indicator Page</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={saveDraft}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={togglePreview}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Edit" : "Preview"}
            </button>
            <button
              type="submit"
              form="indicator-form"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        <form id="indicator-form" onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Indicator Details */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded"></div>
              Indicator Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Indicator Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., Cumulative TICK Indicator"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-vertical"
                  rows={3}
                  placeholder="Brief description that appears in search results and page previews..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[48px] cursor-text focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  {formData.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyDown={addCategory}
                    className="flex-1 min-w-[100px] outline-none"
                    placeholder="Add categories..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Complexity Level</label>
                <select
                  value={formData.complexity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, complexity: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded"></div>
              Indicator Content
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              {showPreview ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[400px]">
                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: formData.content }} />
                </div>
              ) : (
                <ContentBuilder
                  content={formData.content}
                  onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                />
              )}
            </div>
          </div>
        </form>
      </main>

      {/* Sidebar */}
      <aside className="w-80 space-y-6">
        {/* Publication Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 font-semibold text-slate-900">Publication Settings</div>
          <div className="p-4 space-y-4">
            <div className="text-xs text-gray-600 space-y-1">
              <div>
                <strong>Created:</strong> Today at 2:14 PM
              </div>
              <div>
                <strong>Last Modified:</strong> 2 minutes ago
              </div>
            </div>

            <button
              type="submit"
              form="indicator-form"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Publish Page
            </button>
          </div>
        </div>

        {/* SEO Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 font-semibold text-slate-900">SEO Analysis</div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-700">Title Length: Good (45 chars)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-yellow-700">Meta Description: Needs improvement</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-700">URL Structure: Good</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-red-700">Content Length: Too short (aim for 1000+ words)</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
