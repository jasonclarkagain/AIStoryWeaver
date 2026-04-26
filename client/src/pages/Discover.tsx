import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import StoryCard from "@/components/StoryCard";
import type { Story } from "@shared/schema";

export default function Discover() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string>("all");
  const { data: stories = [], isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const s of stories) set.add(s.genre);
    return ["all", ...Array.from(set)];
  }, [stories]);

  const filtered = useMemo(() => {
    return stories.filter((s) => {
      const matchesGenre = genre === "all" || s.genre === genre;
      const text = `${s.title} ${s.description}`.toLowerCase();
      const matchesQuery = !query || text.includes(query.toLowerCase());
      return matchesGenre && matchesQuery;
    });
  }, [stories, genre, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Discover stories</h1>
        <p className="text-muted-foreground">Browse, search, and dive into interactive worlds.</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories..."
            className="w-full rounded-lg border bg-card py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
                g === genre
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card hover:bg-muted"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl border bg-muted/40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          No stories match your filters yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}
