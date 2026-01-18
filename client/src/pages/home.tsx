import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { getFoodRecommendation, getAlternativeRecommendations } from "@/lib/food-data";
import { StepProgress } from "@/components/step-progress";
import { FoodCategoryCard } from "@/components/food-category-card";
import { PriceOptionCard } from "@/components/price-option-card";
import { SpiceLevelCard } from "@/components/spice-level-card";
import { RecommendationResult } from "@/components/recommendation-result";
import { ContactModal } from "@/components/contact-modal";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { ArrowLeft, ArrowRight, RotateCcw, Clock, Sun, Moon } from "lucide-react";
import type { RecommendationRequest, FoodRecommendation } from "@/lib/types";

const FOOD_CATEGORIES = [
  {
    id: "korean",
    name: "한식",
    icon: "🍚",
    description: "김치찌개, 비빔밥...",
    color: "bg-red-500"
  },
  {
    id: "chinese",
    name: "중식",
    icon: "🥢",
    description: "짜장면, 탕수육...",
    color: "bg-yellow-500"
  },
  {
    id: "japanese",
    name: "일식",
    icon: "🍣",
    description: "초밥, 라멘...",
    color: "bg-purple-500"
  },
  {
    id: "western",
    name: "양식",
    icon: "🍔",
    description: "파스타, 피자...",
    color: "bg-green-500"
  },
  {
    id: "street",
    name: "분식/간식",
    icon: "🌭",
    description: "떡볶이, 김밥, 핫도그...",
    color: "bg-pink-500"
  }
] as const;

const PRICE_OPTIONS = [
  {
    id: "budget",
    name: "저렴한 가격",
    icon: "💰",
    description: "5,000원 ~ 8,000원",
    emoji: "😊"
  },
  {
    id: "moderate",
    name: "적당한 가격",
    icon: "💳",
    description: "8,000원 ~ 12,000원",
    emoji: "😋"
  },
  {
    id: "premium",
    name: "프리미엄",
    icon: "💎",
    description: "12,000원 이상",
    emoji: "🤤"
  }
] as const;

const SPICE_LEVELS = [
  {
    id: "mild",
    name: "순한맛",
    icon: "🥛",
    description: "매운맛 없이 부드럽게",
    spiceIcon: "🌶️"
  },
  {
    id: "medium",
    name: "보통맛",
    icon: "🔥",
    description: "적당히 매콤하게",
    spiceIcon: "🌶️🌶️"
  },
  {
    id: "hot",
    name: "매운맛",
    icon: "🌋",
    description: "진짜 매운맛으로!",
    spiceIcon: "🌶️🌶️🌶️"
  }
] as const;

