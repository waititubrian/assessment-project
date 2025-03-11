"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Album = {
  id: number
  userId: number
  title: string
}

type User = {
  id: number
  name: string
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [users, setUsers] = useState<Record<number, string>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch albums and users in parallel
        const [albumsResponse, usersResponse] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/albums"),
          fetch("https://jsonplaceholder.typicode.com/users"),
        ])

        if (!albumsResponse.ok || !usersResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const albumsData = await albumsResponse.json()
        const usersData: User[] = await usersResponse.json()

        // Create a map of user IDs to user names
        const userMap: Record<number, string> = {}
        usersData.forEach((user) => {
          userMap[user.id] = user.name
        })

        setAlbums(albumsData)
        setUsers(userMap)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredAlbums = albums.filter((album) => album.title.toLowerCase().includes(searchTerm.toLowerCase()))

  if (isLoading) {
    return <div className="text-center py-8">Loading albums...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Albums</h1>
        <div className="w-full sm:w-auto max-w-sm">
          <Input
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAlbums.map((album) => (
          <Link key={album.id} href={`/albums/${album.id}`}>
            <Card className="h-full hover:bg-accent/5 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{album.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm line-clamp-1">Album #{album.id}</div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  By: {users[album.userId] || `User #${album.userId}`}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {filteredAlbums.length === 0 && (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No albums found</h3>
          <p className="text-muted-foreground">Try adjusting your search term</p>
        </div>
      )}
    </div>
  )
}

