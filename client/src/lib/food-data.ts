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
  const s = SPICE_LEVELS.find(l => l.id === id);
  return s ? s.description : id;
}

const createFoodImages = (dishName: string): string[] => {
  const foodImageMap: { [key: string]: string[] } = {
    "김치찌개": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
      "https://images.unsplash.com/photo-1612428978309-0b7d97e7e924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
      "https://images.unsplash.com/photo-1611599238845-7f3c32eadb3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
    ],
  };
  return foodImageMap[dishName] || [
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    "https://images.unsplash.com/photo-1582927349550-778a53160baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
  ];
};

// Base items for local fallback
const baseItems = [
  { id: 1, name: "김치찌개", category: "korean", priceRange: "budget", spiceLevel: "medium", price: 8000, description: "얼큰하고 시원한 김치찌개!", imageUrl: null, tags: ["🌶️🌶️ 보통맛", "🍚 밥 포함"] },
  { id: 2, name: "된장찌개", category: "korean", priceRange: "budget", spiceLevel: "mild", price: 7000, description: "구수한 된장찌개!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 3, name: "불고기", category: "korean", priceRange: "moderate", spiceLevel: "mild", price: 12000, description: "달콤한 불고기!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 10, name: "짜장면", category: "chinese", priceRange: "budget", spiceLevel: "mild", price: 6000, description: "달콤한 짜장소스!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 15, name: "라멘", category: "japanese", priceRange: "budget", spiceLevel: "mild", price: 8000, description: "진한 국물 라멘!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 20, name: "스파게티", category: "western", priceRange: "budget", spiceLevel: "mild", price: 8500, description: "토마토 스파게티!", imageUrl: null, tags: ["🥛 순한맛"] },
  { id: 25, name: "떡볶이", category: "street", priceRange: "budget", spiceLevel: "medium", price: 4000, description: "매콤달콤 떡볶이!", imageUrl: null, tags: ["🌶️🌶️ 보통맛"] },
  { id: 30, name: "쌀국수", category: "vietnamese", priceRange: "budget", spiceLevel: "mild", price: 9000, description: "진한 육수의 베트남 쌀국수!", imageUrl: null, tags: ["🍜 담백한맛"] },
  { id: 31, name: "분짜", category: "vietnamese", priceRange: "moderate", spiceLevel: "mild", price: 12000, description: "숯불 돼지고기와 새콤달콤한 소스!", imageUrl: null, tags: ["🥗 새콤달콤"] },
  { id: 40, name: "타코", category: "mexican", priceRange: "budget", spiceLevel: "medium", price: 8000, description: "신선한 재료가 듬뿍 들어간 타코!", imageUrl: null, tags: ["🌮 멕시칸"] },
  { id: 41, name: "부리또", category: "mexican", priceRange: "moderate", spiceLevel: "medium", price: 11000, description: "든든한 한 끼, 멕시칸 부리또!", imageUrl: null, tags: ["🌯 든든한"] },
  { id: 50, name: "팟타이", category: "asian", priceRange: "moderate", spiceLevel: "medium", price: 11000, description: "태국식 볶음 쌀국수!", imageUrl: null, tags: ["🥘 아시안"] },
  { id: 51, name: "나시고랭", category: "asian", priceRange: "moderate", spiceLevel: "medium", price: 11000, description: "인도네시아식 볶음밥!", imageUrl: null, tags: ["🍛 볶음밥"] },
];

const foodRecommendations = baseItems.map(item => {
  const imageUrls = createFoodImages(item.name);
  return { ...item, imageUrls, imageUrl: imageUrls[0] };
});

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
async function fetchFoodImages(koreanName: string, englishQuery?: string): Promise<string[]> {
  // 1. Try Google Images first (Most accurate)
  // Use Korean name for Google as it's more accurate for local dishes
  const googleImages = await fetchGoogleImages(koreanName + " 음식"); 
  if (googleImages.length > 0) return googleImages;

  // 2. Fallback to Pexels (Stock photos)
  // Use English query + "food" for better stock photo results
  const pexelsQuery = englishQuery ? `${englishQuery} food` : `${koreanName} food`;
  const pexelsImages = await fetchPexelsImages(pexelsQuery);
  if (pexelsImages.length > 0) return pexelsImages;

  return [];
}

