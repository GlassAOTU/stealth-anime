import Image from "next/image"
import { silkscreen } from "./app/page"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import RecommendationBox from "./components/ui/recommendation-box"
import { fetchGameDetails } from "@/lib/fetchGameDetails"; // Adjust path based on your project structure

export default function Home() {
    const [selectedTags, setSelectedTags] = useState<string[]>([])  // state of empty array of string, initalized to an empty array
    const [customTag, setCustomTag] = useState("")   // stores user tag input
    const [description, setDescription] = useState("")
    const [recommendations, setRecommendations] = useState<{ title: string; description: string; image: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const tags = [
        "Action",
        "Adventure",
        "RPG",
        "Shooter",
        "Strategy",
        "Puzzle",
        "Platformer",
        "Simulation",
        "Horror",
        "Sports",
        "Fighting",
        "MMO",
        "Indie",
        "AAA"
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
            const gameList: string[] = data.recommendations.split(" | ");
            const gameFinish: { title: string; description: string; image: string }[] = [];

            for (const game of gameList) {
                const [title] = game.split(" ~ ");
                const { coverUrl, description: summary } = await fetchGameDetails(title);
                gameFinish.push({ title, description: summary ?? "No description available.", image: coverUrl ?? "/fallback.jpg" });


            }

            setRecommendations(gameFinish);
        } catch (err) {
            setError("Failed to get recommendations. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#18131b]">
            {/* banner image */}
            <div className="w-full bg-black flex justify-center">
                <img
                    src="/plg-banner.png"
                    alt="Banner"
                    className="w-full max-w-5xl h-auto object-contain"
                />
            </div>

            {/* main section */}
            <div className="container mx-auto px-4 py-8 space-y-6 text-[#E0E0E0]">
                {/* heading */}
                <div className={`relative text-center space-y-4 ${silkscreen.className}`}>
                    <h1 className="text-4xl font-bold tracking-tight">WELCOME TO PLG</h1>
                    <p className="text-3xl">Find your next game to play!</p>
                </div>

                {/* description section */}
                <div className="max-w-2xl mx-auto space-y-2 text-[#E0E0E0]">
                    <p>Share a short description of what you're looking for / choose some tags.</p>
                    <p className="text-sm">We take care of the rest</p>

                    {/* description input */}
                    <Input type="text" placeholder="Write your description..." className="w-full bg-[#1A1A1A] text-[#F8F8F2] border border-[#FF3CAC] placeholder-[#888] focus:outline-none hover:shadow-[0_0_10px_#ff8ace] focus:shadow-[0_0_10px_#ff8ace] transition-all rounded px-4 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                {/* tag section */}
                <div className="max-w-2xl mx-auto">
                    {/* tag label */}
                    <p className="mb-3 text-[#E0E0E0]">Tags (Choose up to {5 - selectedTags.length} or write your own)</p>

                    {/* list of tags */}
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                // prewritten tags
                                <Badge
                                    key={tag}
                                    variant={isSelected ? "default" : "outline"}
                                    className={`text-sm max-px-4 py-1 cursor-pointer transition-all text-[#E0E0E0] 
                                        ${isSelected
                                            ? "bg-[#ff5db9] hover:bg-[#ff8ace] text-[#0C0C0C]"
                                            : "border border-[#E0E0E0] hover:border-[#FF3CAC] hover:bg-[#18131b]"}`
                                    }
                                    onClick={() => handleTagClick(tag)}
                                >
                                    {tag}
                                </Badge>
                            );
                        })}

                        {/* custom written tags */}
                        {selectedTags
                            .filter((tag) => !tags.includes(tag)) // Only show truly custom tags
                            .map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="default"
                                    className="text-sm max-px-4 py-1 cursor-pointer transition-all text-[#0C0C0C] bg-[#ff5db9] hover:bg-[#ff8ace]"
                                    onClick={() => handleTagClick(tag)}
                                >
                                    {tag}
                                </Badge>
                            ))}

                        {/* custom tag input */}
                        {selectedTags.length < 5 && (
                            <input
                                type="text"
                                placeholder="Type a tag..."
                                value={customTag}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                className="text-sm px-2 py-1 rounded-full bg-[#1A1A1A] text-[#F8F8F2] border hover:shadow-[0_0_5px_#ff8ace] transition-all border-[#FF3CAC] placeholder-[#888] focus:outline-none"
                            />
                        )}
                    </div>

                    {/* recommend button */}
                    <Button className="w-full mx-auto mt-8 bg-[#00d0d0] transition-all hover:bg-[#00f7f7] hover:shadow-[0_0_10px_#00F7F7]  text-[#1A1A1A]" disabled={(!description && selectedTags.length === 0) || isLoading} onClick={handleGetRecommendations}>
                        {isLoading ? "Getting Recommendations..." : "Get Recommendations"}
                    </Button>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                    {/* list of returned recommendations */}
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
