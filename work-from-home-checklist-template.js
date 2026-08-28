document.addEventListener('DOMContentLoaded', () => {
  const checklistVersions = [
    {
      id: 'simple-wfh-checklist',
      label: 'Simple WFH Checklist',
      values: {
        setup: '[ ] Clean desk and open required tools\n[ ] Check internet, charger, and headset\n[ ] Keep water and notebook ready',
        tasks: '[ ] Write top 3 priority tasks\n[ ] Complete one deep-work task before noon\n[ ] Update task progress in tracker',
        communication: '[ ] Check important messages/emails\n[ ] Share status update with team/client\n[ ] Clarify blockers early',
        breaks: '[ ] Take a short break every 90 minutes\n[ ] Stretch and rest eyes\n[ ] Have lunch away from desk',
        meetings: '[ ] Review agenda before each meeting\n[ ] Join 5 minutes early\n[ ] Note action items and owners',
        review: '[ ] Mark completed tasks\n[ ] List carry-forward items\n[ ] Plan top 3 tasks for tomorrow'
      }
    },
    {
      id: 'detailed-wfh-checklist',
      label: 'Detailed WFH Checklist',
      values: {
        setup: '[ ] Set start time and work blocks\n[ ] Open calendar, project board, and notes\n[ ] Turn on focus mode / silence distractions\n[ ] Check workspace lighting and posture setup',
        tasks: '[ ] Define top 3 outcomes for the day\n[ ] Break large tasks into smaller actions\n[ ] Batch similar tasks (emails/calls/admin)\n[ ] Track completion in task manager',
        communication: '[ ] Send morning availability update\n[ ] Respond to critical messages within planned slots\n[ ] Share ETA changes immediately\n[ ] Document key decisions in written form',
        breaks: '[ ] Take 5-10 min breaks between focus blocks\n[ ] Move or stretch at least 3 times\n[ ] Avoid screen during one break\n[ ] Hydrate throughout the day',
        meetings: '[ ] Read pre-read and align your talking points\n[ ] Keep files/links ready before joining\n[ ] Capture decisions, deadlines, and dependencies\n[ ] Send quick follow-up summary if needed',
        review: '[ ] Review completed vs planned tasks\n[ ] Note wins and blockers\n[ ] Prepare tomorrow\'s priority list\n[ ] Close work apps and end day on time'
      }
    }
  ];

  const fieldOrder = ['setup', 'tasks', 'communication', 'breaks', 'meetings', 'review'];
  const fields = Array.from(document.querySelectorAll('[data-wfh-field]'));
  const switcher = document.getElementById('wfhChecklistSwitcher');
  const feedbackNode = document.getElementById('wfhChecklistFeedback');
  const copyButton = document.getElementById('copyWfhChecklistTemplate');
  const printButton = document.getElementById('printWfhChecklistTemplate');
  const resetButton = document.getElementById('resetWfhChecklistTemplate');
  let activeVersionId = checklistVersions[0].id;

  const getActiveVersion = () => checklistVersions.find((v) => v.id === activeVersionId) || checklistVersions[0];
  const setFeedback = (message, isError = false) => window.ToolShalaTemplateFeedback?.setFeedback(feedbackNode, message, isError, 2600);

  const hydrateFields = (values) => {
    fields.forEach((field) => {
      const key = field.getAttribute('data-wfh-field');
      field.textContent = values[key] || '';
    });
  };

  const buildChecklistText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-wfh-field');
      values[key] = field.textContent.trim();
    });
    return fieldOrder.map((key) => values[key] || '').filter(Boolean).join('\n\n').trim();
  };

  const downloadChecklistText = () => {
    const slug = getActiveVersion().label.toLowerCase().replace(/\s+/g, '-');
    const blob = new Blob([buildChecklistText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `wfh-checklist-${slug}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = checklistVersions.map((version) => `<button type="button" class="filter-btn ${version.id === activeVersionId ? 'active' : ''}" data-wfh-version="${version.id}">${version.label}</button>`).join('');
    switcher.querySelectorAll('[data-wfh-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const selectedVersion = checklistVersions.find((version) => version.id === button.getAttribute('data-wfh-version'));
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const copyChecklistText = async () => {
    try {
      await navigator.clipboard.writeText(buildChecklistText());
      setFeedback('Checklist copied. Customize and use in your workflow.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Checklist reset to selected version defaults.');
  };

  const setChecklistData = (payload) => {
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

  window.ToolShalaWfhChecklistTemplateAPI = { getActiveVersion, buildChecklistText, setChecklistData };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);
  copyButton?.addEventListener('click', copyChecklistText);
  printButton?.addEventListener('click', () => {
    downloadChecklistText();
    window.print();
  });
  resetButton?.addEventListener('click', resetActiveVersion);
});
