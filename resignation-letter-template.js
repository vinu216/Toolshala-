document.addEventListener('DOMContentLoaded', () => {
  const resignationVersions = [
    {
      id: 'formal-resignation-letter',
      label: 'Formal Resignation Letter',
      values: {
        sender: '[Your Name]\n[Job Title / Department]\n[Company Name]',
        date: '[Date]',
        recipient: '[Manager Name]\n[Manager Designation]\n[Company Name]',
        subject: 'Subject: Formal Resignation - [Your Name]',
        opening: 'Dear [Manager Name],',
        statement: 'Please accept this letter as formal notice of my resignation from my position as [Your Job Title] at [Company Name].',
        lastDay: 'As per my notice period, my last working day will be [Last Working Date].',
        gratitude: 'I sincerely appreciate the opportunities, guidance, and support I have received during my time with the organization.',
        transition: 'I am committed to ensuring a smooth handover and will be happy to assist in the transition process during my notice period.',
        closing: 'Thank you once again for your support.\n\nSincerely,\n[Your Name]\n[Employee ID]'
      }
    },
    {
      id: 'short-resignation-letter',
      label: 'Short Resignation Letter',
      values: {
        sender: '[Your Name]\n[Department]\n[Company Name]',
        date: '[Date]',
        recipient: '[Manager Name]\n[Company Name]',
        subject: 'Subject: Resignation Notice',
        opening: 'Dear [Manager Name],',
        statement: 'I am writing to resign from my role at [Company Name].',
        lastDay: 'My last working day will be [Last Working Date].',
        gratitude: 'Thank you for the support and opportunities provided to me.',
        transition: 'I will complete pending responsibilities and support the handover process.',
        closing: 'Regards,\n[Your Name]'
      }
    },
    {
      id: 'internship-resignation-letter',
      label: 'Internship Resignation Letter',
      values: {
        sender: '[Your Name]\nIntern - [Team/Department]\n[Company Name]',
        date: '[Date]',
        recipient: '[Supervisor Name]\n[Designation]\n[Company Name]',
        subject: 'Subject: Internship Resignation Letter - [Your Name]',
        opening: 'Respected [Supervisor Name],',
        statement: 'I am writing to formally resign from my internship position at [Company Name] due to [brief reason].',
        lastDay: 'My last working day as an intern will be [Last Working Date].',
        gratitude: 'I am grateful for the guidance, learning opportunities, and practical exposure I received during this internship.',
        transition: 'I will ensure proper handover of assigned tasks and remain available for any required support during transition.',
        closing: 'Thank you for your understanding.\n\nYours sincerely,\n[Your Name]\n[College Name]'
      }
    }
  ];

  const fieldOrder = ['sender', 'date', 'recipient', 'subject', 'opening', 'statement', 'lastDay', 'gratitude', 'transition', 'closing'];
  const fields = Array.from(document.querySelectorAll('[data-resignation-field]'));
  const switcher = document.getElementById('resignationVersionSwitcher');
  const feedbackNode = document.getElementById('resignationTemplateFeedback');
  const copyButton = document.getElementById('copyResignationTemplate');
  const printButton = document.getElementById('printResignationTemplate');
  const resetButton = document.getElementById('resetResignationTemplate');
  let activeVersionId = resignationVersions[0].id;

  const getActiveVersion = () => resignationVersions.find((v) => v.id === activeVersionId) || resignationVersions[0];

  const setFeedback = (message, isError = false) => window.ToolShalaTemplateFeedback?.setFeedback(feedbackNode, message, isError, 2600);

  const hydrateFields = (values) => {
    fields.forEach((field) => {
      const key = field.getAttribute('data-resignation-field');
      field.textContent = values[key] || '';
    });
  };

  const buildResignationText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-resignation-field');
      values[key] = field.textContent.trim();
    });
    return fieldOrder.map((key) => values[key] || '').filter(Boolean).join('\n\n').trim();
  };

  const downloadResignationText = () => {
    const slug = getActiveVersion().label.toLowerCase().replace(/\s+/g, '-');
    const blob = new Blob([buildResignationText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `resignation-letter-${slug}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = resignationVersions.map((version) => `<button type="button" class="filter-btn ${version.id === activeVersionId ? 'active' : ''}" data-resignation-version="${version.id}">${version.label}</button>`).join('');
    switcher.querySelectorAll('[data-resignation-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const selectedVersion = resignationVersions.find((version) => version.id === button.getAttribute('data-resignation-version'));
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const copyResignationText = async () => {
    try {
      await navigator.clipboard.writeText(buildResignationText());
      setFeedback('Resignation letter copied. Personalize before sharing.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Template reset to selected version defaults.');
  };

  const setResignationData = (payload) => {
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

  window.ToolShalaResignationTemplateAPI = { getActiveVersion, buildResignationText, setResignationData };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);
  copyButton?.addEventListener('click', copyResignationText);
  printButton?.addEventListener('click', () => {
    downloadResignationText();
    window.print();
  });
  resetButton?.addEventListener('click', resetActiveVersion);
});
