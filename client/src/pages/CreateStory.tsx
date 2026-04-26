import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Wand2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Story } from "@shared/schema";

export default function CreateStory() {
  const [, navigate] = useLocation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("fantasy");
  const [openingScene, setOpeningScene] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      const story = await apiRequest<Story>("POST", "/api/stories", {
        authorId: "00000000-0000-0000-0000-000000000000",
        title,
        description,
        genre,
        isPublished: true,
      });
      if (openingScene.trim()) {
        await apiRequest("POST", `/api/stories/${story.id}/chapters`, {
          orderIndex: 0,
          title: "Chapter 1",
          content: openingScene,
          choices: [],
        });
      }
      return story;
    },
    onSuccess: (story) => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stories/trending"] });
      navigate(`/stories/${story.id}`);
    },
    onError: (err: Error) => setError(err.message),
  });

  const aiMutation = useMutation({
    mutationFn: async () => {
      const prompt = `Suggest the opening of a ${genre} story titled "${title || "Untitled"}" with this premise: ${description || "n/a"}`;
      return apiRequest<{ content: string }>("POST", "/api/ai/generate", { prompt });
    },
    onSuccess: ({ content }) => setAiSuggestion(content),
    onError: (err: Error) => setError(err.message),
  });

  const canSubmit = title.trim().length > 0 && !createMutation.isPending;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          if (canSubmit) createMutation.mutate();
        }}
        className="space-y-6 rounded-xl border bg-card p-6"
      >
        <div>
          <h1 className="text-2xl font-bold">Start a new story</h1>
          <p className="text-sm text-muted-foreground">
            Sketch your idea, set the mood, and let AI help shape the opening.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="The night the stars fell"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {["fantasy", "sci-fi", "mystery", "romance", "adventure", "horror", "general"].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short hook about your story"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Opening scene</label>
            <button
              type="button"
              disabled={aiMutation.isPending}
              onClick={() => aiMutation.mutate()}
              className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/5 disabled:opacity-60"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {aiMutation.isPending ? "Thinking..." : "AI suggestion"}
            </button>
          </div>
          <textarea
            value={openingScene}
            onChange={(e) => setOpeningScene(e.target.value)}
            rows={8}
            placeholder="Set the scene. Describe what your reader sees, hears, and feels..."
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed focus:border-primary focus:outline-none"
          />
          {aiSuggestion && (
            <div className="rounded-lg border bg-primary/5 p-4 text-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                AI suggestion
              </p>
              <p className="whitespace-pre-line text-foreground/90">{aiSuggestion}</p>
              <button
                type="button"
                onClick={() => setOpeningScene((prev) => (prev ? `${prev}\n\n${aiSuggestion}` : aiSuggestion))}
                className="mt-3 text-xs font-medium text-primary hover:underline"
              >
                Use this suggestion
              </button>
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-60"
        >
          <Wand2 className="h-4 w-4" />
          {createMutation.isPending ? "Publishing..." : "Publish story"}
        </button>
      </form>

      <aside className="space-y-4">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold">Tips for great stories</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Open with a moment of tension or wonder.</li>
            <li>· Anchor the scene with sensory detail.</li>
            <li>· Let the reader's first choice matter.</li>
            <li>· Lean on AI for fresh angles, then make it yours.</li>
          </ul>
        </div>
        <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-accent/10 p-5">
          <h3 className="text-sm font-semibold">Need inspiration?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap "AI suggestion" to spark an opening scene tailored to your title and genre.
          </p>
        </div>
      </aside>
    </div>
  );
}
