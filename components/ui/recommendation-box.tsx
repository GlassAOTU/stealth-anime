import Image from "next/image";
import { Button } from "./button";

export default function RecommendationBox({ item }: any) {
  return (
    <div className="flex gap-4 p-10 border rounded-lg border-[#00d0d0] bg-[#18131b] hover:shadow-[0_0_10px_#00F7F7] transition-all">
      <Image src={item.image} alt={item.title} width={100} height={150} className="rounded-lg outline " />
      <div className="flex flex-col justify-between">
        <div>
          <p className="font-bold">{item.title}</p>
          <p className="text-sm text-[#F0F0F0]">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
