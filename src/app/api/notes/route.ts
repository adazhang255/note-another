import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { createNote, createQuotes, getNotes } from "@/features/notes/services/notes.service"
import { extractHighlightsFromNote } from "@/features/notes/services/ollama.service"

function isValidPayload(body: unknown): body is { title?: string; content?: string; category?: string; tags?: string; date?: string } {
  return typeof body === "object" && body !== null
}

function parseLocalDate(dateString: string | undefined) {
  if (!dateString) {
    return new Date()
  }

  const [year, month, day] = dateString.split("-").map(Number)
  if (!year || !month || !day) {
    return new Date()
  }

  return new Date(year, month - 1, day)
}

export async function GET() {
  const notes = await getNotes()

  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!isValidPayload(body) || typeof body.content !== "string" || body.content.trim() === "") {
      return NextResponse.json(
        {
          error: "A thought body is required",
        },
        {
          status: 400,
        }
      )
    }

    const title = typeof body.title === "string" ? body.title.trim() : "A thought"
    const content = body.content.trim()
    const category = typeof body.category === "string" && body.category.trim() ? body.category.trim() : "Personal"
    const tags = typeof body.tags === "string" ? body.tags.trim() : ""
    const date = parseLocalDate(typeof body.date === "string" ? body.date : undefined)

    const note = await createNote({ title, content, category, tags, date })
    const highlights = await extractHighlightsFromNote(content)
    await createQuotes(highlights.map((quote) => ({ noteId: note.id, quote })))
    revalidatePath("/")

    return NextResponse.json(note)
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request",
      },
      {
        status: 400,
      }
    )
  }
}