document.addEventListener('DOMContentLoaded', () => {
  const todoVersions = [
    {
      id: 'simple-todo-list',
      label: 'Simple To-Do List',
      values: {
        today: '[ ] Complete assignment draft\n[ ] Reply to client messages\n[ ] 30 minutes revision',
        priority: '[ ] Submit project before 5 PM\n[ ] Prepare for tomorrow\'s test',
        lowPriority: '[ ] Organize desktop files\n[ ] Read one article',
        completed: '[x] Morning workout\n[x] Checked emails',
        notes: 'Keep focus on top 2 priorities before noon.'
      }
    },
    {
      id: 'detailed-todo-list',
      label: 'Detailed To-Do List',
      values: {
        today: '[ ] Plan day in 10 minutes\n[ ] Complete deep-work task\n[ ] Finish review and corrections\n[ ] Update progress tracker',
        priority: '[ ] Priority 1: Finalize internship application\n[ ] Priority 2: Complete client deliverable\n[ ] Priority 3: Practice interview questions',
        lowPriority: '[ ] Clean inbox\n[ ] Organize notes\n[ ] Backup important files',
        completed: '[x] Updated resume\n[x] Scheduled study session',
        notes: 'Do not add new tasks after 6 PM unless urgent. Move pending items to tomorrow list.'
      }
    }
  ];

  const fieldOrder = ['today', 'priority', 'lowPriority', 'completed', 'notes'];
  const fields = Array.from(document.querySelectorAll('[data-todo-field]'));
  const switcher = document.getElementById('todoSwitcher');
  const feedbackNode = document.getElementById('todoFeedback');
  const copyButton = document.getElementById('copyTodoTemplate');
  const printButton = document.getElementById('printTodoTemplate');
  const resetButton = document.getElementById('resetTodoTemplate');
  let activeVersionId = todoVersions[0].id;

  const getActiveVersion = () => todoVersions.find((v) => v.id === activeVersionId) || todoVersions[0];
  const setFeedback = (message, isError = false) => {
    if (!feedbackNode) return;
    feedbackNode.textContent = message;
    feedbackNode.classList.remove('hidden');
    feedbackNode.classList.toggle('text-emerald-700', !isError);
    feedbackNode.classList.toggle('text-rose-700', isError);
    window.setTimeout(() => feedbackNode.classList.add('hidden'), 2600);
  };

  const hydrateFields = (values) => {
    fields.forEach((field) => {
      const key = field.getAttribute('data-todo-field');
      field.textContent = values[key] || '';
    });
  };

  const buildTodoText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-todo-field');
      values[key] = field.textContent.trim();
    });
    return fieldOrder.map((key) => values[key] || '').filter(Boolean).join('\n\n').trim();
  };

  const downloadTodoText = () => {
    const slug = getActiveVersion().label.toLowerCase().replace(/\s+/g, '-');
    const blob = new Blob([buildTodoText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-list-${slug}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = todoVersions.map((version) => `<button type="button" class="filter-btn ${version.id === activeVersionId ? 'active' : ''}" data-todo-version="${version.id}">${version.label}</button>`).join('');
    switcher.querySelectorAll('[data-todo-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const selectedVersion = todoVersions.find((version) => version.id === button.getAttribute('data-todo-version'));
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const copyTodoText = async () => {
    try {
      await navigator.clipboard.writeText(buildTodoText());
      setFeedback('To-do list copied. Update and use for your day.');
    } catch {
      setFeedback('Copy failed. Please copy manually from preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('To-do list reset to selected version defaults.');
  };

  const setTodoData = (payload) => {
    if (!payload || typeof payload !== 'object') return false;
    const targetVersion = getActiveVersion();
    let updated = false;
    fieldOrder.forEach((key) => {
      if (typeof payload[key] === 'string' && payload[key].trim()) {
        targetVersion.values[key] = payload[key].trim();
        updated = true;
      }
    });
    if (updated) hydrateFields(targetVersion.values);
    return updated;
  };

  window.ToolShalaTodoListTemplateAPI = { getActiveVersion, buildTodoText, setTodoData };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);
  copyButton?.addEventListener('click', copyTodoText);
  printButton?.addEventListener('click', () => {
    downloadTodoText();
    window.print();
  });
  resetButton?.addEventListener('click', resetActiveVersion);
});
