(() => {
  const OBJECTIVES = [
    { id: 1, category: 'General Fresher', text: '[Your Name] is a motivated fresher seeking a [Target Role] opportunity in the [Industry] sector to apply [Key Skill] and build strong professional experience.' },
    { id: 2, category: 'General Fresher', text: 'Detail-oriented fresher aiming to start a career as a [Target Role], contributing problem-solving skills and a learning mindset to a growth-focused team.' },
    { id: 3, category: 'Internship Applicant', text: 'Enthusiastic student looking for an internship as a [Target Role] to apply classroom knowledge, improve [Key Skill], and contribute to live projects.' },
    { id: 4, category: 'Internship Applicant', text: 'Seeking an internship in [Industry] where I can support project execution, learn industry workflows, and strengthen practical [Key Skill].' },
    { id: 5, category: 'Commerce Student', text: 'Commerce graduate aiming for a [Target Role] role to apply accounting basics, business analysis, and communication skills in a professional environment.' },
    { id: 6, category: 'Commerce Student', text: 'Fresher with strong fundamentals in finance and reporting, seeking entry-level opportunities in [Industry] to contribute with accuracy and discipline.' },
    { id: 7, category: 'Science Student', text: 'Science graduate seeking a [Target Role] opportunity to apply analytical thinking, research skills, and structured problem solving in [Industry].' },
    { id: 8, category: 'Science Student', text: 'Curious and detail-oriented science fresher looking to begin a career in [Industry], leveraging [Key Skill] and data interpretation abilities.' },
    { id: 9, category: 'Arts / Humanities Student', text: 'Arts graduate aspiring to work as a [Target Role], using communication, writing, and stakeholder coordination skills to support team outcomes.' },
    { id: 10, category: 'Arts / Humanities Student', text: 'Humanities fresher seeking an entry-level role in [Industry] to contribute through research, content development, and creative problem solving.' },
    { id: 11, category: 'Tech / IT Fresher', text: 'Computer science fresher looking for a [Target Role] position to apply [Key Skill], coding fundamentals, and debugging ability on real product challenges.' },
    { id: 12, category: 'Tech / IT Fresher', text: 'Entry-level IT candidate seeking to contribute to development and testing tasks while growing expertise in [Key Skill] and software best practices.' },
    { id: 13, category: 'Marketing Fresher', text: 'Marketing fresher aiming for a [Target Role] role to support campaign planning, content execution, and audience engagement using [Key Skill].' },
    { id: 14, category: 'Marketing Fresher', text: 'Creative and data-aware fresher seeking opportunities in digital marketing to improve brand reach and lead generation in [Industry].' },
    { id: 15, category: 'Sales Fresher', text: 'Goal-driven fresher seeking a [Target Role] position to contribute to lead conversion, client communication, and revenue support using strong interpersonal skills.' },
    { id: 16, category: 'Sales Fresher', text: 'Sales-oriented candidate looking to start a career in [Industry], with focus on relationship building, follow-ups, and customer satisfaction.' },
    { id: 17, category: 'Operations / Admin Fresher', text: 'Organized fresher seeking a [Target Role] opportunity to support operations, documentation, and team coordination with attention to detail.' },
    { id: 18, category: 'Operations / Admin Fresher', text: 'Operations-focused fresher aiming to contribute to process efficiency, scheduling, and administrative support while strengthening [Key Skill].' }
  ];

  const filtersHost = document.getElementById('objectiveCategoryFilters');
  const grid = document.getElementById('objectiveBankGrid');
  const feedback = document.getElementById('objectiveBankFeedback');

  const copySelectedBtn = document.getElementById('copySelectedObjectives');
  const copyAllBtn = document.getElementById('copyAllObjectives');
  const downloadBtn = document.getElementById('downloadObjectiveBank');
  const printBtn = document.getElementById('printObjectiveBank');
  const resetBtn = document.getElementById('resetObjectiveBank');

  const categories = ['All', ...new Set(OBJECTIVES.map((o) => o.category))];
  let activeCategory = 'All';

  const setFeedback = (msg, isError = false) => {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.classList.remove('hidden');
    feedback.classList.toggle('text-red-600', isError);
    feedback.classList.toggle('text-emerald-700', !isError);
  };

  const getVisible = () => activeCategory === 'All' ? OBJECTIVES : OBJECTIVES.filter((o) => o.category === activeCategory);

  const renderFilters = () => {
    if (!filtersHost) return;
    filtersHost.innerHTML = categories.map((c) => `<button type="button" class="filter-btn${c === activeCategory ? ' active' : ''}" data-category="${c}">${c}</button>`).join('');
    filtersHost.querySelectorAll('[data-category]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-category') || 'All';
        renderAll();
      });
    });
  };

  const renderGrid = () => {
    const rows = getVisible();
    grid.innerHTML = rows.map((item) => `
      <article class="objective-card" data-id="${item.id}">
        <div class="objective-top"><label class="objective-select"><input type="checkbox" data-objective-select value="${item.id}" /> Select</label><span class="template-badge">${item.category}</span></div>
        <p class="objective-text" contenteditable="true">${item.text}</p>
        <div class="objective-actions"><button type="button" class="btn-secondary" data-copy-one="${item.id}">Copy Objective</button></div>
      </article>
    `).join('');

    grid.querySelectorAll('[data-copy-one]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.getAttribute('data-copy-one'));
        const card = grid.querySelector(`.objective-card[data-id="${id}"] .objective-text`);
        const text = card?.textContent?.trim() || '';
        try {
          await navigator.clipboard.writeText(text);
          setFeedback('Objective copied successfully.');
        } catch {
          setFeedback('Copy failed. Please copy manually.', true);
        }
      });
    });
  };

  const copySelected = async () => {
    const selectedIds = [...grid.querySelectorAll('[data-objective-select]:checked')].map((el) => Number(el.value));
    if (!selectedIds.length) {
      setFeedback('Select at least one objective to copy.', true);
      return;
    }
    const lines = selectedIds.map((id) => grid.querySelector(`.objective-card[data-id="${id}"] .objective-text`)?.textContent?.trim() || '').filter(Boolean);
    try {
      await navigator.clipboard.writeText(lines.join('\n\n'));
      setFeedback('Selected objectives copied successfully.');
    } catch {
      setFeedback('Copy failed. Please copy manually.', true);
    }
  };

  const copyAll = async () => {
    const all = [...grid.querySelectorAll('.objective-text')].map((el) => el.textContent?.trim() || '').filter(Boolean);
    try {
      await navigator.clipboard.writeText(all.join('\n\n'));
      setFeedback('All visible objectives copied successfully.');
    } catch {
      setFeedback('Copy failed. Please copy manually.', true);
    }
  };

  const reset = () => {
    activeCategory = 'All';
    renderAll();
    setFeedback('Objective bank reset to default examples.');
  };

  const downloadAll = () => {
    const visible = getVisible()
      .map((item) => `${item.category}: ${grid.querySelector(`.objective-card[data-id="${item.id}"] .objective-text`)?.textContent?.trim() || item.text}`)
      .join('\n\n');
    const blob = new Blob([visible], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'fresher-resume-objective-bank.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    setFeedback('Visible objectives downloaded successfully.');
  };

  const renderAll = () => {
    renderFilters();
    renderGrid();
  };

  copySelectedBtn?.addEventListener('click', copySelected);
  copyAllBtn?.addEventListener('click', copyAll);
  downloadBtn?.addEventListener('click', downloadAll);
  printBtn?.addEventListener('click', () => window.print());
  resetBtn?.addEventListener('click', reset);

  renderAll();
})();
