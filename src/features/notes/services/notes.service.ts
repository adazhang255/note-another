import { prisma } from "@/lib/prisma"

export async function createNote(data: {
  title: string
  content: string
  category: string
  tags: string
  date: Date
}) {
  return prisma.note.create({
    data,
  })
}

export async function getNotes() {
  return prisma.note.findMany({
    orderBy: {
      date: "asc",
    },
  })
}

export async function createQuote(data: { noteId: string; quote: string }) {
  return prisma.quote.create({
    data,
  })
}

export async function createQuotes(data: { noteId: string; quote: string }[]) {
  return prisma.quote.createMany({
    data,
  })
}

export async function getQuotes() {
  return prisma.quote.findMany({
    include: {
      note: true,
    },
    orderBy: {
      note: {
        date: "asc",
      },
    },
  })
}