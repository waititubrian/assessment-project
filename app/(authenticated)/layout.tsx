"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Users, BookImage, ImageIcon, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isLoading && !user) {
      // Encode the current path as a callbackUrl parameter
      const currentPath = window.location.pathname
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`)
    }
  }, [user, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null
  }

  const navItems = [
    { href: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Home", id: "nav-home" },
    { href: "/users", icon: <Users className="h-5 w-5" />, label: "Users", id: "nav-users" },
    { href: "/albums", icon: <BookImage className="h-5 w-5" />, label: "Albums", id: "nav-albums" },
    { href: "/photos", icon: <ImageIcon className="h-5 w-5" />, label: "Photos", id: "nav-photos" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold">Assessment Project</span>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              id={item.id}
              data-testid={item.id}
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm">
            Welcome, {user.name} <span className="text-muted-foreground">(@{user.username})</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="hidden md:flex"
            aria-label="Logout"
            id="logout-button"
          >
            <LogOut className="h-5 w-5" />
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            id="mobile-menu-button"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-background flex flex-col">
          <div className="p-4 border-b">
            <div className="font-medium">
              {user.name} <span className="text-muted-foreground">(@{user.username})</span>
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
          <nav className="flex flex-col p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                id={`mobile-${item.id}`}
                data-testid={`mobile-${item.id}`}
                className="flex items-center gap-2 p-3 text-sm font-medium hover:bg-accent rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button
              className="flex items-center gap-2 p-3 text-sm font-medium hover:bg-accent rounded-md text-left"
              onClick={() => {
                setIsMobileMenuOpen(false)
                handleLogout()
              }}
              id="mobile-logout-button"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}