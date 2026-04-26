import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, Heart } from "lucide-react";
import type { Story, StoryChapter } from "@shared/schema";

type StoryWithChapters = Story & { chapters: StoryChapter[] };

export default function StoryDetail() {
  const [, params] = useRoute("/stories/:id");
  const id = params?.id;

  const { data, isLoading, error } = useQuery<StoryWithChapters>({
    queryKey: ["/api/stories", id],
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-xl bg-muted/40" />;
  }
  if (error || !data) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">We couldn't find that story.</p>
        <Link href="/discover" className="text-primary hover:underline">
          Back to discover
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-8">
      <Link href="/discover" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All stories
      </Link>

      <header className="space-y-3">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
          {data.genre}
        </span>
        <h1 className="text-4xl font-bold tracking-tight">{data.title}</h1>
        <p className="text-lg text-muted-foreground">{data.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Eye className="h-4 w-4" /> {data.views}</span>
          <span className="inline-flex items-center gap-1.5"><Heart className="h-4 w-4" /> {data.likeCount}</span>
        </div>
      </header>

      <section className="space-y-8">
        {data.chapters.length === 0 ? (
          <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            This story has no chapters yet.
          </p>
        ) : (
          data.chapters.map((chapter) => (
            <div key={chapter.id} className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">{chapter.title}</h2>
              <p className="whitespace-pre-line leading-relaxed text-foreground/90">
                {chapter.content}
              </p>
              {chapter.choices.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    What happens next?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {chapter.choices.map((choice) => (
                      <button
                        key={choice.id}
                        className="rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:border-primary hover:bg-primary/10"
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </article>
  );
}
