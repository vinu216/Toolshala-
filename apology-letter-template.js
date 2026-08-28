document.addEventListener('DOMContentLoaded', () => {
  const apologyVersions = [
    {
      id: 'school-apology-letter',
      label: 'School Apology Letter',
      values: {
        sender: '[Student Name]\nClass [Class/Section], Roll No. [Roll Number]\n[School Name]',
        date: '[Date]',
        recipient: 'The Principal\n[School Name]\n[City]',
        subject: 'Subject: Apology Letter for [Reason/Incident]',
        opening: 'Respected Sir/Madam,\n\nI sincerely apologize for [incident].',
        explanation: 'The incident occurred due to [brief reason]. I understand that this caused inconvenience and concern.',
        responsibility: 'I accept responsibility for my action and understand that it did not meet expected discipline and conduct.',
        assurance: 'I assure you this will not be repeated. I will be more careful and responsible going forward.',
        closing: 'Thank you for your understanding.\n\nYours obediently,\n[Student Name]\n[Parent/Guardian Signature if required]'
      }
    },
    {
      id: 'college-apology-letter',
      label: 'College Apology Letter',
      values: {
        sender: '[Your Name]\n[Course / Semester]\n[College Name]\n[Enrollment Number]',
        date: '[Date]',
        recipient: 'The Head of Department\n[Department Name]\n[College Name]',
        subject: 'Subject: Apology for [Issue/Incident]',
        opening: 'Respected Sir/Madam,\n\nI am writing to sincerely apologize for [incident].',
        explanation: 'This happened because of [brief explanation]. I realize this affected academic discipline and communication.',
        responsibility: 'I take full responsibility for this matter and understand the importance of maintaining expected standards.',
        assurance: 'I assure you that I have taken corrective steps and this will not happen again.',
        closing: 'Thank you for your time and consideration.\n\nSincerely,\n[Your Name]\n[Contact Number]'
      }
    },
    {
      id: 'office-apology-letter',
      label: 'Office Apology Email/Letter',
      values: {
        sender: '[Your Name]\n[Job Title / Department]\n[Company Name]',
        date: '[Date]',
        recipient: '[Manager/Recipient Name]\n[Designation]\n[Company Name]',
        subject: 'Subject: Apology for [Issue/Delay/Error]',
        opening: 'Dear [Manager/Recipient Name],\n\nPlease accept my sincere apology for [issue].',
        explanation: 'The issue occurred due to [brief explanation]. I understand the impact this had on the team/workflow.',
        responsibility: 'I take complete responsibility for this and acknowledge that I should have handled it better.',
        assurance: 'I have already initiated corrective steps: [step 1], [step 2]. I will ensure better communication and prevention going forward.',
        closing: 'Thank you for your understanding.\n\nRegards,\n[Your Name]\n[Employee ID]'
      }
    }
  ];

  const fields = Array.from(document.querySelectorAll('[data-apology-field]'));
  const switcher = document.getElementById('apologyVersionSwitcher');
  const feedbackNode = document.getElementById('apologyTemplateFeedback');
  const copyButton = document.getElementById('copyApologyTemplate');
  const printButton = document.getElementById('printApologyTemplate');
  const resetButton = document.getElementById('resetApologyTemplate');
  let activeVersionId = apologyVersions[0].id;

  const fieldOrder = ['sender', 'date', 'recipient', 'subject', 'opening', 'explanation', 'responsibility', 'assurance', 'closing'];

  const getActiveVersion = () => apologyVersions.find((version) => version.id === activeVersionId) || apologyVersions[0];

  const setFeedback = (message, isError = false) => window.ToolShalaTemplateFeedback?.setFeedback(feedbackNode, message, isError, 2600);

  const hydrateFields = (values) => {
    fields.forEach((field) => {
      const key = field.getAttribute('data-apology-field');
      field.textContent = values[key] || '';
    });
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = apologyVersions
      .map((version) => {
        const activeClass = version.id === activeVersionId ? 'active' : '';
        return `<button type="button" class="filter-btn ${activeClass}" data-apology-version="${version.id}">${version.label}</button>`;
      })
      .join('');

    switcher.querySelectorAll('[data-apology-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const versionId = button.getAttribute('data-apology-version');
        const selectedVersion = apologyVersions.find((version) => version.id === versionId);
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const buildApologyText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-apology-field');
      values[key] = field.textContent.trim();
    });

    return fieldOrder
      .map((key) => values[key] || '')
      .filter(Boolean)
      .join('\n\n')
      .trim();
  };

  const copyApologyText = async () => {
    try {
      await navigator.clipboard.writeText(buildApologyText());
      setFeedback('Apology letter copied. Personalize before sending.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from the preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Template reset to selected version defaults.');
  };

  const setApologyData = (payload) => {
    if (!payload || typeof payload !== 'object') return false;
    const targetVersion = apologyVersions.find((version) => version.id === activeVersionId);
    if (!targetVersion) return false;

    fieldOrder.forEach((key) => {
      if (typeof payload[key] === 'string' && payload[key].trim()) {
        targetVersion.values[key] = payload[key].trim();
      }
    });

    hydrateFields(targetVersion.values);
    return true;
  };

  window.ToolShalaApologyLetterTemplateAPI = {
    getActiveVersion,
    setApologyData
  };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);

  copyButton?.addEventListener('click', copyApologyText);
  printButton?.addEventListener('click', () => window.print());
  resetButton?.addEventListener('click', resetActiveVersion);
});
