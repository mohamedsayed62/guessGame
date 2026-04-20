// ─── Word Bank ───
const WORDS = [
  { word: "مكتبة", hint: "مكان تجد فيه الكتب" },
  { word: "سفينة", hint: "مركبة تسير على الماء" },
  { word: "حديقة", hint: "مكان جميل فيه أشجار وزهور" },
  { word: "مدرسة", hint: "مكان التعلم والدراسة" },
  { word: "طائرة", hint: "مركبة تطير في السماء" },
  { word: "نافذة", hint: "فتحة في الجدار تدخل منها الضوء" },
  { word: "خريطة", hint: "رسم يصف الأرض والمناطق" },
  { word: "قصيدة", hint: "نص أدبي موزون ومقفى" },
  { word: "شاحنة", hint: "سيارة كبيرة لنقل البضائع" },
  { word: "مزرعة", hint: "أرض يزرع فيها المحاصيل" },
  { word: "دراجة", hint: "مركبة بعجلتين تسير بالركل" },
  { word: "رسالة", hint: "كتابة ترسلها لشخص آخر" },
  { word: "مصباح", hint: "أداة إضاءة كهربائية" },
  { word: "تفاحة", hint: "فاكهة حمراء أو خضراء مشهورة" },
  { word: "ثلاجة", hint: "جهاز يحفظ الطعام بارداً" },
  { word: "جامعة", hint: "مؤسسة تعليم عالٍ بعد الثانوية" },
  { word: "سيارة", hint: "مركبة تسير على أربع عجلات" },
  { word: "فراشة", hint: "حشرة جميلة ذات أجنحة ملونة" },
  { word: "جزيرة", hint: "أرض محاطة بالماء من كل الجهات" },
  { word: "قلعات", hint: "جمع قلعة، حصن قديم" },
];

let numOfTries   = 6;
let numOfLetters = 6;
let currentTry   = 1;

let divInputs = document.querySelector(".inputs");
let hintBtn   = document.querySelector(".hint");
let numOfHints = 2;
let hint = `${numOfHints} تلميح`;

// Pick a random word entry
let entry = WORDS[Math.floor(Math.random() * WORDS.length)];
let word  = entry.word;
numOfLetters = word.length;

// ─── Show Target Word Above Inputs ───
function renderTargetWord() {
  const container = document.getElementById("target-word-display");
  container.innerHTML = "";

  // Label
  const label = document.createElement("div");
  label.className = "target-label";
  label.textContent = "الكلمة المطلوب كتابتها";
  container.appendChild(label);

  // One box per letter
  word.split("").forEach((letter, i) => {
    const box = document.createElement("div");
    box.className = "target-letter-box";
    box.textContent = letter;
    box.style.animationDelay = `${i * 80}ms`;
    container.appendChild(box);
  });
}

