import { GoogleGenAI } from "@google/genai";
import type { FoodRecommendation, RecommendationRequest } from "@/lib/types";
import { getNearbyMenuCounts } from "@/lib/kakao-places";

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

// Comprehensive Food Database
const baseItems = [
  // --- KOREAN (한식) ---
  // Budget (저렴)
  { 
    id: 1, name: "김치찌개", category: "korean", priceRange: "budget", spiceLevel: "medium", price: 8500, 
    description: "얼큰하고 시원한 한국인의 소울푸드", 
    tags: ["🌶️🌶️ 보통맛", "🍲 찌개", "🍚 든든한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d6/Korean.cuisine-Kimchi_jjigae-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Kimchi_jjigae_-_Kogi%2C_Brighton_2023-11-15.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/4c/Korean_stew-Kimchi_jjigae-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/da/Korean.cuisine-Kimchi_jjigae-03.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/55/Korean_stew-Kimchi_jjigae-02.jpg"
    ]
  },
  { 
    id: 2, name: "된장찌개", category: "korean", priceRange: "budget", spiceLevel: "mild", price: 8000, 
    description: "구수한 시골 된장의 깊은 맛", 
    tags: ["🥛 순한맛", "🍲 찌개", "🌿 건강식"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/0/01/Doenjang-jjigae_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/ef/Doenjang-jjigae_4.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/Doenjang-jjigae_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Korean_stew-Doenjang_jjigae-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/37/Korean_cuisine-Doenjang_jjigae_and_banchan.jpg"
    ]
  },
  { 
    id: 3, name: "콩나물국밥", category: "korean", priceRange: "budget", spiceLevel: "mild", price: 7500, 
    description: "해장에 최고인 시원한 국물", 
    tags: ["🥛 순한맛", "🍲 해장", "💰 가성비"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/6/67/Kongnamul-gukbap_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/27/Kongnamul_gukbap_20230408_003.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7b/Kongnamulgukbap_%28haejangguk%29_%28soybean_sprout_hangover_soup%29.jpg"
    ]
  },
  { 
    id: 4, name: "순두부찌개", category: "korean", priceRange: "budget", spiceLevel: "medium", price: 8500, 
    description: "몽글몽글 부드러운 순두부와 매콤한 국물", 
    tags: ["🌶️🌶️ 보통맛", "🍲 찌개", "🥚 부드러운"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Korean_stew-Sundubu_jjigae-05.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/Sundubu-jjigae_in_Hawaii.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Sundubu-jjigae_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/ef/Sundubu_jjigae_with_seafood_and_beef_from_Lighthouse_Tofu.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b3/Sundubu-jjigae_with_beef_in_Annandale%2C_Virginia.jpg"
    ]
  },
  { 
    id: 5, name: "육개장", category: "korean", priceRange: "budget", spiceLevel: "hot", price: 9000, 
    description: "소고기와 대파가 듬뿍 들어간 얼큰한 국물", 
    tags: ["🌋 매운맛", "🥩 소고기", "🍲 보양"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/a/a2/Korean_soup-Yukgaejang-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/4c/Yukgaejang-Moscow.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/7/7e/Korean.cuisine-Yukgaejang-02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/0a/%EC%9C%A1%EA%B0%9C%EC%9E%A5.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9c/Korean.cuisine-Yukgaejang-01.jpg"
    ]
  },
  { 
    id: 6, name: "잔치국수", category: "korean", priceRange: "budget", spiceLevel: "mild", price: 6500, 
    description: "멸치 육수의 깔끔하고 담백한 맛", 
    tags: ["🍜 면요리", "🥛 순한맛", "💰 가성비"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/4/42/Janchi-guksu.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/Janchiguksu%EC%9E%94%EC%B9%98%EA%B5%AD%EC%88%98IMG_0714.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d7/Janchi-guksu_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6e/Janchi_guksu_%28noodle_soup%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6e/Janchi-guksu_3.jpg"
    ]
  },
  { 
    id: 7, name: "비빔국수", category: "korean", priceRange: "budget", spiceLevel: "medium", price: 7000, 
    description: "매콤새콤 입맛 돋우는 비빔 양념", 
    tags: ["🌶️🌶️ 보통맛", "🍜 면요리", "🌈 새콤달콤"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Bibim-guksu.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1a/Kimchi-bibim-guksu_with_samgyeopsal.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Korean_noodle-Bibim_guksu-02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c1/Korean_noodles-Bibim_guksu-03.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/50/Korean_noodles-Bibim_guksu-01.jpg"
    ]
  },
  { 
    id: 8, name: "고등어구이 정식", category: "korean", priceRange: "budget", spiceLevel: "mild", price: 9000, 
    description: "노릇하게 구운 고소한 고등어", 
    tags: ["🐟 생선구이", "🥛 순한맛", "🍱 정식"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/c/c4/Grilled_mackerel_on_a_BBQ.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/80/Salty_grilled_mackerel_lunch_of_Yoshinoya.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/18/Grilled_mackerel_sushi_%284691657059%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/df/Grilled_horse-mackerel_%285171123164%29.jpg"
    ]
  },
  { 
    id: 9, name: "계란찜 정식", category: "korean", priceRange: "budget", spiceLevel: "mild", price: 8000, 
    description: "폭신폭신한 계란찜과 정갈한 반찬", 
    tags: ["🥚 계란", "🥛 순한맛", "🍚 집밥"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e9/Korean.Banchan-Gyeran.jjim-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/bc/Korean_cuisine-Gyeranjjim-02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c1/Korean.cuisine-Gyeran.jjim-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/0e/1005_eggjjim.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/20/Gyeranjjim.jpg"
    ]
  },
  { 
    id: 10, name: "매운 순두부찌개", category: "korean", priceRange: "budget", spiceLevel: "hot", price: 9000, 
    description: "스트레스 풀리는 화끈한 매운맛", 
    tags: ["🌋 매운맛", "🌶️🌶️🌶️", "🍲 찌개"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/KOCIS_sundubu-jjigae%2C_Spicy_Soft_Tofu_Stew_%284556151465%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/de/Korean_stew-Sundubu-07.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b7/Korean_stew-Sundubu_jjigae-08.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/Sundubu-jjigae_in_Hawaii.jpg"
    ]
  },

  // Moderate (적당)
  { 
    id: 11, name: "제육볶음", category: "korean", priceRange: "moderate", spiceLevel: "medium", price: 10000, 
    description: "불맛 가득 매콤한 제육볶음", 
    tags: ["🍖 고기", "🌶️🌶️ 보통맛", "🔥 불맛"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Jeyuk-bokkeum_4.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Jeyuk-bokkeum_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e5/Jeyuk-bokkeum_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Jeyuk-bokkeum_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/95/Jeyuk-bokkeum%2C_Korean_food_02.jpg"
    ]
  },
  { 
    id: 12, name: "비빔밥", category: "korean", priceRange: "moderate", spiceLevel: "mild", price: 11000, 
    description: "다양한 나물과 고추장의 완벽한 조화", 
    tags: ["🥗 건강식", "🌈 다채로운", "🥛 순한맛"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Bibimbap_6.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/63/Korean_cuisine-Bibimbap-08.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Bibimbap_at_Micun_Bibimbap%2C_CapitaMall_Crystal_%2820211212122041%29.jpg"
    ]
  },
  { 
    id: 13, name: "뚝배기 불고기", category: "korean", priceRange: "moderate", spiceLevel: "mild", price: 11000, 
    description: "달콤 짭짤한 국물에 당면까지", 
    tags: ["🥩 소고기", "🥛 순한맛", "🍲 단짠"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Ttukbaegi_bulgogi_-_Bulgogi%28beef%29_hot_pot_-_Kogi_Korean_cuisine_2024-09-03.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/0d/Ttukbaegi-bulgogi_2.jpg"
    ]
  },
  { 
    id: 14, name: "보쌈 정식", category: "korean", priceRange: "moderate", spiceLevel: "mild", price: 12000, 
    description: "야들야들하게 삶은 수육과 겉절이", 
    tags: ["🍖 고기", "🥛 순한맛", "🍱 정식"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Korean_cuisine-Bossam-04.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/48/Korean.food-Bossam-02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/69/Bossam_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/76/Korean_cuisine-Bossam-02.jpg"
    ]
  },
  { 
    id: 15, name: "낙지덮밥", category: "korean", priceRange: "moderate", spiceLevel: "hot", price: 12000, 
    description: "통통한 낙지와 화끈한 양념의 만남", 
    tags: ["🌋 매운맛", "🐙 해산물", "🍚 덮밥"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/3/34/Korean.cuisine-Nakji_bokkeum-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/2a/Nakji-bokkeum%2C_Stir-Fried_Octopus.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f0/Nakji-bokkeum.jpg"
    ]
  },
  { 
    id: 16, name: "돌솥비빔밥", category: "korean", priceRange: "moderate", spiceLevel: "medium", price: 12000, 
    description: "지글지글 소리까지 맛있는 비빔밥", 
    tags: ["🌶️🌶️ 보통맛", "🍚 든든한", "🍲 뜨끈한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/6/60/Hot_stone_pot_bibimbap_with_beef_%28Bulgogi_dolsot_bibimbap%29_-_Kogi_2023-10-16.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/68/Vegetarian_Dolsot_Bibimbap%2C_Jeongane%2C_Paris_002.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/21/Vegan_hot_stone_pot_bibimbap_%28Dolsot-bibimbap%29_-_Kogi_2023-10-16.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f5/Korean.food-Bibimbap-02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/25/Dolsot-bibimbap_1.jpg"
    ]
  },
  { 
    id: 17, name: "김치찜", category: "korean", priceRange: "moderate", spiceLevel: "medium", price: 11000, 
    description: "푹 익은 김치와 돼지고기의 깊은 맛", 
    tags: ["🌶️🌶️ 보통맛", "🥬 김치", "🍖 밥도둑"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9d/%EA%B9%80%EC%B9%98%EC%B0%9C.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/cf/Mugeun-ji-jjim_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3c/Mugeun-ji-jjim_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d1/Gimchi-jjim.jpg"
    ]
  },
  { 
    id: 18, name: "뼈해장국", category: "korean", priceRange: "moderate", spiceLevel: "medium", price: 10000, 
    description: "진한 국물과 살코기가 듬뿍", 
    tags: ["🌶️🌶️ 보통맛", "🍖 고기", "🍲 든든한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/7/7e/Korean.food-Gamjatang-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Gamjatang_%28pork_neck_stew%29_%2825676572251%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/45/Ppyeohaejangguk_20240929_001.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Ppyeo-haejang-guk.jpg"
    ]
  },
  { 
    id: 19, name: "물냉면", category: "korean", priceRange: "moderate", spiceLevel: "mild", price: 10000, 
    description: "살얼음 동동 시원한 육수", 
    tags: ["🍜 시원한", "🥛 순한맛", "❄️ 여름"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/1/18/Mulnaengmyeon_20221210_001.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/45/Doongji_Cold_Noodles_20210817_002.jpg"
    ]
  },
  { 
    id: 20, name: "비빔냉면", category: "korean", priceRange: "moderate", spiceLevel: "medium", price: 10500, 
    description: "매콤새콤 자꾸 당기는 양념", 
    tags: ["🌶️🌶️ 보통맛", "🍜 면요리", "🌈 새콤달콤"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9f/KOCIS_Bibim-naengmyeon_Spicy_Mixed_Buckwheat_Noodles_%284594769498%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/Bibim_Naengmyeon_in_Beijing%2C_China_%2820230207165730%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Bibim-naengmyeon_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Bibim-naengmyeon_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9a/Bibim_naengmyeon_by_avlxyz.jpg"
    ]
  },

  // Premium (프리미엄)
  { 
    id: 21, name: "삼계탕", category: "korean", priceRange: "premium", spiceLevel: "mild", price: 16000, 
    description: "원기 회복을 위한 든든한 보양식", 
    tags: ["🐔 보양식", "💎 프리미엄", "🥛 담백한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/Korean_soup-Samgyetang-13.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/36/Jeju-do_samgyetang_with_abalone_05.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/Samgye-tang_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Ginseng_Chicken_Soup.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Samgyetang_with_seafood_04.jpg"
    ]
  },
  { 
    id: 22, name: "한우 육회비빔밥", category: "korean", priceRange: "premium", spiceLevel: "mild", price: 18000, 
    description: "신선한 한우 육회가 듬뿍", 
    tags: ["🥩 소고기", "💎 프리미엄", "🥛 고소한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/Yukhoe-bibimbap_%2831896884871%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/16/Yukhoe-bibimbap_%2832013698315%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/cd/Korean.cuisine-Yukhoe_bibimbap-01.jpg"
    ]
  },
  { 
    id: 23, name: "갈비탕", category: "korean", priceRange: "premium", spiceLevel: "mild", price: 17000, 
    description: "진하게 우려낸 고품격 고기 국물", 
    tags: ["🥩 소고기", "💎 프리미엄", "🍲 뜨끈한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Korean_soup-Galbitang-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/Neungi-jeonbok-galbi-tang_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Galbi-tang_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/bb/Galbi-tang_1.jpg"
    ]
  },
  { 
    id: 24, name: "매운 갈비찜", category: "korean", priceRange: "premium", spiceLevel: "hot", price: 25000, 
    description: "고급스러운 갈비와 화끈한 양념", 
    tags: ["🌋 매운맛", "🍖 갈비", "💎 프리미엄"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/7/7f/%EB%A7%A4%EC%9A%B4%EA%B0%88%EB%B9%84%EC%B0%9C_%EC%9B%90%EC%A3%BC_10_4_13.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/3/34/Maeun-galbi-jjim.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/Testing_out_%40davidchang%27s_mom%27s_Galbi_Jjim_recipe_for_possible_inclusion_in_Christmas_Dinner._It%27s_excellent._-Korean_-shortribs_-galbijjim_%2815334632144%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/58/Galbi-jjim_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/19/Galbi-jjim_1.jpg"
    ]
  },
  { 
    id: 25, name: "불고기 전골", category: "korean", priceRange: "premium", spiceLevel: "mild", price: 20000, 
    description: "가족 외식 메뉴 1순위, 달콤한 전골", 
    tags: ["🥩 소고기", "🍲 전골", "💎 고급진"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/0/02/Bulgogi-jeongol_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/54/Bulgogi-jeongol_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Ttukbaegi_bulgogi_-_Bulgogi%28beef%29_hot_pot_-_Kogi_Korean_cuisine_2024-09-03.jpg"
    ]
  },
  { 
    id: 26, name: "간장게장 정식", category: "korean", priceRange: "premium", spiceLevel: "mild", price: 30000, 
    description: "진정한 밥도둑, 짭조름한 매력", 
    tags: ["🦀 해산물", "💎 프리미엄", "🍚 밥도둑"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/b/b7/Korean.cuisine-Ganjang_gejang_and_banchan-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/64/Korean.cuisine-Ganjang_gejang_and_banchan-02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/58/Korean.cuisine-Ganjang_gejang_and_banchan-03.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c4/Korean_seafood-ganjang_gejang_Yeosu_2015-08-15.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/29/Ganjang-gejang_%2832014766195%29.jpg"
    ]
  },
  { 
    id: 27, name: "찜닭", category: "korean", priceRange: "premium", spiceLevel: "medium", price: 28000, 
    description: "짭짤한 간장 양념의 푸짐한 닭요리", 
    tags: ["🐔 닭요리", "🌶️🌶️ 보통맛", "🍲 푸짐한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/1/17/Andong-jjimdak.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/57/Korean_cuisine-Andong_jjimdak-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/63/Andong_Jjimdak.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Andong_mask_festival_008.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d0/Jjimdak.jpg"
    ]
  },
  { 
    id: 28, name: "곱창전골", category: "korean", priceRange: "premium", spiceLevel: "medium", price: 35000, 
    description: "고소한 곱창과 얼큰한 국물", 
    tags: ["🌶️🌶️ 보통맛", "🍖 고기", "🍲 술안주"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/%EB%82%98%EC%9D%98%EA%B0%80%EC%95%BC_%EC%95%95%EA%B5%AC%EC%A0%95_%ED%98%84%EB%8C%80%EB%B0%B1%ED%99%94%EC%A0%90_%EA%B3%B1%EC%B0%BD%EC%A0%84%EA%B3%A8_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Gopchang-jeongol_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b8/%EB%82%98%EC%9D%98%EA%B0%80%EC%95%BC_%EC%95%95%EA%B5%AC%EC%A0%95_%ED%98%84%EB%8C%80%EB%B0%B1%ED%99%94%EC%A0%90_%EA%B3%B1%EC%B0%BD%EC%A0%84%EA%B3%A8_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Gopchang-jeongol_1.jpg"
    ]
  },
  { 
    id: 29, name: "닭볶음탕", category: "korean", priceRange: "premium", spiceLevel: "hot", price: 30000, 
    description: "매콤한 양념이 쏙 배어든 닭요리", 
    tags: ["🌋 매운맛", "🐔 닭요리", "🌶️🌶️🌶️"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/Korean.food-Dakbokemtang-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/de/Dakbokkeumtang_and_samgyetang.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f5/Daktoritang.jpg"
    ]
  },
  { 
    id: 30, name: "해물파전", category: "korean", priceRange: "moderate", spiceLevel: "mild", price: 18000, 
    description: "해산물이 아낌없이 들어간 바삭한 전", 
    tags: ["🦐 해산물", "🥟 바삭함", "🥢 안주"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/7/74/Korean_seafood_pancake_%ED%95%B4%EB%AC%BC%ED%8C%8C%EC%A0%84_%285534738474%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f9/Korean.pancake-Pajeon-05.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/Korean.cuisine-Pajeon_and_gyeran_jjim.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/ee/Korean_pancake-Haemul_pajeon-01.jpg"
    ]
  },

  // --- CHINESE (중식) ---
  { 
    id: 31, name: "짜장면", category: "chinese", priceRange: "budget", spiceLevel: "mild", price: 7000, 
    description: "남녀노소 좋아하는 달콤한 춘장 소스", 
    tags: ["🍜 면요리", "🥛 순한맛", "💰 가성비"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Jajangmyeon_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d0/Jajangmyeon_%28mixed%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/49/Jajangmyeon_by_KFoodaddict.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/Jajangmyeon_-_2019_-_Emanuele_Oddo.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/77/Jajangmyeon_-_Kogi_Korean_cuisine%2C_Brighton_2024-03-12.jpg"
    ]
  },
  { 
    id: 32, name: "짬뽕", category: "chinese", priceRange: "budget", spiceLevel: "medium", price: 9000, 
    description: "해산물의 시원함과 얼큰한 국물", 
    tags: ["🌶️🌶️ 보통맛", "🍜 면요리", "🦑 해산물"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/a/ab/Jjamppong_20241006_001.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f5/Jeonbok-haemul-jjamppong_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shikairo_Nagasaki_Japan05s.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/42/Jjamppong-sujebi_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/16/Jjamppong_3.jpg"
    ]
  },
  { 
    id: 33, name: "볶음밥", category: "chinese", priceRange: "budget", spiceLevel: "mild", price: 8000, 
    description: "고슬고슬하게 볶아낸 고소한 밥", 
    tags: ["🍚 볶음밥", "🥛 순한맛", "🍳 인기"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9b/Fried_rice_in_home.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/30/Fried_rice_with_chicken_and_egg.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Fried_rice_by_olive.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8e/Fried_rice_in_Uganda.jpg"
    ]
  },
  { 
    id: 34, name: "군만두", category: "chinese", priceRange: "budget", spiceLevel: "mild", price: 6000, 
    description: "겉은 바삭, 속은 촉촉한 튀김만두", 
    tags: ["🥟 바삭함", "🥛 순한맛", "🥢 사이드"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/5/55/Korean_Chinese_gun-mandu.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/21/Gunmandu.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1c/Korean.cuisine-Gunmandu-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a6/Korean_grilled_dumpling-Gunmandu-01.jpg"
    ]
  },
  { 
    id: 35, name: "매운 짬뽕", category: "chinese", priceRange: "budget", spiceLevel: "hot", price: 9500, 
    description: "땀이 뻘뻘 나는 강력한 매운맛", 
    tags: ["🌋 매운맛", "🌶️🌶️🌶️", "🍜 얼큰한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/1/16/Jjamppong_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/cf/Jjamppong_4.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/12/Jjamppong_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f5/Jeonbok-haemul-jjamppong_1.jpg"
    ]
  },
  { 
    id: 36, name: "마파두부밥", category: "chinese", priceRange: "moderate", spiceLevel: "medium", price: 10000, 
    description: "부드러운 두부와 매콤한 소스의 만남", 
    tags: ["🌶️🌶️ 보통맛", "🍚 덮밥", "🍲 두부"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/a/a5/Billyfoodmabodofu3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/73/Authentic_Mapo_Tofu.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Chen_Mapo_Tofu.jpg"
    ]
  },
  { 
    id: 37, name: "잡채밥", category: "chinese", priceRange: "moderate", spiceLevel: "mild", price: 11000, 
    description: "탱글한 당면과 풍부한 야채", 
    tags: ["🍚 덮밥", "🥛 순한맛", "🌈 다채로운"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/f/f1/Homemade_Japchae%2C_Dhaka_02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c1/Japchae-bap_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f1/Japchae-bap.jpg"
    ]
  },
  { 
    id: 38, name: "탕수육", category: "chinese", priceRange: "premium", spiceLevel: "mild", price: 22000, 
    description: "바삭한 고기 튀김과 새콤달콤 소스", 
    tags: ["🍖 고기", "💎 프리미엄", "🍯 단짠"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/4/4d/Tangsuyuk_%28Korean_Chinese_sweet_and_sour_pork%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/63/Tangsuyuk_6.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/ba/Tangsuyuk_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d3/Tangsuyuk_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/bc/Tangsuyuk_1.jpg"
    ]
  },
  { 
    id: 39, name: "깐풍기", category: "chinese", priceRange: "premium", spiceLevel: "medium", price: 25000, 
    description: "매콤하고 짭짤한 닭고기 튀김 요리", 
    tags: ["🐔 닭요리", "🌶️🌶️ 보통맛", "🔥 불맛"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/1/13/Kkanpunggi_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Korean_cuisine-Kkanpunggi-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c5/Kkanpunggi.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5b/Andongjang_02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/22/Spicy_honey_garlic_chicken_wings.jpg"
    ]
  },
  { 
    id: 40, name: "양장피", category: "chinese", priceRange: "premium", spiceLevel: "medium", price: 35000, 
    description: "톡 쏘는 겨자 소스와 다양한 재료", 
    tags: ["🥗 해산물", "💎 프리미엄", "👃 코끝찡"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9b/Jellyfish_and_roast_duck_salad.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/7/79/Yangjangpi.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/76/Yangjangpi_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d1/Yangjangpi_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Yangjangpi_2.jpg"
    ]
  },
  { 
    id: 41, name: "마라탕", category: "chinese", priceRange: "moderate", spiceLevel: "hot", price: 12000, 
    description: "취향대로 골라 담는 얼큰하고 얼얼한 맛", 
    tags: ["🌋 매운맛", "🔥 중독성", "🍜 마라"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/4/42/Malatang_with_Tianshui_flavor_in_Suzhou-20240411.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Malatang_from_Hope_Tree_%2820220226172344%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Spicy_Hot_Pot.jpg"
    ]
  },
  { 
    id: 42, name: "고추잡채", category: "chinese", priceRange: "moderate", spiceLevel: "medium", price: 25000, 
    description: "아삭한 피망과 꽃빵의 환상 조합", 
    tags: ["🌶️🌶️ 보통맛", "🍞 꽃빵", "🥩 고기요리"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/5/58/Pepper_japchae01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/cb/Hu%C4%81ju%C7%8En.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/Scallion_flower_rolls.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b1/A_frozen_spring_onion_steamed_flower_bun.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/42/Mandarinrolls.jpg"
    ]
  },

  // --- JAPANESE (일식) ---
  { 
    id: 51, name: "돈카츠", category: "japanese", priceRange: "moderate", spiceLevel: "mild", price: 11000, 
    description: "바삭한 튀김옷 속 두툼한 돼지고기", 
    tags: ["🍖 고기", "🥛 순한맛", "🍱 일식"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tonkatsu_of_Kimukatsu.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/ba/Tonkatsu_mit_asiatischem_Krautsalat%2C_Reis_und_Tonkatsusauce.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/62/Tonkatsu_by_ayustety_in_Tokyo.jpg"
    ]
  },
  { 
    id: 52, name: "라멘", category: "japanese", priceRange: "moderate", spiceLevel: "medium", price: 10000, 
    description: "진한 사골 육수의 깊은 감칠맛", 
    tags: ["🍜 면요리", "🌶️🌶️ 보통맛", "🇯🇵 전통"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/2/28/Ramen_Jump_002.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d6/Ramen_dan_Teh_Manis_Dingin.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Soy_Milk_Ramen_and_Tonkotsu_Miso_Ramen_by_Goemon_Ramen_Bar.jpg"
    ]
  },
  { 
    id: 53, name: "초밥 세트", category: "japanese", priceRange: "premium", spiceLevel: "mild", price: 20000, 
    description: "신선한 제철 생선으로 만든 깔끔한 한 끼", 
    tags: ["🍣 신선함", "💎 프리미엄", "🍱 깔끔한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/d/db/Chef_Special_Sushi_Set_-_Memo_Wall_Japanese_Cuisine.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/60/Sushi_platter.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/03/Assorted_Western_sushi_%28%E7%9B%9B%E3%82%8A%E5%90%88%E3%82%8F%E3%81%9B%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/Sushi_Platter_in_Portugal.png"
    ]
  },
  { 
    id: 54, name: "규동", category: "japanese", priceRange: "budget", spiceLevel: "mild", price: 8500, 
    description: "부드러운 소고기 덮밥의 정석", 
    tags: ["🍚 덮밥", "🥛 순한맛", "🥩 소고기"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/4/45/Gyuu-don_001.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/47/Extra_large_gy%C5%ABdon_at_Yoshinoya_Beijing_West_Railway_Station_%28S%29_Restaurant_%2820210716191713%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/Noto_beef_bowl.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/17/Sesame_Beef_Don_-_Pompoko_2024-07-03.jpg"
    ]
  },
  { 
    id: 55, name: "사케동", category: "japanese", priceRange: "moderate", spiceLevel: "mild", price: 13000, 
    description: "입안에서 살살 녹는 연어 덮밥", 
    tags: ["🍣 연어", "🍚 덮밥", "🥛 부드러운"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Salmon_don_of_Nakau_01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Salmon_don_of_Nakau_02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/61/Salmon_caviar_donburi%3B_2011.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/15/Rice_bowl_topped_with_salmon_and_salmon_egg_%2814904439935%29.jpg"
    ]
  },
  { 
    id: 56, name: "우동", category: "japanese", priceRange: "budget", spiceLevel: "mild", price: 7500, 
    description: "탱글한 면발과 따뜻한 국물", 
    tags: ["🍜 면요리", "🥛 순한맛", "💰 가성비"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/Kake_udon_by_Joe_Jones_in_Tokyo.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/fc/Kake_udon_by_udono.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/81/Tempura_udon_by_6strings.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Chicken_and_burdock_tempura_udon_and_Oden_in_Sukesan_Udon_Maebashi-Nishi.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/ea/Kake_Udon_and_Spam_omusubi_from_Marugame_Udon_%282024-06-11%29.jpg"
    ]
  },
  { 
    id: 57, name: "가츠동", category: "japanese", priceRange: "moderate", spiceLevel: "mild", price: 9500, 
    description: "돈카츠와 계란, 소스의 완벽한 조화", 
    tags: ["🍚 덮밥", "🥛 순한맛", "🍖 고기"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/0/00/Special_pork_cutlet_bowl_of_Katsuya.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/24/Tsukemen_by_banej_in_Singapore.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/ad/Katsudon_001.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9a/Katsudon_602.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/17/Katsudon_601.jpg"
    ]
  },
  { 
    id: 58, name: "매운 탄탄멘", category: "japanese", priceRange: "moderate", spiceLevel: "hot", price: 11000, 
    description: "고소한 땅콩 맛과 화끈한 고추기름", 
    tags: ["🌋 매운맛", "🍜 면요리", "🥜 고소매콤"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/0/02/Kohmen_ramen_restaurant_%40_Shinjuku_%289200139832%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a0/Chinese_food.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/71/Tan_Tsai_Noodle_of_Tu_Hsiao_Yue_2015.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/95/Tan_Tsai_Noodle_of_Tu_Hsiao_Yueh.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/Vegan_tan_tan_%28VG%29_-_Goemon_Ramen_Bar_2024-01-26.jpg"
    ]
  },
  { 
    id: 59, name: "텐동", category: "japanese", priceRange: "moderate", spiceLevel: "mild", price: 12000, 
    description: "바삭한 모듬 튀김이 올라간 덮밥", 
    tags: ["🥟 바삭함", "🍚 덮밥", "🥛 순한맛"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8b/Tendon.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e0/Tendon_set_by_avlxyz.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/28/Tendon_001.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5b/Tendon_of_Ten%27ya.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/21/All_star_tendon_of_Ten%27ya.jpg"
    ]
  },
  { 
    id: 60, name: "장어덮밥(우나쥬)", category: "japanese", priceRange: "premium", spiceLevel: "mild", price: 35000, 
    description: "특제 소스를 발라 구운 고급 보양식", 
    tags: ["🐍 보양식", "💎 프리미엄", "🍱 최고급"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/7/75/Mini_Unadon_in_Hong_Kong.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Unadon_of_Matsuya.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e7/Tokyo_Chikuyotei_Unadon01s2100.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e9/%E3%81%86%E3%81%AA%E3%83%81%E3%82%AD%E4%B8%BC%EF%BC%88%E3%81%86%E3%81%AA%E3%81%8E%E5%92%8C%E5%8F%8B%E3%83%BB%E6%96%B0%E5%B0%8F%E5%B2%A9%EF%BC%8920220811-P1001911.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/Tofu_Shouga_Yakin_Don_and_Unagi_Don_-_Pompoko_2023-08-03.jpg"
    ]
  },

  // --- WESTERN (양식) ---
  { 
    id: 71, name: "까르보나라", category: "western", priceRange: "moderate", spiceLevel: "mild", price: 13000, 
    description: "진하고 고소한 크림 파스타", 
    tags: ["🍝 파스타", "🥛 순한맛", "🧀 치즈"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Espaguetis_carbonara.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/74/Spaghetti_Carbonara_with_Japanese_Raw_Egg.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/ed/Spaghetti_Carbonara_von_Unico_Tauberbischofsheim_2.jpg"
    ]
  },
  { 
    id: 72, name: "아라비아따", category: "western", priceRange: "moderate", spiceLevel: "medium", price: 14000, 
    description: "매콤한 토마토 소스의 깔끔한 맛", 
    tags: ["🍝 파스타", "🌶️🌶️ 보통맛", "🔥 매콤함"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/0/09/%EC%84%B1%EB%B6%81%EB%8F%99_%EB%94%94%EB%84%88%EC%87%BC_%EC%95%84%EB%9D%BC%EB%B9%84%EC%95%84%EB%94%B0.png",
      "https://upload.wikimedia.org/wikipedia/commons/c/cd/Penne_Arrabbiata.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f3/Pasta_all%C2%B4arrabbiata_%285864409158%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/77/Pasta_all%C2%B4arrabbiata_%285863855957%29.jpg"
    ]
  },
  { 
    id: 73, name: "페퍼로니 피자", category: "western", priceRange: "moderate", spiceLevel: "mild", price: 18000, 
    description: "짭짤한 페퍼로니와 치즈의 환상 조화", 
    tags: ["🍕 피자", "🥛 순한맛", "🧀 짭짤한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/All_Good_pizza_%2838501728345%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Pepperoni_Pizza_-_Greggs_2024-03-16.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/30/Pepperoni_Pizza_from_Fellini%E2%80%99s_Pizza.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Pepperoni_pizza-_boella_co._2024-02-17.jpg"
    ]
  },
  { 
    id: 74, name: "수제버거", category: "western", priceRange: "moderate", spiceLevel: "mild", price: 12000, 
    description: "육즙 가득 패티와 신선한 야채", 
    tags: ["🍔 햄버거", "🥛 순한맛", "🥩 든든한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/c/c3/Gourmet_Burger_Kitchen_hamburger.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5b/Cheddar_Cheese_Beef_Burger_-_Gourmet_Burger_Kitchen_2023-10-03.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/Hamburger_sandwich.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d0/Hamburger_on_Brioche.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/4d/Cheeseburger.jpg"
    ]
  },
  { 
    id: 75, name: "등심 스테이크", category: "western", priceRange: "premium", spiceLevel: "mild", price: 38000, 
    description: "고급스러운 육질과 풍부한 육즙", 
    tags: ["🥩 소고기", "💎 프리미엄", "🍽️ 분위기"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8b/300_grams_Sirloin_Steak_%283690335768%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/Sirloin_Steak_%282056614458%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/dc/Sirloin_steak_at_home.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Classic_8oz_sirloin_steak_-_The_Bright_Helm_2023-10-17.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/82/Beef_Strip_Sirloin_Steak_with_Potato_Fries.jpg"
    ]
  },
  { 
    id: 76, name: "알리오올리오", category: "western", priceRange: "budget", spiceLevel: "mild", price: 9000, 
    description: "마늘과 올리브유의 담백한 풍미", 
    tags: ["🍝 파스타", "🥛 순한맛", "🧄 마늘풍미"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Mussels_Spaghetti_aglio_e_olio_textures_Vikings_Luxury_Dinner_Buffet_26_January_2025_Philippines5.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Pasta_made_by_a_restaurant_named_%EC%97%B4%EB%91%90%EB%8B%AC_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3e/Spaghetti_aglio_e_olio_KB.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/72/Spaghetti_aglio_olio_e_peperoncino_by_matsuyuki_retouched.jpg"
    ]
  },
  { 
    id: 77, name: "매운 해물 파스타", category: "western", priceRange: "moderate", spiceLevel: "hot", price: 16000, 
    description: "해산물이 듬뿍 들어간 얼큰한 파스타", 
    tags: ["🌋 매운맛", "🍝 파스타", "🦐 해산물"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e7/Pasta_with_Calamari%2C_Mussels_%26_Prawns_in_a_spicy_tomato_sauce._%2843496515810%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/dc/Seafood_pasta_%286792548256%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/59/Pasta_with_seafood.jpg"
    ]
  },
  { 
    id: 78, name: "리조또", category: "western", priceRange: "moderate", spiceLevel: "mild", price: 15000, 
    description: "부드럽고 크리미한 이탈리아식 쌀요리", 
    tags: ["🍚 리조또", "🥛 순한맛", "🧀 부드러운"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/a/ae/Risotto_de_gambas%2C_restaurant_Danieli_%28Vienne%2C_Autriche%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Risotto_Weihnachten_2020_13.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a9/Risotto_with_truffles_in_Saudi_Arabia.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/0e/Risotto_de_verduras_acompa%C3%B1ado_con_salsa_de_tomate_y_queso_rallado.jpg"
    ]
  },
  { 
    id: 79, name: "함박 스테이크", category: "western", priceRange: "moderate", spiceLevel: "mild", price: 14000, 
    description: "입안에서 녹는 부드러운 다진 고기", 
    tags: ["🥩 소고기", "🥛 순한맛", "🍳 인기"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e0/Hamburg-Steak.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/dd/Teriyaki_Hamburger_Steak_at_Suzuki_Kitchen%2C_Lidu_%2820201206171408%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/43/Hamburg_steak_%2830664320015%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e5/Hamburg_steak_lunch_of_Nakau.jpg"
    ]
  },
  { 
    id: 80, name: "치즈 피자", category: "western", priceRange: "budget", spiceLevel: "mild", price: 15000, 
    description: "치즈 본연의 고소함을 즐기는 피자", 
    tags: ["🍕 피자", "🥛 순한맛", "🧀 치즈듬뿍"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Bar_Pizza-_Cheese.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c5/Three_cheese_Pizza_Vikings_Luxury_Dinner_Buffet_platter_26_January_2025_Philippines4.jpg"
    ]
  },

  // --- STREET (분식) ---
  { 
    id: 91, name: "떡볶이", category: "street", priceRange: "budget", spiceLevel: "medium", price: 4500, 
    description: "매콤달콤 국민 간식", 
    tags: ["🍢 분식", "🌶️🌶️ 보통맛", "💰 가성비"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e9/Homemade_hot_and_spicy_rice_cake.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Korean.snacks-Tteokbokki-08.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c5/Korean.snacks-Tteokbokki-01.jpg"
    ]
  },
  { 
    id: 92, name: "순대", category: "street", priceRange: "budget", spiceLevel: "mild", price: 5000, 
    description: "쫄깃쫄깃 고소한 맛", 
    tags: ["🍢 분식", "🥛 순한맛", "🧂 소금톡톡"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Korean_blood_sausage-Sundae-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/42/Korean.food-Sundae-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/94/Sundae_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a4/Sundae_4.jpg"
    ]
  },
  { 
    id: 93, name: "튀김 세트", category: "street", priceRange: "budget", spiceLevel: "mild", price: 6000, 
    description: "바삭바삭한 다양한 튀김들", 
    tags: ["🍢 분식", "🥛 순한맛", "🥟 바삭함"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/f/fd/Korean.cuisine-Goguma_twigim-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/50/Korea-Sokcho-Daepo_Port-Twigim_and_Ojingeo_sundae-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/ec/Ojingeo-twigim_and_gochu-twigim.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f9/Gim-mari-twigim_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/76/Saeu-twigim.jpg"
    ]
  },
  { 
    id: 94, name: "매운 떡볶이", category: "street", priceRange: "budget", spiceLevel: "hot", price: 5000, 
    description: "땀이 쏙 빠지는 매운맛의 진수", 
    tags: ["🌋 매운맛", "🍢 분식", "🔥 도전"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/b/ba/Tteokbokki_in_korea.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/01/Tteokbokki_Dukki_Berlin.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7a/Korean.snacks-Tteokbokki-06.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Tteokbokki_%EB%96%A1%EB%B3%B6%EC%9D%B4_cheese1.jpg"
    ]
  },
  { 
    id: 95, name: "김밥", category: "street", priceRange: "budget", spiceLevel: "mild", price: 4000, 
    description: "든든하게 속을 채운 정성", 
    tags: ["🍢 분식", "🥛 순한맛", "🍚 간단한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/0/0e/Gimbap_%28pixabay%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/10/2015%EB%85%84_3%EC%9B%94_8%EC%9D%BC_%EB%8B%B9%EA%B7%BC%EC%9D%B4_%EB%A7%8E%EC%9D%B4_%EB%93%A4%EC%96%B4%EA%B0%84_%EA%B9%80%EB%B0%A5.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Gimbap_8.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/ff/KTX_gimbap-dosirak.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/71/Gimbap_02.jpg"
    ]
  },
  { 
    id: 96, name: "라볶이", category: "street", priceRange: "budget", spiceLevel: "medium", price: 6500, 
    description: "라면과 떡볶이의 환상 만남", 
    tags: ["🍢 분식", "🌶️🌶️ 보통맛", "🍜 면요리"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/2/21/Ra-bokki%2C_stir-fried_rice_cakes_and_ramyeon_noodles.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Ra-bokki_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f1/Rabokki_-_SOJU_2024-06-02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/Ra-bokki_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/34/Ra-bokki_1.jpg"
    ]
  },

  // --- ASIAN / VIETNAMESE (아시안) ---
  { 
    id: 101, name: "쌀국수", category: "vietnamese", priceRange: "moderate", spiceLevel: "mild", price: 10000, 
    description: "맑고 진한 육수의 베트남 대표 면요리", 
    tags: ["🍜 베트남", "🥛 순한맛", "🌿 깔끔한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/5/5d/Pho_Vietnamese_noodle_soup_in_Ho_Chi_Minh_City%2C_Vietnam.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/03/Vietnamese_Beef_Noodle_Soup_at_Ming_Viet_Vietnamese_Cuisine_in_Central.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/Rice_Noodle_With_Braised_Duck_And_Hard_Boiled_Egg_-_March_2024.jpg"
    ]
  },
  { 
    id: 102, name: "분짜", category: "vietnamese", priceRange: "moderate", spiceLevel: "mild", price: 13000, 
    description: "숯불 고기와 새콤한 소스의 조화", 
    tags: ["🍜 베트남", "🥗 신선함", "🥛 순한맛"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/Vietnamese_grilled_pork_with_rice_noodles_and_fish_sauce.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/B%C3%BAn_ch%E1%BA%A3_H%C3%A0ng_M%C3%A0nh.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Bun_cha_Hanoi.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/4d/B%C3%BAn_ch%E1%BA%A3_Vietnamese_food.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/4d/B%C3%BAn_ch%E1%BA%A3_with_chili_peppers_and_fresh_garlic.jpg"
    ]
  },
  { 
    id: 103, name: "팟타이", category: "asian", priceRange: "moderate", spiceLevel: "medium", price: 12000, 
    description: "태국식 볶음 쌀국수의 달콤짭짤한 맛", 
    tags: ["🥘 태국", "🌶️🌶️ 보통맛", "🥜 고소한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Phat_Thai_kung_Chang_Khien_street_stall.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/63/Thai-Pad-Thai_2023-06-04.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/fc/Pad_Thai_in_Thai_Cooking_School_in_Sukhothai.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/01/Pad_Thai_Noodles_-_Little_Thai%2C_Brighton_2024-03-21.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/0d/Pad_Thai_with_Pork_-_Unithai.jpg"
    ]
  },
  { 
    id: 104, name: "나시고랭", category: "asian", priceRange: "moderate", spiceLevel: "medium", price: 11000, 
    description: "인도네시아의 풍미 가득한 볶음밥", 
    tags: ["🍛 볶음밥", "🌶️🌶️ 보통맛", "🇮🇩 인기"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/3/34/Nasi_goreng_pattaya_20231028_120535.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3e/Nasi_goreng_indonesia.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b3/Nasi_Goreng_Ikan_Asin.jpg"
    ]
  },
  { 
    id: 105, name: "반미", category: "vietnamese", priceRange: "budget", spiceLevel: "mild", price: 7500, 
    description: "바삭한 바게트 샌드위치", 
    tags: ["🥖 베트남", "🥛 순한맛", "🥗 신선함"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/6/66/Banh_mi_PaMi_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/B%C3%A1nh_M%C3%AC_with_Spicy_Miso_Aubergine%2C_Kimchi_-_Earl%27s_Sandwiches_2023-09-25.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a2/Viet_McRib_Banh_Mi.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Special_Baguette_%28B%C3%A1nh_m%C3%AC%29_-_Banh_Mi_Ancient_Saigon_2024-12-20.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e3/B%C3%A1nh_m%C3%AC_%C4%91%E1%BA%ADu_h%C5%A9.jpg"
    ]
  },
  { 
    id: 106, name: "똠양꿍", category: "asian", priceRange: "premium", spiceLevel: "hot", price: 18000, 
    description: "매콤새콤 중독성 있는 세계 3대 스프", 
    tags: ["🌋 매운맛", "🦐 해산물", "🥘 이색적"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Tom_Yum_mixed_with_clear_soup.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b1/Mushrooms_Tom_Yum%2C_Duck_Pa-naeng%2C_and_Thai_Jasmine_Rice_-_Sawadee_Thai_Restaurant_2024-10-05.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Tom_Yum_with_Clear_Soup.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/30/Tom_Yum_Soup_with_mushroom_-_Siam_Siam_2025-09-07.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9c/Tom_Yum_Soup.JPG"
    ]
  },
  { 
    id: 107, name: "푸팟퐁커리", category: "asian", priceRange: "premium", spiceLevel: "mild", price: 28000, 
    description: "부드러운 커리와 게 요리", 
    tags: ["🦀 게요리", "💎 프리미엄", "🥛 부드러운"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/4/43/Pu_Phat_Phong_Kari.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/48/Phunim_phat_pong_kari.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Phuket_Style_Crab_Curry_Kanomjean_Vermicelli_rice_noodle_with_blue_crab%2C_crab_meat_curry%2C_served_with_hard_boiled_egg%2C_pickle_carrot_and_papaya_%2825136801546%29.jpg"
    ]
  },

  // --- MEXICAN (멕시칸) ---
  { 
    id: 111, name: "타코", category: "mexican", priceRange: "budget", spiceLevel: "medium", price: 9000, 
    description: "또띠아에 담긴 신선한 즐거움", 
    tags: ["🌮 멕시칸", "🌶️🌶️ 보통맛", "🥗 가벼운"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/bf/Tacos_al_pastor_prepa_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/15/Tacos_al_pastor_con_pi%C3%B1a.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3a/Tacos_al_pastor.jpg"
    ]
  },
  { 
    id: 112, name: "부리또", category: "mexican", priceRange: "moderate", spiceLevel: "medium", price: 12000, 
    description: "속이 꽉 찬 든든한 한 끼", 
    tags: ["🌯 멕시칸", "🌶️🌶️ 보통맛", "🍚 든든한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/0/01/Burrito_al_pastor_-_Bacalar_QR.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Chile_relleno_burrito.png",
      "https://upload.wikimedia.org/wikipedia/commons/4/44/Burrito_chihuahuense_de_chile_verde.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c9/Burrito_chihuahuense_de_chile_verde_c.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/83/Burrito_de_carne_con_papas_r%C3%BAsticas.jpg"
    ]
  },
  { 
    id: 113, name: "퀘사디아", category: "mexican", priceRange: "moderate", spiceLevel: "mild", price: 14000, 
    description: "치즈가 듬뿍 들어간 멕시코식 피자", 
    tags: ["🧀 치즈", "🥛 순한맛", "🌮 인기"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/Quesadilles_de_Blanes_amb_salses.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/03/At_Long_Island_2023_267.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5c/Chicken_quesadilla_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/bd/Quesadilla_alejandr%C3%A9.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/61/Quesadilla_de_maiz.jpg"
    ]
  },
  { 
    id: 114, name: "나초 플래터", category: "mexican", priceRange: "moderate", spiceLevel: "medium", price: 15000, 
    description: "풍성한 토핑의 바삭한 나초", 
    tags: ["🌮 멕시칸", "🥟 바삭함", "🌶️🌶️ 보통맛"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/f/fd/Mozzarella_cheese_stick%2C_fries%2C_and_nachos_platter.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/4d/NachosPlatter_C2Cafe.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f2/SoupPlatter_HomeMade_Mumbai.jpg"
    ]
  },
  { 
    id: 115, name: "엔칠라다", category: "mexican", priceRange: "premium", spiceLevel: "hot", price: 18000, 
    description: "소스에 푹 적신 매콤한 또띠아 요리", 
    tags: ["🌋 매운맛", "🌶️🌶️🌶️", "🌮 멕시칸"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/Enchiladas.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/ba/Festival_de_la_Enchilada_59.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/ec/Enchilada_Rice_Beans.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Enchiladas_en_salsa_verde.jpg"
    ]
  },

  // --- CHINESE (중식) ---
  { 
    id: 116, name: "훠궈", category: "chinese", priceRange: "premium", spiceLevel: "hot", price: 22000, 
    description: "각종 재료를 끓여 먹는 중국식 전골", 
    tags: ["🌋 매운맛", "🍲 전골", "🥢 중식"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/2/29/Hot_pot_in_Taiwanese_restaurant.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/da/Hai_Di_Lao_Hot_Pot_Food.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/Concentric_hot_pot_in_Chongqing_%2820180217165607%29.jpg"
    ]
  },
  { 
    id: 117, name: "딤섬 모둠", category: "chinese", priceRange: "moderate", spiceLevel: "mild", price: 14000, 
    description: "한입 크기의 다양한 딤섬을 즐기는 구성", 
    tags: ["🥛 순한맛", "🥟 딤섬", "🥢 중식"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d6/Dim_sum_at_Golden_Unicorn%2C_Chinatown%2C_NYC%2C_April_2009.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f6/Dim_Sum_Breakfast.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/12/Dim_Sum_collection_in_Chinese_restaurant.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5e/Xionghejia_-_Dimsum_Rosa_2.jpg"
    ]
  },
  { 
    id: 118, name: "샤오롱바오", category: "chinese", priceRange: "moderate", spiceLevel: "mild", price: 13000, 
    description: "육즙이 가득한 중국식 찐만두", 
    tags: ["🥛 순한맛", "🥟 만두", "🥢 중식"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Xiao_Long_Bao_by_Junhao%21.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5e/Xiaolongbao_Shanghai.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/80/Xiaolongbao-breakfast.jpg"
    ]
  },

  // --- JAPANESE (일식) ---
  { 
    id: 119, name: "오코노미야키", category: "japanese", priceRange: "moderate", spiceLevel: "mild", price: 12000, 
    description: "철판에 구워낸 일본식 부침 요리", 
    tags: ["🥛 순한맛", "🥞 철판", "🦑 해산물"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/5/59/Okonomiyaki_001.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/Okonomiyaki_in_Hiroshima.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/3/3a/Okonomiyaki%2C_Nagata-Ya%2C_Hiroshima_%2835565845404%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9b/Hiroshima-Style_Okonomiyaki_%2840283556800%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/27/Okonomiyaki_by_zezebono_in_Osaka.jpg"
    ]
  },
  { 
    id: 120, name: "가라아게 정식", category: "japanese", priceRange: "moderate", spiceLevel: "mild", price: 13000, 
    description: "겉바속촉 일본식 닭튀김 정식", 
    tags: ["🥛 순한맛", "🍗 닭고기", "🍚 든든한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/b/b8/Chicken_karaage_002.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/Chicken_karaage_003.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b1/Karaage_Set_20200421-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/78/Karaage_Set_20200806-01.jpg"
    ]
  },
  { 
    id: 121, name: "메밀소바", category: "japanese", priceRange: "budget", spiceLevel: "mild", price: 9000, 
    description: "담백한 메밀면과 시원한 육수", 
    tags: ["🥛 순한맛", "🍜 면요리", "❄️ 시원한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/7/7a/Japanese_Zaru_Soba.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/d/dd/Zaru-Soba-1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/cd/Zaru_Soba.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/69/Zaru_soba_by_spinachdip.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c3/Juwari_Soba_%288067612263%29.jpg"
    ]
  },

  // --- WESTERN (양식) ---
  { 
    id: 122, name: "라자냐", category: "western", priceRange: "moderate", spiceLevel: "mild", price: 15000, 
    description: "치즈와 소스가 층층이 쌓인 파스타", 
    tags: ["🥛 순한맛", "🧀 치즈", "🍝 파스타"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Lasagna_Bolognese_%2828840810053%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/66/Lasagna_Bolognese_%2828840811363%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/06/Meaty_Lasagna_8of8_%288736299782%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/16/Lasagna_with_minced_meat%2C_Brisbane.jpg"
    ]
  },
  { 
    id: 123, name: "클램 차우더", category: "western", priceRange: "moderate", spiceLevel: "mild", price: 14000, 
    description: "조개가 듬뿍 들어간 크리미한 수프", 
    tags: ["🥛 순한맛", "🥣 수프", "🦪 해산물"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/4/47/ManhattanClamChowder.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/98/Clam_Chowder.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/0/07/Clam_chowder_%2811030850154%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/49/Clam_chowder_with_whole_clams.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/ba/Quincy_Market_-_Boston_Chowda_clam_chowder.jpg"
    ]
  },
  { 
    id: 124, name: "치킨 파마산", category: "western", priceRange: "premium", spiceLevel: "mild", price: 20000, 
    description: "치즈와 토마토 소스가 어우러진 치킨 요리", 
    tags: ["🥛 순한맛", "🍗 닭고기", "🧀 치즈"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/3/34/Chicken_parmesan.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/12/Chicken_parmigiana.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/17/Chicken_parm_at_a_diner.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f6/Parmesan_chicken_filled_with_mozzarella_%288011631412%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d8/Chicken_parmigiana_with_a_side_of_rigatoni_pasta.jpg"
    ]
  },

  // --- STREET (분식/간식) ---
  { 
    id: 125, name: "어묵탕", category: "street", priceRange: "budget", spiceLevel: "mild", price: 6000, 
    description: "따끈한 국물과 어묵이 어우러진 간식", 
    tags: ["🥛 순한맛", "🍢 분식", "🥣 국물"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/2/2a/Eomuk-tang.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7b/Eomuk-tang_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/67/Eomuk-tang_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/90/Korea_fish_cake_soup-Eomuk-Tang_%EC%96%B4%EB%AC%B5%ED%83%95-_%286768498759%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f8/Eomuk-kkochi.jpg"
    ]
  },
  { 
    id: 126, name: "호떡", category: "street", priceRange: "budget", spiceLevel: "mild", price: 4000, 
    description: "달콤한 속이 가득한 겨울 간식", 
    tags: ["🥛 순한맛", "🍯 달콤", "🍡 간식"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/9/94/Korean_snack-Hotteok-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/97/Hotteok.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3c/Hotteok_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/37/Hotteok_3.jpg"
    ]
  },
  { 
    id: 127, name: "붕어빵", category: "street", priceRange: "budget", spiceLevel: "mild", price: 3500, 
    description: "팥이 듬뿍 들어간 추억의 간식", 
    tags: ["🥛 순한맛", "🐟 간식", "🍡 길거리"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/2/28/Bungeoppang-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/ad/Boong_o_bbang.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d3/%ED%95%9C%EA%B5%AD%EA%B8%B0%ED%96%89_%EA%B9%80%EC%9E%A5_%EC%9D%8C%EC%8B%9D_%EB%B6%95%EC%96%B4%EB%B9%B5.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/46/%EC%8B%9C%EC%9E%A5_2.jpg"
    ]
  },

  // --- VIETNAMESE (베트남) ---
  { 
    id: 128, name: "고이꾸온", category: "vietnamese", priceRange: "moderate", spiceLevel: "mild", price: 11000, 
    description: "쫀득한 라이스페이퍼의 베트남식 롤", 
    tags: ["🥛 순한맛", "🥗 가벼운", "🌿 신선"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/0/03/Summer_roll.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f2/Goi_cuon_Phuongnhu.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/9/90/G%E1%BB%8Fi_cu%E1%BB%91n.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/02/G%E1%BB%8Fi_Cu%E1%BB%91n_Chay_Vietnamese_Fresh_Vegetarian_Spring_Roll_2019-1599.jpg"
    ]
  },
  { 
    id: 129, name: "반쎄오", category: "vietnamese", priceRange: "moderate", spiceLevel: "mild", price: 13000, 
    description: "바삭한 베트남식 부침 요리", 
    tags: ["🥛 순한맛", "🥞 부침", "🥬 야채"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e5/B%C3%A1nh_x%C3%A8o_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/95/B%C3%A1nh_x%C3%A8o_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a5/B%C3%A1nh_x%C3%A8o_with_n%C6%B0%E1%BB%9Bc_m%E1%BA%AFm.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/59/Banh_Xeo_with_fish_sauce_and_vegetables.jpg"
    ]
  },

  // --- ASIAN (아시안) ---
  { 
    id: 130, name: "락사", category: "asian", priceRange: "premium", spiceLevel: "hot", price: 18000, 
    description: "코코넛과 향신료가 어우러진 매콤한 국수", 
    tags: ["🌋 매운맛", "🍜 면요리", "🥥 코코넛"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/7/7a/Curry_Laksa.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/61/Laksa_Noodles.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b9/Laksa_Bihun.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c8/Laksa_Noodle_Soup.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/34/Bowl_of_Katong_Laksa.jpg"
    ]
  },

  // --- STREET (분식/간식) ---
  { 
    id: 131, name: "핫도그", category: "street", priceRange: "budget", spiceLevel: "mild", price: 4500, 
    description: "겉은 바삭하고 속은 촉촉한 간편 간식", 
    tags: ["🥛 순한맛", "🌭 간식", "🍞 간편"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/Korean_potato_corn_dog.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5c/Korean_corn_dog_%26_fried_dumplings_-_KOGI_to-go_Korean_kitchen.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/77/Corn_dog_001.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/66/Corn_dog_1.jpg"
    ]
  },
  { 
    id: 132, name: "계란빵", category: "street", priceRange: "budget", spiceLevel: "mild", price: 3500, 
    description: "따끈한 빵 속에 계란이 쏙 들어간 간식", 
    tags: ["🥛 순한맛", "🥚 간식", "🍞 달콤"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/6/61/Gyeranppang_by_travel_oriented.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/99/Gyeranppang_%28egg_bread%29_%28Seoul_street_food%29.jpg"
    ]
  },

  // --- VIETNAMESE (베트남) ---
  { 
    id: 133, name: "분보후에", category: "vietnamese", priceRange: "moderate", spiceLevel: "hot", price: 12000, 
    description: "매콤한 향신료가 살아있는 진한 국물면", 
    tags: ["🌋 매운맛", "🍜 면요리", "🥩 고기"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Bun_Bo_Hue_and_Bun_Thit_Nuong.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f5/Bun-Bo-Hue-2008.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Bun_Bo_Hue_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/00/Bun-Bo-Hue-from-Huong-Giang-2011.jpg"
    ]
  },
  { 
    id: 134, name: "짜조", category: "vietnamese", priceRange: "moderate", spiceLevel: "mild", price: 11000, 
    description: "바삭하게 튀긴 베트남식 스프링롤", 
    tags: ["🥛 순한맛", "🥟 튀김", "🥬 야채"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Cha_gio.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/14/M%C3%B3n_%C4%83n_c%C3%BAng_m%E1%BB%93ng_2_T%E1%BA%BFt_2022_%28nem_r%C3%A1n%29_%282%29.jpg"
    ]
  },

  // --- MEXICAN (멕시칸) ---
  { 
    id: 135, name: "치미창가", category: "mexican", priceRange: "moderate", spiceLevel: "medium", price: 14000, 
    description: "바삭하게 튀긴 든든한 멕시칸 랩", 
    tags: ["🌶️🌶️ 보통맛", "🌯 멕시칸", "🥟 바삭함"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/c/c5/Chimichanga_%28188214820%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/27/Chimichanga2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/2010-02-14_Giant_steak_chimichanga_at_Cosmic_Cantina.jpg"
    ]
  },
  { 
    id: 136, name: "타말", category: "mexican", priceRange: "budget", spiceLevel: "mild", price: 9000, 
    description: "옥수수 반죽에 속을 넣어 찐 전통 멕시칸", 
    tags: ["🥛 순한맛", "🌽 옥수수", "🌮 멕시칸"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/3/3c/Tamales_tabasque%C3%B1os.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/64/La_Havane_%281%29_Tamales_pli%C3%A9s.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9a/Tamales_Mexicanos_sweet_corn_tamales_01.jpg"
    ]
  },

  // --- ASIAN (아시안) ---
  { 
    id: 137, name: "카오만까이", category: "asian", priceRange: "moderate", spiceLevel: "mild", price: 12000, 
    description: "부드러운 닭고기와 향긋한 밥의 조합", 
    tags: ["🥛 순한맛", "🍗 닭고기", "🍚 든든한"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/5/59/Hainanese_Chicken_Rice%2C_with_asparagus.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/0f/Hainanese_chicken_rice_%28in_Macau%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/94/Hainanese_chicken_rice_in_Singapore.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Hainanese_chicken_rice_at_Thai_Ten.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Hainanese_Chicken_Rice_on_Glass_Dish.jpg"
    ]
  },
  { 
    id: 138, name: "그린커리", category: "asian", priceRange: "moderate", spiceLevel: "medium", price: 13000, 
    description: "코코넛 향이 감도는 태국식 커리", 
    tags: ["🌶️🌶️ 보통맛", "🥥 코코넛", "🍛 커리"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e5/Thai_green_chicken_curry_and_roti.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/da/Yellow_curry_and_green_curry_-_Nok_Nok_Kitchen_at_The_Cow_2025-09-30.jpg"
    ]
  }
];

