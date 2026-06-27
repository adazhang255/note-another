import { execFile } from "node:child_process"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const OLLAMA_MODEL = "mistral-7b-v0"

export async function extractHighlightsFromNote(content: string) {
  const prompt = `Extract up to 3 short, distinct highlights from the following note. Return each highlight on its own line, without numbering or extra commentary. Note:

${content}`

  try {
    const { stdout } = await execFileAsync("ollama", ["predict", OLLAMA_MODEL, prompt], {
      maxBuffer: 1024 * 1024 * 5,
    })

    const raw = String(stdout).trim()
    const lines = raw
      .split(/\r?\n/)
      .map((line) => line.replace(/^\d+[.)\-]?\s*/, "").trim())
      .filter(Boolean)

    return lines.length > 0 ? lines : fallbackHighlights(content)
  } catch (error) {
    return fallbackHighlights(content)
  }
}

function fallbackHighlights(content: string) {
  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  const unique = Array.from(new Set(sentences))
  const sorted = unique.sort((a, b) => b.length - a.length)
  const highlights = sorted.slice(0, 3).map((sentence) => sentence.slice(0, 280).trim())

  return highlights.length > 0 ? highlights : [content.trim().slice(0, 280)]
}
