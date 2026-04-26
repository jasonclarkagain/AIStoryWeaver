import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, BookOpen, Wand2 } from "lucide-react";
import StoryCard from "@/components/StoryCard";
import type { Story } from "@shared/schema";

export default function Home() {
  const { data: trending = [], isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories/trending"],
  });

  return (
    <div className="space-y-12">
      <section className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-10 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI-powered interactive storytelling
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
          Weave stories that readers shape together with you
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          StoryWeave pairs your imagination with an AI co-author so you can craft branching
          narratives, explore fresh ideas, and publish stories your audience will love to read.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <Wand2 className="h-4 w-4" />
            Start a new story
          </Link>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 rounded-lg border bg-card px-5 py-2.5 text-sm font-semibold transition hover:bg-muted"
          >
            <BookOpen className="h-4 w-4" />
            Browse stories
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Trending stories</h2>
            <p className="text-sm text-muted-foreground">
              The most loved interactive tales right now.
            </p>
          </div>
          <Link href="/discover" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl border bg-muted/40" />
            ))}
          </div>
        ) : trending.length === 0 ? (
          <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            No trending stories yet. Be the first to publish one!
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trending.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
