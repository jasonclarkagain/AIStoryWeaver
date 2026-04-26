import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertStorySchema, insertChapterSchema } from "@shared/schema";
import {
  generateStoryContent,
  analyzeSentiment,
  generateChoices,
  improveWriting,
  isAiAvailable,
} from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, ai: isAiAvailable() });
  });

  app.get("/api/stories", async (_req, res) => {
    const stories = await storage.getStories({ publishedOnly: true });
    res.json(stories);
  });

  app.get("/api/stories/trending", async (_req, res) => {
    const stories = await storage.getStories({ publishedOnly: true });
    res.json(
      stories
        .slice()
        .sort((a, b) => b.likeCount + b.views - (a.likeCount + a.views))
        .slice(0, 6),
    );
  });

  app.get("/api/stories/:id", async (req, res) => {
    const story = await storage.getStory(req.params.id);
    if (!story) return res.status(404).json({ error: "Story not found" });
    await storage.incrementStoryViews(story.id);
    const chapters = await storage.getChapters(story.id);
    res.json({ ...story, chapters });
  });

  app.post("/api/stories", async (req, res) => {
    const parsed = insertStorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const story = await storage.createStory(parsed.data);
    res.status(201).json(story);
  });

  app.post("/api/stories/:id/chapters", async (req, res) => {
    const parsed = insertChapterSchema.safeParse({ ...req.body, storyId: req.params.id });
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const chapter = await storage.createChapter(parsed.data);
    res.status(201).json(chapter);
  });

  app.post("/api/stories/:id/like", async (req, res) => {
    const userId = z.string().min(1).safeParse(req.body?.userId);
    if (!userId.success) return res.status(400).json({ error: "userId is required" });
    const result = await storage.toggleStoryLike(req.params.id, userId.data);
    res.json(result);
  });

  const aiPromptSchema = z.object({ prompt: z.string().min(1), context: z.string().optional() });
  app.post("/api/ai/generate", async (req, res) => {
    const parsed = aiPromptSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    try {
      const content = await generateStoryContent(parsed.data.prompt, parsed.data.context);
      res.json({ content });
    } catch (err: any) {
      res.status(500).json({ error: err?.message ?? "AI request failed" });
    }
  });

  const textSchema = z.object({ text: z.string().min(1) });
  app.post("/api/ai/sentiment", async (req, res) => {
    const parsed = textSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    try {
      res.json(await analyzeSentiment(parsed.data.text));
    } catch (err: any) {
      res.status(500).json({ error: err?.message ?? "AI request failed" });
    }
  });

  app.post("/api/ai/choices", async (req, res) => {
    const parsed = textSchema.safeParse({ text: req.body?.context });
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    try {
      res.json({ choices: await generateChoices(parsed.data.text) });
    } catch (err: any) {
      res.status(500).json({ error: err?.message ?? "AI request failed" });
    }
  });

  app.post("/api/ai/improve", async (req, res) => {
    const parsed = textSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    try {
      res.json({ content: await improveWriting(parsed.data.text) });
    } catch (err: any) {
      res.status(500).json({ error: err?.message ?? "AI request failed" });
    }
  });

  return createServer(app);
}
