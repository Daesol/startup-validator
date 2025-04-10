import type React from "react"

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 w-full max-w-full overflow-x-hidden">{children}</div>
      <footer className="border-t bg-background">
        <div className="container px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Startup Validator. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default PageLayout
