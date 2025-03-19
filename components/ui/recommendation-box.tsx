// import Image from "next/image";
// import { Button } from "./button";

// export default function RecommendationBox({ item }: any) {
//   return (
//     <div className="flex gap-4 p-4 border rounded-lg">
//       <Image src={item.image} alt={item.title} width={100} height={150} className="rounded-lg" />
//       <div className="flex flex-col justify-between">
//         <div>
//           <p className="font-bold">{item.title}</p>
//           <p className="text-sm text-gray-600">{item.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function RecommendationBox({ item }: { item: { title: string; description: string; image: string; streamingLink: { url: string; site: string } | null } }) {
    return (
        <Card className="p-4 flex gap-4 items-start">
            <Image src={item.image} alt={item.title} width={100} height={150} className="rounded-lg" />
            <CardContent className="flex flex-col space-y-2">
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>

                {item.streamingLink && (
                    <div className="mt-2">
                        <p className="text-sm font-semibold">Watch here:</p>
                        <a 
                            href={item.streamingLink.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline"
                        >
                            {item.streamingLink.site}
                        </a>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
