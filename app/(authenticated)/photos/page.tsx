"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface Photo {
  id: number
  title: string
  url: string
  thumbnailUrl: string
  albumId: number
}

interface Album {
  id: number
  title: string
  userId: number
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAlbum, setSelectedAlbum] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const photosPerPage = 12

  useEffect(() => {
    async function fetchData() {
      try {
        const [photosResponse, albumsResponse] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/photos?_limit=100"),
          fetch("https://jsonplaceholder.typicode.com/albums"),
        ])

        if (!photosResponse.ok || !albumsResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const photosData = await photosResponse.json()
        const albumsData = await albumsResponse.json()

        setPhotos(photosData)
        setFilteredPhotos(photosData)
        setAlbums(albumsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...photos]

    // Filter by album
    if (selectedAlbum !== "all") {
      filtered = filtered.filter((photo) => photo.albumId === Number.parseInt(selectedAlbum))
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((photo) => photo.title.toLowerCase().includes(query))
    }

    setFilteredPhotos(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, selectedAlbum, photos])

  const getAlbumTitle = (albumId: number) => {
    const album = albums.find((album) => album.id === albumId)
    return album ? album.title : "Unknown Album"
  }

  // Pagination logic
  const indexOfLastPhoto = currentPage * photosPerPage
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage
  const currentPhotos = filteredPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto)
  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading photos...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Photos</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="photo-search"
              data-testid="photo-search"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedAlbum} onValueChange={setSelectedAlbum}>
              <SelectTrigger id="album-filter" data-testid="album-filter">
                <SelectValue placeholder="Filter by album" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Albums</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album.id} value={album.id.toString()}>
                    {album.title.length > 30 ? album.title.substring(0, 30) + "..." : album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentPhotos.map((photo) => (
          <Card
            key={photo.id}
            className="overflow-hidden hover:shadow-md transition-shadow photo-card"
            data-photo-id={photo.id}
          >
            <div className="aspect-square relative">
              <Image src={photo.thumbnailUrl || "/placeholder.svg"} alt={photo.title} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <p className="text-sm font-medium line-clamp-2 photo-title">{photo.title}</p>
              <p className="text-xs text-muted-foreground mt-1 photo-album">
                Album: {getAlbumTitle(photo.albumId).substring(0, 20)}...
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-8" id="no-photos-message" data-testid="no-photos-message">
          <p className="text-muted-foreground">No photos found matching your search criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {filteredPhotos.length > 0 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            id="prev-page"
            data-testid="prev-page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            id="next-page"
            data-testid="next-page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}