interface RecommendationResponse {
  recommendation: FoodRecommendation;
  alternatives: FoodRecommendation[];
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentTime, setCurrentTime] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const { theme, setTheme } = useTheme();
  const [selections, setSelections] = useState<RecommendationRequest>({
    category: "korean",
    priceRange: "budget",
    spiceLevel: "mild"
  });
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const recommendationMutation = useMutation({
    mutationFn: async (request: RecommendationRequest) => {
      const recommendation = await getFoodRecommendation(request);
      const alternatives = await getAlternativeRecommendations(request.category, recommendation.id);
      return { recommendation, alternatives };
    },
    onSuccess: (data) => {
      setRecommendation(data);
      setCurrentStep(5);
    }
  });

  const handleSwapRecommendation = (newRecommendation: FoodRecommendation, currentRecommendation: FoodRecommendation) => {
    if (!recommendation) return;
    
    // Remove the new recommendation from alternatives and add current one
    const updatedAlternatives = recommendation.alternatives.filter(alt => alt.id !== newRecommendation.id);
    updatedAlternatives.push(currentRecommendation);
    
    // Update the recommendation state
    setRecommendation({
      recommendation: newRecommendation,
      alternatives: updatedAlternatives
    });
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelections(prev => ({ ...prev, category: category as any }));
    setTimeout(() => setCurrentStep(2), 500);
  };

  const handlePriceSelect = (priceRange: string) => {
    setSelections(prev => ({ ...prev, priceRange: priceRange as any }));
    setTimeout(() => setCurrentStep(3), 500);
  };

  const handleSpiceSelect = (spiceLevel: string) => {
    setSelections(prev => ({ ...prev, spiceLevel: spiceLevel as any }));
    setTimeout(() => {
      setCurrentStep(4);
      // Simulate loading time
      setTimeout(() => {
        recommendationMutation.mutate(selections);
      }, 2000);
    }, 500);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startOver = () => {
    setCurrentStep(1);
    setRecommendation(null);
    setSelections({
      category: "korean",
      priceRange: "budget",
      spiceLevel: "mild"
    });
  };

  return (
    <div className="max-w-md mx-auto bg-card/40 backdrop-blur-md shadow-2xl min-h-[90vh] relative my-4 rounded-2xl border border-white/10 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 text-foreground p-4 sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">🍽️ 오늘뭐먹지?</h1>
            <div className="text-sm opacity-90 flex items-center text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              <span>{currentTime}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-accent">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        
        <StepProgress currentStep={currentStep} totalSteps={5} />
      </header>

      {/* Top Banner Ad - Removed */}
      
      {/* Main Content */}
      <main className="p-4 pb-20">
        {/* Step 1: Food Category Selection */}
        {currentStep === 1 && (
          <div className="step fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">어떤 종류의 음식을 드시고 싶나요?</h2>
              <p className="text-muted-foreground">카테고리를 선택해주세요</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {FOOD_CATEGORIES.slice(0, 4).map((category) => (
                <FoodCategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selections.category === category.id}
                  onSelect={handleCategorySelect}
                />
              ))}
              <div className="col-span-2">
                <FoodCategoryCard
                  category={FOOD_CATEGORIES[4]}
                  isSelected={selections.category === FOOD_CATEGORIES[4].id}
                  onSelect={handleCategorySelect}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Price Range Selection */}
        {currentStep === 2 && (
          <div className="step fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">예산은 얼마나 생각하고 계신가요?</h2>
              <p className="text-muted-foreground">가격대를 선택해주세요</p>
            </div>

            <div className="space-y-4">
              {PRICE_OPTIONS.map((option) => (
                <PriceOptionCard
                  key={option.id}
                  option={option}
                  isSelected={selections.priceRange === option.id}
                  onSelect={handlePriceSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Spice Level Selection */}
        {currentStep === 3 && (
          <div className="step fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">매운 정도는 어떻게 하실까요?</h2>
              <p className="text-muted-foreground">매운맛 정도를 선택해주세요</p>
            </div>

            <div className="space-y-4">
              {SPICE_LEVELS.map((level) => (
                <SpiceLevelCard
                  key={level.id}
                  level={level}
                  isSelected={selections.spiceLevel === level.id}
                  onSelect={handleSpiceSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Loading Screen */}
        {currentStep === 4 && (
          <div className="step fade-in">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-foreground mb-2">맛있는 메뉴를 찾고 있어요...</h2>
              <p className="text-muted-foreground">잠시만 기다려주세요!</p>
            </div>
          </div>
        )}

        {/* Step 5: Recommendation Result */}
        {currentStep === 5 && recommendation && (
          <RecommendationResult 
            recommendation={recommendation.recommendation}
            alternatives={recommendation.alternatives}
            onSwapRecommendation={handleSwapRecommendation}
          />
        )}
      </main>

      {/* Footer Links */}
      <footer className="py-6 text-center text-xs text-muted-foreground pb-24 border-t border-border/10 mt-8">
        <p className="mb-2">Note: This recommender is a random generator for fun.</p>
        <div className="flex justify-center gap-4">
          <Link href="/about" className="underline hover:text-primary cursor-pointer">About Us</Link>
          <button 
            className="underline hover:text-primary cursor-pointer bg-transparent border-none p-0 text-xs text-muted-foreground" 
            onClick={() => setShowContactModal(true)}
          >
            Affiliate Inquiry
          </button>
          <Link href="/privacy" className="underline hover:text-primary cursor-pointer">Privacy Policy</Link>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card/80 backdrop-blur-sm border-t border-border/50 p-4 rounded-b-2xl transition-colors duration-300">
        <div className="flex space-x-3">
          {currentStep > 1 && currentStep < 5 && (
            <Button
              variant="secondary"
              className="flex-1"
              onClick={goBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              이전
            </Button>
          )}
          
          {currentStep === 5 && (
            <Button
              className="flex-1 bg-secondary hover:bg-secondary/90"
              onClick={startOver}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 추천받기
            </Button>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  );
}
