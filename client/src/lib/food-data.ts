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
  },
  {
    id: "vietnamese",
    name: "베트남",
    icon: "🍜",
    description: "쌀국수, 분짜, 반미...",
    color: "western-food"
  },
  {
    id: "mexican",
    name: "멕시칸",
    icon: "🌮",
    description: "타코, 부리또, 퀘사디아...",
    color: "street-food"
  },
  {
    id: "asian",
    name: "아시안",
    icon: "🥘",
    description: "팟타이, 나시고랭, 딤섬...",
    color: "chinese-food"
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

// Helper functions for prompt generation
function getCategoryName(id: string) {
  const cat = FOOD_CATEGORIES.find(c => c.id === id);
  return cat ? cat.name : id;
}

function getPriceDescription(id: string) {
  const p = PRICE_RANGES.find(r => r.id === id);
  return p ? p.description : id;
}

function getSpiceDescription(id: string) {
  switch (id) {
    case 'mild': return "Level 1/5 (Non-spicy, completely mild)";
    case 'medium': return "Level 3/5 (Moderately spicy, standard Korean spice)";
    case 'hot': return "Level 5/5 (Very spicy, hot)";
    default: return "Level 1/5 (Mild)";
  }
}

// ... baseItems and foodRecommendations ...

const foodRecommendations = baseItems.map(item => ({ ...item, imageUrls: [], imageUrl: null }));

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

async function fetchGoogleImages(query: string): Promise<string[]> {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const cx = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;
  
  if (!apiKey || !cx) return [];

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image&num=3&safe=active`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.items) return [];
    
    return data.items.map((item: any) => item.link);
  } catch (e) {
    console.error("Google Search fetch error:", e);
    return [];
  }
}

async function fetchPexelsImages(query: string): Promise<string[]> {
  const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
  if (!apiKey) return [];
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3`, {
      headers: { Authorization: apiKey }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.photos.map((p: any) => p.src.large);
  } catch (e) {
    console.error("Pexels fetch error:", e);
    return [];
  }
}

// Helper to fetch images from available sources
async function fetchFoodImages(koreanName: string, englishQuery?: string, categoryId?: string): Promise<string[]> {
  // 1. Try Google Images first (Most accurate for specific dish)
  const googleImages = await fetchGoogleImages(koreanName + " 음식"); 
  if (googleImages.length > 0) return googleImages;

  // 2. Fallback to Pexels (Stock photos for specific dish)
  const pexelsQuery = englishQuery ? `${englishQuery} food` : `${koreanName} food`;
  const pexelsImages = await fetchPexelsImages(pexelsQuery);
  if (pexelsImages.length > 0) return pexelsImages;

  // 3. Last Resort: Fetch Category Genre Image (e.g., "Korean Food", "Mexican Food")
  // This ensures we rarely show "No Image" while keeping relevance high enough.
  if (categoryId) {
    const categoryName = FOOD_CATEGORIES.find(c => c.id === categoryId)?.name || categoryId;
    const categoryQuery = categoryId === 'korean' ? 'Korean Food' : 
                          categoryId === 'mexican' ? 'Mexican Food' :
                          categoryId === 'vietnamese' ? 'Vietnamese Food' :
                          `${categoryName} food`;
                          
    console.log(`Fetching category fallback image for: ${categoryQuery}`);
    const categoryImages = await fetchPexelsImages(categoryQuery);
    if (categoryImages.length > 0) return categoryImages;
  }

  return [];
}

// ... getLocalFallback ...

async function withFallbackImage(recommendation: FoodRecommendation): Promise<FoodRecommendation> {
  if (!recommendation.imageUrl || recommendation.imageUrl.length === 0) {
    // Try to fetch live images using the new helper
    const liveImages = await fetchFoodImages(recommendation.name, undefined, recommendation.category);
    
    if (liveImages.length > 0) {
      return { ...recommendation, imageUrls: liveImages, imageUrl: liveImages[0], isAiGenerated: false };
    }
  }
  return { ...recommendation, isAiGenerated: false };
}

export async function getFoodRecommendation(request: RecommendationRequest): Promise<FoodRecommendation> {
  if (!ai) {
    console.warn("No Gemini API Key. Using fallback.");
    return withFallbackImage(getLocalFallback(request));
  }

  try {
    console.log("Calling Gemini API with @google/genai...");
    const prompt = `Recommend ONE specific lunch menu dish that STRICTLY matches these criteria:
    
    1. Category: ${getCategoryName(request.category)} (${request.category}) - MUST be this cuisine type.
    2. Price Range: ${getPriceDescription(request.priceRange)} - Dish average price MUST be within this range.
    3. Spice Level: ${getSpiceDescription(request.spiceLevel)} - Spice level MUST match this.
    
    * Context: Lunch recommendation for a Korean user.
    * Constraint: Do NOT recommend a generic list. Recommend ONE specific dish.
    
    Return strictly valid JSON (no markdown):
    {
      "name": "Dish Name (Korean)",
      "englishQuery": "English Search Term for Pexels (e.g. Delicious Kimchi Stew food photography)",
      "description": "Appetizing description in Korean explaining why it fits the criteria (max 1 sentence)",
      "price": estimated_price_number_KRW,
      "tags": ["Tag1", "Tag2"]
    }`;

    // ... (Gemini SDK call) ...

    // Use the unified fetch function
    const imageUrls = await fetchFoodImages(data.name, data.englishQuery, request.category);

    return {
      // ...
    };
  } catch (error) {
    console.warn("SDK Failed, trying REST fallback...", error);
    
    // REST Fallback
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      const prompt = `Recommend ONE specific lunch menu dish that STRICTLY matches these criteria:
      1. Category: ${getCategoryName(request.category)} (${request.category})
      2. Price Range: ${getPriceDescription(request.priceRange)}
      3. Spice Level: ${getSpiceDescription(request.spiceLevel)}
      
      Return strictly valid JSON (no markdown):
      { "name": "...", "englishQuery": "...", "description": "...", "price": 0, "tags": [...] }`;

      // ... (REST call) ...
      
      // Use the unified fetch function
      const imageUrls = await fetchFoodImages(data.name, data.englishQuery, request.category);

      return {
        // ...
      };
    } catch (restError) {
       // ...
    }
  }
}

export async function getAlternativeRecommendations(category: string, excludeId?: number): Promise<FoodRecommendation[]> {
  const alternatives = foodRecommendations.filter(food => food.id !== excludeId);
  const shuffled = alternatives.sort(() => Math.random() - 0.5).slice(0, 3);

  // Fetch accurate images for alternatives in parallel
  const updatedAlternatives = await Promise.all(shuffled.map(async (item) => {
    // Use the unified fetch function with category fallback
    const liveImages = await fetchFoodImages(item.name, undefined, item.category);
    
    if (liveImages.length > 0) {
      return { 
        ...item, 
        imageUrl: liveImages[0], 
        imageUrls: liveImages 
      };
    }
    return item;
  }));

  return updatedAlternatives;
}