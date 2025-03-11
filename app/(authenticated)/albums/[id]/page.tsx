"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User } from "lucide-react"

type Album = {
  id: number
  userId: number
  title: string
}

type Photo = {
  id: number
  albumId: number
  title: string
  url: string
  thumbnailUrl: string
}

export default function AlbumDetailPage() {
  const params = useParams()
  const router = useRouter()
  const albumId = params.id as string

  const [album, setAlbum] = useState<Album | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [userName, setUserName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAlbumData() {
      try {
        const albumResponse = await fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`)

        if (!albumResponse.ok) {
          throw new Error("Album not found")
        }

        const albumData = await albumResponse.json()
        setAlbum(albumData)

        // Fetch the user name and photos in parallel
        const [userResponse, photosResponse] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/users/${albumData.userId}`),
          fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}/photos`),
        ])

        const userData = await userResponse.json()
        const photosData = await photosResponse.json()

        setUserName(userData.name)
        setPhotos(photosData)
      } catch (error) {
        console.error("Error fetching album data:", error)
        router.push("/albums")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlbumData()
  }, [albumId, router])

  if (isLoading) {
    return <div className="text-center py-8">Loading album details...</div>
  }

  if (!album) {
    return <div className="text-center py-8">Album not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{album.title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <Link href={`/users/${album.userId}`} className="text-sm text-muted-foreground hover:underline">
          {userName || `User #${album.userId}`}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Photos ({photos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((photo) => (
              <Link key={photo.id} href={`/photos/${photo.id}`}>
                <div className="overflow-hidden rounded-md hover:opacity-80 transition-opacity">
                  <Image
                    src={photo.thumbnailUrl || "/placeholder.svg?height=150&width=150"}
                    alt={photo.title}
                    width={150}
                    height={150}
                    className="object-cover aspect-square w-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=150&width=150"
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>

          {photos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No photos found in this album</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

