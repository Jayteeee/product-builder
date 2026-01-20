import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { getFoodRecommendation, getAlternativeRecommendations } from "@/lib/food-data";
import { CATEGORY_IDS, PRICE_IDS, SPICE_IDS } from "@/lib/constants";
import { decompressData, compressData } from "@/lib/share-utils";
import { StepProgress } from "@/components/step-progress";
import { FoodCategoryCard } from "@/components/food-category-card";
import { PriceOptionCard } from "@/components/price-option-card";
import { SpiceLevelCard } from "@/components/spice-level-card";
import { RecommendationResult } from "@/components/recommendation-result";
import { DisqusComments } from "@/components/disqus-comments";
import { ContactModal } from "@/components/contact-modal";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { StructuredData } from "@/components/structured-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/components/language-provider";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/use-geolocation";
import { ArrowLeft, RotateCcw, Clock, Sun, Moon, Gamepad2, AlertCircle, ArrowUp, History, Share2, MapPin } from "lucide-react";
import type { RecommendationRequest, FoodRecommendation } from "@/lib/types";
import { ShareButtons } from "@/components/share-buttons";

interface RecommendationResponse {
  recommendation: FoodRecommendation;
  alternatives: FoodRecommendation[];
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentTime, setCurrentTime] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [history, setHistory] = useState<FoodRecommendation[]>([]);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const { location, requestLocation } = useGeolocation();
  
  const [selections, setSelections] = useState<RecommendationRequest>({
    category: "korean",
    priceRange: "budget",
    spiceLevel: "mild",
    location: undefined
  });
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [shareUrl, setShareUrl] = useState(window.location.href);
  const shareTitle = t('title');

  // Update shareUrl when recommendation changes
  useEffect(() => {
    const updateShareUrl = async () => {
      if (recommendation?.recommendation) {
        const data = {
          n: recommendation.recommendation.name,
          d: recommendation.recommendation.description,
          p: recommendation.recommendation.price.toString(),
          c: recommendation.recommendation.category,
          i: recommendation.recommendation.imageUrl,
          t: recommendation.recommendation.tags
        };
        const v = await compressData(data);
        const url = new URL(window.location.origin);
        url.searchParams.set('v', v);
        setShareUrl(url.toString());
      } else {
        const url = new URL(window.location.origin);
        setShareUrl(url.toString());
      }
    };
    updateShareUrl();
  }, [recommendation]);

  // Automatically request location on mount or when starting
  useEffect(() => {
    requestLocation();
  }, []);

  // Update selections when location address is resolved
  useEffect(() => {
    if (location.address) {
      setSelections(prev => ({ ...prev, location: location.address }));
    }
  }, [location.address]);

  // Handle Shared Links and History
  useEffect(() => {
    const handleSharedData = async () => {
      let params = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      
      // Fallback to hash params if search params are empty but hash exists (old links)
      if (Array.from(params).length === 0 && hash.includes('?')) {
        params = new URLSearchParams(hash.split('?')[1]);
      }

      let sharedData: any = null;

      // 1. Try compressed data 'v'
      const v = params.get('v');
      if (v) {
        sharedData = await decompressData(v);
      } else {
        // 2. Fallback to old format
        const n = params.get('n');
        const d = params.get('d');
        if (n && d) {
          sharedData = {
            n, d, 
            p: params.get('p'),
            c: params.get('c'),
            i: params.get('i'),
            t: params.get('t')?.split(',') || []
          };
        }
      }

      if (sharedData && sharedData.n && sharedData.d) {
        const sharedRec: FoodRecommendation = {
          id: Date.now(),
          name: sharedData.n,
          description: sharedData.d,
          price: parseInt(sharedData.p || '0'),
          category: sharedData.c || 'korean',
          imageUrl: sharedData.i || null,
          imageUrls: sharedData.i ? [sharedData.i] : [],
          spiceLevel: 'mild',
          priceRange: 'moderate',
          tags: sharedData.t || [],
          isAiGenerated: true
        };
        setRecommendation({ recommendation: sharedRec, alternatives: [] });
        setCurrentStep(5);
        return true;
      }
      return false;
    };

    const runInit = async () => {
      const hasSharedData = await handleSharedData();
      if (!hasSharedData) {
        const saved = localStorage.getItem("recommendation_history");
        if (saved) {
          try {
            setHistory(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse history", e);
          }
        }
      }
    };

    runInit();

    // Listen to both hashchange (for old links) and popstate (for clean URLs)
    window.addEventListener('hashchange', handleSharedData);
    window.addEventListener('popstate', handleSharedData);
    return () => {
      window.removeEventListener('hashchange', handleSharedData);
      window.removeEventListener('popstate', handleSharedData);
    };
  }, []);

  const saveToHistory = (item: FoodRecommendation) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.name !== item.name);
      const newHistory = [item, ...filtered].slice(0, 5);
      localStorage.setItem("recommendation_history", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleLang = () => setLanguage(language === "en" ? "ko" : "en");

  const recommendationMutation = useMutation({
    mutationFn: async (request: RecommendationRequest) => {
      const recommendation = await getFoodRecommendation(request);
      const alternatives = await getAlternativeRecommendations(request.category, recommendation.id);
      return { recommendation, alternatives };
    },
    onSuccess: (data) => {
      setRecommendation(data);
      setCurrentStep(5);
      saveToHistory(data.recommendation);
    },
    onError: (error) => {
      console.error("Recommendation failed:", error);
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "메뉴 추천 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  });

  const handleSwapRecommendation = (newRecommendation: FoodRecommendation, currentRecommendation: FoodRecommendation) => {
    if (!recommendation) return;
    const updatedAlternatives = recommendation.alternatives.filter((alt: FoodRecommendation) => alt.id !== newRecommendation.id);
    updatedAlternatives.push(currentRecommendation);
    setRecommendation({ recommendation: newRecommendation, alternatives: updatedAlternatives });
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString(language === "en" ? "en-US" : "ko-KR", {
        hour: "2-digit", minute: "2-digit", hour12: false
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [language]);

  const handleCategorySelect = (category: string) => {
    setSelections(prev => ({ ...prev, category: category as any }));
    setTimeout(() => setCurrentStep(2), 500);
  };

  const handlePriceSelect = (priceRange: string) => {
    setSelections(prev => ({ ...prev, priceRange: priceRange as any }));
    setTimeout(() => setCurrentStep(3), 500);
  };

  const handleSpiceSelect = (spiceLevel: string) => {
    const newSelections = { ...selections, spiceLevel: spiceLevel as any };
    setSelections(newSelections);
    setTimeout(() => {
      setCurrentStep(4);
      setTimeout(() => recommendationMutation.mutate(newSelections), 2000);
    }, 500);
  };

  const handleHistoryClick = (item: FoodRecommendation) => {
    setRecommendation({ recommendation: item, alternatives: [] });
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);
  const startOver = () => {
    setCurrentStep(1);
    setRecommendation(null);
    setSelections({ category: "korean", priceRange: "budget", spiceLevel: "mild" });
    
    // Clear URL parameters properly using history API
    if (window.location.search || window.location.hash) {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      <Helmet>
        <title>오늘뭐먹지? - 음식 메뉴 추천 앱</title>
        <meta name="description" content="결정 장애를 위한 최고의 해결책! AI가 당신의 취향에 딱 맞는 오늘 점심 메뉴를 추천해드립니다. 매일 반복되는 점심 고민, 이제 AI에게 맡기세요!" />
        <link rel="canonical" href="https://product-builder-10l.pages.dev/" />
      </Helmet>
      <StructuredData />
      
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 text-foreground p-4 sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={startOver}
            >
              <img src="/favicon.svg" alt="Favicon" className="w-6 h-6" />
              <h1 className="text-xl font-bold">{t('title')}</h1>
            </div>
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent border border-border/50">
                  <Share2 className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="end">
                <ShareButtons url={shareUrl} title={shareTitle} />
              </PopoverContent>
            </Popover>
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
      <main className="p-4 pb-10">
        {/* Back Button & Summary */}
        <div className="min-h-[48px]">
          {currentStep > 1 && currentStep < 5 && (
            <div className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                onClick={goBack} 
                className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent group h-auto py-2 self-start"
              >
                <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 
                <span className="text-base font-medium">{t('prev')}</span>
              </Button>

              {/* Selection Summary */}
              <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
                <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium bg-secondary/50 text-secondary-foreground border border-border/50">
                  {t(selections.category as any)}
                </Badge>
                {currentStep > 2 && (
                  <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium bg-secondary/50 text-secondary-foreground border border-border/50">
                    {t(selections.priceRange as any)}
                  </Badge>
                )}
                {currentStep > 3 && (
                  <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium bg-secondary/50 text-secondary-foreground border border-border/50">
                    {t(selections.spiceLevel as any)}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 1: Category */}
        {currentStep === 1 && (
          <div className="step fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">{t('category_title')}</h2>
              <p className="text-muted-foreground">{t('category_desc')}</p>
              
              {/* Location Status Indicator */}
              {location.loaded && (
                <div className="mt-4 flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                    <MapPin className="w-3 h-3" />
                    <span>{location.address ? `${location.address} 주변 추천` : "위치 파악 불가"}</span>
                  </div>
                  {!location.address && (
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={requestLocation}>
                      재시도
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-10">
              {CATEGORY_IDS.map((cat) => (
                <FoodCategoryCard
                  key={cat.id}
                  category={{ ...cat, name: t(cat.id as any), description: "" }} 
                  isSelected={selections.category === cat.id}
                  onSelect={handleCategorySelect}
                />
              ))}
            </div>

            {/* History Section */}
            {history.length > 0 && (
              <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <History className="w-4 h-4" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">{t('history_title')}</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[10px] h-7 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setHistory([]);
                      localStorage.removeItem("recommendation_history");
                    }}
                  >
                    삭제
                  </Button>
                </div>
                <div className="space-y-3">
                  {history.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-4 rounded-2xl bg-card/30 border border-border/40 hover:bg-card/50 hover:border-primary/20 transition-all cursor-pointer group shadow-sm active:scale-95"
                      onClick={() => handleHistoryClick(item)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-xl shadow-inner">
                          {CATEGORY_IDS.find(c => c.id === item.category)?.icon || "🍴"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground leading-none mb-1">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">
                            {t(item.category as any)} • {new Date(item.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] py-0 h-5 font-normal border-muted-foreground/20 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary transition-colors">
                        {item.price.toLocaleString()}원
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              shareUrl={shareUrl}
              shareTitle={shareTitle}
              currentLocation={location.address}
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

      <footer className="py-6 text-center text-xs text-muted-foreground mt-8">
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
      {showScrollTop && createPortal(
        <Button
          size="icon"
          className="fixed bottom-10 right-6 rounded-full w-12 h-12 shadow-[0_8px_30px_rgb(0,0,0,0.3)] bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-border/50 hover:scale-110 active:scale-95 transition-all z-[110] animate-in fade-in zoom-in duration-300"
          onClick={scrollToTop}
        >
          <ArrowUp className="w-6 h-6" />
        </Button>,
        document.body
      )}

      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      <PWAInstallPrompt />
    </div>
  );
}