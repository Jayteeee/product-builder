/* =====================
   Theme Toggle
===================== */
const THEME_KEY = "lunch_theme";
const btnTheme = document.getElementById("btnTheme");

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    btnTheme.textContent = "Dark Mode";
  } else {
    document.documentElement.removeAttribute("data-theme");
    btnTheme.textContent = "Light Mode";
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

const PIZZA_IMAGE_URL = "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

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
  if (menu === "Pizza") {
    resultEl.innerHTML = `<img src="${PIZZA_IMAGE_URL}" alt="Pizza" class="pizza-image">`;
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
  resultEl.innerHTML = `<span class="hint">Press the button below to get a lunch menu recommendation.</span>`;
  lastMenu = null;
  count = 0;
  lastTimeEl.textContent = "-";
  countEl.textContent = "0";
  btnRepick.disabled = true;
  btnCopy.disabled = true;
};
