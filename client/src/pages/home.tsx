import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { getFoodRecommendation, getAlternativeRecommendations } from "@/lib/food-data";
import { StepProgress } from "@/components/step-progress";
import { FoodCategoryCard } from "@/components/food-category-card";
import { PriceOptionCard } from "@/components/price-option-card";
import { SpiceLevelCard } from "@/components/spice-level-card";
import { RecommendationResult } from "@/components/recommendation-result";
import { DisqusComments } from "@/components/disqus-comments";
import { ContactModal } from "@/components/contact-modal";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/components/language-provider";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RotateCcw, Clock, Sun, Moon, Gamepad2, AlertCircle, ArrowUp } from "lucide-react";
import type { RecommendationRequest, FoodRecommendation } from "@/lib/types";

interface RecommendationResponse {
  recommendation: FoodRecommendation;
  alternatives: FoodRecommendation[];
}

const CATEGORY_IDS = [
  { id: "korean", icon: "🍚", color: "bg-red-500" },
  { id: "chinese", icon: "🥢", color: "bg-yellow-500" },
  { id: "japanese", icon: "🍣", color: "bg-purple-500" },
  { id: "western", icon: "🍔", color: "bg-green-500" },
  { id: "street", icon: "🌭", color: "bg-pink-500" },
  { id: "vietnamese", icon: "🍜", color: "bg-emerald-500" },
  { id: "mexican", icon: "🌮", color: "bg-orange-500" },
  { id: "asian", icon: "🥘", color: "bg-teal-500" }
] as const;

const PRICE_IDS = [
  { id: "budget", icon: "💰", emoji: "😊" },
  { id: "moderate", icon: "💳", emoji: "😋" },
  { id: "premium", icon: "💎", emoji: "🤤" }
] as const;