type BaseItem = (typeof baseItems)[number];

const foodRecommendations = baseItems.map(item => ({
  ...item,
  imageUrls: item.imageUrls ?? [],
  imageUrl: item.imageUrls?.[0] ?? null
}));

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
    
    const responseData = await response.json();
    if (!responseData.items) return [];
    
    return responseData.items.map((item: any) => item.link);
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
    const responseData = await response.json();
    return responseData.photos.map((p: any) => p.src.large);
  } catch (e) {
    console.error("Pexels fetch error:", e);
    return [];
  }
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  korean: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Korean_stew_dish_-_Kimchi-jjigae_Kimchi_Stew_2019_%2801%29.jpg/330px-Korean_stew_dish_-_Kimchi-jjigae_Kimchi_Stew_2019_%2801%29.jpg",
  chinese: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Jajangmyeon.jpg/330px-Jajangmyeon.jpg",
  japanese: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Shoyu_ramen%2C_at_Kasukabe_Station_%282014.05.05%29_1.jpg/330px-Shoyu_ramen%2C_at_Kasukabe_Station_%282014.05.05%29_1.jpg",
  western: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/330px-Pizza-3007395.jpg",
  street: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Tteokbokki.JPG/330px-Tteokbokki.JPG",
  vietnamese: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Ph%E1%BB%9F_b%C3%B2_%2839425047901%29.jpg/330px-Ph%E1%BB%9F_b%C3%B2_%2839425047901%29.jpg",
  mexican: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg/330px-001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg",
  asian: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Phat_Thai_kung_Chang_Khien_street_stall.jpg/330px-Phat_Thai_kung_Chang_Khien_street_stall.jpg"
};

