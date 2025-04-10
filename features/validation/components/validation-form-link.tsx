"use client"

import type React from "react"
import { useRouter } from "next/navigation"

export function ValidationFormLink({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return <div onClick={() => router.push("/validate")}>{children}</div>
}