const SPICE_IDS = [
  { id: "mild", icon: "🥛", spiceIcon: "🌶️" },
  { id: "medium", icon: "🔥", spiceIcon: "🌶️🌶️" },
  { id: "hot", icon: "🌋", spiceIcon: "🌶️🌶️🌶️" }
] as const;

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-md md:max-w-2xl mx-auto bg-card/40 backdrop-blur-md shadow-2xl min-h-[90vh] relative my-4 rounded-3xl border border-white/10 overflow-hidden transition-all duration-300">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 text-foreground p-4 sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{t('title')}</h1>
            <div className="text-sm opacity-90 flex items-center text-muted-foreground hidden sm:flex">
              <Clock className="w-3 h-3 mr-1" />
              <span>{currentTime}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/rps">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent border border-border/50" title={t('rps_game')}>
                <Gamepad2 className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full hover:bg-accent border border-border/50">
              <span className="text-xs font-bold">{language === "en" ? "EN" : "KO"}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-accent border border-border/50">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        <StepProgress currentStep={currentStep} totalSteps={5} />
      </header>
      
      {/* Main Content */}
      <main className="p-4 pb-20">
        {/* Back Button */}
        {currentStep > 1 && currentStep < 5 && (
          <div className="mb-2">
            <Button 
              variant="ghost" 
              onClick={goBack} 
              className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent group h-auto py-2"
            >
              <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 
              <span className="text-base font-medium">{t('prev')}</span>
            </Button>
          </div>
        )}

        {/* Selection Summary */}
        {currentStep > 1 && (
          <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in slide-in-from-top-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-secondary/50 text-secondary-foreground border border-border/50">
              {t(selections.category as any)}
            </Badge>
            {currentStep > 2 && (
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-secondary/50 text-secondary-foreground border border-border/50">
                {t(selections.priceRange as any)}
              </Badge>
            )}
            {currentStep > 3 && (
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-secondary/50 text-secondary-foreground border border-border/50">
                {t(selections.spiceLevel as any)}
              </Badge>
            )}
          </div>
        )}

        {/* Step 1: Category */}
        {currentStep === 1 && (
          <div className="step fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">{t('category_title')}</h2>
              <p className="text-muted-foreground">{t('category_desc')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORY_IDS.map((cat) => (
                <FoodCategoryCard
                  key={cat.id}
                  category={{ ...cat, name: t(cat.id as any), description: "" }} 
                  isSelected={selections.category === cat.id}
                  onSelect={handleCategorySelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Price */}
        {currentStep === 2 && (
          <div className="step fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">{t('price_title')}</h2>
              <p className="text-muted-foreground">{t('price_desc')}</p>
            </div>
            <div className="space-y-4">
              {PRICE_IDS.map((opt) => (
                <PriceOptionCard
                  key={opt.id}
                  option={{ ...opt, name: t(opt.id as any), description: "" }}
                  isSelected={selections.priceRange === opt.id}
                  onSelect={handlePriceSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Spice */}
        {currentStep === 3 && (
          <div className="step fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">{t('spice_title')}</h2>
              <p className="text-muted-foreground">{t('spice_desc')}</p>
            </div>
            <div className="space-y-4">
              {SPICE_IDS.map((lvl) => (
                <SpiceLevelCard
                  key={lvl.id}
                  level={{ ...lvl, name: t(lvl.id as any), description: "" }}
                  isSelected={selections.spiceLevel === lvl.id}
                  onSelect={handleSpiceSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Loading or Error */}
        {currentStep === 4 && (
          <div className="step fade-in">
            <div className="text-center py-16">
              {recommendationMutation.isError ? (
                <>
                  <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-foreground mb-2">오류가 발생했습니다</h2>
                  <p className="text-muted-foreground mb-6">메뉴를 추천하는 도중 문제가 생겼습니다.</p>
                  <Button onClick={() => recommendationMutation.mutate(selections)} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" /> 다시 시도하기
                  </Button>
                </>
              ) : (
                <>
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                  <h2 className="text-xl font-bold text-foreground mb-2">{t('loading_title')}</h2>
                  <p className="text-muted-foreground">{t('loading_desc')}</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Result */}
        {currentStep === 5 && recommendation && (
          <>
            <RecommendationResult 
              recommendation={recommendation.recommendation}
              alternatives={recommendation.alternatives}
              onSwapRecommendation={handleSwapRecommendation}
            />
            <div className="mt-8 px-2 step fade-in" style={{ animationDelay: '0.2s' }}>
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-bold shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground border-none" 
                onClick={startOver}
              >
                <RotateCcw className="w-5 h-5 mr-2" /> {t('restart')}
              </Button>
            </div>
          </>
        )}
      </main>

      {/* Disqus Comments */}
      <section className="px-6 mb-8">
        <DisqusComments />
      </section>

      {/* SEO & Footer */}
      <section className="p-8 mx-6 mb-8 rounded-2xl bg-card/40 backdrop-blur-md border border-border/30 shadow-sm transition-all hover:shadow-md">
        <article className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4 leading-tight">{t('seo_title_1')}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{t('seo_desc_1')}</p>
        </article>
        <article>
          <h2 className="text-xl font-bold text-foreground mb-4 leading-tight">{t('seo_title_2')}</h2>
          <div className="text-muted-foreground text-sm leading-relaxed">{t('seo_desc_2')}</div>
        </article>
      </section>

      <footer className="py-6 text-center text-xs text-muted-foreground pb-24 border-t border-border/10 mt-8">
        <p className="mb-2">{t('footer_note')}</p>
        <div className="flex justify-center gap-4">
          <Link href="/about" className="underline hover:text-primary cursor-pointer">{t('about')}</Link>
          <button 
            className="underline hover:text-primary cursor-pointer bg-transparent border-none p-0 text-xs text-muted-foreground" 
            onClick={() => setShowContactModal(true)}
          >
            {t('affiliate')}
          </button>
          <Link href="/privacy" className="underline hover:text-primary cursor-pointer">{t('privacy')}</Link>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <Button
          size="icon"
          className="fixed bottom-24 right-6 rounded-full w-12 h-12 shadow-2xl bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-border/50 hover:scale-110 transition-all z-40"
          onClick={scrollToTop}
        >
          <ArrowUp className="w-6 h-6" />
        </Button>
      )}

      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      <PWAInstallPrompt />
    </div>
  );
}