import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stories = pgTable("stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  genre: text("genre").notNull().default("general"),
  coverImageUrl: text("cover_image_url"),
  isPublished: boolean("is_published").notNull().default(false),
  views: integer("views").notNull().default(0),
  likeCount: integer("like_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const storyChapters = pgTable("story_chapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storyId: varchar("story_id").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  choices: jsonb("choices").$type<StoryChoice[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const storyLikes = pgTable("story_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storyId: varchar("story_id").notNull(),
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type StoryChoice = {
  id: string;
  label: string;
  nextChapterId?: string | null;
};

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  views: true,
  likeCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChapterSchema = createInsertSchema(storyChapters).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type StoryChapter = typeof storyChapters.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type StoryLike = typeof storyLikes.$inferSelect;
