/* =========================================================
   quiz.js
   ---------------------------------------------------------
   "মডেল টেস্ট" পেজের কুইজ ইঞ্জিন।
   ধাপ:
   ১. ব্যবহারকারী ক্যাটাগরি ও প্রশ্নসংখ্যা বেছে নেন এবং শুরু করেন
   ২. একটি করে প্রশ্ন দেখানো হয়, অপশন সিলেক্ট করে Submit করলে
      সঠিক/ভুল রঙ করে দেখানো হয়
   ৩. সব প্রশ্ন শেষ হলে ফলাফল (স্কোর, সঠিক/ভুল সংখ্যা) দেখানো হয়
   ৪. "আবার পরীক্ষা দিন" চাপলে নতুন করে শুরু করা যায়
   ========================================================= */

let quizPool = [];      // এই কুইজের জন্য বাছাই করা প্রশ্নগুলো
let quizIndex = 0;      // বর্তমান প্রশ্নের index
let quizScore = 0;      // এখন পর্যন্ত সঠিক উত্তরের সংখ্যা
let quizAnswers = [];   // প্রতিটি প্রশ্নে ব্যবহারকারী কী উত্তর দিলেন তা রাখা হয়
let quizAnswered = false; // বর্তমান প্রশ্নের উত্তর জমা দেওয়া হয়েছে কিনা

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  const category = document.getElementById("quizCategory").value;
  const countSelect = document.getElementById("quizCount");
  let count = parseInt(countSelect.value, 10);

  let pool = filterByCategory(category);
  pool = shuffleArray(pool);
  if (count > pool.length) count = pool.length;
  quizPool = pool.slice(0, count);

  quizIndex = 0;
  quizScore = 0;
  quizAnswers = [];
  quizAnswered = false;

  document.getElementById("quizSetup").style.display = "none";
  document.getElementById("quizResult").style.display = "none";
  document.getElementById("quizArea").style.display = "block";

  if (quizPool.length === 0) {
    document.getElementById("quizArea").innerHTML =
      '<p class="empty-note">এই ক্যাটাগরিতে এখনো যথেষ্ট প্রশ্ন যোগ করা হয়নি। অন্য ক্যাটাগরি বেছে নিন।</p>';
    return;
  }

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = quizPool[quizIndex];
  const total = quizPool.length;
  const percent = Math.round((quizIndex / total) * 100);

  const optionsHTML = q.options
    .map(
      (op, i) =>
        `<li data-index="${i}" onclick="selectQuizOption(${i})">${bnLetter(i)}. ${escapeHTML(op)}</li>`
    )
    .join("");

  document.getElementById("quizArea").innerHTML = `
    <div class="quiz-progress">প্রশ্ন ${quizIndex + 1} / ${total} — ${q.category}</div>
    <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${percent}%"></div></div>
    <div class="quiz-question">${escapeHTML(q.question)}</div>
    <ul class="quiz-options" id="quizOptions">${optionsHTML}</ul>
    <div class="quiz-actions">
      <span class="muted" id="quizFeedback"></span>
      <button class="btn btn-primary" id="quizActionBtn" onclick="submitQuizAnswer()" disabled>Submit করুন</button>
    </div>
  `;
  quizAnswered = false;
  quizSelected = null;
}

let quizSelected = null;

function selectQuizOption(i) {
  if (quizAnswered) return; // একবার Submit করার পর আর পরিবর্তন করা যাবে না
  quizSelected = i;
  document.querySelectorAll("#quizOptions li").forEach((li) => li.classList.remove("selected"));
  document.querySelector(`#quizOptions li[data-index="${i}"]`).classList.add("selected");
  document.getElementById("quizActionBtn").disabled = false;
}

function submitQuizAnswer() {
  if (quizSelected === null || quizAnswered) return;
  const q = quizPool[quizIndex];
  quizAnswered = true;
  quizAnswers.push({ id: q.id, selected: quizSelected, correct: q.answer });

  const items = document.querySelectorAll("#quizOptions li");
  items.forEach((li) => {
    const idx = parseInt(li.getAttribute("data-index"), 10);
    if (idx === q.answer) li.classList.add("correct");
    if (idx === quizSelected && idx !== q.answer) li.classList.add("wrong");
  });

  const feedback = document.getElementById("quizFeedback");
  if (quizSelected === q.answer) {
    quizScore++;
    feedback.textContent = "সঠিক উত্তর! ✅";
    feedback.style.color = "var(--correct)";
  } else {
    feedback.textContent = "উত্তরটি সঠিক নয় ❌";
    feedback.style.color = "var(--wrong)";
  }

  const btn = document.getElementById("quizActionBtn");
  btn.textContent = quizIndex === quizPool.length - 1 ? "ফলাফল দেখুন" : "পরবর্তী প্রশ্ন";
  btn.onclick = nextQuizQuestion;
}

function nextQuizQuestion() {
  quizIndex++;
  if (quizIndex >= quizPool.length) {
    showQuizResult();
  } else {
    renderQuizQuestion();
  }
}

function showQuizResult() {
  document.getElementById("quizArea").style.display = "none";
  const total = quizPool.length;
  const wrong = total - quizScore;
  const percent = Math.round((quizScore / total) * 100);

  document.getElementById("quizResult").style.display = "block";
  document.getElementById("quizResult").innerHTML = `
    <div class="quiz-result">
      <div class="stamp">
        <strong>${percent}%</strong>
        <span>ফলাফল</span>
      </div>
      <h3>আপনি ${total} টির মধ্যে ${quizScore} টি সঠিক উত্তর দিয়েছেন</h3>
      <p class="muted">সঠিক: ${quizScore} টি &nbsp;•&nbsp; ভুল: ${wrong} টি</p>
      <button class="btn btn-primary" onclick="restartQuiz()">আবার পরীক্ষা দিন</button>
    </div>
  `;
}

function restartQuiz() {
  document.getElementById("quizResult").style.display = "none";
  document.getElementById("quizSetup").style.display = "block";
}
