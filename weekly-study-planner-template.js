document.addEventListener('DOMContentLoaded', () => {
  const plannerModes = [
    {
      id: 'simple-weekly-plan',
      label: 'Simple Weekly Plan',
      intro: 'Use this quick planner when you want a clean weekly routine without too many details.',
      columns: ['Day', 'Main Study Block', 'Second Study Block', 'Revision Block', 'Break / Rest', 'Daily Goal'],
      rows: [
        ['Monday', '[Math - 7:00 PM to 8:00 PM]', '[Physics - 8:15 PM to 9:00 PM]', '[Revise formula notes]', '[15-min walk]', '[Finish Chapter 3 questions]'],
        ['Tuesday', '[Biology - 6:30 PM to 7:30 PM]', '[Chemistry - 7:45 PM to 8:45 PM]', '[Revise Monday weak points]', '[Stretch + water break]', '[Complete two topic summaries]'],
        ['Wednesday', '[English - 7:00 PM to 8:00 PM]', '[Math practice - 8:15 PM to 9:00 PM]', '[Flashcard revision]', '[10-min breathing break]', '[Solve one mock section]'],
        ['Thursday', '[Chemistry - 6:30 PM to 7:30 PM]', '[Biology diagrams - 7:45 PM to 8:45 PM]', '[Concept recap]', '[Music / light refresh]', '[Strengthen weak chapter]'],
        ['Friday', '[Math - 7:00 PM to 8:00 PM]', '[Physics numericals - 8:15 PM to 9:15 PM]', '[Error log review]', '[Quick snack break]', '[Improve speed + accuracy]'],
        ['Saturday', '[Weekly test - 10:00 AM to 11:30 AM]', '[Doubt clearing - 5:00 PM to 6:00 PM]', '[Test analysis]', '[Outdoor break]', '[List next week focus areas]'],
        ['Sunday', '[Light revision - 9:00 AM to 10:00 AM]', '[Plan next week - 6:00 PM to 6:45 PM]', '[Weekly review]', '[Rest and reset]', '[Set realistic goals]']
      ]
    },
    {
      id: 'detailed-weekly-plan',
      label: 'Detailed Weekly Plan',
      intro: 'Use this detailed planner when preparing for exams and tracking outcomes by subject and session.',
      columns: [
        'Day',
        'Study Block 1',
        'Study Block 2',
        'Study Block 3',
        'Revision Block',
        'Break / Rest Block',
        'Priority Subject',
        'Daily Outcome / Notes'
      ],
      rows: [
        ['Monday', '[Math concepts]', '[Physics practice]', '[English reading]', '[Revise weak formulas]', '[15-min break between sessions]', '[Math]', '[Complete 30 practice problems]'],
        ['Tuesday', '[Chemistry theory]', '[Biology notes]', '[Math worksheet]', '[Revise reaction charts]', '[20-min evening break]', '[Chemistry]', '[Summarize one chapter]'],
        ['Wednesday', '[Physics numericals]', '[English writing]', '[Chemistry MCQs]', '[Revise difficult questions]', '[10-min eye break + stretch]', '[Physics]', '[Fix mistakes from Tuesday]'],
        ['Thursday', '[Biology diagrams]', '[Math timed practice]', '[Chemistry revision]', '[Flashcard revision]', '[Short walk + hydration]', '[Biology]', '[Improve retention on diagrams]'],
        ['Friday', '[English grammar]', '[Physics concepts]', '[Math assignment]', '[Weekly recap notes]', '[Screen-free 20 minutes]', '[Physics]', '[Finish all pending tasks]'],
        ['Saturday', '[Full mock test]', '[Mock analysis]', '[Weak topic repair]', '[Error notebook revision]', '[Longer rest block (30 mins)]', '[Weakest subject]', '[Track score and errors]'],
        ['Sunday', '[Light review]', '[Next week planning]', '[Optional backlog clear]', '[Weekly summary revision]', '[Rest / hobby time]', '[Revision strategy]', '[Set next week targets]']
      ]
    }
  ];

  const switcher = document.getElementById('plannerModeSwitcher');
  const preview = document.getElementById('plannerPreview');
  const feedbackNode = document.getElementById('plannerTemplateFeedback');
  const copyButton = document.getElementById('copyPlannerTemplate');
  const printButton = document.getElementById('printPlannerTemplate');
  const resetButton = document.getElementById('resetPlannerTemplate');

  let activeModeId = plannerModes[0].id;

  const getActiveMode = () => plannerModes.find((mode) => mode.id === activeModeId) || plannerModes[0];

  const setFeedback = (message, isError = false) => window.ToolShalaTemplateFeedback?.setFeedback(feedbackNode, message, isError, 2800);

  const buildEditableCell = (value) => `<td><div class="editable-block planner-cell" contenteditable="true">${value}</div></td>`;

  const renderPlanner = () => {
    if (!preview) return;
    const mode = getActiveMode();

    const headMarkup = mode.columns.map((column) => `<th>${column}</th>`).join('');
    const bodyMarkup = mode.rows
      .map((row) => `<tr>${row.map((cellText) => buildEditableCell(cellText)).join('')}</tr>`)
      .join('');

    preview.innerHTML = `
      <section class="planner-sheet" data-planner-mode="${mode.id}">
        <h2>${mode.label}</h2>
        <p>${mode.intro}</p>
        <div class="planner-table-wrap">
          <table class="planner-table" aria-label="${mode.label}">
            <thead><tr>${headMarkup}</tr></thead>
            <tbody>${bodyMarkup}</tbody>
          </table>
        </div>
      </section>
    `;
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = plannerModes
      .map((mode) => {
        const activeClass = mode.id === activeModeId ? 'active' : '';
        return `<button type="button" class="filter-btn ${activeClass}" data-planner-mode="${mode.id}">${mode.label}</button>`;
      })
      .join('');

    switcher.querySelectorAll('[data-planner-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        const selectedMode = button.getAttribute('data-planner-mode');
        if (!plannerModes.some((mode) => mode.id === selectedMode)) return;
        activeModeId = selectedMode;
        renderPlanner();
        renderSwitcher();
      });
    });
  };

  const buildCopyText = () => {
    const mode = getActiveMode();
    const rows = Array.from(preview.querySelectorAll('tbody tr'));
    const header = mode.columns.join(' | ');
    const body = rows
      .map((row) => Array.from(row.querySelectorAll('.planner-cell')).map((cell) => cell.textContent.trim()).join(' | '))
      .join('\n');

    return `${mode.label}\n${mode.intro}\n\n${header}\n${body}`.trim();
  };

  const copyPlannerText = async () => {
    try {
      await navigator.clipboard.writeText(buildCopyText());
      setFeedback('Planner structure copied. Paste into notes, docs, or chats.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from the planner.', true);
    }
  };

  const resetActivePlanner = () => {
    renderPlanner();
    setFeedback('Planner reset to default structure for selected version.');
  };

  const setPlannerData = (plannerPayload) => {
    if (!plannerPayload || !Array.isArray(plannerPayload.rows) || !Array.isArray(plannerPayload.columns)) {
      return false;
    }

    const targetMode = plannerModes.find((mode) => mode.id === activeModeId);
    if (!targetMode) return false;

    targetMode.columns = plannerPayload.columns;
    targetMode.rows = plannerPayload.rows;
    if (typeof plannerPayload.intro === 'string' && plannerPayload.intro.trim()) {
      targetMode.intro = plannerPayload.intro;
    }
    renderPlanner();
    return true;
  };

  window.ToolShalaWeeklyPlannerAPI = {
    getActiveMode,
    setPlannerData
  };

  renderSwitcher();
  renderPlanner();

  copyButton?.addEventListener('click', copyPlannerText);
  printButton?.addEventListener('click', () => window.print());
  resetButton?.addEventListener('click', resetActivePlanner);
});
