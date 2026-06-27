"use client"

import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("thought-journal-theme") as "light" | "dark" | null
    const initialTheme = savedTheme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

    setTheme(initialTheme)
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    document.documentElement.classList.toggle("dark", nextTheme === "dark")
    window.localStorage.setItem("thought-journal-theme", nextTheme)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-400 hover:text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-stone-600 dark:hover:text-white"
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  )
}
