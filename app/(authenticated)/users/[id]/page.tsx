"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, MapPin, Phone, Globe, Building2 } from "lucide-react"

type User = {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

type Album = {
  id: number
  userId: number
  title: string
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const [userResponse, albumsResponse] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/users/${userId}`),
          fetch(`https://jsonplaceholder.typicode.com/users/${userId}/albums`),
        ])

        if (!userResponse.ok) {
          throw new Error("User not found")
        }

        const userData = await userResponse.json()
        const albumsData = await albumsResponse.json()

        setUser(userData)
        setAlbums(albumsData)
      } catch (error) {
        console.error("Error fetching user data:", error)
        router.push("/users")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [userId, router])

  if (isLoading) {
    return <div className="text-center py-8">Loading user details...</div>
  }

  if (!user) {
    return <div className="text-center py-8">User not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Username</div>
                  <div>@{user.username}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Email</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Phone</div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Website</div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{user.website}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address & Company</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Address</div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>
                      {user.address.street}, {user.address.suite}
                      <br />
                      {user.address.city}, {user.address.zipcode}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Company</div>
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div>{user.company.name}</div>
                      <div className="text-sm text-muted-foreground">{user.company.catchPhrase}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="albums" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Albums</CardTitle>
            </CardHeader>
            <CardContent>
              {albums.length > 0 ? (
                <div className="grid gap-2">
                  {albums.map((album) => (
                    <Link
                      key={album.id}
                      href={`/albums/${album.id}`}
                      className="block p-3 hover:bg-accent rounded-md transition-colors"
                    >
                      {album.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No albums found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

