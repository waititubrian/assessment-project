"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, BookImage } from "lucide-react"

type Photo = {
  id: number
  albumId: number
  title: string
  url: string
  thumbnailUrl: string
}

type Album = {
  id: number
  title: string
  userId: number
}

export default function PhotoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const photoId = params.id as string

  const [photo, setPhoto] = useState<Photo | null>(null)
  const [album, setAlbum] = useState<Album | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPhotoData() {
      try {
        const photoResponse = await fetch(`https://jsonplaceholder.typicode.com/photos/${photoId}`)

        if (!photoResponse.ok) {
          throw new Error("Photo not found")
        }

        const photoData = await photoResponse.json()
        setPhoto(photoData)

        // Fetch the album data after getting the photo
        const albumResponse = await fetch(`https://jsonplaceholder.typicode.com/albums/${photoData.albumId}`)
        const albumData = await albumResponse.json()

        setAlbum(albumData)
      } catch (error) {
        console.error("Error fetching photo data:", error)
        router.push("/photos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPhotoData()
  }, [photoId, router])

  if (isLoading) {
    return <div className="text-center py-8">Loading photo details...</div>
  }

  if (!photo) {
    return <div className="text-center py-8">Photo not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight line-clamp-1">{photo.title}</h1>
      </div>

      {album && (
        <div className="flex items-center gap-2">
          <BookImage className="h-4 w-4 text-muted-foreground" />
          <Link href={`/albums/${album.id}`} className="text-sm text-muted-foreground hover:underline">
            Album: {album.title}
          </Link>
        </div>
      )}

      <Card>
        <CardContent className="p-4 flex justify-center">
          <div className="overflow-hidden rounded-md max-w-xl">
            <Image
              src={photo.url || "/placeholder.svg?height=600&width=600"}
              alt={photo.title}
              width={600}
              height={600}
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=600&width=600"
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="py-4">
        <h2 className="text-lg font-semibold mb-2">Photo Details</h2>
        <div className="grid gap-2">
          <div>
            <span className="font-medium">Title:</span> {photo.title}
          </div>
          <div>
            <span className="font-medium">Photo ID:</span> {photo.id}
          </div>
          <div>
            <span className="font-medium">Album ID:</span> {photo.albumId}
          </div>
        </div>
      </div>
    </div>
  )
}