const ENGLISH_FOOD_QUERIES: Record<string, string[]> = {
  "김치찌개": ["Kimchi stew", "Kimchi jjigae"],
  "된장찌개": ["Soybean paste stew", "Doenjang jjigae"],
  "콩나물국밥": ["Bean sprout soup rice", "Kongnamul gukbap"],
  "순두부찌개": ["Soft tofu stew", "Sundubu jjigae"],
  "육개장": ["Spicy beef soup", "Yukgaejang"],
  "잔치국수": ["Banquet noodles", "Janchi guksu"],
  "비빔국수": ["Bibim guksu", "Spicy mixed noodles"],
  "고등어구이 정식": ["Grilled mackerel set", "Grilled mackerel"],
  "계란찜 정식": ["Steamed egg set", "Gyeran jjim"],
  "매운 순두부찌개": ["Spicy soft tofu stew", "Spicy sundubu jjigae"],
  "제육볶음": ["Spicy pork stir-fry", "Jeyuk bokkeum"],
  "비빔밥": ["Bibimbap"],
  "뚝배기 불고기": ["Bulgogi hot pot", "Bulgogi stew"],
  "보쌈 정식": ["Bossam set", "Boiled pork wraps"],
  "낙지덮밥": ["Octopus rice bowl", "Nakji bokkeumbap"],
  "돌솥비빔밥": ["Dolsot bibimbap", "Stone bowl bibimbap"],
  "김치찜": ["Kimchi jjim", "Braised kimchi"],
  "뼈해장국": ["Pork bone soup", "Gamjatang"],
  "물냉면": ["Cold noodles", "Mul naengmyeon"],
  "비빔냉면": ["Spicy cold noodles", "Bibim naengmyeon"],
  "삼계탕": ["Samgyetang", "Ginseng chicken soup"],
  "한우 육회비빔밥": ["Korean beef tartare bibimbap", "Yukhoe bibimbap"],
  "갈비탕": ["Galbitang", "Short rib soup"],
  "매운 갈비찜": ["Spicy braised short ribs", "Spicy galbi jjim"],
  "불고기 전골": ["Bulgogi hot pot", "Bulgogi jeongol"],
  "간장게장 정식": ["Soy sauce crab set", "Ganjang gejang"],
  "찜닭": ["Jjimdak", "Braised chicken"],
  "곱창전골": ["Gopchang hot pot", "Beef intestine stew"],
  "닭볶음탕": ["Spicy braised chicken", "Dakbokkeumtang"],
  "해물파전": ["Seafood scallion pancake", "Haemul pajeon"],
  "짜장면": ["Jajangmyeon", "Black bean noodles"],
  "짬뽕": ["Jjamppong", "Spicy seafood noodle soup"],
  "볶음밥": ["Fried rice"],
  "군만두": ["Fried dumplings", "Gunmandu"],
  "매운 짬뽕": ["Spicy jjamppong", "Spicy seafood noodle soup"],
  "마파두부밥": ["Mapo tofu rice", "Mapo tofu"],
  "잡채밥": ["Japchae rice", "Stir-fried glass noodles"],
  "탕수육": ["Sweet and sour pork", "Tangsuyuk"],
  "깐풍기": ["Kkanpunggi", "Spicy garlic chicken"],
  "양장피": ["Yangjangpi", "Chinese jellyfish salad"],
  "마라탕": ["Malatang", "Spicy hot pot"],
  "고추잡채": ["Gochu japchae", "Stir-fried peppers and pork"],
  "돈카츠": ["Tonkatsu", "Breaded pork cutlet"],
  "라멘": ["Ramen"],
  "초밥 세트": ["Sushi set", "Sushi platter"],
  "규동": ["Gyudon", "Beef rice bowl"],
  "사케동": ["Salmon rice bowl", "Sake don"],
  "우동": ["Udon"],
  "가츠동": ["Katsudon", "Pork cutlet bowl"],
  "매운 탄탄멘": ["Spicy tantanmen", "Spicy tan tan noodles"],
  "텐동": ["Tendon tempura bowl", "Tempura rice bowl"],
  "장어덮밥(우나쥬)": ["Unagi rice bowl", "Unadon"],
  "까르보나라": ["Carbonara"],
  "아라비아따": ["Arrabbiata pasta", "Penne arrabbiata"],
  "페퍼로니 피자": ["Pepperoni pizza"],
  "수제버거": ["Gourmet burger", "Hamburger"],
  "등심 스테이크": ["Sirloin steak", "Steak"],
  "알리오올리오": ["Aglio e olio"],
  "매운 해물 파스타": ["Spicy seafood pasta", "Seafood pasta"],
  "리조또": ["Risotto"],
  "함박 스테이크": ["Hamburg steak", "Hamburger steak"],
  "치즈 피자": ["Cheese pizza", "Pizza"],
  "떡볶이": ["Tteokbokki", "Spicy rice cakes"],
  "순대": ["Sundae korean blood sausage", "Korean blood sausage"],
  "튀김 세트": ["Fried snack platter", "Assorted fritters"],
  "매운 떡볶이": ["Spicy tteokbokki", "Spicy rice cakes"],
  "김밥": ["Gimbap", "Korean sushi rolls"],
  "라볶이": ["Rabokki", "Ramen tteokbokki"],
  "쌀국수": ["Pho", "Vietnamese noodle soup"],
  "분짜": ["Bun cha", "Vietnamese grilled pork noodles"],
  "팟타이": ["Pad thai"],
  "나시고랭": ["Nasi goreng"],
  "반미": ["Banh mi"],
  "똠양꿍": ["Tom yum", "Tom yum soup"],
  "푸팟퐁커리": ["Pu pad pong curry", "Thai crab curry"],
  "타코": ["Taco", "Tacos"],
  "부리또": ["Burrito"],
  "퀘사디아": ["Quesadilla"],
  "나초 플래터": ["Nachos platter", "Nachos"],
  "엔칠라다": ["Enchilada"]
};

