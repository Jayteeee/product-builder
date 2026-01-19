import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { language } = useLanguage();
  
  // Touch handling for swipe dismissal
  const touchStartY = useRef<number | null>(null);
  const promptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Slight delay to not annoy immediately on load
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const closePrompt = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 300); // Wait for animation
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY.current || !promptRef.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    
    // If swiping down
    if (diff > 0) {
      promptRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartY.current || !promptRef.current) return;
    const currentY = e.changedTouches[0].clientY;
    const diff = currentY - touchStartY.current;

    // Threshold to dismiss
    if (diff > 50) {
      closePrompt();
    } else {
      // Reset position
      promptRef.current.style.transform = '';
    }
    touchStartY.current = null;
  };

  if (!isVisible) return null;

  return createPortal(
    <div 
      ref={promptRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[100] p-4 pb-8 transition-all duration-300 ease-out sm:pb-6",
        isClosing ? "translate-y-[150%] opacity-0" : "animate-in slide-in-from-bottom-full fade-in"
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-foreground p-5 rounded-2xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] border border-border/50 flex items-center justify-between gap-4 max-w-md mx-auto relative overflow-hidden">
        {/* Drag Handle Indicator */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-muted/50 rounded-full" />

        <div className="flex-1 pt-2">
          <h3 className="font-bold text-base mb-1">
            {language === 'ko' ? "앱으로 더 간편하게" : "Install App"}
          </h3>
          <p className="text-xs text-muted-foreground leading-tight">
            {language === 'ko' 
              ? "홈 화면에 추가하여 빠르게 추천받으세요." 
              : "Add to home screen for quick recommendations."}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button 
            size="sm" 
            className="font-bold whitespace-nowrap h-10 px-5 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            onClick={handleInstallClick}
          >
            <Download className="w-4 h-4 mr-2" />
            {language === 'ko' ? "설치" : "Install"}
          </Button>
          <button 
            onClick={closePrompt}
            className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
