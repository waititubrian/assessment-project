"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the User type
export interface User {
  id: string
  name: string
  email: string
  username: string
}

// Define the login result type
export interface LoginResult {
  success: boolean
  error?: string
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => void
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if we're in a browser environment
      const storedUser = localStorage.getItem("auth-user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("Failed to parse stored user:", error)
          localStorage.removeItem("auth-user")
        }
      }
      setIsLoading(false)
    }
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      // Fetch users from JSONPlaceholder API
      const response = await fetch("https://jsonplaceholder.typicode.com/users")
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const users = await response.json()

      // Find user with matching email
      const user = users.find((user: any) => user.email.toLowerCase() === email.toLowerCase())

      if (!user) {
        return { success: false, error: "User not found" }
      }

      // For demo purposes, we'll consider the password valid if it matches the username
      if (password !== user.username) {
        return { success: false, error: "Invalid password" }
      }

      // Create user object
      const authUser: User = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
      }

      // Store user in state and localStorage (with check for browser environment)
      setUser(authUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("auth-user", JSON.stringify(authUser))
      }

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An error occurred during login" }
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-user")
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}