import Image from "next/image"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import RecommendationBox from "./components/ui/recommendation-box"
import { fetchAnimeCover } from "@/app/api/anilist/route"; // Adjust path based on your project structure


export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [recommendations, setRecommendations] = useState<
    { title: string; description: string; image: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const tags = [
    "Shonen",
    "Isekai",
    "Fantasy",
    "Slice of Life",
    "Sci-Fi",
    "Romance",
    "Comedy",
    "Sports",
    "Horror",
    "Psychological",
    "Retro",
    "90s",
  ]

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, tags: selectedTags }),
      });

      if (!response.ok) throw new Error("Failed to get recommendations");

      const data = await response.json();
      const animeList: string[] = data.recommendations.split(" | ");
      const animeFinish: { title: string; description: string; image: string }[] = [];

      for (const anime of animeList) {
        const [title, description] = anime.split(" ~ ");
        const image = await fetchAnimeCover(title);
        animeFinish.push({ title, description, image });
      }

      setRecommendations(animeFinish);
    } catch (err) {
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold">BENTO</div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Discover
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Recommendations
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Watchlist
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="text-sm text-gray-600">Sign Out</button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recommended%20Anime-19iGdw33ZsM1k2jm0QZ8CvjcJI2G9Q.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="relative h-[300px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i-made-some-phone-wallpapers-from-the-first-4-episodes-v0-74rejus01woc1-ps2l55aLfu2uXnHS0UYqVMNQnnYTRT.webp')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 to-orange-300/50 backdrop-blur-sm"></div>
        </div>
        <div className="relative text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">WELCOME TO BENTO</h1>
          <p className="text-xl">A new way to save and discover your favorite anime!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-gray-600">Share a short description of what you're looking for / choose some tags.</p>
          <p className="text-sm text-gray-500">We take care of the rest</p>
          <Input type="text" placeholder="Write your description..." className="w-full" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="mb-3 text-gray-600">Tags (Choose up to {5 - selectedTags.length})</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag)
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  className={`text-sm max-px-4 py-1 cursor-pointer transition-all ${isSelected ? "bg-purple-500 hover:bg-purple-600" : "hover:bg-purple-100"} ${selectedTags.length >= 5 && !isSelected ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              )
            })}
          </div>
          <Button className="w-full mx-auto mt-8 bg-purple-500 hover:bg-purple-600 text-white" disabled={(!description && selectedTags.length === 0) || isLoading} onClick={handleGetRecommendations}>
            {isLoading ? "Getting Recommendations..." : "Get Recommendations"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <div className="flex flex-col mt-8 gap-2">
            {recommendations.map((item, index) => (
              <div key={index}>
                <RecommendationBox item={item} />
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  )
}
