import { Link } from "wouter";
import { Eye, Heart } from "lucide-react";
import type { Story } from "@shared/schema";

export default function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      href={`/stories/${story.id}`}
      className="group flex h-full flex-col rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-md"
    >
      <span className="inline-block w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
        {story.genre}
      </span>
      <h3 className="mt-3 text-lg font-semibold group-hover:text-primary">{story.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
        {story.description || "An untold story awaits."}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {story.views}</span>
        <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {story.likeCount}</span>
      </div>
    </Link>
  );
}
