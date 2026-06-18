"use client"

import { Button } from "@/components/Button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" className="size-9 px-0" aria-label="Тема">
        <Sun className="size-4" aria-hidden="true" />
      </Button>
    )
  }

  const isDark = theme === "dark"
  const nextTheme = isDark ? "light" : "dark"
  const Icon = isDark ? Moon : Sun

  return (
    <Button
      type="button"
      variant="ghost"
      className="size-9 px-0"
      aria-label="Переключить тему"
      title="Переключить тему"
      onClick={() => setTheme(nextTheme)}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  )
}
