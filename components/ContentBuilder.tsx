"use client"

import { useState } from "react"
import { X, Type, List, Quote, ImageIcon, TrendingUp, Lightbulb, GripVertical } from "lucide-react"

interface ContentBlock {
  id: string
  type: "heading" | "paragraph" | "list" | "highlights" | "quote" | "image" | "trade-summary"
  content: any
}

interface ContentBuilderProps {
  content: string
  onChange: (content: string) => void
}

export default function ContentBuilder({ content, onChange }: ContentBuilderProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    // Parse existing content or start with empty
    if (content) {
      return [{ id: "1", type: "paragraph", content: { text: content } }]
    }
    return []
  })

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
    }
    const newBlocks = [...blocks, newBlock]
    setBlocks(newBlocks)
    updateContent(newBlocks)
  }

  const removeBlock = (id: string) => {
    const newBlocks = blocks.filter((block) => block.id !== id)
    setBlocks(newBlocks)
    updateContent(newBlocks)
  }

  const updateBlock = (id: string, content: any) => {
    const newBlocks = blocks.map((block) => (block.id === id ? { ...block, content } : block))
    setBlocks(newBlocks)
    updateContent(newBlocks)
  }

  const updateContent = (blocks: ContentBlock[]) => {
    const html = blocks.map((block) => blockToHtml(block)).join("\n")
    onChange(html)
  }

  const getDefaultContent = (type: ContentBlock["type"]) => {
    switch (type) {
      case "heading":
        return { text: "New Heading" }
      case "paragraph":
        return { text: "Write your paragraph here..." }
      case "list":
        return { items: ["List item 1", "List item 2"] }
      case "highlights":
        return { title: "Key Insights", items: ["Important insight 1", "Important insight 2"] }
      case "quote":
        return { text: "Your quote here...", author: "Author Name" }
      case "image":
        return { url: "", alt: "", caption: "" }
      case "trade-summary":
        return {
          entry: "",
          exit: "",
          profit: "",
          strategy: "",
          notes: "",
        }
      default:
        return {}
    }
  }

  const blockToHtml = (block: ContentBlock): string => {
    switch (block.type) {
      case "heading":
        return `<h2>${block.content.text}</h2>`
      case "paragraph":
        return `<p>${block.content.text}</p>`
      case "list":
        return `<ul>${block.content.items.map((item: string) => `<li>${item}</li>`).join("")}</ul>`
      case "highlights":
        return `<div class="highlights"><h3>${block.content.title}</h3><ul>${block.content.items
          .map((item: string) => `<li>${item}</li>`)
          .join("")}</ul></div>`
      case "quote":
        return `<blockquote><p>${block.content.text}</p><cite>— ${block.content.author}</cite></blockquote>`
      case "image":
        return `<figure><img src="${block.content.url}" alt="${block.content.alt}" /><figcaption>${block.content.caption}</figcaption></figure>`
      case "trade-summary":
        return `<div class="trade-summary">
          <h3>Trade Summary</h3>
          <div class="trade-details">
            <p><strong>Entry:</strong> ${block.content.entry}</p>
            <p><strong>Exit:</strong> ${block.content.exit}</p>
            <p><strong>Profit:</strong> ${block.content.profit}</p>
            <p><strong>Strategy:</strong> ${block.content.strategy}</p>
            <p><strong>Notes:</strong> ${block.content.notes}</p>
          </div>
        </div>`
      default:
        return ""
    }
  }

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case "heading":
        return (
          <input
            type="text"
            value={block.content.text}
            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
            className="w-full text-2xl font-bold border-none outline-none bg-transparent"
            placeholder="Enter heading..."
          />
        )

      case "paragraph":
        return (
          <textarea
            value={block.content.text}
            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
            className="w-full border-none outline-none bg-transparent resize-none"
            placeholder="Write your paragraph..."
            rows={3}
          />
        )

      case "list":
        return (
          <div className="space-y-2">
            {block.content.items.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...block.content.items]
                    newItems[index] = e.target.value
                    updateBlock(block.id, { items: newItems })
                  }}
                  className="flex-1 border-none outline-none bg-transparent"
                  placeholder="List item..."
                />
                <button
                  onClick={() => {
                    const newItems = block.content.items.filter((_: any, i: number) => i !== index)
                    updateBlock(block.id, { items: newItems })
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newItems = [...block.content.items, "New item"]
                updateBlock(block.id, { items: newItems })
              }}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              + Add item
            </button>
          </div>
        )

      case "highlights":
        return (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <input
              type="text"
              value={block.content.title}
              onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
              className="w-full font-bold text-lg border-none outline-none bg-transparent mb-2"
              placeholder="Highlights title..."
            />
            <div className="space-y-2">
              {block.content.items.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...block.content.items]
                      newItems[index] = e.target.value
                      updateBlock(block.id, { ...block.content, items: newItems })
                    }}
                    className="flex-1 border-none outline-none bg-transparent"
                    placeholder="Key insight..."
                  />
                  <button
                    onClick={() => {
                      const newItems = block.content.items.filter((_: any, i: number) => i !== index)
                      updateBlock(block.id, { ...block.content, items: newItems })
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newItems = [...block.content.items, "New insight"]
                  updateBlock(block.id, { ...block.content, items: newItems })
                }}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add insight
              </button>
            </div>
          </div>
        )

      case "quote":
        return (
          <div className="border-l-4 border-gray-300 pl-4 italic">
            <textarea
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              className="w-full border-none outline-none bg-transparent resize-none text-lg"
              placeholder="Enter quote..."
              rows={2}
            />
            <input
              type="text"
              value={block.content.author}
              onChange={(e) => updateBlock(block.id, { ...block.content, author: e.target.value })}
              className="w-full border-none outline-none bg-transparent text-sm text-gray-600 mt-2"
              placeholder="— Author name"
            />
          </div>
        )

      case "image":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="space-y-3">
              <input
                type="text"
                value={block.content.url}
                onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Image URL..."
              />
              <input
                type="text"
                value={block.content.alt}
                onChange={(e) => updateBlock(block.id, { ...block.content, alt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Alt text..."
              />
              <input
                type="text"
                value={block.content.caption}
                onChange={(e) => updateBlock(block.id, { ...block.content, caption: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Caption..."
              />
              {block.content.url && (
                <img
                  src={block.content.url || "/placeholder.svg"}
                  alt={block.content.alt}
                  className="max-w-full h-auto rounded"
                />
              )}
            </div>
          </div>
        )

      case "trade-summary":
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-lg mb-3">Trade Summary</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={block.content.entry}
                onChange={(e) => updateBlock(block.id, { ...block.content, entry: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded"
                placeholder="Entry price..."
              />
              <input
                type="text"
                value={block.content.exit}
                onChange={(e) => updateBlock(block.id, { ...block.content, exit: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded"
                placeholder="Exit price..."
              />
              <input
                type="text"
                value={block.content.profit}
                onChange={(e) => updateBlock(block.id, { ...block.content, profit: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded"
                placeholder="Profit/Loss..."
              />
              <input
                type="text"
                value={block.content.strategy}
                onChange={(e) => updateBlock(block.id, { ...block.content, strategy: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded"
                placeholder="Strategy used..."
              />
            </div>
            <textarea
              value={block.content.notes}
              onChange={(e) => updateBlock(block.id, { ...block.content, notes: e.target.value })}
              className="w-full mt-3 px-3 py-2 border border-gray-300 rounded resize-none"
              placeholder="Trade notes..."
              rows={3}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Content Blocks Toolbar */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Add Content Block</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => addBlock("heading")}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Type className="w-4 h-4" />
            Heading
          </button>
          <button
            onClick={() => addBlock("paragraph")}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Type className="w-4 h-4" />
            Paragraph
          </button>
          <button
            onClick={() => addBlock("list")}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <List className="w-4 h-4" />
            List
          </button>
          <button
            onClick={() => addBlock("highlights")}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Lightbulb className="w-4 h-4" />
            Highlights
          </button>
          <button
            onClick={() => addBlock("quote")}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Quote className="w-4 h-4" />
            Quote
          </button>
          <button
            onClick={() => addBlock("image")}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <ImageIcon className="w-4 h-4" />
            Image
          </button>
          <button
            onClick={() => addBlock("trade-summary")}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <TrendingUp className="w-4 h-4" />
            Trade Summary
          </button>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-4">
        {blocks.map((block) => (
          <div key={block.id} className="group relative border border-gray-200 rounded-lg p-4 hover:border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500 uppercase">{block.type}</span>
              </div>
              <button
                onClick={() => removeBlock(block.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderBlock(block)}
          </div>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No content blocks yet. Add your first block above to get started.</p>
        </div>
      )}
    </div>
  )
}