function getLocalFallback(request: RecommendationRequest): FoodRecommendation {
  const exactMatches = foodRecommendations.filter(food => 
    food.category === request.category &&
    food.priceRange === request.priceRange &&
    food.spiceLevel === request.spiceLevel
  );
  if (exactMatches.length > 0) return exactMatches[Math.floor(Math.random() * exactMatches.length)];

  const categoryMatches = foodRecommendations.filter(food => food.category === request.category);
  if (categoryMatches.length > 0) return categoryMatches[Math.floor(Math.random() * categoryMatches.length)];

  return foodRecommendations[Math.floor(Math.random() * foodRecommendations.length)];
}

async function withFallbackImage(recommendation: FoodRecommendation): Promise<FoodRecommendation> {
  if (!recommendation.imageUrl || recommendation.imageUrl.length === 0) {
    // Try to fetch live images using the new helper
    const liveImages = await fetchFoodImages(recommendation.name);
    
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

    // Try using the SDK with 'gemini-2.0-flash'
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    // Safely access text from response
    let responseText = "";
    const res = response as any;
    if (typeof res.text === 'function') {
      responseText = res.text();
    } else if (typeof res.text === 'string') {
      responseText = res.text;
    } else if (res.candidates && res.candidates[0]?.content?.parts?.[0]?.text) {
      responseText = res.candidates[0].content.parts[0].text;
    } else {
      console.warn("Unexpected Gemini response structure:", response);
      throw new Error("Invalid Gemini response structure");
    }

    console.log("Gemini Response:", responseText);
    
    let jsonStr = responseText || "{}";
    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);

    // Use the unified fetch function
    const imageUrls = await fetchFoodImages(data.name, data.englishQuery);

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
    console.warn("SDK Failed, trying REST fallback...", error);
    
    // REST Fallback - Use gemini-1.5-flash as it is most stable for REST
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      const prompt = `Recommend ONE specific lunch menu dish that STRICTLY matches these criteria:
      1. Category: ${getCategoryName(request.category)} (${request.category})
      2. Price Range: ${getPriceDescription(request.priceRange)}
      3. Spice Level: ${getSpiceDescription(request.spiceLevel)}
      
      Return strictly valid JSON (no markdown):
      { "name": "...", "englishQuery": "...", "description": "...", "price": 0, "tags": [...] }`;

      const restResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            role: "user",
            parts: [{ text: prompt }] 
          }]
        })
      });

      if (!restResponse.ok) {
        const errText = await restResponse.text();
        throw new Error(`REST Error: ${restResponse.status} - ${errText}`);
      }
      
      const restData = await restResponse.json();
      const text = restData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No text in REST response");

      const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(jsonStr);
      
      // Use the unified fetch function
      const imageUrls = await fetchFoodImages(data.name, data.englishQuery);

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
    } catch (restError) {
      console.error("All AI attempts failed:", restError);
      return withFallbackImage(getLocalFallback(request));
    }
  }
}

export async function getAlternativeRecommendations(category: string, excludeId?: number): Promise<FoodRecommendation[]> {
  const alternatives = foodRecommendations.filter(food => food.id !== excludeId);
  const shuffled = alternatives.sort(() => Math.random() - 0.5).slice(0, 3);

  // Fetch accurate images for alternatives in parallel
  const updatedAlternatives = await Promise.all(shuffled.map(async (item) => {
    // Use the unified fetch function
    // For alternatives (static items), we might not have 'englishQuery', so just use name
    const liveImages = await fetchFoodImages(item.name);
    
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