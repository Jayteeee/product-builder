/* =====================
   Constants & Config
===================== */
const LANG_KEY = "lunch_lang";
const THEME_KEY = "lunch_theme";
const HISTORY_MAX = 8;
const PEXELS_API_KEY = "YOUR_PEXELS_API_KEY"; // Replace with your actual key

const LUNCH_MENUS = {
  "Kimchi Jjigae": "김치찌개",
  "Doenjang Jjigae": "된장찌개",
  "Budae Jjigae": "부대찌개",
  "Sundubu Jjigae": "순두부찌개",
  "Cheonggukjang": "청국장",
  "Jeyuk Bokkeum": "제육볶음",
  "Ojingeo Bokkeum": "오징어볶음",
  "Bulgogi": "불고기",
  "Donkkaseu": "돈까스",
  "Curry": "카레",
  "Jajangmyeon": "짜장면",
  "Jjamppong": "짬뽕",
  "Bokkeumbap": "볶음밥",
  "Tangsuyuk": "탕수육",
  "Mapadubu": "마파두부",
  "Sushi": "초밥",
  "Udon": "우동",
  "Ramen": "라멘",
  "Soba": "소바",
  "Hoe-deopbap": "회덮밥",
  "Pho": "쌀국수",
  "Bun Cha": "분짜",
  "Pad Thai": "팟타이",
  "Nasi Goreng": "나시고랭",
  "Mi Goreng": "미고랭",
  "Pasta": "파스타",
  "Pizza": "피자",
  "Risotto": "리조또",
  "Steak": "스테이크",
  "Hamburger": "햄버거",
  "Sandwich": "샌드위치",
  "Salad": "샐러드",
  "Taco": "타코",
  "Burrito": "부리또",
  "Quesadilla": "퀘사디아",
  "Bibimbap": "비빔밥",
  "Naengmyeon": "냉면",
  "Kalguksu": "칼국수",
  "Sujebi": "수제비",
  "Tteokbokki": "떡볶이",
};

const translations = {
  en: {
    title: "Lunch Menu Recommender",
    heading: "Lunch Menu Recommender",
    subheading: "Press the button to get a lunch menu recommendation!",
    theme_light: "Light Mode",
    theme_dark: "Dark Mode",
    hint: "Press the button below to get a lunch menu recommendation.",
    recommend_button: "Recommend Menu",
    rerecommend_button: "Re-recommend",
    copy_button: "Copy",
    clear_history_button: "Clear History",
    last_recommendation: "Last recommendation",
    total_recommendations: "Total recommendations",
    recent_recommendations: "Recent Recommendations (max 8)",
    footer: "Note: This recommender is a random generator for fun and to help with menu selection.",
  },
  ko: {
    title: "점심 메뉴 추천기",
    heading: "점심 메뉴 추천기",
    subheading: "버튼을 눌러 오늘 점심 메뉴를 추천받아 보세요!",
    theme_light: "화이트 모드",
    theme_dark: "다크 모드",
    hint: "아래 버튼을 눌러 점심 메뉴를 추천받아 보세요.",
    recommend_button: "메뉴 추천",
    rerecommend_button: "다시 추천",
    copy_button: "복사",
    clear_history_button: "기록 지우기",
    last_recommendation: "마지막 추천",
    total_recommendations: "총 추천 횟수",
    recent_recommendations: "최근 추천 기록 (최대 8개)",
    footer: "참고: 본 추천기는 재미용 랜덤 생성기이며, 메뉴 선택에 도움을 주기 위한 것입니다.",
  },
};

/* =====================
   DOM Elements
===================== */
const btnLang = document.getElementById("btnLang");
const btnTheme = document.getElementById("btnTheme");

const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");
const lastTimeEl = document.getElementById("lastTime");
const countEl = document.getElementById("count");

const btnPick = document.getElementById("btnPick");
const btnRepick = document.getElementById("btnRepick");
const btnCopy = document.getElementById("btnCopy");
const btnClear = document.getElementById("btnClear");

/* =====================
   State
===================== */
let lastMenu = null;
let count = 0;
let history = [];

// Language State
const savedLang = localStorage.getItem(LANG_KEY);
let currentLang = (savedLang === 'en' || savedLang === 'ko') ? savedLang : 'en';

