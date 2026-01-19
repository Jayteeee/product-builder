export const CATEGORY_IDS = [
  { id: "korean", icon: "🍚", color: "bg-red-500" },
  { id: "chinese", icon: "🥢", color: "bg-yellow-500" },
  { id: "japanese", icon: "🍣", color: "bg-purple-500" },
  { id: "western", icon: "🍔", color: "bg-green-500" },
  { id: "street", icon: "🌭", color: "bg-pink-500" },
  { id: "vietnamese", icon: "🍜", color: "bg-emerald-500" },
  { id: "mexican", icon: "🌮", color: "bg-orange-500" },
  { id: "asian", icon: "🥘", color: "bg-teal-500" }
] as const;

export const PRICE_IDS = [
  { id: "budget", icon: "💰", emoji: "😊" },
  { id: "moderate", icon: "💳", emoji: "😋" },
  { id: "premium", icon: "💎", emoji: "🤤" }
] as const;

export const SPICE_IDS = [
  { id: "mild", icon: "🥛", spiceIcon: "🌶️" },
  { id: "medium", icon: "🔥", spiceIcon: "🌶️🌶️" },
  { id: "hot", icon: "🌋", spiceIcon: "🌶️🌶️🌶️" }
] as const;