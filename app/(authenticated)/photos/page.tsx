"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"

type Photo = {
  id: number
  albumId: number
  title: string
  url: string
  thumbnailUrl: string
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const photosPerPage = 20

  useEffect(() => {
    async function fetchPhotos() {
      try {
        // Get first 100 photos to avoid too many requests to the API
        const response = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=100")
        if (!response.ok) throw new Error("Failed to fetch photos")
        const data = await response.json()
        setPhotos(data)
      } catch (error) {
        console.error("Error fetching photos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  const filteredPhotos = photos.filter((photo) => photo.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const paginatedPhotos = filteredPhotos.slice((page - 1) * photosPerPage, page * photosPerPage)

  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage)

  if (isLoading) {
    return <div className="text-center py-8">Loading photos...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Photos</h1>
        <div className="w-full sm:w-auto max-w-sm">
          <Input
            placeholder="Search photos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {paginatedPhotos.map((photo) => (
          <Link key={photo.id} href={`/photos/${photo.id}`}>
            <div className="group overflow-hidden rounded-md border bg-card">
              <div className="aspect-square overflow-hidden">
                <Image
                  src={photo.thumbnailUrl || "/placeholder.svg?height=150&width=150"}
                  alt={photo.title}
                  width={150}
                  height={150}
                  className="object-cover transition-transform group-hover:scale-105 h-full w-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=150&width=150"
                  }}
                />
              </div>
              <div className="p-2">
                <p className="text-xs text-muted-foreground line-clamp-2">{photo.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No photos found</h3>
          <p className="text-muted-foreground">Try adjusting your search term</p>
        </div>
      )}

      {filteredPhotos.length > 0 && (
        <div className="flex justify-center gap-2 py-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

