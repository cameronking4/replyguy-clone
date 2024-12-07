"use client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface GifCardProps {
  url: string;
  title: string;
  description: string;
}

export function GifCard({ url, title, description }: GifCardProps) {
  return (
    <div className="w-full rounded-3xl">
      <div
        className={cn(
          "group w-full cursor-pointer overflow-hidden relative card h-48 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
          "bg-[url(https://images.unsplash.com/photo-1476842634003-7dcca8f832de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80)] bg-cover",
          // Preload hover image by setting it in a pseudo-element
          "before:bg-[url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlodTF3MjJ3NnJiY3Rlc2J0ZmE0c28yeWoxc3gxY2VtZzA5ejF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/syEfLvksYQnmM/giphy.gif)] before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
          "hover:bg-[url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlodTF3MjJ3NnJiY3Rlc2J0ZmE0c28yeWoxc3gxY2VtZzA5ejF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/syEfLvksYQnmM/giphy.gif)]",
          "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
          "transition-all duration-500"
        )}
      >
        <div className="text relative z-50">
          <Badge className="relative my-2 shadow-xl">
            {description}
          </Badge>
          <h1 className="font-bold text-xl md:text-3xl text-gray-50 relative">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}

export const GifGrid = ({ gifs  }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border shadow-xl rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifs.map((gif, index) => (
          <GifCard key={index} url={gif.url} title={gif.title} description={gif.description} />
        ))}
      </div>
    </div>
  );