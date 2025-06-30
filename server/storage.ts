import { users, foodRecommendations, type User, type InsertUser, type FoodRecommendation, type InsertFoodRecommendation, type RecommendationRequest } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getFoodRecommendation(request: RecommendationRequest): Promise<FoodRecommendation>;
  getAlternativeRecommendations(category: string, excludeId?: number): Promise<FoodRecommendation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private foodRecommendations: FoodRecommendation[] = [];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.initializeFoodData();
  }

  private initializeFoodData() {
    this.foodRecommendations = [
      // Korean Food
      {
        id: 1,
        name: "김치찌개",
        category: "korean",
        priceRange: "budget",
        spiceLevel: "medium",
        price: 8500,
        rating: "4.8",
        description: "얼큰하고 시원한 김치찌개로 속을 채워보세요! 따뜻한 국물이 몸을 데워줄 거예요.",
        imageUrl: "https://images.unsplash.com/photo-1582927349550-778a53160baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🌶️🌶️ 보통맛", "🍚 밥 포함", "🥬 반찬 3종"]
      },
      {
        id: 2,
        name: "된장찌개",
        category: "korean",
        priceRange: "budget",
        spiceLevel: "mild",
        price: 7000,
        rating: "4.6",
        description: "구수한 된장찌개로 든든한 한 끼를 즐겨보세요.",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍚 밥 포함", "🥬 반찬 포함"]
      },
      {
        id: 3,
        name: "불고기",
        category: "korean",
        priceRange: "moderate",
        spiceLevel: "mild",
        price: 12000,
        rating: "4.9",
        description: "달콤하고 부드러운 불고기로 특별한 점심을 만들어보세요.",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🥩 프리미엄 고기", "🍚 밥 포함"]
      },
      {
        id: 4,
        name: "제육볶음",
        category: "korean",
        priceRange: "moderate",
        spiceLevel: "medium",
        price: 9000,
        rating: "4.7",
        description: "매콤달콤한 제육볶음으로 입맛을 돋워보세요.",
        imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🌶️🌶️ 보통맛", "🍚 밥 포함", "🥬 상추 포함"]
      },
      {
        id: 5,
        name: "갈비탕",
        category: "korean",
        priceRange: "premium",
        spiceLevel: "mild",
        price: 15000,
        rating: "4.9",
        description: "진한 국물의 갈비탕으로 깊은 맛을 느껴보세요.",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍖 갈비 포함", "🍚 밥 포함"]
      },
      // Chinese Food
      {
        id: 6,
        name: "짜장면",
        category: "chinese",
        priceRange: "budget",
        spiceLevel: "mild",
        price: 6000,
        rating: "4.5",
        description: "달콤한 짜장소스의 클래식한 맛을 즐겨보세요.",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍜 면 요리", "🥒 단무지 포함"]
      },
      {
        id: 7,
        name: "짬뽕",
        category: "chinese",
        priceRange: "budget",
        spiceLevel: "medium",
        price: 7000,
        rating: "4.6",
        description: "얼큰한 국물의 짬뽕으로 시원하게 해결하세요.",
        imageUrl: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🌶️🌶️ 보통맛", "🍜 면 요리", "🦐 해물 포함"]
      },
      {
        id: 8,
        name: "탕수육",
        category: "chinese",
        priceRange: "moderate",
        spiceLevel: "mild",
        price: 18000,
        rating: "4.8",
        description: "바삭하고 달콤한 탕수육으로 특별한 점심을 만들어보세요.",
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍖 바삭한 고기", "🍚 밥 추가 가능"]
      },
      // Japanese Food
      {
        id: 9,
        name: "라멘",
        category: "japanese",
        priceRange: "budget",
        spiceLevel: "mild",
        price: 8000,
        rating: "4.7",
        description: "진한 돈코츠 국물의 라멘으로 든든하게 드세요.",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍜 면 요리", "🥚 반숙계란 포함"]
      },
      {
        id: 10,
        name: "초밥",
        category: "japanese",
        priceRange: "premium",
        spiceLevel: "mild",
        price: 25000,
        rating: "4.9",
        description: "신선한 회로 만든 프리미엄 초밥을 즐겨보세요.",
        imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍣 신선한 회", "🍵 된장국 포함"]
      },
      // Western Food
      {
        id: 11,
        name: "파스타",
        category: "western",
        priceRange: "moderate",
        spiceLevel: "mild",
        price: 12000,
        rating: "4.6",
        description: "크림 파스타로 부드러운 점심을 즐겨보세요.",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍝 면 요리", "🧀 치즈 포함"]
      },
      {
        id: 12,
        name: "피자",
        category: "western",
        priceRange: "moderate",
        spiceLevel: "mild",
        price: 15000,
        rating: "4.8",
        description: "치즈가 듬뿍 들어간 피자로 만족스러운 식사를 하세요.",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🧀 치즈 듬뿍", "🥗 샐러드 포함"]
      },
      // Street Food
      {
        id: 13,
        name: "떡볶이",
        category: "street",
        priceRange: "budget",
        spiceLevel: "medium",
        price: 4000,
        rating: "4.5",
        description: "매콤달콤한 떡볶이로 간단하게 배를 채워보세요.",
        imageUrl: "https://images.unsplash.com/photo-1582474368633-d8de6f07f3b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🌶️🌶️ 보통맛", "🍢 어묵 포함", "🥚 계란 추가 가능"]
      },
      {
        id: 14,
        name: "김밥",
        category: "street",
        priceRange: "budget",
        spiceLevel: "mild",
        price: 3000,
        rating: "4.4",
        description: "든든한 김밥으로 간편하게 점심을 해결하세요.",
        imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍚 밥 요리", "🥬 야채 포함"]
      }
    ];
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getFoodRecommendation(request: RecommendationRequest): Promise<FoodRecommendation> {
    // Find matching recommendations based on user preferences
    const matches = this.foodRecommendations.filter(food => 
      food.category === request.category &&
      food.priceRange === request.priceRange &&
      food.spiceLevel === request.spiceLevel
    );

    if (matches.length > 0) {
      // Return random match from exact matches
      return matches[Math.floor(Math.random() * matches.length)];
    }

    // Fallback: match category and price range only
    const partialMatches = this.foodRecommendations.filter(food => 
      food.category === request.category &&
      food.priceRange === request.priceRange
    );

    if (partialMatches.length > 0) {
      return partialMatches[Math.floor(Math.random() * partialMatches.length)];
    }

    // Final fallback: match category only
    const categoryMatches = this.foodRecommendations.filter(food => 
      food.category === request.category
    );

    return categoryMatches[Math.floor(Math.random() * categoryMatches.length)];
  }

  async getAlternativeRecommendations(category: string, excludeId?: number): Promise<FoodRecommendation[]> {
    return this.foodRecommendations
      .filter(food => food.category === category && food.id !== excludeId)
      .slice(0, 3);
  }
}

export const storage = new MemStorage();
