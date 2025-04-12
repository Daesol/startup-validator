"use client"

import { useState } from "react"
import { clearValidationTables } from "@/lib/supabase/validation-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleClearTables = async () => {
    setIsLoading(true)
    setMessage(null)
    
    try {
      const result = await clearValidationTables()
      if (result.success) {
        setMessage({ type: "success", text: "Successfully cleared all validation tables" })
      } else {
        setMessage({ type: "error", text: result.error || "Failed to clear tables" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Manage validation data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="destructive"
                onClick={handleClearTables}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  "Clear All Validation Data"
                )}
              </Button>
            </div>
            
            {message && (
              <div className={`p-4 rounded-md ${
                message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {message.text}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 