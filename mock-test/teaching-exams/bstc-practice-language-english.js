const languageEnglishQuestions = [
  {
    question: "Choose the correct synonym of 'Rapid'.",
    options: ["Slow", "Quick", "Weak", "Late"],
    answer: 1,
    explanation: "'Rapid' means fast or quick."
  },
  {
    question: "Identify the correctly spelled word.",
    options: ["Definately", "Recieve", "Beautiful", "Seperate"],
    answer: 2,
    explanation: "'Beautiful' is the correct spelling."
  },
  {
    question: "Choose the correct article: ___ honest man.",
    options: ["A", "An", "The", "No article"],
    answer: 1,
    explanation: "'Honest' starts with a vowel sound, so 'An' is used."
  },
  {
    question: "Fill in the blank: She ____ to school every day.",
    options: ["go", "goes", "gone", "going"],
    answer: 1,
    explanation: "With third person singular subject 'She' in simple present tense, verb takes 'es': goes."
  },
  {
    question: "Choose the correct antonym of 'Ancient'.",
    options: ["Old", "Historic", "Modern", "Traditional"],
    answer: 2,
    explanation: "'Modern' is the opposite of 'Ancient'."
  }
];

let currentIndex = 0;
const userSelections = Array(languageEnglishQuestions.length).fill(null);
const checkedState = Array(languageEnglishQuestions.length).fill(false);

const progressEl = document.getElementById("progress");
const questionEl = document.getElementById("question");
const optionsFormEl = document.getElementById("options-form");
const feedbackEl = document.getElementById("feedback");
const explanationEl = document.getElementById("explanation");
const explanationTextEl = document.getElementById("explanation-text");
const checkBtn = document.getElementById("check-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

function renderQuestion() {
  const item = languageEnglishQuestions[currentIndex];
  progressEl.textContent = `Question ${currentIndex + 1} of ${languageEnglishQuestions.length}`;
  questionEl.textContent = item.question;

  optionsFormEl.innerHTML = "";

  item.options.forEach((option, optionIndex) => {
    const label = document.createElement("label");
    label.className = "block cursor-pointer rounded-xl border border-slate-200 p-3 text-sm transition hover:border-indigo-300";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "option";
    input.value = String(optionIndex);
    input.className = "mr-2 align-middle";
    input.checked = userSelections[currentIndex] === optionIndex;

    input.addEventListener("change", () => {
      userSelections[currentIndex] = optionIndex;
      if (!checkedState[currentIndex]) {
        hideFeedback();
      }
    });

    const text = document.createElement("span");
    text.className = "align-middle";
    text.textContent = option;

    label.appendChild(input);
    label.appendChild(text);
    optionsFormEl.appendChild(label);
  });

  updateOptionStyles();
  renderFeedbackSection();
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === languageEnglishQuestions.length - 1;
}

function updateOptionStyles() {
  const labels = optionsFormEl.querySelectorAll("label");
  const selected = userSelections[currentIndex];
  const correct = languageEnglishQuestions[currentIndex].answer;
  const checked = checkedState[currentIndex];

  labels.forEach((label, idx) => {
    label.className = "block cursor-pointer rounded-xl border border-slate-200 p-3 text-sm transition hover:border-indigo-300";

    if (selected === idx) {
      label.classList.add("border-indigo-400", "bg-indigo-50");
    }

    if (checked) {
      if (idx === correct) {
        label.classList.remove("border-slate-200");
        label.classList.add("border-emerald-500", "bg-emerald-50");
      }
      if (selected === idx && selected !== correct) {
        label.classList.remove("border-indigo-400", "bg-indigo-50");
        label.classList.add("border-rose-500", "bg-rose-50");
      }
    }
  });
}

function renderFeedbackSection() {
  if (!checkedState[currentIndex]) {
    hideFeedback();
    return;
  }

  const selected = userSelections[currentIndex];
  const correct = languageEnglishQuestions[currentIndex].answer;
  const isCorrect = selected === correct;

  feedbackEl.classList.remove("hidden", "border-rose-200", "bg-rose-50", "text-rose-800", "border-emerald-200", "bg-emerald-50", "text-emerald-800");
  feedbackEl.classList.add(isCorrect ? "border-emerald-200" : "border-rose-200", isCorrect ? "bg-emerald-50" : "bg-rose-50", isCorrect ? "text-emerald-800" : "text-rose-800");

  const correctAnswerText = languageEnglishQuestions[currentIndex].options[correct];
  feedbackEl.innerHTML = isCorrect
    ? `<p class="font-semibold">✅ सही उत्तर! आपने सही विकल्प चुना।</p><p class="mt-1 text-sm">Correct Answer: ${correctAnswerText}</p>`
    : `<p class="font-semibold">❌ गलत उत्तर।</p><p class="mt-1 text-sm">Correct Answer: ${correctAnswerText}</p>`;

  explanationEl.classList.remove("hidden");
  explanationTextEl.textContent = languageEnglishQuestions[currentIndex].explanation;
}

function hideFeedback() {
  feedbackEl.classList.add("hidden");
  explanationEl.classList.add("hidden");
}

checkBtn.addEventListener("click", () => {
  if (userSelections[currentIndex] === null) {
    feedbackEl.classList.remove("hidden");
    feedbackEl.className = "mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800";
    feedbackEl.innerHTML = "<p class='font-semibold'>कृपया पहले एक विकल्प चुनें।</p>";
    explanationEl.classList.add("hidden");
    return;
  }

  checkedState[currentIndex] = true;
  updateOptionStyles();
  renderFeedbackSection();
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < languageEnglishQuestions.length - 1) {
    currentIndex += 1;
    renderQuestion();
  }
});

renderQuestion();