function getEnglishQueries(koreanName: string): string[] {
  return ENGLISH_FOOD_QUERIES[koreanName] ?? [];
}

function buildOptimizedQuery(query: string, isEnglish: boolean): string {
  if (isEnglish) {
    return `${query} food -meal kit -recipe -youtube -thumbnail -illustration -vector -product -shopping -price -person -face -human`;
  }
  return `${query} 음식 -밀키트 -레시피 -유튜브 -youtube -thumbnail -일러스트 -벡터 -제품 -쇼핑 -가격 -사람 -얼굴 -인물 -먹는모습 -face -person -human`;
}

// Helper to fetch images from available sources
async function fetchFoodImages(
  koreanName: string,
  englishQueries?: string[],
  categoryId?: string
): Promise<string[]> {
  // 1. Try Google Images first (Most accurate for specific dish)
  // Optimization: Exclude commercial products, recipes, people, and illustrations
  const googleImages = await fetchGoogleImages(buildOptimizedQuery(koreanName, false)); 
  if (googleImages.length > 0) return googleImages;
  if (englishQueries && englishQueries.length > 0) {
    for (const query of englishQueries) {
      const googleEnglish = await fetchGoogleImages(buildOptimizedQuery(query, true));
      if (googleEnglish.length > 0) return googleEnglish;
    }
  }

  // 2. Fallback to Pexels (Stock photos for specific dish)
  const pexelsKorean = await fetchPexelsImages(`${koreanName} food photography -person -face -man -woman`);
  if (pexelsKorean.length > 0) return pexelsKorean;
  if (englishQueries && englishQueries.length > 0) {
    for (const query of englishQueries) {
      const pexelsEnglish = await fetchPexelsImages(`${query} food photography -person -face -man -woman`);
      if (pexelsEnglish.length > 0) return pexelsEnglish;
    }
  }

  // 3. Last Resort: Fetch Category Genre Image
  if (categoryId && CATEGORY_FALLBACK_IMAGES[categoryId]) {
    return [CATEGORY_FALLBACK_IMAGES[categoryId]];
  }

  return [];
}

