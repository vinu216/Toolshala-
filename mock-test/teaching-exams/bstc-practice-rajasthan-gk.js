const rajasthanGkQuestions = [
  {
    question: "राजस्थान की राजधानी कौन-सी है?",
    options: ["जोधपुर", "उदयपुर", "जयपुर", "बीकानेर"],
    answer: 2,
    explanation: "जयपुर राजस्थान की राजधानी है।"
  },
  {
    question: "राजस्थान का राज्य पशु कौन-सा है?",
    options: ["ऊँट", "चिंकारा", "नीलगाय", "काला हिरण"],
    answer: 1,
    explanation: "चिंकारा राजस्थान का राज्य पशु है।"
  },
  {
    question: "राजस्थान का राज्य वृक्ष कौन-सा है?",
    options: ["नीम", "खेजड़ी", "पीपल", "बरगद"],
    answer: 1,
    explanation: "खेजड़ी राजस्थान का राज्य वृक्ष है।"
  },
  {
    question: "हल्दीघाटी का युद्ध किनके बीच लड़ा गया था?",
    options: ["महाराणा प्रताप और अकबर", "महाराणा प्रताप और मानसिंह", "राणा सांगा और बाबर", "दुर्गादास और औरंगज़ेब"],
    answer: 1,
    explanation: "हल्दीघाटी का युद्ध महाराणा प्रताप और मुगल सेना के सेनापति मानसिंह के बीच लड़ा गया था।"
  },
  {
    question: "राजस्थान दिवस कब मनाया जाता है?",
    options: ["30 मार्च", "1 मई", "15 अगस्त", "26 जनवरी"],
    answer: 0,
    explanation: "राजस्थान दिवस हर वर्ष 30 मार्च को मनाया जाता है।"
  }
];

let currentIndex = 0;
const userSelections = Array(rajasthanGkQuestions.length).fill(null);
const checkedState = Array(rajasthanGkQuestions.length).fill(false);

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
  const item = rajasthanGkQuestions[currentIndex];
  progressEl.textContent = `Question ${currentIndex + 1} of ${rajasthanGkQuestions.length}`;
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
  nextBtn.disabled = currentIndex === rajasthanGkQuestions.length - 1;
}

function updateOptionStyles() {
  const labels = optionsFormEl.querySelectorAll("label");
  const selected = userSelections[currentIndex];
  const correct = rajasthanGkQuestions[currentIndex].answer;
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
  const correct = rajasthanGkQuestions[currentIndex].answer;
  const isCorrect = selected === correct;

  feedbackEl.classList.remove("hidden", "border-rose-200", "bg-rose-50", "text-rose-800", "border-emerald-200", "bg-emerald-50", "text-emerald-800");
  feedbackEl.classList.add(isCorrect ? "border-emerald-200" : "border-rose-200", isCorrect ? "bg-emerald-50" : "bg-rose-50", isCorrect ? "text-emerald-800" : "text-rose-800");

  const correctAnswerText = rajasthanGkQuestions[currentIndex].options[correct];
  feedbackEl.innerHTML = isCorrect
    ? `<p class="font-semibold">✅ सही उत्तर! आपने सही विकल्प चुना।</p><p class="mt-1 text-sm">Correct Answer: ${correctAnswerText}</p>`
    : `<p class="font-semibold">❌ गलत उत्तर।</p><p class="mt-1 text-sm">Correct Answer: ${correctAnswerText}</p>`;

  explanationEl.classList.remove("hidden");
  explanationTextEl.textContent = rajasthanGkQuestions[currentIndex].explanation;
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
  if (currentIndex < rajasthanGkQuestions.length - 1) {
    currentIndex += 1;
    renderQuestion();
  }
});

renderQuestion();
