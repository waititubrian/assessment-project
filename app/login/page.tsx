"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [exampleUsers, setExampleUsers] = useState<Array<{ email: string; username: string }>>([])

  useEffect(() => {
    // Fetch some example users from JSONPlaceholder for the hint
    async function fetchExampleUsers() {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users?_limit=3")
        if (response.ok) {
          const users = await response.json()
          setExampleUsers(
            users.map((user: any) => ({
              email: user.email,
              username: user.username,
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching example users:", error)
      }
    }

    fetchExampleUsers()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="email@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-500">
              For demo, use any of these credentials:
              {exampleUsers.length > 0 ? (
                <span className="block font-medium mt-1">
                  {exampleUsers.map((user) => (
                    <span key={user.email} className="block">
                      Email: {user.email}, Password: {user.username}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="block font-medium mt-1">
                  Email: Sincere@april.biz, Password: Bret
                  <br />
                  Email: Shanna@melissa.tv, Password: Antonette
                </span>
              )}
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