function generateInputs() {
  renderTargetWord();

  for (let i = 1; i <= numOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>محاولة ${i}</span>`;
    if (i !== currentTry) {
      tryDiv.classList.add("disabled-input");
    }

    for (let j = 1; j <= numOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.maxLength = "1";
      input.setAttribute("autocomplete", "off");
      input.setAttribute("autocorrect", "off");
      input.setAttribute("spellcheck", "false");
      tryDiv.appendChild(input);
    }
    divInputs.appendChild(tryDiv);
  }

  divInputs.children[0].children[1].focus();

  const inputsInTryDiv = document.querySelectorAll(".disabled-input input");
  inputsInTryDiv.forEach(input => input.disabled = true);

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      // Strip diacritics
      this.value = this.value.replace(/[\u064B-\u065F\u0670]/g, "");
      if (this.value.length > 1) this.value = this.value.slice(-1);
      if (this.value != "") {
        const nextInput = inputs[index + 1];
        if (nextInput) nextInput.focus();
      }
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && this.value === "") {
        const prevInput = inputs[index - 1];
        if (prevInput && !prevInput.disabled) { prevInput.value = ""; prevInput.focus(); }
      }
      if (e.key == "ArrowRight") {
        let idx = Array.from(inputs).indexOf(e.target);
        idx++;
        if (idx < inputs.length) inputs[idx].focus();
      }
      if (e.key == "ArrowLeft") {
        let previdx = Array.from(inputs).indexOf(e.target);
        previdx--;
        if (previdx >= 0) inputs[previdx].focus();
      }
      this.setSelectionRange(this.value.length, this.value.length);
    });
  });

  hintBtn.innerHTML = hint;
}

let checkBtn   = document.querySelector(".check");
let guessWord  = "";
let rightLetters = [];

checkBtn.addEventListener("click", () => {
  guessWord = "";
  let tryDiv    = document.querySelector(`.inputs .try-${currentTry}`);
  let tryInputs = Array.from(tryDiv.children);

  for (let i = 1; i < tryInputs.length; i++) {
    guessWord += tryInputs[i].value;
  }

  if (guessWord.length < word.length) {
    showToast("⚠️ أكمل جميع الحروف أولاً");
    return;
  }

  // Evaluate with two-pass algorithm
  const target  = word.split("");
  const guess   = guessWord.split("");
  const result  = Array(target.length).fill("wrong");
  const tUsed   = Array(target.length).fill(false);
  const gUsed   = Array(target.length).fill(false);

  guess.forEach((ch, i) => {
    if (ch === target[i]) {
      result[i] = "right"; tUsed[i] = true; gUsed[i] = true;
      if (!rightLetters.includes(i)) rightLetters.push(i);
    }
  });
  guess.forEach((ch, i) => {
    if (gUsed[i]) return;
    const ti = target.findIndex((tc, j) => !tUsed[j] && tc === ch);
    if (ti !== -1) { result[i] = "not-in-place"; tUsed[ti] = true; }
  });

  // Apply with flip
  const letterInputs = tryInputs.slice(1);
  letterInputs.forEach((inp, i) => {
    setTimeout(() => {
      inp.classList.add("flip");
      setTimeout(() => inp.classList.add(result[i]), 200);
    }, i * 100);
  });

  const delay = (target.length - 1) * 100 + 450;
  setTimeout(() => {
    if (guessWord === word) {
      showToast("🎉 تهانينا! خمّنت الكلمة الصحيحة");
      tryInputs.forEach(input => input.disabled = true);
      setTimeout(() => showOverlay("🎉 أحسنت!", `كتبت الكلمة <strong>${word}</strong> بنجاح`), 800);
    } else {
      tryDiv.classList.add("disabled-input");
      currentTry += 1;
      tryInputs.forEach(input => input.disabled = true);

      if (currentTry > numOfTries) {
        showOverlay("😞 للأسف!", `الكلمة الصحيحة كانت <strong>${word}</strong>`);
        return;
      }

      tryDiv = document.querySelector(`.inputs .try-${currentTry}`);
      tryDiv.classList.remove("disabled-input");
      const nextInputs = document.querySelectorAll(`.inputs .try-${currentTry} input`);
      nextInputs.forEach(input => input.removeAttribute("disabled"));
      tryDiv.children[1].focus();
    }
  }, delay);
});

hintBtn.addEventListener("click", () => {
  let setLetters = new Set(rightLetters.sort());
  if (numOfHints == 0 || setLetters.size == word.length) return;

  // First hint: show meaning
  if (numOfHints === 2) {
    numOfHints--;
    hintBtn.innerHTML = `${numOfHints} تلميح`;
    showToast("💡 " + entry.hint, 3500);
    return;
  }

  // Second hint: reveal a letter
  numOfHints--;
  hintBtn.innerHTML = `${numOfHints} تلميح`;

  if (rightLetters.length == 0) {
    let currentInput = document.querySelector(`#guess-${currentTry}-letter-1`);
    rightLetters.push(0);
    currentInput.value = word[0];
    currentInput.classList.add("right");
    currentInput.disabled = true;
  } else {
    let iter = setLetters.keys();
    let flag = false;
    for (let i = 0; i < setLetters.size; i++) {
      let next = iter.next().value;
      if (i != next) {
        let currentInput = document.querySelector(`#guess-${currentTry}-letter-${i + 1}`);
        currentInput.value = word[i];
        rightLetters.push(i);
        currentInput.classList.add("right");
        currentInput.disabled = true;
        flag = true;
        break;
      }
    }
    if (!flag) {
      let idx = setLetters.size;
      let currentInput = document.querySelector(`#guess-${currentTry}-letter-${idx + 1}`);
      currentInput.value = word[idx];
      rightLetters.push(idx);
      currentInput.classList.add("right");
      currentInput.disabled = true;
    }
  }
});

// ─── Toast ───
let toastTimer;
function showToast(msg, duration = 2200) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), duration);
}

// ─── Overlay ───
function showOverlay(title, body) {
  document.querySelector(".win-overlay")?.remove();
  const overlay = document.createElement("div");
  overlay.className = "win-overlay";
  overlay.innerHTML = `
    <h2>${title}</h2>
    <p>${body}</p>
    <button class="btn check" id="replay-btn">العب مرة أخرى</button>
  `;
  document.body.appendChild(overlay);
  document.getElementById("replay-btn").addEventListener("click", () => {
    overlay.remove();
    restartGame();
  });
}

// ─── Restart ───
function restartGame() {
  divInputs.innerHTML = "";
  currentTry   = 1;
  guessWord    = "";
  rightLetters = [];
  numOfHints   = 2;
  hint         = `${numOfHints} تلميح`;
  entry        = WORDS[Math.floor(Math.random() * WORDS.length)];
  word         = entry.word;
  numOfLetters = word.length;
  generateInputs();
}

window.onload = generateInputs;
