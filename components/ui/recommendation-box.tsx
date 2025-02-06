import { Button } from "./button"

export default function RecommendationBox({ item }: any) {
    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg">
            <p className="font-bold">{item[0]}</p>
            <p className="text-sm text-gray-600">{item[1]}</p>
            <Button variant='outline' className="w-fit">Add to watchlist</Button>
        </div>
    )
}
