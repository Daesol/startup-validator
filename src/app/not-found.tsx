import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/layouts/page-layout"

export default function NotFound() {
  return (
    <PageLayout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </PageLayout>
  )
}
