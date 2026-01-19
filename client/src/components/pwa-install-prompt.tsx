import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-primary text-primary-foreground p-4 rounded-xl shadow-2xl border border-primary/20 flex items-center justify-between gap-4 max-w-md mx-auto">
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-1">
            {language === 'ko' ? "앱으로 더 빠르게!" : "Install App"}
          </h3>
          <p className="text-xs opacity-90">
            {language === 'ko' 
              ? "웹사이트 방문 없이 홈 화면에서 바로 메뉴를 추천받아보세요." 
              : "Get quick recommendations directly from your home screen."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            className="font-bold whitespace-nowrap h-9 px-4 shadow-sm"
            onClick={handleInstallClick}
          >
            <Download className="w-4 h-4 mr-2" />
            {language === 'ko' ? "앱 설치" : "Install"}
          </Button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
}
