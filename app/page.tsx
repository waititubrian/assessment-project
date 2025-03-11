import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-4 lg:px-6">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">JSONPlaceholder App</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline">
            Log In
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to JSONPlaceholder App
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  A simple web application that interacts with JSONPlaceholder API. Explore users, albums, and photos.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button size="lg">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                  <svg
                    className=" h-6 w-6 text-gray-500 dark:text-gray-400"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">User Profiles</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Browse through user profiles and explore their details.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                  <svg
                    className=" h-6 w-6 text-gray-500 dark:text-gray-400"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Albums</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  View albums created by users and navigate through their content.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                  <svg
                    className=" h-6 w-6 text-gray-500 dark:text-gray-400"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect height="14" rx="2" ry="2" width="14" x="5" y="5" />
                    <path d="M15 2v3" />
                    <path d="M9 2v3" />
                    <path d="M9 15h6" />
                    <path d="M9 18h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Photos</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Browse through photos from different albums shared by users.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex h-16 items-center border-t px-4 lg:px-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} JSONPlaceholder App. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

