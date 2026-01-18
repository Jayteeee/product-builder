import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
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
            <h1 className="text-3xl font-bold border-b border-white/10 pb-4">About Us</h1>
            
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                "What should I eat for lunch?"<br />
                It's a question we face every single day. The <strong>Lunch Menu Recommender</strong> was born to solve this trivial yet stressful dilemma. 
                Our goal is to help you make quick, fun, and satisfying decisions so you can focus your energy on what truly matters.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Technology</h2>
              <div className="text-muted-foreground leading-relaxed">
                This project utilizes modern web technologies to provide a fast and accessible experience.
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Frontend:</strong> React, TypeScript, Tailwind CSS</li>
                  <li><strong>Style:</strong> Glassmorphism UI (Dark Mode)</li>
                  <li><strong>Deployment:</strong> Cloudflare Pages / GitHub Pages</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                This website provides random recommendations for entertainment purposes. 
                Please consider your own dietary restrictions and allergies when choosing your meal.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold border-b border-white/10 pb-4">사이트 소개</h1>
            
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제작 배경</h2>
              <p className="text-muted-foreground leading-relaxed">
                "오늘 점심 뭐 먹지?"<br />
                매일 반복되는 이 고민, 지겹지 않으신가요? <strong>점심 메뉴 추천기</strong>는 현대인의 가장 큰 난제 중 하나인 점심 메뉴 선정을 돕기 위해 만들어졌습니다.
                결정의 고통을 줄이고, 의외의 메뉴를 만나는 즐거움을 드리는 것이 저희의 목표입니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">기술 스택</h2>
              <div className="text-muted-foreground leading-relaxed">
                이 웹사이트는 빠르고 직관적인 사용자 경험을 제공하기 위해 다음과 같은 기술로 제작되었습니다.
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>프론트엔드:</strong> React, TypeScript, Tailwind CSS</li>
                  <li><strong>스타일:</strong> 글래스모피즘 UI (다크 모드)</li>
                  <li><strong>배포:</strong> Cloudflare Pages / GitHub Pages</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">면책 조항</h2>
              <p className="text-muted-foreground leading-relaxed">
                이 웹사이트는 재미를 위한 랜덤 추천 서비스를 제공합니다. 
                실제 식사 선택 시에는 개인의 알레르기나 식이 조절 필요성을 반드시 고려해 주시기 바랍니다.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
