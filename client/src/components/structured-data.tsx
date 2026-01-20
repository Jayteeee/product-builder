import { Helmet } from "react-helmet-async";

export function StructuredData() {
  const structuredData = [
    {
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
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "점심 메뉴를 고르는 것이 왜 이렇게 힘들까요?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "현대인의 '결정 피로(Decision Fatigue)' 때문입니다. 오전 업무로 지친 뇌가 수많은 식당과 메뉴 사이에서 최적의 선택을 하려고 할 때 스트레스를 받습니다. '오늘뭐먹지?'는 이 과정을 단순화하여, AI가 사용자 취향에 맞는 최적의 한 끼를 즉시 제안함으로써 뇌의 부담을 줄여줍니다."
          }
        },
        {
          "@type": "Question",
          "name": "AI 추천 메뉴는 믿을 수 있나요?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "네, 물론입니다. 저희 알고리즘은 사용자가 선택한 카테고리(한식, 중식, 일식 등), 가격대, 매운맛 정도를 종합적으로 분석하여 데이터베이스 내 수백 가지 메뉴 중 가장 적합한 음식을 선별합니다."
          }
        }
      ]
    }
  ];

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
