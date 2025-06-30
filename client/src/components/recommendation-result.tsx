
import { ImageCarousel } from "./image-carousel";
import { ImageModal } from "./image-modal";
import type { FoodRecommendation } from "@shared/schema";

interface RecommendationResultProps {
  recommendation: FoodRecommendation;
  alternatives: FoodRecommendation[];
  onSwapRecommendation?: (newRecommendation: FoodRecommendation, currentRecommendation: FoodRecommendation) => void;
}

export function RecommendationResult({ recommendation, alternatives, onSwapRecommendation }: RecommendationResultProps) {
  const handleAlternativeClick = (alternative: FoodRecommendation) => {
    if (onSwapRecommendation) {
      onSwapRecommendation(alternative, recommendation);
    }
  };

  // Create image arrays for carousel - use imageUrls if available, otherwise create array from imageUrl
  const getImageUrls = (food: FoodRecommendation) => {
    if (food.imageUrls && food.imageUrls.length > 0) {
      return food.imageUrls;
    }
    if (food.imageUrl) {
      return [food.imageUrl];
    }
    return [];
  };
  return (
    <div className="step fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">🎉 추천 메뉴</h2>
        <p className="text-gray-600">오늘의 점심은 이거 어때요?</p>
      </div>

      {/* Recommended Food Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 bounce-in">
        <ImageModal
          images={getImageUrls(recommendation)}
          alt={recommendation.name}
          trigger={
            <div className="cursor-pointer">
              <ImageCarousel 
                images={getImageUrls(recommendation)}
                alt={recommendation.name}
                className="w-full h-48"
              />
            </div>
          }
        />
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold text-gray-800">{recommendation.name}</h3>
            <div className="bg-primary text-white px-3 py-1 rounded-full text-sm">
              {getCategoryName(recommendation.category)}
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">{recommendation.description}</p>
          
          <div className="flex items-center justify-end mb-4">
            <div className="text-lg font-bold text-primary">
              {recommendation.price.toLocaleString()}원
            </div>
          </div>
          
          {recommendation.tags && (
            <div className="flex flex-wrap gap-2">
              {recommendation.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alternative Options */}
      {alternatives.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">다른 추천 메뉴도 있어요!</h4>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {alternatives.map((option) => (
              <div 
                key={option.id}
                className="flex-shrink-0 bg-white rounded-lg p-3 shadow-md min-w-[120px] hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <div className="relative">
                  {option.imageUrl && (
                    <ImageModal
                      images={getImageUrls(option)}
                      alt={option.name}
                      trigger={
                        <img 
                          src={option.imageUrl} 
                          alt={option.name}
                          className="w-full h-16 object-cover rounded mb-2 cursor-pointer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      }
                    />
                  )}
                  <div className="text-2xl mb-1">{getCategoryIcon(option.category)}</div>
                </div>
                <div 
                  className="cursor-pointer"
                  onClick={() => handleAlternativeClick(option)}
                >
                  <h5 className="font-medium text-sm">{option.name}</h5>
                  <p className="text-xs text-gray-500">{option.price.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    korean: "한식",
    chinese: "중식", 
    japanese: "일식",
    western: "양식",
    street: "분식"
  };
  return categoryMap[category] || category;
}

function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    korean: "🍚",
    chinese: "🥢",
    japanese: "🍣", 
    western: "🍔",
    street: "🌭"
  };
  return iconMap[category] || "🍽️";
}