function pickByNearbyCounts(
  items: BaseItem[],
  nearbyCounts?: Record<string, number>
) {
  if (!nearbyCounts) {
    return items[Math.floor(Math.random() * items.length)];
  }

  let bestScore = -1;
  let bestItems: BaseItem[] = [];

  for (const item of items) {
    const score = nearbyCounts[item.name] ?? 0;
    if (score > bestScore) {
      bestScore = score;
      bestItems = [item];
    } else if (score === bestScore) {
      bestItems.push(item);
    }
  }

  const pool = bestScore > 0 ? bestItems : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getLocalFallback(
  request: RecommendationRequest,
  nearbyCounts?: Record<string, number>
): FoodRecommendation {
  const spiceOrder = ["mild", "medium", "hot"];
  const spiceIndex = (level: string) => spiceOrder.indexOf(level);
  const requestedSpice = spiceOrder.includes(request.spiceLevel)
    ? request.spiceLevel
    : "mild";
  const categoryItems = baseItems.filter(item => item.category === request.category);

  let filtered = categoryItems.filter(item =>
    item.priceRange === request.priceRange &&
    item.spiceLevel === requestedSpice
  );

  // Keep spice preference, relax price first
  if (filtered.length === 0) {
    filtered = categoryItems.filter(item => item.spiceLevel === requestedSpice);
  }

  // If no items match the spice at all, choose the closest spice level in-category.
  if (filtered.length === 0) {
    const priceItems = categoryItems.filter(item => item.priceRange === request.priceRange);
    const candidatePool = priceItems.length > 0 ? priceItems : categoryItems;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const item of candidatePool) {
      const distance = Math.abs(spiceIndex(item.spiceLevel) - spiceIndex(requestedSpice));
      if (distance < bestDistance) {
        bestDistance = distance;
        filtered = [item];
      } else if (distance === bestDistance) {
        filtered.push(item);
      }
    }
  }

  const selected = filtered.length > 0 
    ? pickByNearbyCounts(filtered, nearbyCounts)
    : baseItems[0];

  return {
    ...selected,
    imageUrls: selected.imageUrls ?? [],
    imageUrl: selected.imageUrls?.[0] ?? null,
    isAiGenerated: false
  };
}

