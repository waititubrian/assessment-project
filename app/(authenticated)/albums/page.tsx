"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookImage } from "lucide-react"

interface Album {
  id: number
  title: string
  userId: number
}

interface User {
  id: number
  name: string
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [albumsResponse, usersResponse] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/albums"),
          fetch("https://jsonplaceholder.typicode.com/users"),
        ])

        if (!albumsResponse.ok || !usersResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const albumsData = await albumsResponse.json()
        const usersData = await usersResponse.json()

        setAlbums(albumsData)
        setFilteredAlbums(albumsData)
        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...albums]

    // Filter by user
    if (selectedUser !== "all") {
      filtered = filtered.filter((album) => album.userId === Number.parseInt(selectedUser))
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((album) => album.title.toLowerCase().includes(query))
    }

    setFilteredAlbums(filtered)
  }, [searchQuery, selectedUser, albums])

  const getUserName = (userId: number) => {
    const user = users.find((user) => user.id === userId)
    return user ? user.name : "Unknown User"
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading albums...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Albums</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64">
            <Input
              id="album-search"
              data-testid="album-search"
              placeholder="Search albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger id="user-filter" data-testid="user-filter">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAlbums.map((album) => (
          <Link key={album.id} href={`/albums/${album.id}`}>
            <Card
              className="h-full hover:bg-accent/5 transition-colors cursor-pointer album-card"
              data-album-id={album.id}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium album-title">
                  {album.title.charAt(0).toUpperCase() + album.title.slice(1)}
                </CardTitle>
                <BookImage className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground album-user">By {getUserName(album.userId)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredAlbums.length === 0 && (
        <div className="text-center py-8" id="no-albums-message" data-testid="no-albums-message">
          <p className="text-muted-foreground">No albums found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}