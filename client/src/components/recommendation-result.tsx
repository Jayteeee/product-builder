
import { ImageCarousel } from "./image-carousel";
import { ImageModal } from "./image-modal";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import type { FoodRecommendation } from "@/lib/types";

interface RecommendationResultProps {
  recommendation: FoodRecommendation;
  alternatives: FoodRecommendation[];
  onSwapRecommendation?: (newRecommendation: FoodRecommendation, currentRecommendation: FoodRecommendation) => void;
}

export function RecommendationResult({ recommendation, alternatives, onSwapRecommendation }: RecommendationResultProps) {
  const { t } = useLanguage();
  
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
        <h2 className="text-2xl font-bold text-primary mb-2">🎉 {t('result_title')}</h2>
        <p className="text-muted-foreground">{t('result_desc')}</p>
      </div>

      {/* Recommended Food Card */}
      <div className="bg-card border border-border/50 rounded-2xl shadow-lg overflow-hidden mb-6 bounce-in">
        <ImageModal
          images={getImageUrls(recommendation)}
          alt={recommendation.name}
          trigger={
            <div className="cursor-pointer">
              <ImageCarousel 
                images={getImageUrls(recommendation)}
                alt={recommendation.name}
                className="w-full h-64 md:h-72" 
              />
            </div>
          }
        />
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <h3 className="text-2xl font-bold text-foreground order-2 md:order-1">{recommendation.name}</h3>
            <div className="flex flex-wrap gap-2 order-1 md:order-2">
              {recommendation.isAiGenerated && (
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 animate-pulse">
                  <span>✨</span> {t('ai_badge')}
                </div>
              )}
              <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                {getCategoryName(recommendation.category, t)}
              </div>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-6 leading-relaxed text-base border-l-4 border-primary/30 pl-4 py-1">
            {recommendation.description}
          </p>
          
          <div className="flex items-center justify-end mb-4">
            <div className="text-lg font-bold text-primary">
              {recommendation.price.toLocaleString()}원
            </div>
          </div>
          
          {recommendation.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {recommendation.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="px-3 py-1 text-sm font-normal bg-secondary/80 hover:bg-secondary text-secondary-foreground border-none"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alternative Options */}
      {alternatives.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3">{t('alternatives')}</h4>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {alternatives.map((option) => (
              <div 
                key={option.id}
                className="flex-shrink-0 bg-card border border-border/50 rounded-lg p-3 shadow-md min-w-[120px] hover:shadow-lg hover:scale-105 transition-all duration-200"
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
                  <h5 className="font-medium text-sm text-foreground">{option.name}</h5>
                  <p className="text-xs text-muted-foreground">{option.price.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getCategoryName(category: string, t: any): string {
  // Try to use translation key based on category id
  const key = category as any;
  // If translation exists, return it, otherwise fallback
  return t(key) !== key ? t(key) : category;
}

function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    korean: "🍚",
    chinese: "🥢",
    japanese: "🍣", 
    western: "🍔",
    street: "🌭",
    vietnamese: "🍜",
    mexican: "🌮",
    asian: "🥘"
  };
  return iconMap[category] || "🍽️";
}
