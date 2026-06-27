"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

const categories = ["Personal", "Idea", "Work", "Reflection", "Dream", "Random"]

export function NoteForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("Personal")
  const [tags, setTags] = useState("")
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedContent) {
      setMessage("Write down a thought before saving it.")
      return
    }

    try {
      setLoading(true)
      setMessage("")

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle || "A thought",
          content: trimmedContent,
          category: category || "Personal",
          tags,
          date,
        }),
      })

      if (!response.ok) {
        throw new Error("Unable to save your thought")
      }

      setTitle("")
      setContent("")
      setCategory("Personal")
      setTags("")
      setDate(new Date().toISOString().slice(0, 10))
      setMessage("Thought saved. Keep going.")
      router.refresh()
    } catch {
      setMessage("Something went wrong while saving your note.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-colors dark:border-stone-800 dark:bg-stone-900">
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-200">
            Title (optional)
          </label>
          <input
            id="title"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-500 dark:border-stone-700 dark:bg-stone-950"
            placeholder="A quick label for this thought"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-200">
            Category
          </label>
          <select
            id="category"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-500 dark:border-stone-700 dark:bg-stone-950"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-200">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-500 dark:border-stone-700 dark:bg-stone-950"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-200">
          Your thought
        </label>
        <textarea
          id="content"
          rows={6}
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-500 dark:border-stone-700 dark:bg-stone-950"
          placeholder="Write whatever is on your mind right now..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="tags" className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-200">
          Tags
        </label>
        <input
          id="tags"
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-500 dark:border-stone-700 dark:bg-stone-950"
          placeholder="work, idea, dream"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-500 dark:text-stone-400">{message || "Keep it simple and honest."}</p>
        <button
          type="submit"
          className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save thought"}
        </button>
      </div>
    </form>
  )
}