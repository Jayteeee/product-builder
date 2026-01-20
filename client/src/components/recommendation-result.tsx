import { ImageCarousel } from "./image-carousel";
import { ImageModal } from "./image-modal";
import { useLanguage } from "./language-provider";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MapPin, Share2, Search, Map as MapIcon } from "lucide-react";
import { compressData } from "@/lib/share-utils";
import type { FoodRecommendation } from "@/lib/types";
import { ShareButtons } from "./share-buttons";

interface RecommendationResultProps {
  recommendation: FoodRecommendation;
  alternatives: FoodRecommendation[];
  onSwapRecommendation: (newRec: FoodRecommendation, currentRec: FoodRecommendation) => void;
  shareUrl?: string;
  shareTitle?: string;
}

export function RecommendationResult({ recommendation, alternatives, onSwapRecommendation, shareUrl, shareTitle }: RecommendationResultProps) {
  console.log("Rendering RecommendationResult for:", recommendation.name);
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const handleAlternativeClick = (alternative: FoodRecommendation) => {
    onSwapRecommendation(alternative, recommendation);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchMap = (type: 'naver' | 'kakao') => {
    const query = encodeURIComponent(recommendation.name);
    const url = type === 'naver' 
      ? `https://map.naver.com/v5/search/${query}`
      : `https://map.kakao.com/link/search/${query}`;
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    const url = shareUrl || window.location.href;
    const title = shareTitle || (language === 'ko' ? '오늘뭐먹지? 🍱' : 'Lunch Picker 🍱');
    
    const text = language === 'ko' 
        ? `오늘 점심은 이걸로 정했어요! ✨\n\n🍴 메뉴: ${recommendation.name}\n💰 예상가격: ${recommendation.price.toLocaleString()}원\n💬 추천이유: ${recommendation.description}\n\n지금 바로 확인해보세요 👇`
        : `I found the perfect lunch! ✨\n\n🍴 Menu: ${recommendation.name}\n💰 Price: ₩${recommendation.price.toLocaleString()}\n💬 Why: ${recommendation.description}\n\nCheck it out here 👇`;

    const shareData = {
      title: title,
      text: text,
      url: url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        toast({
          title: language === 'ko' ? "링크 복사 완료" : "Link Copied",
          description: language === 'ko' ? "클립보드에 링크가 복사되었습니다." : "Link has been copied to clipboard.",
        });
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  const getImageUrls = (food: FoodRecommendation) => {
    if (food.imageUrls && food.imageUrls.length > 0) return food.imageUrls;
    if (food.imageUrl) return [food.imageUrl];
    return [];
  };

  return (
    <div className="step fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">🎉 {t('result_title')}</h2>
        <p className="text-muted-foreground">{t('result_desc')}</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl shadow-lg overflow-hidden mb-6 bounce-in relative">
        <ImageModal
          images={getImageUrls(recommendation)}
          alt={recommendation.name}
          trigger={
            <div className="cursor-pointer">
              <ImageCarousel images={getImageUrls(recommendation)} alt={recommendation.name} className="w-full h-64 md:h-72" />
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
            <div className="text-xl font-bold text-primary">{recommendation.price.toLocaleString()}원</div>
            <div className="text-[10px] text-muted-foreground mt-1 text-right max-w-[200px]">{t('price_disclaimer')}</div>
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 border-primary/20 hover:bg-primary/5 h-12 rounded-xl transition-all"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-bold text-sm">{t('search_nearby')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-popover/95 backdrop-blur-md border-border/50 rounded-xl shadow-xl min-w-[160px]">
                <DropdownMenuItem onClick={() => handleSearchMap('naver')} className="flex items-center gap-2 cursor-pointer py-3 focus:bg-primary/10">
                  <div className="bg-green-500 w-2 h-2 rounded-full" />
                  <span className="font-medium">{t('naver_map')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSearchMap('kakao')} className="flex items-center gap-2 cursor-pointer py-3 focus:bg-primary/10">
                  <div className="bg-yellow-500 w-2 h-2 rounded-full" />
                  <span className="font-medium">{t('kakao_map')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 border-primary/20 hover:bg-primary/5 h-12 rounded-xl transition-all"
                >
                  <Share2 className="w-4 h-4 text-primary" />
                  <span className="font-bold text-sm">{t('share_result')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="end">
                <ShareButtons url={shareUrl} title={shareTitle} />
              </PopoverContent>
            </Popover>
          </div>

          {recommendation.tags && (
            <div className="flex flex-wrap gap-2">
              {recommendation.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 text-sm font-normal bg-secondary/80 hover:bg-secondary text-secondary-foreground border-none">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {alternatives.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3">{t('alternatives')}</h4>
          <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
            {alternatives.map((option) => (
              <div key={option.id} className="flex-shrink-0 bg-card border border-border/50 rounded-lg p-3 shadow-sm w-[140px] hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
                <div className="relative h-20 w-full mb-2 overflow-hidden rounded bg-muted">
                  {getImageUrls(option).length > 0 ? (
                    <ImageModal
                      images={getImageUrls(option)}
                      alt={option.name}
                      trigger={
                        <div className="w-full h-full cursor-pointer hover:scale-110 transition-transform duration-500">
                          <ImageCarousel 
                            images={getImageUrls(option)} 
                            alt={option.name} 
                            className="w-full h-full" 
                            showControls={false}
                          />
                        </div>
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">{getCategoryIcon(option.category)}</div>
                  )}
                </div>
                <div className="cursor-pointer flex-1 flex flex-col justify-between" onClick={() => handleAlternativeClick(option)}>
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
  const key = category as any;
  return t(key) !== key ? t(key) : category;
}

function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    korean: "🍚", chinese: "🥢", japanese: "🍣", western: "🍔", street: "🌭", vietnamese: "🍜", mexican: "🌮", asian: "🥘"
  };
  return iconMap[category] || "🍽️";
}