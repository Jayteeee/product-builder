import { GoogleGenAI } from "@google/genai";
import type { FoodRecommendation, RecommendationRequest } from "@/lib/types";

export const FOOD_CATEGORIES = [
  {
    id: "korean",
    name: "한식",
    icon: "🍚",
    description: "김치찌개, 비빔밥...",
    color: "korean-food"
  },
  {
    id: "chinese", 
    name: "중식",
    icon: "🥢",
    description: "짜장면, 탕수육...",
    color: "chinese-food"
  },
  {
    id: "japanese",
    name: "일식", 
    icon: "🍣",
    description: "초밥, 라멘...",
    color: "japanese-food"
  },
  {
    id: "western",
    name: "양식",
    icon: "🍔", 
    description: "파스타, 피자...",
    color: "western-food"
  },
  {
    id: "street",
    name: "분식/간식",
    icon: "🌭",
    description: "떡볶이, 김밥, 핫도그...",
    color: "street-food"
  }
] as const;

export const PRICE_RANGES = [
  {
    id: "budget",
    name: "저렴한 가격",
    description: "5,000원 ~ 8,000원",
    icon: "💰",
    emoji: "😊"
  },
  {
    id: "moderate", 
    name: "적당한 가격",
    description: "8,000원 ~ 12,000원",
    icon: "💳",
    emoji: "😋"
  },
  {
    id: "premium",
    name: "프리미엄",
    description: "12,000원 이상", 
    icon: "💎",
    emoji: "🤤"
  }
] as const;

export const SPICE_LEVELS = [
  {
    id: "mild",
    name: "순한맛",
    description: "매운맛 없이 부드럽게",
    icon: "🥛",
    spiceIcon: "🌶️"
  },
  {
    id: "medium",
    name: "보통맛", 
    description: "적당히 매콤하게",
    icon: "🔥",
    spiceIcon: "🌶️🌶️"
  },
  {
    id: "hot",
    name: "매운맛",
    description: "진짜 매운맛으로!",
    icon: "🌋", 
    spiceIcon: "🌶️🌶️🌶️"
  }
] as const;

// Base items for local fallback
const baseItems = [
  { id: 1, name: "김치찌개", category: "korean", priceRange: "budget", spiceLevel: "medium", price: 8000, description: "얼큰하고 시원한 김치찌개!", imageUrl: null, tags: ["🌶️🌶️ 보통맛", "🍚 밥 포함"] },
  { id: 2, name: "된장찌개", category: "korean", priceRange: "budget", spiceLevel: "mild", price: 7000, description: "구수한 된장찌개!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 3, name: "불고기", category: "korean", priceRange: "moderate", spiceLevel: "mild", price: 12000, description: "달콤한 불고기!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 10, name: "짜장면", category: "chinese", priceRange: "budget", spiceLevel: "mild", price: 6000, description: "달콤한 짜장소스!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 15, name: "라멘", category: "japanese", priceRange: "budget", spiceLevel: "mild", price: 8000, description: "진한 국물 라멘!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 20, name: "스파게티", category: "western", priceRange: "budget", spiceLevel: "mild", price: 8500, description: "토마토 소스 스파게티!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 25, name: "떡볶이", category: "street", priceRange: "budget", spiceLevel: "medium", price: 4000, description: "매콤달콤 떡볶이!", imageUrl: null, tags: ["🌶️🌶️ 보통맛"] },
];

const foodRecommendations = baseItems.map(item => {
  return { ...item, imageUrls: [], imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300" };
});

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

async function fetchPexelsImages(query: string): Promise<string[]> {
  const pexelsKey = import.meta.env.VITE_PEXELS_API_KEY;
  if (!pexelsKey) return [];
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3`, {
      headers: { Authorization: pexelsKey }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.photos.map((p: any) => p.src.large);
  } catch (e) {
    console.error("Pexels fetch error:", e);
    return [];
  }
}

function getLocalFallback(request: RecommendationRequest): FoodRecommendation {
  const exactMatches = foodRecommendations.filter(food => 
    food.category === request.category &&
    food.priceRange === request.priceRange &&
    food.spiceLevel === request.spiceLevel
  );
  if (exactMatches.length > 0) return exactMatches[Math.floor(Math.random() * exactMatches.length)];
  return foodRecommendations[Math.floor(Math.random() * foodRecommendations.length)];
}

async function withFallbackImage(recommendation: FoodRecommendation): Promise<FoodRecommendation> {
  const liveImages = await fetchPexelsImages(recommendation.name);
  if (liveImages.length > 0) {
    return { ...recommendation, imageUrls: liveImages, imageUrl: liveImages[0], isAiGenerated: false };
  }
  return { ...recommendation, isAiGenerated: false };
}

export async function getFoodRecommendation(request: RecommendationRequest): Promise<FoodRecommendation> {
  if (!ai) {
    console.warn("No Gemini API Key found. Using local fallback.");
    return withFallbackImage(getLocalFallback(request));
  }

  try {
    console.log("Calling Gemini API with @google/genai...");
    const prompt = `Recommend one specific, popular lunch menu dish (Korean preference) based on:
    Category: ${request.category}
    Price Range: ${request.priceRange}
    Spice Level: ${request.spiceLevel}
    
    Return strictly valid JSON (no markdown):
    {
      "name": "Dish Name (Korean)",
      "englishQuery": "English Search Term for Pexels (e.g. Delicious Kimchi Stew)",
      "description": "Appetizing description in Korean (max 1 sentence)",
      "price": estimated_price_number_KRW,
      "tags": ["Tag1", "Tag2"]
    }`;

    // Using the new SDK syntax from the user's snippet (simple string content)
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    console.log("Gemini Response:", response.text());
    const jsonStr = result.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);

    // Combine Korean Name + English Query for exact matching
    const combinedQuery = `${data.name} ${data.englishQuery}`;
    const imageUrls = await fetchPexelsImages(combinedQuery);

    return {
      id: Date.now(),
      name: data.name,
      category: request.category,
      priceRange: request.priceRange,
      spiceLevel: request.spiceLevel,
      price: data.price,
      description: data.description,
      imageUrl: imageUrls[0] || null,
      imageUrls: imageUrls,
      tags: data.tags,
      isAiGenerated: true
    };
  } catch (error) {
    console.error("Gemini AI Failed:", error);
    return withFallbackImage(getLocalFallback(request));
  }
}

export async function getAlternativeRecommendations(category: string, excludeId?: number): Promise<FoodRecommendation[]> {
  const alternatives = foodRecommendations.filter(food => food.id !== excludeId);
  const shuffled = alternatives.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3) as FoodRecommendation[];
}
