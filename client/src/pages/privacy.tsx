import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
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
            <h1 className="text-3xl font-bold border-b border-white/10 pb-4">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: January 17, 2026</p>
            
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Collecting and Using Your Personal Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                <ul className="list-disc pl-5 mt-2">
                  <li>Usage Data (e.g., IP address, browser type)</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Cookies and Tracking Technologies</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-2">We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information.</p>
                <p className="mb-2"><strong>Google AdSense:</strong> We use Google AdSense to display ads. Google uses cookies to serve ads based on your prior visits to our website or other websites.</p>
                <p>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" className="text-primary hover:underline">Google Ads Settings</a>.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, You can contact us via the "Affiliate Inquiry" form on our homepage.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold border-b border-white/10 pb-4">개인정보처리방침</h1>
            <p className="text-sm text-muted-foreground">최종 수정일: 2026년 1월 17일</p>
            
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">수집하는 개인정보 항목</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>당사는 서비스 제공 및 개선을 위해 다음과 같은 정보를 수집할 수 있습니다:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>사용 데이터 (예: IP 주소, 브라우저 유형, 방문 페이지 등) - 이는 서비스 이용 시 자동으로 수집됩니다.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">쿠키 및 추적 기술</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-2">당사는 서비스 내 활동을 추적하고 특정 정보를 저장하기 위해 쿠키 및 유사한 추적 기술을 사용합니다.</p>
                <p className="mb-2"><strong>Google AdSense 광고:</strong> 당사는 광고 게재를 위해 Google AdSense를 사용합니다. Google은 쿠키를 사용하여 귀하의 당사 웹사이트 또는 인터넷상의 다른 웹사이트 방문 기록을 바탕으로 광고를 제공합니다.</p>
                <p>귀하는 <a href="https://www.google.com/settings/ads" target="_blank" className="text-primary hover:underline">Google 광고 설정</a>을 방문하여 개인 맞춤 광고 설정을 해제할 수 있습니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">문의하기</h2>
              <p className="text-muted-foreground leading-relaxed">
                본 개인정보처리방침에 대해 궁금한 점이 있으시면, 홈페이지의 "제휴 문의" 폼을 통해 문의해 주시기 바랍니다.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
