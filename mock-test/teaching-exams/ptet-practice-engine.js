(() => {
  const letters = ['A', 'B', 'C', 'D'];
  const config = window.ptetPracticeConfig || {};
  const bank = window.ptetPracticeQuestionBank || { sections: [] };
  const section = (bank.sections || []).find((item) => item.slug === config.slug);
  const data = (section?.questions || []).filter(Boolean);
  const state = { current: 0, answers: {}, checked: {} };

  const $ = (id) => document.getElementById(id);
  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const formatPreservedText = (value = '') => escapeHtml(value).replace(/&lt;br\s*\/?&gt;/gi, '<br>').replace(/\r?\n/g, '<br>');
  const renderLabelBlock = (title, content = '') => `<div class="question-block"><span class="question-block-title">${title}</span><div>${formatPreservedText(content)}</div></div>`;
  const embeddedOptionLine = /^\s*(?:[A-D]|[एबीसीडी])\s*[.)।:-]\s+/;
  const optionGuideLabel = /^(.*?)(?:\n\s*)?((?:सही\s+|अशुद्ध वाक्यों का\s+|असंगत\s+)?कूट|विकल्प)(?:\s*\([^)]*\))?\s*[:：]\s*(.*)$/is;
  const stripEmbeddedOptionLines = (value = '') => String(value).split(/\r?\n/).filter((line) => !embeddedOptionLine.test(line)).join('\n').replace(/(?:\n\s*)?(?:कूट|विकल्प)(?:\s*\([^)]*\))?\s*[:：]\s*$/i, '').trim();
  const splitOptionGuide = (value = '') => {
    const match = String(value).match(optionGuideLabel);
    if (!match) return { body: stripEmbeddedOptionLines(value), guide: '' };
    return { body: stripEmbeddedOptionLines(match[1]), guide: stripEmbeddedOptionLines(match[3]) };
  };
  const parseAssertionReason = (question = '') => {
    const match = String(question).match(/(.*?)(कथन\s*\(A\)\s*[:：])(.*?)(कारण\s*\(R\)\s*[:：])(.*)$/is);
    if (!match) return null;
    const reason = splitOptionGuide(match[5]);
    return { intro: match[1].trim(), statement: stripEmbeddedOptionLines(match[3]), reason: reason.body, guide: reason.guide };
  };
  const parseStatementConclusion = (question = '') => {
    const match = String(question).match(/(.*?)(कथन\s*[:：])(.*?)(निष्कर्ष\s*[:：]?)(.*)$/is);
    if (!match) return null;
    const conclusions = splitOptionGuide(match[5]);
    return { intro: match[1].trim(), statements: stripEmbeddedOptionLines(match[3]), conclusions: conclusions.body, guide: conclusions.guide };
  };
  const parseMatching = (question = '') => {
    const match = String(question).match(/(.*?)(सूची[-\s]*(?:1|I+)[^\n\r:：]*)(?:\s*[:：])?\s*\r?\n(.*?)(?:\r?\n\s*)+(सूची[-\s]*(?:2|II)[^\n\r:：]*)(?:\s*[:：])?\s*\r?\n(.*)$/is);
    if (!match) return null;
    const list2 = splitOptionGuide(match[5]);
    return { intro: stripEmbeddedOptionLines(match[1]), list1Title: match[2].trim(), list1: stripEmbeddedOptionLines(match[3]), list2Title: match[4].trim(), list2: list2.body, guide: list2.guide };
  };

  function renderStructuredQuestion(question) {
    const questionText = $('question-text');
    const matchingBlock = $('matching-block');
    const raw = String(question.question || '');
    const assertionData = question.questionType === 'Assertion-Reason' ? parseAssertionReason(raw) : null;
    if (assertionData) {
      questionText.innerHTML = `<div class="question-structured">${assertionData.intro ? `<div>${formatPreservedText(assertionData.intro)}</div>` : ''}${renderLabelBlock('कथन (A):', assertionData.statement)}${renderLabelBlock('कारण (R):', assertionData.reason)}${assertionData.guide ? renderLabelBlock('कूट:', assertionData.guide) : ''}</div>`;
      matchingBlock.innerHTML = '';
      return;
    }
    const statementData = question.questionType === 'Statement-Conclusion' ? parseStatementConclusion(raw) : null;
    if (statementData) {
      questionText.innerHTML = `<div class="question-structured">${statementData.intro ? `<div>${formatPreservedText(statementData.intro)}</div>` : ''}${renderLabelBlock('कथन:', statementData.statements)}${renderLabelBlock('निष्कर्ष:', statementData.conclusions)}${statementData.guide ? renderLabelBlock('कूट:', statementData.guide) : ''}</div>`;
      matchingBlock.innerHTML = '';
      return;
    }
    const matching = question.questionType === 'Matching' ? parseMatching(raw) : null;
    if (matching) {
      questionText.innerHTML = matching.intro ? formatPreservedText(matching.intro) : '';
      matchingBlock.innerHTML = `<div class="matching-grid"><div class="matching-list"><strong>${formatPreservedText(matching.list1Title || 'सूची-1')}</strong><div class="mt-2">${formatPreservedText(matching.list1)}</div></div><div class="matching-list"><strong>${formatPreservedText(matching.list2Title || 'सूची-2')}</strong><div class="mt-2">${formatPreservedText(matching.list2)}</div></div></div>`;
      return;
    }
    questionText.innerHTML = formatPreservedText(stripEmbeddedOptionLines(raw));
    matchingBlock.innerHTML = '';
  }

  function optionHtml(question) {
    return (question.options || []).map((option, index) => {
      const key = letters[index];
      const selected = state.answers[question.id] === key;
      const checked = Boolean(state.checked[question.id]);
      const correct = question.answer === key;
      const wrong = checked && selected && !correct;
      const classes = ['option-item', 'cursor-pointer'];
      if (selected) classes.push('selected');
      if (checked && correct) classes.push('correct');
      if (wrong) classes.push('wrong');
      return `<label class="${classes.join(' ')}"><input class="mr-2 mt-1 align-top" type="radio" name="option" value="${key}" ${selected ? 'checked' : ''}/> <span class="option-code">${key}.</span> <span>${formatPreservedText(option)}</span></label>`;
    }).join('');
  }

  function renderFeedback(question) {
    const feedback = $('feedback');
    const explanation = $('explanation');
    if (!state.checked[question.id]) {
      feedback.classList.add('hidden');
      explanation.classList.add('hidden');
      return;
    }
    const selected = state.answers[question.id];
    const correctAnswerText = question.options[letters.indexOf(question.answer)] || '';
    const isCorrect = selected === question.answer;
    feedback.className = `mt-6 review-card ${isCorrect ? 'status-correct' : 'status-wrong'}`;
    feedback.innerHTML = isCorrect
      ? `<p class="font-bold">✅ सही उत्तर! आपने सही विकल्प चुना।</p><p class="mt-2 text-sm"><strong>Correct Answer:</strong> <span class="answer-pill correct">${question.answer}. ${formatPreservedText(correctAnswerText)}</span></p>`
      : `<p class="font-bold">❌ गलत उत्तर।</p><p class="mt-2 text-sm"><strong>Your Answer:</strong> <span class="answer-pill user-wrong">${selected || '—'}</span></p><p class="mt-2 text-sm"><strong>Correct Answer:</strong> <span class="answer-pill correct">${question.answer}. ${formatPreservedText(correctAnswerText)}</span></p>`;
    explanation.classList.remove('hidden');
    $('explanation-text').innerHTML = formatPreservedText(question.explanation || 'Explanation available नहीं है।');
  }

  function renderPalette() {
    const palette = $('practice-palette');
    if (!palette) return;
    palette.innerHTML = data.map((question, index) => {
      const classes = ['practice-palette-btn'];
      if (state.current === index) classes.push('active');
      if (state.checked[question.id]) classes.push('checked');
      if (!state.checked[question.id] && state.answers[question.id]) classes.push('unchecked-attempted');
      return `<button type="button" data-index="${index}" class="${classes.join(' ')}">${index + 1}</button>`;
    }).join('');
    palette.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        state.current = Number(button.dataset.index) || 0;
        renderQuestion();
      });
    });
  }

  function renderQuestion() {
    if (!data.length) {
      $('question-meta').textContent = 'Questions unavailable';
      $('question-text').textContent = 'PTET practice question data could not be loaded.';
      return;
    }
    const question = data[state.current];
    $('practice-title').textContent = section.title;
    $('practice-description').textContent = section.description;
    $('question-meta').textContent = `प्रश्न / Question ${state.current + 1} of ${data.length}`;
    $('section-tag').textContent = `${question.section} • ${question.difficulty} • ${question.questionType}`;
    renderStructuredQuestion(question);
    $('options').innerHTML = optionHtml(question);
    $('options').querySelectorAll('input').forEach((input) => {
      input.addEventListener('change', (event) => {
        state.answers[question.id] = event.target.value;
        if (!state.checked[question.id]) renderFeedback(question);
        renderQuestion();
      });
    });
    $('prev-btn').disabled = state.current === 0;
    $('next-btn').disabled = state.current === data.length - 1;
    renderFeedback(question);
    renderPalette();
  }

  function bindEvents() {
    $('check-btn').addEventListener('click', () => {
      const question = data[state.current];
      if (!state.answers[question.id]) {
        const feedback = $('feedback');
        feedback.className = 'mt-6 review-card status-attempted';
        feedback.innerHTML = '<p class="font-bold">कृपया पहले एक विकल्प चुनें।</p>';
        $('explanation').classList.add('hidden');
        return;
      }
      state.checked[question.id] = true;
      renderQuestion();
    });
    $('prev-btn').addEventListener('click', () => {
      if (state.current > 0) {
        state.current -= 1;
        renderQuestion();
      }
    });
    $('next-btn').addEventListener('click', () => {
      if (state.current < data.length - 1) {
        state.current += 1;
        renderQuestion();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!section) {
      $('practice-title').textContent = 'PTET Practice Set';
      $('practice-description').textContent = 'Practice section not found. Please return to the PTET Practice Sets hub.';
      $('question-meta').textContent = 'Questions unavailable';
      return;
    }
    bindEvents();
    renderQuestion();
  });
})();
