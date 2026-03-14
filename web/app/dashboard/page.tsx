"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession, signOut } from "@/lib/auth-client"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const router = useRouter()
  const t = useTranslations()
  const { data: session, isPending } = useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      router.push("/login")
    } catch (err) {
      console.error("Sign out error:", err)
    } finally {
      setIsSigningOut(false)
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">{t("common.error")}</p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    )
  }

  const joinedDate = session.user.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString()
    : "N/A"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{t("dashboard.title")}</h1>
          <Button variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
            {isSigningOut ? t("common.loading") : t("auth.logout")}
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.userInfo")}</CardTitle>
              <CardDescription>
                {t("dashboard.welcome", { name: session.user.name || "User" })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{session.user.email}</div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{session.user.name || "Not provided"}</div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Member Since</div>
                <div className="font-medium">
                  {t("dashboard.memberSince", { date: joinedDate })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
