import { z } from "zod";

export const recommendationRequestSchema = z.object({
  category: z.enum(["korean", "chinese", "japanese", "western", "street"]),
  priceRange: z.enum(["budget", "moderate", "premium"]),
  spiceLevel: z.enum(["mild", "medium", "hot"]),
});

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;

export interface FoodRecommendation {
  id: number;
  name: string;
  category: string;
  priceRange: string;
  spiceLevel: string;
  price: number;
  description: string;
  imageUrl: string | null;
  imageUrls: string[] | null;
  tags: string[] | null;
  isAiGenerated?: boolean;
}
