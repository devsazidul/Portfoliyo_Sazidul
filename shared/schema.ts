import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Projects schema
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  technologies: text("technologies").array().notNull(),
  link: text("link"),
  github: text("github"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Documents schema
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  fileUrl: text("file_url").notNull(),
  size: text("size").notNull(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true });
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Contact messages schema
export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true });
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Personal info type (static data)
export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  phone: string;
  skills: string[];
  stats: {
    yearsExperience: number;
    projectsCompleted: number;
    documentsShared: number;
    happyClients: number;
  };
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    dribbble?: string;
  };
}

// Users schema (keeping existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
