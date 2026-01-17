/* =====================
   Language Toggle
===================== */
const LANG_KEY = "lunch_lang";
const btnLang = document.getElementById("btnLang");
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

function applyLang(lang) {
  document.documentElement.lang = lang;
  Object.keys(translations[lang]).forEach((key) => {
    const element = document.querySelector(`[data-lang="${key}"]`);
    if (element) {
      element.textContent = translations[lang][key];
    }
  });
  btnLang.textContent = lang === "en" ? "한국어" : "English";
}

const savedLang = localStorage.getItem(LANG_KEY);
let currentLang = savedLang || "en";
applyLang(currentLang);

btnLang.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "ko" : "en";
  localStorage.setItem(LANG_KEY, currentLang);
  applyLang(currentLang);
});


/* =====================
   Theme Toggle
===================== */
const THEME_KEY = "lunch_theme";
const btnTheme = document.getElementById("btnTheme");

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    btnTheme.textContent = translations[currentLang].theme_dark;
  } else {
    document.documentElement.removeAttribute("data-theme");
    btnTheme.textContent = translations[currentLang].theme_light;
  }
}

const savedTheme = localStorage.getItem(THEME_KEY);
let currentTheme =
  savedTheme ||
  (window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark");

applyTheme(currentTheme);

btnTheme.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem(THEME_KEY, currentTheme);
  applyTheme(currentTheme);
});

/* =====================
   Lunch Menu Logic
===================== */
const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");
const lastTimeEl = document.getElementById("lastTime");
const countEl = document.getElementById("count");

const btnPick = document.getElementById("btnPick");
const btnRepick = document.getElementById("btnRepick");
const btnCopy = document.getElementById("btnCopy");
const btnClear = document.getElementById("btnClear");

const HISTORY_MAX = 8;
const LUNCH_MENUS = [
  "Kimchi Jjigae", "Doenjang Jjigae", "Budae Jjigae", "Sundubu Jjigae", "Cheonggukjang",
  "Jeyuk Bokkeum", "Ojingeo Bokkeum", "Bulgogi", "Donkkaseu", "Curry",
  "Jajangmyeon", "Jjamppong", "Bokkeumbap", "Tangsuyuk", "Mapadubu",
  "Sushi", "Udon", "Ramen", "Soba", "Hoe-deopbap",
  "Pho", "Bun Cha", "Pad Thai", "Nasi Goreng", "Mi Goreng",
  "Pasta", "Pizza", "Risotto", "Steak", "Hamburger",
  "Sandwich", "Salad", "Taco", "Burrito", "Quesadilla",
  "Bibimbap", "Naengmyeon", "Kalguksu", "Sujebi", "Tteokbokki"
];

const PEXELS_API_KEY = "YOUR_PEXELS_API_KEY";

let lastMenu = null;
let count = 0;

function now() {
  return new Date().toLocaleString();
}

function pickMenu() {
  const randomIndex = Math.floor(Math.random() * LUNCH_MENUS.length);
  return LUNCH_MENUS[randomIndex];
}

async function getMenuImage(menu) {
  if (PEXELS_API_KEY === "YOUR_PEXELS_API_KEY") {
    return null;
  }
  const response = await fetch(`https://api.pexels.com/v1/search?query=${menu}&per_page=1`, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });
  const data = await response.json();
  return data.photos.length > 0 ? data.photos[0].src.large : null;
}

async function render(menu) {
  resultEl.innerHTML = `<div class="loader"></div>`;
  const imageUrl = await getMenuImage(menu);
  if (imageUrl) {
    resultEl.innerHTML = `<img src="${imageUrl}" alt="${menu}" class="menu-image">`;
  } else {
    resultEl.innerHTML = `<div class="menu-result">${menu}</div>`;
  }
}

function addHistory(menu) {
  const li = document.createElement("li");
  li.className = "history-item";
  li.textContent = menu;
  historyEl.prepend(li);
  while (historyEl.children.length > HISTORY_MAX) {
    historyEl.removeChild(historyEl.lastElementChild);
  }
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

btnPick.onclick = pick;
btnRepick.onclick = pick;

btnCopy.onclick = () => {
  if (!lastMenu) return;
  navigator.clipboard.writeText(lastMenu);
};

btnClear.onclick = () => {
  historyEl.innerHTML = "";
  resultEl.innerHTML = `<span class="hint">${translations[currentLang].hint}</span>`;
  lastMenu = null;
  count = 0;
  lastTimeEl.textContent = "-";
  countEl.textContent = "0";
  btnRepick.disabled = true;
  btnCopy.disabled = true;
};
