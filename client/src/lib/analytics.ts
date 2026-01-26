import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-5DV0KJ0T45"; // index.html에 있던 ID

/**
 * GA4 초기화
 * - 실배포 환경(production)이거나 명시적으로 허용된 경우에만 초기화
 */
export const initGA = () => {
  // 개발 환경에서는 콘솔 로깅만 하고 실제 전송은 하지 않음 (데이터 오염 방지)
  const isDev = import.meta.env.DEV;
  
  if (isDev) {
    console.log("[GA4] Development mode - events will be logged to console only.");
    return;
  }

  ReactGA.initialize(GA_MEASUREMENT_ID);
  console.log("[GA4] Initialized");
};

/**
 * 페이지뷰 추적 (SPA 라우팅 변경 시 호출)
 */
export const trackPageView = (path: string) => {
  if (import.meta.env.DEV) {
    console.log(`[GA4 PageView] ${path}`);
    return;
  }
  
  ReactGA.send({ hitType: "pageview", page: path });
};

/**
 * 커스텀 이벤트 추적
 * @param eventName - snake_case 권장 (e.g., cta_click)
 * @param params - 이벤트 파라미터 객체
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (import.meta.env.DEV) {
    console.log(`[GA4 Event] ${eventName}`, params);
    return;
  }

  ReactGA.event(eventName, params);
};

// --- Convenience Wrappers for Key Events ---

export const trackLandingView = () => {
  trackEvent("landing_view", {
    page_path: window.location.pathname,
    referrer: document.referrer
  });
};

export const trackCtaClick = (buttonName: string, location: string) => {
  trackEvent("cta_click", {
    button_name: buttonName,
    location: location
  });
};

export const trackStepView = (stepName: string, stepIndex: number) => {
  trackEvent("step_view", {
    step_name: stepName,
    step_index: stepIndex
  });
};

export const trackOptionSelect = (stepName: string, selectedValue: string) => {
  trackEvent("option_select", {
    step_name: stepName,
    selected_value: selectedValue
  });
};

export const trackResultView = (resultId: number, resultName: string, category: string) => {
  trackEvent("result_view", {
    result_id: resultId,
    result_name: resultName,
    category: category
  });
};

export const trackShareClick = (method: string, contentId?: string) => {
  trackEvent("share_click", {
    method: method,
    content_id: contentId
  });
};

export const trackMapSearch = (provider: 'naver' | 'kakao', keyword: string) => {
  trackEvent("map_search_click", {
    map_provider: provider,
    search_keyword: keyword
  });
};
