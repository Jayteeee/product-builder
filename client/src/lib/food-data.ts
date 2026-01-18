import { GoogleGenerativeAI } from "@google/generative-ai";
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

const createFoodImages = (dishName: string): string[] => {
  const foodImageMap: { [key: string]: string[] } = {
    "김치찌개": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
      "https://images.unsplash.com/photo-1612428978309-0b7d97e7e924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
      "https://images.unsplash.com/photo-1611599238845-7f3c32eadb3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
    ],
    "된장찌개": [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
    ],
    // ... (rest of the images logic could be simplified but kept for fallback)
  };
  return foodImageMap[dishName] || [
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    "https://images.unsplash.com/photo-1582927349550-778a53160baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
  ];
};

const baseItems = [
  // Korean Food - Budget
  {
    id: 1,
    name: "김치찌개",
    category: "korean",
    priceRange: "budget",
    spiceLevel: "medium",
    price: 8000,
    description: "얼큰하고 시원한 김치찌개로 속을 채워보세요!",
    imageUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    tags: ["🌶️🌶️ 보통맛", "🍚 밥 포함"]
  },
  {
    id: 2,
    name: "된장찌개",
    category: "korean",
    priceRange: "budget",
    spiceLevel: "mild",
    price: 7000,
    description: "구수한 된장찌개로 든든한 한 끼를 즐겨보세요.",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    tags: ["🥛 순한맛", "🍚 밥 포함"]
  },
  // We keep a small base set for fallback
  { id: 10, name: "짜장면", category: "chinese", priceRange: "budget", spiceLevel: "mild", price: 6000, description: "달콤한 짜장소스의 클래식한 맛!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 15, name: "라멘", category: "japanese", priceRange: "budget", spiceLevel: "mild", price: 8000, description: "진한 돈코츠 국물의 라멘!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 20, name: "스파게티", category: "western", priceRange: "budget", spiceLevel: "mild", price: 8500, description: "토마토 소스 스파게티!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 25, name: "떡볶이", category: "street", priceRange: "budget", spiceLevel: "medium", price: 4000, description: "매콤달콤한 떡볶이!", imageUrl: null, tags: ["🌶️🌶️ 보통맛"] },
];

const foodRecommendations = baseItems.map(item => {
  const imageUrls = createFoodImages(item.name);
  return {
    ...item,
    imageUrls,
    imageUrl: imageUrls[0]
  };
});

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

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

function getLocalFallback(request: RecommendationRequest): FoodRecommendation {
  // Simple random fallback
  return foodRecommendations[Math.floor(Math.random() * foodRecommendations.length)];
}

export async function getFoodRecommendation(request: RecommendationRequest): Promise<FoodRecommendation> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    const selected = getLocalFallback(request);
    const liveImages = await fetchPexelsImages(selected.name); // Search by name as fallback
    if (liveImages.length > 0) {
      return { ...selected, imageUrls: liveImages, imageUrl: liveImages[0] };
    }
    return selected;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Recommend one specific, popular lunch menu dish (Korean preference) based on:
    Category: ${request.category}
    Price Range: ${request.priceRange}
    Spice Level: ${request.spiceLevel}
    
    Return strictly valid JSON (no markdown):
    {
      "name": "Dish Name (Korean)",
      "englishQuery": "English Search Term for Pexels (e.g. Delicious Kimchi Stew food photography)",
      "description": "Appetizing description in Korean (max 1 sentence)",
      "price": estimated_price_in_KRW_number,
      "tags": ["Tag1", "Tag2"]
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);

    const imageUrls = await fetchPexelsImages(data.englishQuery);

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
      tags: data.tags
    };
  } catch (error) {
    console.error("Gemini AI Error:", error);
    const selected = getLocalFallback(request);
    return selected;
  }
}

export async function getAlternativeRecommendations(category: string, excludeId?: number): Promise<FoodRecommendation[]> {
  // For alternatives, we can just use the local fallback list for speed, 
  // or call Gemini again (but that's slow). Let's use local fallback for now.
  const alternatives = foodRecommendations
    .filter(food => food.id !== excludeId);
  
  const shuffled = alternatives.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3) as FoodRecommendation[];
}