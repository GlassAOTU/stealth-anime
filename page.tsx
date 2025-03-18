import Image from "next/image"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import RecommendationBox from "./components/ui/recommendation-box"
import { fetchAnimeCover } from "@/app/api/anilist/route"; // Adjust path based on your project structure


export default function Home() {
    const [selectedTags, setSelectedTags] = useState<string[]>([])  // state of empty array of string, initalized to an empty array
    const [customTag, setCustomTag] = useState("")   // stores user tag input
    const [description, setDescription] = useState("")
    const [recommendations, setRecommendations] = useState<{ title: string; description: string; image: string }[]>([]);
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
        "Long runners",
        "Quick watches"
    ]

    const handleTagClick = (tag: string) => {
        if (selectedTags.includes(tag)) {   // checks to see if the selectedTags array already included the tag
            setSelectedTags(selectedTags.filter(t => t !== tag))    // removes tag from the selectedTags array
        } else if (selectedTags.length < 5) {   // if there is space for more tags
            setSelectedTags([...selectedTags, tag])     // adds tag to the end selectedTags array
        }
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomTag(e.target.value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();  // Prevent accidental form submission

            const trimmedTag = customTag.trim();
            if (!trimmedTag) return; // Ignore empty input

            // Check for duplicates and tag limit
            if (!selectedTags.includes(trimmedTag) && selectedTags.length < 5) {
                setSelectedTags([...selectedTags, trimmedTag]); // Add new tag
            }

            setCustomTag(""); // Clear input
        }
    };

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

            <div className="relative h-[350px] flex items-center justify-center text-white">
                <div className="absolute inset-0 bg-[url('/banner-image.png')] bg-cover bg-center">
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
                    <p className="mb-3 text-gray-600">Tags (Choose up to {5 - selectedTags.length} or write your own)</p>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <Badge
                                    key={tag}
                                    variant={isSelected ? "default" : "outline"}
                                    className={`text-sm max-px-4 py-1 cursor-pointer transition-all ${isSelected ? "bg-purple-500 hover:bg-purple-600" : "hover:bg-purple-100"
                                        }`}
                                    onClick={() => handleTagClick(tag)}
                                >
                                    {tag}
                                </Badge>
                            );
                        })}

                        {/* Render custom tags that weren't in the original list */}
                        {selectedTags
                            .filter((tag) => !tags.includes(tag)) // Only show truly custom tags
                            .map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="default"
                                    className="text-sm max-px-4 py-1 cursor-pointer transition-all bg-purple-500 hover:bg-purple-600"
                                    onClick={() => handleTagClick(tag)}
                                >
                                    {tag}
                                </Badge>
                            ))}

                        {/* Custom tag input (only if less than 5 tags are selected) */}
                        {selectedTags.length < 5 && (
                            <input
                                type="text"
                                placeholder="Type a tag..."
                                value={customTag}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                className="text-sm px-2 py-1 rounded-full border border-gray-300 w-36 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        )}
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
