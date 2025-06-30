import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const foodRecommendations = pgTable("food_recommendations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  priceRange: text("price_range").notNull(),
  spiceLevel: text("spice_level").notNull(),
  price: integer("price").notNull(),
  rating: text("rating").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  imageUrls: text("image_urls").array(),
  tags: text("tags").array(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFoodRecommendationSchema = createInsertSchema(foodRecommendations).omit({
  id: true,
});

export const recommendationRequestSchema = z.object({
  category: z.enum(["korean", "chinese", "japanese", "western", "street"]),
  priceRange: z.enum(["budget", "moderate", "premium"]),
  spiceLevel: z.enum(["mild", "medium", "hot"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type FoodRecommendation = typeof foodRecommendations.$inferSelect;
export type InsertFoodRecommendation = z.infer<typeof insertFoodRecommendationSchema>;
export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;
