"use client"

import { useEffect, useState } from "react"

type Note = {
  id: string
  title: string
  content: string
  category: string
  tags: string
  date: string
}

type Quote = {
  id: string
  quote: string
  note: Note
}

export function NoteTabs({ notes, quotes }: { notes: Note[]; quotes: Quote[] }) {
  const [activeTab, setActiveTab] = useState<"notes" | "highlights">("highlights")

  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith("#note-")) {
      setActiveTab("notes")
    }
  }, [])

  function goToNote(noteId: string) {
    setActiveTab("notes")
    window.requestAnimationFrame(() => {
      const element = document.getElementById(`note-${noteId}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm transition-colors dark:border-stone-800 dark:bg-stone-900">
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === "notes"
              ? "bg-stone-900 text-white dark:bg-stone-200 dark:text-stone-950"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-950 dark:text-stone-300 dark:hover:bg-stone-800"
          }`}
        >
          Notes
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("highlights")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === "highlights"
              ? "bg-stone-900 text-white dark:bg-stone-200 dark:text-stone-950"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-950 dark:text-stone-300 dark:hover:bg-stone-800"
          }`}
        >
          Highlights
        </button>
      </div>

      {activeTab === "notes" ? (
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300">
              No notes yet. Write one to start building your thought archive.
            </div>
          ) : (
            notes.map((note) => (
              <article key={note.id} id={`note-${note.id}`} className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm transition-colors dark:border-stone-800 dark:bg-stone-950">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">{note.category}</p>
                    <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{note.title || "Untitled thought"}</h3>
                  </div>
                  <time className="text-sm text-stone-500 dark:text-stone-400">
                    {new Date(note.date).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-7 text-stone-700 dark:text-stone-300">{note.content}</p>
                {note.tags ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {note.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="rounded-full border border-stone-300 px-3 py-1 text-xs text-stone-600 dark:border-stone-700 dark:text-stone-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300">
              No highlights yet. Add a note to generate the most impactful quote.
            </div>
          ) : (
            quotes.map((quote) => (
              <article key={quote.id} className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm transition-colors dark:border-stone-800 dark:bg-stone-950">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">Highlight</p>
                    <p className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-100">{quote.note.title || "Untitled thought"}</p>
                  </div>
                  <time className="text-sm text-stone-500 dark:text-stone-400">
                    {new Date(quote.note.date).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <blockquote className="rounded-2xl border-l-4 border-stone-900 bg-stone-100 px-5 py-4 text-sm italic text-stone-900 dark:border-stone-200 dark:bg-stone-900 dark:text-stone-100">
                  “{quote.quote}”
                </blockquote>
                <button
                  type="button"
                  onClick={() => goToNote(quote.note.id)}
                  className="mt-4 inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200 dark:hover:border-stone-600 dark:hover:bg-stone-900"
                >
                  View full note
                </button>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  )
}
