/* =========================================================
   main.js
   ---------------------------------------------------------
   পুরো ওয়েবসাইটের কমন (সব পেজে ব্যবহৃত) জাভাস্ক্রিপ্ট।
   - Dark Mode চালু/বন্ধ করা
   - মোবাইল মেনু খোলা/বন্ধ করা
   - সার্চ বক্স হ্যান্ডেল করা
   - প্রশ্নের ডেটা থেকে প্রশ্ন কার্ড তৈরি করা (HTML বানানো)
   - "জনপ্রিয় প্রশ্ন" বের করার জন্য LocalStorage-এ ভিউ কাউন্ট রাখা
   - "আজকের প্রশ্ন" প্রতিদিন পরিবর্তন হওয়ার লজিক
   ========================================================= */

/* ---------- ১. Dark Mode ---------- */
function initTheme() {
  const saved = localStorage.getItem("bdcp_theme");
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
  const btn = document.getElementById("themeToggle");
  if (btn) {
    updateThemeBtnText(btn);
    btn.addEventListener("click", toggleTheme);
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  if (isDark) {
    html.removeAttribute("data-theme");
    localStorage.setItem("bdcp_theme", "light");
  } else {
    html.setAttribute("data-theme", "dark");
    localStorage.setItem("bdcp_theme", "dark");
  }
  const btn = document.getElementById("themeToggle");
  if (btn) updateThemeBtnText(btn);
}

function updateThemeBtnText(btn) {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  btn.textContent = isDark ? "☀ লাইট মোড" : "🌙 ডার্ক মোড";
}

/* ---------- ২. মোবাইল মেনু ---------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

/* ---------- ৩. সার্চ বক্স ---------- */
// হোমপেজ ও যেকোনো পেজের সার্চ বক্স থেকে questions.html পেজে সার্চ টার্ম পাঠায়
function initSearchForms() {
  document.querySelectorAll(".js-search-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='search']");
      const term = input.value.trim();
      const url = "questions.html" + (term ? "?q=" + encodeURIComponent(term) : "");
      window.location.href = url;
    });
  });
}

/* ---------- ৪. প্রশ্ন খোঁজা/ফিল্টার করার হেল্পার ---------- */
function searchQuestions(term) {
  const t = term.trim().toLowerCase();
  if (!t) return questionsData;
  return questionsData.filter((q) => {
    return (
      q.question.toLowerCase().includes(t) ||
      q.category.toLowerCase().includes(t) ||
      q.exam.toLowerCase().includes(t) ||
      q.options.some((op) => op.toLowerCase().includes(t))
    );
  });
}

function filterByCategory(category) {
  if (!category || category === "সব") return questionsData;
  return questionsData.filter((q) => q.category === category);
}

function getRecentQuestions(n) {
  return [...questionsData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, n);
}

// প্রতিদিন একই দিনে একই প্রশ্ন দেখানোর জন্য তারিখ অনুযায়ী একটি স্থির index বের করা হয়
function getTodayQuestion() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const index = dayOfYear % questionsData.length;
  return questionsData[index];
}

/* ---------- ৫. জনপ্রিয় প্রশ্ন (LocalStorage ভিউ কাউন্টার) ---------- */
function trackView(id) {
  const views = JSON.parse(localStorage.getItem("bdcp_views") || "{}");
  views[id] = (views[id] || 0) + 1;
  localStorage.setItem("bdcp_views", JSON.stringify(views));
}

function getPopularQuestions(n) {
  const views = JSON.parse(localStorage.getItem("bdcp_views") || "{}");
  // যদি ব্যবহারকারী এখনো কোনো প্রশ্নে ক্লিক না করে থাকেন, তাহলে শুরুতে
  // সাম্প্রতিক প্রশ্নগুলোই "জনপ্রিয়" হিসেবে দেখানো হবে
  const withViews = questionsData.map((q) => ({
    ...q,
    _views: views[q.id] || 0
  }));
  withViews.sort((a, b) => b._views - a._views || new Date(b.date) - new Date(a.date));
  return withViews.slice(0, n);
}

/* ---------- ৬. প্রশ্ন কার্ডের HTML তৈরি ---------- */
// showAnswer = true হলে সঠিক উত্তর সরাসরি হাইলাইট করা থাকবে (প্রশ্ন ও উত্তর পেজে ব্যবহৃত)
function questionCardHTML(q, showAnswer = true) {
  const optionsHTML = q.options
    .map((op, i) => {
      const isCorrect = i === q.answer;
      return `<li class="${showAnswer && isCorrect ? "correct" : ""}">${bnLetter(i)}. ${escapeHTML(op)}</li>`;
    })
    .join("");

  const explainHTML = q.explanation
    ? `<details class="q-explain"><summary>ব্যাখ্যা দেখুন</summary><p>${escapeHTML(q.explanation)}</p></details>`
    : "";

  return `
    <article class="q-card" data-id="${q.id}">
      <span class="q-serial">প্রশ্ন নং ${q.id}</span>
      <h3>${escapeHTML(q.question)}</h3>
      <ul class="q-options">${optionsHTML}</ul>
      ${explainHTML}
      <div class="q-meta">
        <span class="tag">${escapeHTML(q.category)}</span>
        <span class="tag alt">${escapeHTML(q.exam)}</span>
        <span>${formatDate(q.date)}</span>
      </div>
    </article>
  `;
}

function bnLetter(i) {
  return ["ক", "খ", "গ", "ঘ"][i] || "";
}

function formatDate(iso) {
  const d = new Date(iso);
  const months = [
    "জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন",
    "জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- ৭. পেজ লোড হলে কমন ফাংশনগুলো চালু করা ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initSearchForms();

  // নেভিগেশনে বর্তমান পেজ হাইলাইট করা
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((a) => {
    if (a.getAttribute("href") === current) a.classList.add("active");
  });
});
