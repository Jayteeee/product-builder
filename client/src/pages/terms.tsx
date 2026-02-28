import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
  const [lang, setLang] = useState<"en" | "ko">("ko");

  useEffect(() => {
    const savedLang = localStorage.getItem("lunch_lang");
    if (savedLang === "en" || savedLang === "ko") {
      setLang(savedLang);
    }
  }, []);

  const toggleLang = () => {
    const newLang = lang === "en" ? "ko" : "en";
    setLang(newLang);
    localStorage.setItem("lunch_lang", newLang);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 font-sans">
      <Helmet>
        <title>{lang === "en" ? "Terms of Service - Lunch Picker" : "이용약관 - 오늘뭐먹지?"}</title>
        <meta name="description" content={lang === "en" ? "Terms of Service for Lunch Picker." : "오늘뭐먹지? 서비스의 이용약관입니다."} />
        <link rel="canonical" href="https://product-builder-10l.pages.dev/terms" />
      </Helmet>
      <div className="max-w-3xl mx-auto bg-card/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {lang === "en" ? "Home" : "홈으로"}
            </Button>
          </Link>
          <Button variant="ghost" onClick={toggleLang} className="border border-white/10">
            {lang === "en" ? "한국어" : "English"}
          </Button>
        </div>

        {lang === "en" ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold border-b border-white/10 pb-4">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: March 1, 2026</p>
            
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">2. Service Description</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>Lunch Picker is an AI-based food recommendation service. The recommendations are provided for entertainment and informational purposes only.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">3. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                We make no warranties, expressed or implied, regarding the accuracy or reliability of the recommendations. Users must exercise their own judgment, especially regarding allergies or dietary restrictions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">4. Content and Copyright</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content provided on the blog and website is for informational purposes only. Unauthorized reproduction or scraping of the content is strictly prohibited.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold border-b border-white/10 pb-4">이용약관</h1>
            <p className="text-sm text-muted-foreground">최종 수정일: 2026년 3월 1일</p>
            
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">1. 약관의 동의</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>본 웹사이트에 접속하고 서비스를 이용함으로써 귀하는 본 이용약관에 동의하는 것으로 간주됩니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">2. 서비스 안내</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>오늘뭐먹지? 는 AI 기반 점심 메뉴 추천 서비스입니다. 제공되는 모든 추천 결과는 참고용 및 오락용 목적입니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">3. 면책조항</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>본 서비스에서 제공하는 정보의 정확성이나 신뢰성에 대해 어떠한 보증도 하지 않습니다. 알레르기 및 특이 체질 등 식사와 관련된 최종 결정과 책임은 이용자 본인에게 있습니다.</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">4. 저작권 및 콘텐츠 무단 도용 금지</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>웹사이트 및 블로그 내에 제공되는 모든 콘텐츠(글, 이미지 등)의 저작권은 당사에 있으며, 무단 크롤링, 복제, 배포 및 상업적 이용을 엄격히 금지합니다.</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
