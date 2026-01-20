import { Helmet } from "react-helmet-async";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "오늘뭐먹지? - 음식 메뉴 추천 앱",
    "url": "https://product-builder-10l.pages.dev/",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    },
    "description": "결정 장애를 위한 최고의 해결책! AI가 당신의 취향에 딱 맞는 오늘 점심 메뉴를 추천해드립니다.",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0.0",
    "author": {
      "@type": "Person",
      "name": "Jayteeee"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
