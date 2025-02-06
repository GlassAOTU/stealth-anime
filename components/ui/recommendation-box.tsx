import Image from "next/image";
import { Button } from "./button";

export default function RecommendationBox({ item }: any) {
  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <Image src={item.image} alt={item.title} width={100} height={150} className="rounded-lg" />
      <div className="flex flex-col justify-between">
        <div>
          <p className="font-bold">{item.title}</p>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
        <Button variant="outline" className="w-fit">Add to watchlist</Button>
      </div>
    </div>
  );
}
