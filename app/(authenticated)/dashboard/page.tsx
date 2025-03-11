"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookImage, ImageIcon } from "lucide-react"

type Stats = {
  userCount: number
  albumCount: number
  photoCount: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    userCount: 0,
    albumCount: 0,
    photoCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [users, albums, photos] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/users").then((res) => res.json()),
          fetch("https://jsonplaceholder.typicode.com/albums").then((res) => res.json()),
          fetch("https://jsonplaceholder.typicode.com/photos").then((res) => res.json()),
        ])

        setStats({
          userCount: users.length,
          albumCount: albums.length,
          photoCount: photos.length,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return <div className="text-center py-8">Loading dashboard data...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.name} <span className="text-sm">(@{user?.username})</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/users">
          <Card className="hover:bg-accent/5 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.userCount}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/albums">
          <Card className="hover:bg-accent/5 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Albums</CardTitle>
              <BookImage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.albumCount}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/photos">
          <Card className="hover:bg-accent/5 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.photoCount}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Welcome to the JSONPlaceholder App. This app demonstrates how to integrate with an external API and
            implement basic authentication. Navigate through the different sections using the menu above to explore
            Users, Albums, and Photos from the JSONPlaceholder API.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

