import { prisma } from "@/lib/prisma"
import { NoteForm } from "@/features/notes/components/NoteForm"
import { NoteTabs } from "@/features/notes/components/NoteTabs"
import { ThemeToggle } from "@/components/ThemeToggle"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const notes = await prisma.note.findMany({
    orderBy: {
      date: "asc",
    },
  })

  const quotes = await prisma.quote.findMany({
    include: {
      note: true,
    },
    orderBy: {
      note: {
        date: "asc",
      },
    },
  })

  const serializedNotes = notes.map((note) => ({
    ...note,
    date: note.date.toISOString(),
  }))

  const serializedQuotes = quotes.map((quote) => ({
    ...quote,
    note: {
      ...quote.note,
      date: quote.note.date.toISOString(),
    },
  }))

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 text-stone-800 transition-colors dark:bg-stone-950 dark:text-stone-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-colors dark:border-stone-800 dark:bg-stone-900 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
                My thought journal
              </p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Capture the thoughts that matter to you.
              </h1>
              <p className="mt-3 max-w-2xl text-base text-stone-600 dark:text-stone-300 sm:text-lg">
                A calm place for your ideas, reflections, and private notes—made to feel like your own little brain dump.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <NoteForm />
        <NoteTabs notes={serializedNotes} quotes={serializedQuotes} />
      </div>
    </main>
  )
}