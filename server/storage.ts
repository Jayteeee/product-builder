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
    // Helper function to create authentic Korean food imageUrls
    const createKoreanFoodImages = (dishName: string) => {
      const koreanFoodImages: { [key: string]: string[] } = {
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
        "비빔밥": [
          "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1611599238845-7f3c32eadb3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1582927349550-778a53160baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "육개장": [
          "https://images.unsplash.com/photo-1582927349550-778a53160baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "불고기": [
          "https://images.unsplash.com/photo-1598515213692-d4238af99ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1590777461479-2b68d2616bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1605809138252-14c62e7b9fe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "제육볶음": [
          "https://images.unsplash.com/photo-1590777461479-2b68d2616bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1605809138252-14c62e7b9fe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "갈비탕": [
          "https://images.unsplash.com/photo-1582927349550-778a53160baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "삼겹살": [
          "https://images.unsplash.com/photo-1590777461479-2b68d2616bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1605809138252-14c62e7b9fe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "간장게장": [
          "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "짜장면": [
          "https://images.unsplash.com/photo-1587736904007-0ea5b5b82b60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "짬뽕": [
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1587736904007-0ea5b5b82b60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "탕수육": [
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1587736904007-0ea5b5b82b60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "스시": [
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "라멘": [
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "우동": [
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "파스타": [
          "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "피자": [
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "햄버거": [
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1592415486689-125cbbfcbee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "스테이크": [
          "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1590777461479-2b68d2616bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "떡볶이": [
          "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1611599238845-7f3c32eadb3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        "순대": [
          "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ]
      };
      
      return koreanFoodImages[dishName] || [
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
        description: "얼큰하고 시원한 김치찌개로 속을 채워보세요! 따뜻한 국물이 몸을 데워줄 거예요.",
        imageUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🌶️🌶️ 보통맛", "🍚 밥 포함", "🥬 반찬 3종"]
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
        tags: ["🥛 순한맛", "🍚 밥 포함", "🥬 반찬 포함"]
      },
      {
        id: 3,
        name: "비빔밥",
        category: "korean",
        priceRange: "budget",
        spiceLevel: "medium",
        price: 8500,
        
        description: "신선한 나물과 고추장으로 버무린 건강한 비빔밥이에요.",
        imageUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        imageUrls: [
          "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1611599238845-7f3c32eadb3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1582927349550-778a53160baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        tags: ["🌶️🌶️ 보통맛", "🥬 나물 듬뿍", "🥚 계란후라이"]
      },
      {
        id: 4,
        name: "육개장",
        category: "korean",
        priceRange: "budget",
        spiceLevel: "hot",
        price: 9000,
        
        description: "매콤하고 진한 국물의 육개장으로 든든하게!",
        imageUrl: "https://images.unsplash.com/photo-1582927349550-778a53160baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        imageUrls: [
          "https://images.unsplash.com/photo-1582927349550-778a53160baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        tags: ["🌶️🌶️🌶️ 매운맛", "🥩 소고기", "🍚 밥 포함"]
      },
      
      // Korean Food - Moderate
      {
        id: 5,
        name: "불고기",
        category: "korean",
        priceRange: "moderate",
        spiceLevel: "mild",
        price: 12000,
        
        description: "달콤하고 부드러운 불고기로 특별한 점심을 만들어보세요.",
        imageUrl: "https://images.unsplash.com/photo-1598515213692-d4238af99ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        imageUrls: [
          "https://images.unsplash.com/photo-1598515213692-d4238af99ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1590777461479-2b68d2616bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1605809138252-14c62e7b9fe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
        ],
        tags: ["🥛 순한맛", "🥩 프리미엄 고기", "🍚 밥 포함"]
      },
      {
        id: 6,
        name: "제육볶음",
        category: "korean",
        priceRange: "moderate",
        spiceLevel: "medium",
        price: 10000,
        
        description: "매콤달콤한 제육볶음으로 입맛을 돋워보세요.",
        imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🌶️🌶️ 보통맛", "🍚 밥 포함", "🥬 상추 포함"]
      },
      {
        id: 7,
        name: "닭갈비",
        category: "korean",
        priceRange: "moderate",
        spiceLevel: "hot",
        price: 11000,
        
        description: "매콤한 양념의 춘천식 닭갈비를 즐겨보세요.",
        imageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🌶️🌶️🌶️ 매운맛", "🐔 닭고기", "🥬 야채 포함"]
      },
      
      // Korean Food - Premium
      {
        id: 8,
        name: "갈비탕",
        category: "korean",
        priceRange: "premium",
        spiceLevel: "mild",
        price: 15000,
        
        description: "진한 국물의 갈비탕으로 깊은 맛을 느껴보세요.",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍖 갈비 포함", "🍚 밥 포함"]
      },
      {
        id: 9,
        name: "한우불고기",
        category: "korean",
        priceRange: "premium",
        spiceLevel: "mild",
        price: 18000,
        
        description: "최고급 한우로 만든 프리미엄 불고기입니다.",
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🥩 한우", "🍚 밥 포함"]
      },
      
      // Chinese Food - Budget
      {
        id: 10,
        name: "짜장면",
        category: "chinese",
        priceRange: "budget",
        spiceLevel: "mild",
        price: 6000,
        
        description: "달콤한 짜장소스의 클래식한 맛을 즐겨보세요.",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍜 면 요리", "🥒 단무지 포함"]
      },
      {
        id: 11,
        name: "짬뽕",
        category: "chinese",
        priceRange: "budget",
        spiceLevel: "medium",
        price: 7000,
        
        description: "얼큰한 국물의 짬뽕으로 시원하게 해결하세요.",
        imageUrl: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🌶️🌶️ 보통맛", "🍜 면 요리", "🦐 해물 포함"]
      },
      {
        id: 12,
        name: "볶음밥",
        category: "chinese",
        priceRange: "budget",
        spiceLevel: "mild",
        price: 7500,
        
        description: "고소한 볶음밥으로 든든하게 드세요.",
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍚 볶음밥", "🥚 계란 포함"]
      },
      
      // Chinese Food - Moderate
      {
        id: 13,
        name: "탕수육",
        category: "chinese",
        priceRange: "moderate",
        spiceLevel: "mild",
        price: 12000,
        
        description: "바삭하고 달콤한 탕수육으로 특별한 점심을 만들어보세요.",
        imageUrl: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍖 바삭한 고기", "🍚 밥 추가 가능"]
      },
      {
        id: 14,
        name: "깐풍기",
        category: "chinese",
        priceRange: "moderate",
        spiceLevel: "medium",
        price: 11000,
        
        description: "매콤달콤한 깐풍기로 입맛을 자극해보세요.",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🌶️🌶️ 보통맛", "🐔 닭고기", "🥒 야채 포함"]
      },
      
      // Japanese Food - Budget
      {
        id: 15,
        name: "라멘",
        category: "japanese",
        priceRange: "budget",
        spiceLevel: "mild",
        price: 8000,
        
        description: "진한 돈코츠 국물의 라멘으로 든든하게 드세요.",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍜 면 요리", "🥚 반숙계란 포함"]
      },
      {
        id: 16,
        name: "우동",
        category: "japanese",
        priceRange: "budget",
        spiceLevel: "mild",
        price: 7500,
        
        description: "따뜻한 국물의 우동으로 간단하게 드세요.",
        imageUrl: "https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍜 면 요리", "🍤 새우튀김"]
      },
      
      // Japanese Food - Moderate  
      {
        id: 17,
        name: "돈카츠",
        category: "japanese",
        priceRange: "moderate",
        spiceLevel: "mild",
        price: 10000,
        
        description: "바삭한 돈카츠와 양배추 샐러드로 든든하게!",
        imageUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🐷 돈카츠", "🥗 샐러드 포함"]
      },
      {
        id: 18,
        name: "연어덮밥",
        category: "japanese",
        priceRange: "moderate",
        spiceLevel: "mild",
        price: 12000,
        
        description: "신선한 연어 사시미가 올라간 덮밥이에요.",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🐟 신선한 연어", "🍚 밥 요리"]
      },
      
      // Japanese Food - Premium
      {
        id: 19,
        name: "초밥",
        category: "japanese",
        priceRange: "premium",
        spiceLevel: "mild",
        price: 25000,
        
        description: "신선한 회로 만든 프리미엄 초밥을 즐겨보세요.",
        imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍣 신선한 회", "🍵 된장국 포함"]
      },
      
      // Western Food - Budget
      {
        id: 20,
        name: "스파게티",
        category: "western",
        priceRange: "budget",
        spiceLevel: "mild",
        price: 8500,
        
        description: "토마토 소스 스파게티로 간단하게 드세요.",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍝 면 요리", "🍅 토마토 소스"]
      },
      
      // Western Food - Moderate
      {
        id: 21,
        name: "크림파스타",
        category: "western",
        priceRange: "moderate",
        spiceLevel: "mild",
        price: 12000,
        
        description: "크림 파스타로 부드러운 점심을 즐겨보세요.",
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍝 면 요리", "🧀 치즈 포함"]
      },
      {
        id: 22,
        name: "피자",
        category: "western",
        priceRange: "moderate",
        spiceLevel: "mild",
        price: 11000,
        
        description: "치즈가 듬뿍 들어간 피자로 만족스러운 식사를 하세요.",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🧀 치즈 듬뿍", "🥗 샐러드 포함"]
      },
      {
        id: 23,
        name: "햄버거",
        category: "western",
        priceRange: "moderate",
        spiceLevel: "mild",
        price: 9500,
        
        description: "두툼한 패티의 햄버거로 든든하게!",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍔 햄버거", "🍟 감자튀김"]
      },
      
      // Western Food - Premium
      {
        id: 24,
        name: "스테이크",
        category: "western",
        priceRange: "premium",
        spiceLevel: "mild",
        price: 18000,
        
        description: "프리미엄 스테이크로 특별한 식사를 즐겨보세요.",
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🥩 프리미엄 스테이크", "🥗 샐러드"]
      },
      
      // Street Food - Budget
      {
        id: 25,
        name: "떡볶이",
        category: "street",
        priceRange: "budget",
        spiceLevel: "medium",
        price: 4000,
        
        description: "매콤달콤한 떡볶이로 간단하게 배를 채워보세요.",
        imageUrl: "https://images.unsplash.com/photo-1582474368633-d8de6f07f3b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🌶️🌶️ 보통맛", "🍢 어묵 포함", "🥚 계란 추가 가능"]
      },
      {
        id: 26,
        name: "김밥",
        category: "street",
        priceRange: "budget",
        spiceLevel: "mild",
        price: 3000,
        
        description: "든든한 김밥으로 간편하게 점심을 해결하세요.",
        imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍚 밥 요리", "🥬 야채 포함"]
      },
      {
        id: 27,
        name: "핫도그",
        category: "street",
        priceRange: "budget",
        spiceLevel: "mild",
        price: 3500,
        
        description: "바삭한 반죽의 핫도그로 간식타임!",
        imageUrl: "https://images.unsplash.com/photo-1612392062798-2ee0c5c7f02a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🌭 핫도그", "🧀 치즈 추가"]
      },
      {
        id: 28,
        name: "토스트",
        category: "street",
        priceRange: "budget",
        spiceLevel: "mild",
        price: 4500,
        
        description: "달걀과 야채가 들어간 길거리 토스트에요.",
        imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🥛 순한맛", "🍞 토스트", "🥚 계란 포함"]
      },
      {
        id: 29,
        name: "순대",
        category: "street",
        priceRange: "budget",
        spiceLevel: "medium",
        price: 5000,
        
        description: "쫄깃한 순대로 든든하게 드세요.",
        imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        tags: ["🌶️🌶️ 보통맛", "🍖 순대", "🧂 소금 포함"]
      }
    ];

    // Map through all items to add imageUrls property
    this.foodRecommendations = baseItems.map(item => ({
      ...item,
      imageUrls: createKoreanFoodImages(item.name)
    }));
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
    // Priority 1: Exact matches (category + priceRange + spiceLevel)
    const exactMatches = this.foodRecommendations.filter(food => 
      food.category === request.category &&
      food.priceRange === request.priceRange &&
      food.spiceLevel === request.spiceLevel
    );

    if (exactMatches.length > 0) {
      return exactMatches[Math.floor(Math.random() * exactMatches.length)];
    }

    // Priority 2: Category + PriceRange matches (ignore spice level for more variety)
    const categoryPriceMatches = this.foodRecommendations.filter(food => 
      food.category === request.category &&
      food.priceRange === request.priceRange
    );

    if (categoryPriceMatches.length > 0) {
      return categoryPriceMatches[Math.floor(Math.random() * categoryPriceMatches.length)];
    }

    // Priority 3: Category matches only (ensure we stay within category)
    const categoryMatches = this.foodRecommendations.filter(food => 
      food.category === request.category
    );

    if (categoryMatches.length > 0) {
      return categoryMatches[Math.floor(Math.random() * categoryMatches.length)];
    }

    // Final fallback: return any random food (should never happen with proper data)
    return this.foodRecommendations[Math.floor(Math.random() * this.foodRecommendations.length)];
  }

  async getAlternativeRecommendations(category: string, excludeId?: number): Promise<FoodRecommendation[]> {
    const alternatives = this.foodRecommendations
      .filter(food => food.category === category && food.id !== excludeId);
    
    // Shuffle the alternatives for variety
    const shuffled = alternatives.sort(() => Math.random() - 0.5);
    
    // Return up to 3 random alternatives
    return shuffled.slice(0, 3);
  }
}

export const storage = new MemStorage();
