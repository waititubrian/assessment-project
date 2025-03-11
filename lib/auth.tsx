"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: number
  name: string
  username: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for existing session
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Redirect logic based on authentication status
    if (!isLoading) {
      const isAuthRoute = ["/dashboard", "/users", "/albums", "/photos"].some((route) => pathname?.startsWith(route))

      const isLoginPage = pathname === "/login"

      if (isAuthRoute && !user) {
        router.push("/login")
      } else if (isLoginPage && user) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Fetch all users from JSONPlaceholder
      const response = await fetch("https://jsonplaceholder.typicode.com/users")
      if (!response.ok) throw new Error("Failed to fetch users")

      const users = await response.json()

      // Find the user with the matching email
      const matchedUser = users.find((user: User) => user.email.toLowerCase() === email.toLowerCase())

      if (!matchedUser) {
        return false // User not found
      }

      // For demo purposes, we'll consider the password valid if it matches the username
      // In a real app, you would hash passwords and compare them properly
      if (password !== matchedUser.username) {
        return false // Password doesn't match
      }

      setUser(matchedUser)
      localStorage.setItem("user", JSON.stringify(matchedUser))
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

