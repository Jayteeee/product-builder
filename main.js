/* =====================
   Theme Toggle
===================== */
const THEME_KEY = "lunch_theme";
const btnTheme = document.getElementById("btnTheme");

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    btnTheme.textContent = "다크 모드";
  } else {
    document.documentElement.removeAttribute("data-theme");
    btnTheme.textContent = "화이트 모드";
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
  "김치찌개", "된장찌개", "부대찌개", "순두부찌개", "청국장",
  "제육볶음", "오징어볶음", "불고기", "돈까스", "카레",
  "짜장면", "짬뽕", "볶음밥", "탕수육", "마파두부",
  "초밥", "우동", "라멘", "소바", "회덮밥",
  "쌀국수", "분짜", "팟타이", "나시고랭", "미고랭",
  "파스타", "피자", "리조또", "스테이크", "햄버거",
  "샌드위치", "샐러드", "타코", "부리또", "퀘사디아",
  "비빔밥", "냉면", "칼국수", "수제비", "떡볶이"
];

let lastMenu = null;
let count = 0;

function now() {
  return new Date().toLocaleString();
}

function pickMenu() {
  const randomIndex = Math.floor(Math.random() * LUNCH_MENUS.length);
  return LUNCH_MENUS[randomIndex];
}

function render(menu) {
  resultEl.innerHTML = `<div class="menu-result">${menu}</div>`;
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

function pick() {
  const menu = pickMenu();
  lastMenu = menu;
  count++;

  render(menu);
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
  resultEl.innerHTML = `<span class="hint">아래 버튼을 눌러 점심 메뉴를 추천받아 보세요.</span>`;
  lastMenu = null;
  count = 0;
  lastTimeEl.textContent = "-";
  countEl.textContent = "0";
  btnRepick.disabled = true;
  btnCopy.disabled = true;
};
