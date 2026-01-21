import { z } from "zod";

export const recommendationRequestSchema = z.object({
  category: z.enum(["korean", "chinese", "japanese", "western", "street", "vietnamese", "mexican", "asian"]),
  priceRange: z.enum(["budget", "moderate", "premium"]),
  spiceLevel: z.enum(["mild", "medium", "hot"]),
  location: z.string().optional(),
  coordinates: z
    .object({ lat: z.number(), lng: z.number() })
    .optional(),
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