async function withFallbackImage(recommendation: FoodRecommendation): Promise<FoodRecommendation> {
  const hasLocalImages = recommendation.imageUrls && recommendation.imageUrls.length > 0;
  if (hasLocalImages) {
    return { 
      ...recommendation,
      imageUrl: recommendation.imageUrl ?? recommendation.imageUrls?.[0] ?? null,
      isAiGenerated: false
    };
  }
  if (!recommendation.imageUrl || recommendation.imageUrl.length === 0) {
    const liveImages = await fetchFoodImages(
      recommendation.name,
      getEnglishQueries(recommendation.name),
      recommendation.category
    );
    
    if (liveImages.length > 0) {
      return { ...recommendation, imageUrls: liveImages, imageUrl: liveImages[0], isAiGenerated: false };
    }
  }
  return { ...recommendation, isAiGenerated: false };
}

export async function getFoodRecommendation(request: RecommendationRequest): Promise<FoodRecommendation> {
  let nearbyCounts: Record<string, number> | undefined;
  if (request.coordinates) {
    const pool = baseItems.filter(item => item.category === request.category);
    try {
      nearbyCounts = await getNearbyMenuCounts(
        pool.map(item => item.name),
        request.coordinates
      );
    } catch (e) {
      console.error("Failed to fetch nearby menu counts:", e);
    }
  } else {
  }

  const recommendation = getLocalFallback(request, nearbyCounts);
  return withFallbackImage(recommendation);
}

export async function getAlternativeRecommendations(category: string, excludeId?: number): Promise<FoodRecommendation[]> {
  const alternatives = foodRecommendations.filter(food => food.id !== excludeId);
  const shuffled = alternatives.sort(() => Math.random() - 0.5).slice(0, 3);

  // Fetch accurate images for alternatives in parallel
  const updatedAlternatives = await Promise.all(shuffled.map(async (item) => {
    if (item.imageUrls && item.imageUrls.length > 0) {
      return { ...item, imageUrl: item.imageUrl ?? item.imageUrls[0] };
    }
    // Use the unified fetch function with category fallback
    const liveImages = await fetchFoodImages(
      item.name,
      getEnglishQueries(item.name),
      item.category
    );
    
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
