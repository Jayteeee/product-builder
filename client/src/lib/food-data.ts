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

import type { FoodRecommendation, RecommendationRequest } from "@/lib/types";

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
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
    ],
    "순대": [
      "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
    ]
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

const foodRecommendations = baseItems.map(item => {
  const imageUrls = createFoodImages(item.name);
  return {
    ...item,
    imageUrls,
    imageUrl: imageUrls[0]
  };
});

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

export async function getFoodRecommendation(request: RecommendationRequest): Promise<FoodRecommendation> {
  const exactMatches = foodRecommendations.filter(food => 
    food.category === request.category &&
    food.priceRange === request.priceRange &&
    food.spiceLevel === request.spiceLevel
  );

  let selected: FoodRecommendation;

  if (exactMatches.length > 0) {
    selected = exactMatches[Math.floor(Math.random() * exactMatches.length)];
  } else {
    const categoryPriceMatches = foodRecommendations.filter(food => 
      food.category === request.category &&
      food.priceRange === request.priceRange
    );

    if (categoryPriceMatches.length > 0) {
      selected = categoryPriceMatches[Math.floor(Math.random() * categoryPriceMatches.length)];
    } else {
      const categoryMatches = foodRecommendations.filter(food => 
        food.category === request.category
      );

      if (categoryMatches.length > 0) {
        selected = categoryMatches[Math.floor(Math.random() * categoryMatches.length)];
      } else {
        selected = foodRecommendations[Math.floor(Math.random() * foodRecommendations.length)];
      }
    }
  }

  const liveImages = await fetchPexelsImages(selected.name);
  if (liveImages.length > 0) {
    return {
      ...selected,
      imageUrls: liveImages,
      imageUrl: liveImages[0]
    } as FoodRecommendation;
  }

  return selected as FoodRecommendation;
}

export async function getAlternativeRecommendations(category: string, excludeId?: number): Promise<FoodRecommendation[]> {
  const alternatives = foodRecommendations
    .filter(food => food.category === category && food.id !== excludeId);
  
  const shuffled = alternatives.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3) as FoodRecommendation[];
}

