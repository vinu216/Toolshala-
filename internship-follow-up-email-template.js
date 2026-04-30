document.addEventListener('DOMContentLoaded', () => {
  const followupVersions = [
    {
      id: 'short-followup',
      label: 'Short Follow-Up Email',
      values: {
        subject: 'Subject: Follow-Up on Internship Application - [Your Name]',
        greeting: 'Dear [Hiring Manager Name],',
        reminder: 'I hope you are doing well. I applied for the [Internship Role] position on [Application Date] and wanted to follow up regarding my application status.',
        interest: 'I remain very interested in this opportunity and would be excited to contribute to [Company Name] through this internship role.',
        question: 'Could you kindly let me know if there are any updates on the selection process?',
        closing: 'Thank you for your time and consideration.',
        signature: 'Best regards,\n[Your Name]\n[Phone Number]\n[Email Address]'
      }
    },
    {
      id: 'polite-detailed-followup',
      label: 'Polite Detailed Follow-Up',
      values: {
        subject: 'Subject: Polite Follow-Up Regarding [Internship Role] Application',
        greeting: 'Respected [Hiring Manager Name],',
        reminder: 'I hope this message finds you well. I had submitted my application for the [Internship Role] at [Company Name] on [Application Date], and I wanted to gently follow up regarding its progress.',
        interest: 'I am genuinely interested in this internship because of your team\'s work in [domain/project area], and I would value the opportunity to learn and contribute.',
        question: 'If possible, could you please share any update on the next steps or expected timeline for shortlisting?',
        closing: 'I appreciate your time and understand your team may be handling many applications.',
        signature: 'Sincerely,\n[Your Name]\n[College Name] | [Course / Year]\n[Phone Number] | [Email Address]'
      }
    },
    {
      id: 'friendly-professional-followup',
      label: 'Friendly Professional Follow-Up',
      values: {
        subject: 'Subject: Checking In - [Internship Role] Application',
        greeting: 'Hello [Hiring Manager Name],',
        reminder: 'Just a quick check-in regarding my application for the [Internship Role] position submitted on [Application Date].',
        interest: 'I am still very enthusiastic about the opportunity to join [Company Name] and support your team with my skills in [skill area].',
        question: 'Please let me know if there is any additional information I can share to support my application.',
        closing: 'Thank you again for your time. I look forward to hearing from you.',
        signature: 'Warm regards,\n[Your Name]\n[LinkedIn Profile] | [Phone Number]'
      }
    }
  ];

  const fieldOrder = ['subject', 'greeting', 'reminder', 'interest', 'question', 'closing', 'signature'];
  const fields = Array.from(document.querySelectorAll('[data-followup-field]'));
  const switcher = document.getElementById('followupExampleSwitcher');
  const feedbackNode = document.getElementById('followupTemplateFeedback');
  const copyButton = document.getElementById('copyFollowupTemplate');
  const printButton = document.getElementById('printFollowupTemplate');
  const resetButton = document.getElementById('resetFollowupTemplate');
  let activeVersionId = followupVersions[0].id;

  const getActiveVersion = () => followupVersions.find((v) => v.id === activeVersionId) || followupVersions[0];

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
      const key = field.getAttribute('data-followup-field');
      field.textContent = values[key] || '';
    });
  };

  const buildFollowupText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-followup-field');
      values[key] = field.textContent.trim();
    });

    return fieldOrder.map((key) => values[key] || '').filter(Boolean).join('\n\n').trim();
  };

  const downloadFollowupText = () => {
    const slug = getActiveVersion().label.toLowerCase().replace(/\s+/g, '-');
    const blob = new Blob([buildFollowupText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `internship-followup-${slug}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = followupVersions
      .map((version) => `<button type="button" class="filter-btn ${version.id === activeVersionId ? 'active' : ''}" data-followup-version="${version.id}">${version.label}</button>`)
      .join('');

    switcher.querySelectorAll('[data-followup-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const versionId = button.getAttribute('data-followup-version');
        const selectedVersion = followupVersions.find((version) => version.id === versionId);
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const copyFollowupText = async () => {
    try {
      await navigator.clipboard.writeText(buildFollowupText());
      setFeedback('Follow-up email copied. Personalize it before sending.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from the preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Template reset to selected version defaults.');
  };

  const setFollowupData = (payload) => {
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

  window.ToolShalaInternshipFollowupTemplateAPI = {
    getActiveVersion,
    buildFollowupText,
    setFollowupData
  };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);

  copyButton?.addEventListener('click', copyFollowupText);
  printButton?.addEventListener('click', () => {
    downloadFollowupText();
    window.print();
  });
  resetButton?.addEventListener('click', resetActiveVersion);
});
