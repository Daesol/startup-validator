"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function MainHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Startup Validator
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/validate"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/validate") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Validate
            </Link>
            <Link
              href="/validations"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/validations") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Past Validations
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/validate">
            <Button size="sm">Start Validation</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