// Theme State
const savedTheme = localStorage.getItem(THEME_KEY);
let currentTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

/* =====================
   Functions
===================== */
function now() {
  return new Date().toLocaleString();
}

function renderHistory() {
  historyEl.innerHTML = "";
  history.forEach((menu) => {
    const li = document.createElement("li");
    li.className = "history-item";
    li.textContent = menu[currentLang];
    historyEl.appendChild(li);
  });
}

function applyLang(lang) {
  document.documentElement.lang = lang;
  if (!translations[lang]) return;

  Object.keys(translations[lang]).forEach((key) => {
    const element = document.querySelector(`[data-lang="${key}"]`);
    if (element) {
      element.textContent = translations[lang][key];
    }
  });
  btnLang.textContent = lang === "en" ? "한국어" : "English";
  
  // Update theme button text based on new language
  applyTheme(currentTheme); 
  
  // Re-render history to reflect new language
  renderHistory();
  
  // Re-render result if exists (optional, simplifies to just hint if no lastMenu, or we could support re-rendering last result)
  if (!lastMenu) {
     resultEl.innerHTML = `<span class="hint">${translations[lang].hint}</span>`;
  } else {
     // If we have a last result, we just update the text if it's not an image, or leave it. 
     // For simplicity, we won't re-fetch the image, just ensure history is updated.
  }
}

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    btnTheme.textContent = translations[currentLang].theme_dark;
  } else {
    document.documentElement.removeAttribute("data-theme");
    btnTheme.textContent = translations[currentLang].theme_light;
  }
}

function pickMenu() {
  const menuKeys = Object.keys(LUNCH_MENUS);
  const randomIndex = Math.floor(Math.random() * menuKeys.length);
  const menuKey = menuKeys[randomIndex];
  return {
    en: menuKey,
    ko: LUNCH_MENUS[menuKey],
  };
}

async function getMenuImage(menu) {
  if (PEXELS_API_KEY === "YOUR_PEXELS_API_KEY") {
    return null;
  }
  
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(menu)}&per_page=1`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      console.warn(`Pexels API Error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.photos && data.photos.length > 0 ? data.photos[0].src.large : null;
  } catch (error) {
    console.error("Failed to fetch image:", error);
    return null;
  }
}

async function render(menu) {
  resultEl.innerHTML = `<div class="loader"></div>`;
  const imageUrl = await getMenuImage(menu.en);
  
  if (imageUrl) {
    resultEl.innerHTML = `<img src="${imageUrl}" alt="${menu[currentLang]}" class="menu-image">`;
  } else {
    resultEl.innerHTML = `<div class="menu-result">${menu[currentLang]}</div>`;
  }
}

function addHistory(menu) {
  history.unshift(menu);
  if (history.length > HISTORY_MAX) {
    history.pop();
  }
  renderHistory();
}

async function pick() {
  const menu = pickMenu();
  lastMenu = menu;
  count++;

  await render(menu);
  addHistory(menu);

  lastTimeEl.textContent = now();
  countEl.textContent = count;

  btnRepick.disabled = false;
  btnCopy.disabled = false;
}

/* =====================
   Event Listeners
===================== */
btnLang.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "ko" : "en";
  localStorage.setItem(LANG_KEY, currentLang);
  applyLang(currentLang);
});

btnTheme.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem(THEME_KEY, currentTheme);
  applyTheme(currentTheme);
});

btnPick.onclick = pick;
btnRepick.onclick = pick;

btnCopy.onclick = () => {
  if (!lastMenu) return;
  navigator.clipboard.writeText(lastMenu[currentLang]);
};

btnClear.onclick = () => {
  history = [];
  historyEl.innerHTML = "";
  resultEl.innerHTML = `<span class="hint">${translations[currentLang].hint}</span>`;
  lastMenu = null;
  count = 0;
  lastTimeEl.textContent = "-";
  countEl.textContent = "0";
  btnRepick.disabled = true;
  btnCopy.disabled = true;
};

/* =====================
   Initialization
===================== */
// Initialize app state after all functions and variables are declared
applyLang(currentLang);
applyTheme(currentTheme);