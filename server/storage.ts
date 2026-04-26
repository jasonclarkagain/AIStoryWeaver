import { randomUUID } from "crypto";
import type {
  User,
  InsertUser,
  Story,
  InsertStory,
  StoryChapter,
  InsertChapter,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(input: InsertUser): Promise<User>;

  getStories(filter?: { publishedOnly?: boolean; authorId?: string }): Promise<Story[]>;
  getStory(id: string): Promise<Story | undefined>;
  createStory(input: InsertStory): Promise<Story>;
  updateStory(id: string, patch: Partial<Story>): Promise<Story | undefined>;
  incrementStoryViews(id: string): Promise<void>;
  toggleStoryLike(storyId: string, userId: string): Promise<{ liked: boolean; likeCount: number }>;

  getChapters(storyId: string): Promise<StoryChapter[]>;
  createChapter(input: InsertChapter): Promise<StoryChapter>;
}

export class MemStorage implements IStorage {
  private users = new Map<string, User>();
  private stories = new Map<string, Story>();
  private chapters = new Map<string, StoryChapter>();
  private likes = new Map<string, Set<string>>();

  constructor() {
    this.seed();
  }

  private seed() {
    const demoUser: User = {
      id: randomUUID(),
      username: "demo_author",
      email: "demo@storyweave.app",
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);

    const sampleStories: Array<Pick<Story, "title" | "description" | "genre">> = [
      {
        title: "The Last Lighthouse Keeper",
        description: "A solitary keeper discovers a mysterious signal from the depths of the sea.",
        genre: "mystery",
      },
      {
        title: "Echoes of the Forgotten City",
        description: "An archaeologist uncovers a city that was never supposed to exist.",
        genre: "adventure",
      },
      {
        title: "Stardust Memories",
        description: "Two strangers connect across galaxies through letters written in light.",
        genre: "sci-fi",
      },
    ];

    for (const sample of sampleStories) {
      const story: Story = {
        id: randomUUID(),
        authorId: demoUser.id,
        title: sample.title,
        description: sample.description,
        genre: sample.genre,
        coverImageUrl: null,
        isPublished: true,
        views: Math.floor(Math.random() * 500),
        likeCount: Math.floor(Math.random() * 100),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.stories.set(story.id, story);

      const firstChapter: StoryChapter = {
        id: randomUUID(),
        storyId: story.id,
        orderIndex: 0,
        title: "Chapter 1",
        content: `${sample.description}\n\nThe story begins here. Make a choice to continue.`,
        choices: [
          { id: randomUUID(), label: "Step into the unknown", nextChapterId: null },
          { id: randomUUID(), label: "Turn back and reflect", nextChapterId: null },
        ],
        createdAt: new Date(),
      };
      this.chapters.set(firstChapter.id, firstChapter);
    }
  }

  async getUser(id: string) {
    return this.users.get(id);
  }

  async getUserByUsername(username: string) {
    return Array.from(this.users.values()).find((u) => u.username === username);
  }

  async createUser(input: InsertUser) {
    const user: User = {
      id: randomUUID(),
      createdAt: new Date(),
      ...input,
    };
    this.users.set(user.id, user);
    return user;
  }

  async getStories(filter?: { publishedOnly?: boolean; authorId?: string }) {
    let result = Array.from(this.stories.values());
    if (filter?.publishedOnly) result = result.filter((s) => s.isPublished);
    if (filter?.authorId) result = result.filter((s) => s.authorId === filter.authorId);
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getStory(id: string) {
    return this.stories.get(id);
  }

  async createStory(input: InsertStory) {
    const story: Story = {
      id: randomUUID(),
      authorId: input.authorId,
      title: input.title,
      description: input.description ?? "",
      genre: input.genre ?? "general",
      coverImageUrl: input.coverImageUrl ?? null,
      isPublished: input.isPublished ?? false,
      views: 0,
      likeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stories.set(story.id, story);
    return story;
  }

  async updateStory(id: string, patch: Partial<Story>) {
    const existing = this.stories.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch, updatedAt: new Date() };
    this.stories.set(id, updated);
    return updated;
  }

  async incrementStoryViews(id: string) {
    const existing = this.stories.get(id);
    if (!existing) return;
    existing.views += 1;
    this.stories.set(id, existing);
  }

  async toggleStoryLike(storyId: string, userId: string) {
    const story = this.stories.get(storyId);
    if (!story) return { liked: false, likeCount: 0 };
    const set = this.likes.get(storyId) ?? new Set<string>();
    let liked: boolean;
    if (set.has(userId)) {
      set.delete(userId);
      story.likeCount = Math.max(0, story.likeCount - 1);
      liked = false;
    } else {
      set.add(userId);
      story.likeCount += 1;
      liked = true;
    }
    this.likes.set(storyId, set);
    this.stories.set(storyId, story);
    return { liked, likeCount: story.likeCount };
  }

  async getChapters(storyId: string) {
    return Array.from(this.chapters.values())
      .filter((c) => c.storyId === storyId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async createChapter(input: InsertChapter) {
    const chapter: StoryChapter = {
      id: randomUUID(),
      storyId: input.storyId,
      orderIndex: input.orderIndex ?? 0,
      title: input.title,
      content: input.content ?? "",
      choices: input.choices ?? [],
      createdAt: new Date(),
    };
    this.chapters.set(chapter.id, chapter);
    return chapter;
  }
}

export const storage: IStorage = new MemStorage();
