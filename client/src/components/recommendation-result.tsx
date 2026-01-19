
import { ImageCarousel } from "./image-carousel";
import { ImageModal } from "./image-modal";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Share2, Search } from "lucide-react";
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

  const handleSearchMap = (type: 'kakao' | 'google') => {
    const query = encodeURIComponent(recommendation.name);
    const url = type === 'kakao' 
      ? `https://map.kakao.com/link/search/${query}`
      : `https://www.google.com/maps/search/${query}`;
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: t('title'),
      text: `오늘 점심은 ${recommendation.name} 어때요? ${recommendation.description}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert('링크가 복사되었습니다!');
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  // ... getImageUrls function stays same ...
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
          
          <div className="flex flex-col items-end mb-6">
            <div className="text-xl font-bold text-primary">
              {recommendation.price.toLocaleString()}원
            </div>
            <div className="text-[10px] text-muted-foreground mt-1 text-right max-w-[200px]">
              {t('price_disclaimer')}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Button 
              variant="outline" 
              className="group flex flex-col items-center justify-center gap-1 h-20 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all rounded-2xl"
              onClick={() => handleSearchMap('kakao')}
            >
              <div className="bg-primary/10 p-2 rounded-full group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-bold">{t('search_nearby')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="group flex flex-col items-center justify-center gap-1 h-20 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all rounded-2xl"
              onClick={handleShare}
            >
              <div className="bg-primary/10 p-2 rounded-full group-hover:scale-110 transition-transform">
                <Share2 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-bold">{t('share_result')}</span>
            </Button>
          </div>
          
          {recommendation.tags && (
            <div className="flex flex-wrap gap-2">
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
          <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
            {alternatives.map((option) => (
              <div 
                key={option.id}
                className="flex-shrink-0 bg-card border border-border/50 rounded-lg p-3 shadow-sm w-[140px] hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                <div className="relative h-20 w-full mb-2 overflow-hidden rounded bg-muted">
                  {option.imageUrl ? (
                    <ImageModal
                      images={getImageUrls(option)}
                      alt={option.name}
                      trigger={
                        <img 
                          src={option.imageUrl} 
                          alt={option.name}
                          className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            // Show icon fallback logic could be here if needed, 
                            // but react rendering might be tricky inline. 
                            // Relying on display:none hiding it and the sibling icon showing below if styled right.
                          }}
                        />
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {getCategoryIcon(option.category)}
                    </div>
                  )}
                </div>
                <div 
                  className="cursor-pointer flex-1 flex flex-col justify-between"
                  onClick={() => handleAlternativeClick(option)}
                >
                  <h5 className="font-medium text-sm text-foreground line-clamp-1 mb-1">{option.name}</h5>
                  <p className="text-xs text-muted-foreground font-medium">{option.price.toLocaleString()}원</p>
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
