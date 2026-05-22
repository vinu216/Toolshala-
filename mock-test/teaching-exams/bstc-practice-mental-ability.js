const mentalAbilityQuestions = [
  {
    question: "यदि किसी कूट भाषा में BOOK को CPPL लिखा जाता है, तो COPY को कैसे लिखा जाएगा?",
    options: ["DPQZ", "DPQX", "DPPZ", "CPOZ"],
    answer: 0,
    explanation: "BOOK → CPPL में हर अक्षर को वर्णक्रम में एक स्थान आगे बढ़ाया गया है। इसी नियम से COPY → DPQZ होगा।"
  },
  {
    question: "श्रृंखला में अगली संख्या ज्ञात कीजिए: 3, 6, 12, 24, ?",
    options: ["36", "42", "48", "54"],
    answer: 2,
    explanation: "हर पद अपने पिछले पद का दोगुना है: 3×2=6, 6×2=12, 12×2=24, 24×2=48।"
  },
  {
    question: "यदि A = 1, B = 2, C = 3, ... तो CAB का मान क्या होगा?",
    options: ["6", "7", "8", "9"],
    answer: 0,
    explanation: "CAB = C + A + B = 3 + 1 + 2 = 6।"
  },
  {
    question: "एक घड़ी 3 बजे दर्शा रही है। घंटे और मिनट की सुइयों के बीच का कोण कितना होगा?",
    options: ["30°", "60°", "90°", "120°"],
    answer: 2,
    explanation: "3 बजे मिनट की सुई 12 पर और घंटे की सुई 3 पर होती है, इसलिए कोण 90° होता है।"
  },
  {
    question: "विषम पद चुनिए: 8, 27, 64, 100, 125",
    options: ["27", "64", "100", "125"],
    answer: 2,
    explanation: "8, 27, 64, 125 क्रमशः 2³, 3³, 4³, 5³ हैं। 100 पूर्ण घन नहीं है, इसलिए यह विषम पद है।"
  }
];

let currentIndex = 0;
const userSelections = Array(mentalAbilityQuestions.length).fill(null);
const checkedState = Array(mentalAbilityQuestions.length).fill(false);

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
  const item = mentalAbilityQuestions[currentIndex];
  progressEl.textContent = `Question ${currentIndex + 1} of ${mentalAbilityQuestions.length}`;
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
  nextBtn.disabled = currentIndex === mentalAbilityQuestions.length - 1;
}

function updateOptionStyles() {
  const labels = optionsFormEl.querySelectorAll("label");
  const selected = userSelections[currentIndex];
  const correct = mentalAbilityQuestions[currentIndex].answer;
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
  const correct = mentalAbilityQuestions[currentIndex].answer;
  const isCorrect = selected === correct;

  feedbackEl.classList.remove("hidden", "border-rose-200", "bg-rose-50", "text-rose-800", "border-emerald-200", "bg-emerald-50", "text-emerald-800");
  feedbackEl.classList.add(isCorrect ? "border-emerald-200" : "border-rose-200", isCorrect ? "bg-emerald-50" : "bg-rose-50", isCorrect ? "text-emerald-800" : "text-rose-800");

  const correctAnswerText = mentalAbilityQuestions[currentIndex].options[correct];
  feedbackEl.innerHTML = isCorrect
    ? `<p class="font-semibold">✅ सही उत्तर! आपने सही विकल्प चुना।</p><p class="mt-1 text-sm">Correct Answer: ${correctAnswerText}</p>`
    : `<p class="font-semibold">❌ गलत उत्तर।</p><p class="mt-1 text-sm">Correct Answer: ${correctAnswerText}</p>`;

  explanationEl.classList.remove("hidden");
  explanationTextEl.textContent = mentalAbilityQuestions[currentIndex].explanation;
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
  if (currentIndex < mentalAbilityQuestions.length - 1) {
    currentIndex += 1;
    renderQuestion();
  }
});

renderQuestion();
