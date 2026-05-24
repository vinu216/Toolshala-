const languageHindiQuestions = [
  {
    question: "'विद्यालय' शब्द का सही संधि-विच्छेद क्या है?",
    options: ["विद्या + आलय", "विद + यालय", "वि + द्यालय", "विद्य + आलय"],
    answer: 0,
    explanation: "विद्यालय = विद्या + आलय।"
  },
  {
    question: "'राम ने पत्र लिखा।' वाक्य में 'पत्र' कौन-सा कारक है?",
    options: ["कर्ता कारक", "कर्म कारक", "करण कारक", "सम्प्रदान कारक"],
    answer: 1,
    explanation: "'पत्र' यहाँ क्रिया का फल ग्रहण कर रहा है, इसलिए यह कर्म कारक है।"
  },
  {
    question: "निम्न में से स्त्रीलिंग शब्द कौन-सा है?",
    options: ["कवि", "नदी", "विद्यालय", "पुस्तकालय"],
    answer: 1,
    explanation: "'नदी' स्त्रीलिंग शब्द है।"
  },
  {
    question: "'आसमान से गिरा, खजूर में अटका' मुहावरे का सही अर्थ क्या है?",
    options: ["बहुत प्रसन्न होना", "एक संकट से निकलकर दूसरे संकट में पड़ना", "अचानक धनवान बनना", "कड़ी मेहनत करना"],
    answer: 1,
    explanation: "इस मुहावरे का अर्थ है एक परेशानी से निकलकर दूसरी परेशानी में फँस जाना।"
  },
  {
    question: "'वह तेज दौड़ता है।' वाक्य में 'तेज' कौन-सा पद है?",
    options: ["संज्ञा", "सर्वनाम", "क्रिया-विशेषण", "समुच्चयबोधक"],
    answer: 2,
    explanation: "'तेज' यहाँ 'दौड़ता है' क्रिया की विशेषता बता रहा है, इसलिए यह क्रिया-विशेषण है।"
  }
];

let currentIndex = 0;
const userSelections = Array(languageHindiQuestions.length).fill(null);
const checkedState = Array(languageHindiQuestions.length).fill(false);

const progressEl = document.getElementById("progress");
const questionEl = document.getElementById("question");
questionEl.style.whiteSpace = "pre-line";
const optionsFormEl = document.getElementById("options-form");
const feedbackEl = document.getElementById("feedback");
const explanationEl = document.getElementById("explanation");
const explanationTextEl = document.getElementById("explanation-text");
const checkBtn = document.getElementById("check-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

function renderQuestion() {
  const item = languageHindiQuestions[currentIndex];
  progressEl.textContent = `Question ${currentIndex + 1} of ${languageHindiQuestions.length}`;
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
  nextBtn.disabled = currentIndex === languageHindiQuestions.length - 1;
}

function updateOptionStyles() {
  const labels = optionsFormEl.querySelectorAll("label");
  const selected = userSelections[currentIndex];
  const correct = languageHindiQuestions[currentIndex].answer;
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
  const correct = languageHindiQuestions[currentIndex].answer;
  const isCorrect = selected === correct;

  feedbackEl.classList.remove("hidden", "border-rose-200", "bg-rose-50", "text-rose-800", "border-emerald-200", "bg-emerald-50", "text-emerald-800");
  feedbackEl.classList.add(isCorrect ? "border-emerald-200" : "border-rose-200", isCorrect ? "bg-emerald-50" : "bg-rose-50", isCorrect ? "text-emerald-800" : "text-rose-800");

  const correctAnswerText = languageHindiQuestions[currentIndex].options[correct];
  feedbackEl.innerHTML = isCorrect
    ? `<p class="font-semibold">✅ सही उत्तर! आपने सही विकल्प चुना।</p><p class="mt-1 text-sm">Correct Answer: ${correctAnswerText}</p>`
    : `<p class="font-semibold">❌ गलत उत्तर।</p><p class="mt-1 text-sm">Correct Answer: ${correctAnswerText}</p>`;

  explanationEl.classList.remove("hidden");
  explanationTextEl.textContent = languageHindiQuestions[currentIndex].explanation;
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
  if (currentIndex < languageHindiQuestions.length - 1) {
    currentIndex += 1;
    renderQuestion();
  }
});

renderQuestion();
