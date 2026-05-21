const teachingAptitudeQuestions = [
  {
    question: "एक प्रभावी शिक्षक की सबसे महत्वपूर्ण विशेषता क्या है?",
    options: ["केवल विषय ज्ञान", "अनुशासन के लिए कठोर दंड", "विद्यार्थियों को सीखने के लिए प्रेरित करना", "केवल परीक्षा परिणाम पर ध्यान देना"],
    answer: 2,
    explanation: "प्रभावी शिक्षक वह है जो विद्यार्थियों को सीखने के लिए प्रेरित करे और उनकी सक्रिय भागीदारी बढ़ाए।"
  },
  {
    question: "यदि कक्षा में कुछ विद्यार्थी पाठ नहीं समझ पा रहे हों, तो शिक्षक को सबसे पहले क्या करना चाहिए?",
    options: ["उन्हें डांटना", "उन्हें अनदेखा करना", "विभिन्न उदाहरणों से दोबारा समझाना", "उनके अभिभावकों से तुरंत शिकायत करना"],
    answer: 2,
    explanation: "अलग-अलग उदाहरणों और तरीकों से पुनः समझाने से विद्यार्थियों की समझ बेहतर होती है।"
  },
  {
    question: "निम्न में से कौन-सा मूल्यांकन सीखने को सुधारने के लिए सबसे उपयोगी है?",
    options: ["केवल वार्षिक परीक्षा", "सतत एवं समग्र मूल्यांकन", "केवल मौखिक परीक्षा", "केवल गृहकार्य जांच"],
    answer: 1,
    explanation: "सतत एवं समग्र मूल्यांकन से विद्यार्थी की प्रगति का नियमित आकलन होता है और सुधार के अवसर मिलते हैं।"
  },
  {
    question: "बालकेंद्रित शिक्षण का मुख्य उद्देश्य क्या है?",
    options: ["शिक्षक की सुविधा", "केवल पाठ्यपुस्तक पूरा करना", "विद्यार्थी की रुचि, क्षमता और गति के अनुसार सीखना", "कक्षा में केवल मौन बनाए रखना"],
    answer: 2,
    explanation: "बालकेंद्रित शिक्षण में विद्यार्थी की आवश्यकताओं, रुचि और सीखने की गति को केंद्र में रखा जाता है।"
  },
  {
    question: "एक अच्छे कक्षा-कक्ष वातावरण की पहचान क्या है?",
    options: ["डर और दबाव", "प्रतिस्पर्धा के कारण तनाव", "सहयोग, सम्मान और खुला संवाद", "केवल शिक्षक का एकतरफा बोलना"],
    answer: 2,
    explanation: "सहयोगपूर्ण, सम्मानजनक और संवादात्मक वातावरण सीखने को प्रभावी बनाता है।"
  }
];

let currentIndex = 0;
const userSelections = Array(teachingAptitudeQuestions.length).fill(null);
const checkedState = Array(teachingAptitudeQuestions.length).fill(false);

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
  const item = teachingAptitudeQuestions[currentIndex];
  progressEl.textContent = `Question ${currentIndex + 1} of ${teachingAptitudeQuestions.length}`;
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
  nextBtn.disabled = currentIndex === teachingAptitudeQuestions.length - 1;
}

function updateOptionStyles() {
  const labels = optionsFormEl.querySelectorAll("label");
  const selected = userSelections[currentIndex];
  const correct = teachingAptitudeQuestions[currentIndex].answer;
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
  const correct = teachingAptitudeQuestions[currentIndex].answer;
  const isCorrect = selected === correct;

  feedbackEl.classList.remove("hidden", "border-rose-200", "bg-rose-50", "text-rose-800", "border-emerald-200", "bg-emerald-50", "text-emerald-800");
  feedbackEl.classList.add(isCorrect ? "border-emerald-200" : "border-rose-200", isCorrect ? "bg-emerald-50" : "bg-rose-50", isCorrect ? "text-emerald-800" : "text-rose-800");

  const correctAnswerText = teachingAptitudeQuestions[currentIndex].options[correct];
  feedbackEl.innerHTML = isCorrect
    ? `<p class="font-semibold">✅ सही उत्तर! आपने सही विकल्प चुना।</p><p class="mt-1 text-sm">Correct Answer: ${correctAnswerText}</p>`
    : `<p class="font-semibold">❌ गलत उत्तर।</p><p class="mt-1 text-sm">Correct Answer: ${correctAnswerText}</p>`;

  explanationEl.classList.remove("hidden");
  explanationTextEl.textContent = teachingAptitudeQuestions[currentIndex].explanation;
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
  if (currentIndex < teachingAptitudeQuestions.length - 1) {
    currentIndex += 1;
    renderQuestion();
  }
});

renderQuestion();
