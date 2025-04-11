"use client"

import { Moon, Sun, Flame, Leaf, CircleDot, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {theme === "orange" ? (
            <Flame className="h-[1.2rem] w-[1.2rem] text-[#F15A29]" />
          ) : theme === "ember" ? (
            <Sparkles className="h-[1.2rem] w-[1.2rem] text-[#F15A29]" />
          ) : theme === "green" ? (
            <Leaf className="h-[1.2rem] w-[1.2rem] text-[#22A45D]" />
          ) : theme === "black" ? (
            <CircleDot className="h-[1.2rem] w-[1.2rem] text-white" />
          ) : (
            <>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("orange")}>Orange</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("ember")}>Ember</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("green")}>Green</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("black")}>Black</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
