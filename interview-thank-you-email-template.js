(() => {
  const SUBJECTS = [
    'Thank you for the interview - [Your Name]',
    'Great speaking with you today - [Role] interview',
    'Thank you - [Role] interview at [Company]'
  ];

  const VERSIONS = [
    {
      id: 'general',
      label: 'General Thank You',
      fields: {
        subject: 'Subject: Thank you for the interview - [Your Name]',
        greeting: 'Hi [Interviewer Name],',
        thanks: 'Thank you for taking the time to speak with me today.',
        reference: 'I really enjoyed our conversation about [specific topic discussed in interview].',
        roleFit: 'Learning more about the [Role] at [Company] increased my interest in contributing to your team.',
        closing: 'I appreciate your time and consideration. Please let me know if you need any additional information from me.',
        signature: 'Best regards,\n[Your Name]\n[Phone Number]\n[LinkedIn URL]'
      }
    },
    {
      id: 'internship',
      label: 'Internship Interview',
      fields: {
        subject: 'Subject: Thank you - Internship Interview - [Your Name]',
        greeting: 'Hello [Interviewer Name],',
        thanks: 'Thank you for interviewing me for the [Internship Role] position today.',
        reference: 'I especially valued your insights on [project/team/workflow discussed].',
        roleFit: 'The internship aligns well with my current learning goals in [skill/domain], and I would be excited to contribute while learning from your team.',
        closing: 'Thank you again for your time. I look forward to the possibility of working with [Company Name].',
        signature: 'Sincerely,\n[Your Name]\n[College / University]\n[Phone Number]'
      }
    },
    {
      id: 'job',
      label: 'Job Interview',
      fields: {
        subject: 'Subject: Thank you - [Role] Interview - [Your Name]',
        greeting: 'Dear [Interviewer Name],',
        thanks: 'Thank you for the opportunity to interview for the [Role] position.',
        reference: 'Our discussion around [specific business goal, responsibility, or challenge] was especially meaningful to me.',
        roleFit: 'I am confident my background in [relevant skill/project] can support your team goals, and I remain very interested in the role.',
        closing: 'Thank you again for your time and thoughtful conversation. I look forward to next steps.',
        signature: 'Kind regards,\n[Your Name]\n[Phone Number]\n[Email Address]'
      }
    }
  ];

  const switcher = document.getElementById('thankYouVersionSwitcher');
  const preview = document.getElementById('thankYouTemplatePreview');
  const feedback = document.getElementById('thankYouTemplateFeedback');
  const subjectBank = document.getElementById('thankYouSubjectBank');
  const copyBtn = document.getElementById('copyThankYouTemplate');
  const printBtn = document.getElementById('printThankYouTemplate');
  const resetBtn = document.getElementById('resetThankYouTemplate');

  let activeVersion = VERSIONS[0].id;

  const setFeedback = (message, error = false) => {
    if (!feedback) return;
    feedback.classList.remove('hidden');
    feedback.classList.toggle('text-red-600', error);
    feedback.classList.toggle('text-emerald-700', !error);
    feedback.textContent = message;
  };

  const getActive = () => VERSIONS.find((v) => v.id === activeVersion) || VERSIONS[0];

  const renderSubjects = () => {
    if (!subjectBank) return;
    subjectBank.innerHTML = SUBJECTS.map((s) => `<li>${s}</li>`).join('');
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = VERSIONS.map((v) => `<button type="button" class="example-switch-btn${v.id === activeVersion ? ' active' : ''}" data-version="${v.id}">${v.label}</button>`).join('');
    switcher.querySelectorAll('[data-version]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeVersion = btn.getAttribute('data-version') || VERSIONS[0].id;
        renderAll();
      });
    });
  };

  const renderPreview = () => {
    const { fields } = getActive();
    preview.innerHTML = `
      <div class="thank-you-email-shell">
        <p class="thank-you-line" contenteditable="true"><strong>${fields.subject}</strong></p>
        <p class="thank-you-line" contenteditable="true">${fields.greeting}</p>
        <p class="thank-you-line" contenteditable="true">${fields.thanks}</p>
        <p class="thank-you-line" contenteditable="true">${fields.reference}</p>
        <p class="thank-you-line" contenteditable="true">${fields.roleFit}</p>
        <p class="thank-you-line" contenteditable="true">${fields.closing}</p>
        <p class="thank-you-signature" contenteditable="true">${fields.signature.replace(/\n/g, '<br />')}</p>
      </div>`;
  };

  const collectText = () => {
    const lines = [...preview.querySelectorAll('[contenteditable="true"]')].map((el) => el.textContent?.trim() || '');
    return lines.join('\n\n');
  };

  const copyTemplate = async () => {
    const text = collectText();
    if (!text) {
      setFeedback('Template is empty. Please refresh and try again.', true);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setFeedback('Interview thank you email copied successfully.');
    } catch (e) {
      setFeedback('Copy failed. Please copy manually from preview.', true);
    }
  };

  const resetTemplate = () => {
    activeVersion = VERSIONS[0].id;
    renderAll();
    setFeedback('Template reset to General Thank You defaults.');
  };

  const renderAll = () => {
    renderSubjects();
    renderSwitcher();
    renderPreview();
  };

  copyBtn?.addEventListener('click', copyTemplate);
  printBtn?.addEventListener('click', () => window.print());
  resetBtn?.addEventListener('click', resetTemplate);

  renderAll();
})();
