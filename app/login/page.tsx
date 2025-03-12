"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const { login, user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [exampleUsers, setExampleUsers] = useState<Array<{ email: string; username: string }>>([])
  const [loginError, setLoginError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Navigate to the callbackUrl if provided, or dashboard if not
      router.push(callbackUrl)
    }
  }, [user, router, callbackUrl])

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

  // Validate form fields
  const validateForm = (email: string, password: string) => {
    const errors: { email?: string; password?: string } = {}
    let isValid = true

    // Reset previous errors
    setValidationErrors({})

    // Validate email
    if (!email.trim()) {
      errors.email = "Email is required"
      isValid = false
      // Focus on the email input if it's empty
      emailInputRef.current?.focus()
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address"
      isValid = false
      emailInputRef.current?.focus()
    }

    // Validate password (only if email is valid)
    if (isValid && !password.trim()) {
      errors.password = "Password is required"
      isValid = false
      // Focus on the password input if it's empty
      passwordInputRef.current?.focus()
    }

    setValidationErrors(errors)
    return isValid
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate form before proceeding
    if (!validateForm(email, password)) {
      return
    }

    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (!result.success) {
        setLoginError(result.error || "Invalid email or password")
        setIsLoading(false)
      } else {
        // Explicitly navigate to the callbackUrl on successful login
        router.push(callbackUrl)
      }
    } catch (error) {
      setLoginError("An error occurred. Please try again.")
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
          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="space-y-4">
              {loginError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex justify-between">
                  Email
                  {validationErrors.email && (
                      <span className="text-sm font-normal text-destructive">{validationErrors.email}</span>
                  )}
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    ref={emailInputRef}
                    className={validationErrors.email ? "border-destructive" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex justify-between">
                  Password
                  {validationErrors.password && (
                      <span className="text-sm font-normal text-destructive">{validationErrors.password}</span>
                  )}
                </Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    ref={passwordInputRef}
                    className={validationErrors.password ? "border-destructive" : ""}
                />
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