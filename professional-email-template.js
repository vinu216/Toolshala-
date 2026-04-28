document.addEventListener('DOMContentLoaded', () => {
  const emailFormats = [
    {
      id: 'internship-application',
      label: 'Internship Application',
      values: {
        subject: 'Application for [Role] Internship - [Your Name]',
        greeting: 'Dear [Recipient Name],',
        opening: 'I hope you are doing well. I am [Your Name], a [Year/Program] student at [College Name].',
        body:
          'I am writing to apply for the [Role] internship at [Company Name]. Through my [project/internship/coursework], I have built practical skills in [Skill 1], [Skill 2], and [Skill 3].\n\nI would be grateful for the opportunity to contribute to your team and learn from real-world projects. I have attached my resume for your review.',
        closing: 'Thank you for your time and consideration. I look forward to hearing from you.',
        signature: 'Best regards,\n[Your Name]\n[Phone Number] | [LinkedIn URL]'
      }
    },
    {
      id: 'follow-up-email',
      label: 'Follow-up Email',
      values: {
        subject: 'Follow-up on [Role] Application - [Your Name]',
        greeting: 'Hello [Recipient Name],',
        opening: 'I hope you are doing well. I wanted to follow up on my application for the [Role] position submitted on [Date].',
        body:
          'I remain very interested in this opportunity at [Company Name]. My experience in [relevant skill/project] aligns with the role, and I would appreciate the chance to discuss how I can contribute.\n\nPlease let me know if any additional details are required from my side.',
        closing: 'Thank you for your time. I appreciate your consideration.',
        signature: 'Sincerely,\n[Your Name]\n[Phone Number] | [Email Address]'
      }
    },
    {
      id: 'professional-request',
      label: 'Professional Request',
      values: {
        subject: 'Request for [Topic/Support] - [Your Name]',
        greeting: 'Respected [Recipient Name],',
        opening: 'I hope you are doing well. I am [Your Name], a [Year/Department] student from [College Name].',
        body:
          'I am writing to request your guidance regarding [specific request]. I would be thankful if you could share your inputs on [specific point] or suggest the next steps.\n\nYour support will help me make better decisions for my academic and career progress.',
        closing: 'Thank you in advance for your time and support.',
        signature: 'Warm regards,\n[Your Name]\n[Department / Roll Number]\n[Phone Number]'
      }
    }
  ];

  const fields = Array.from(document.querySelectorAll('[data-email-field]'));
  const switcher = document.getElementById('emailExampleSwitcher');
  const feedbackNode = document.getElementById('emailTemplateFeedback');
  const copyButton = document.getElementById('copyEmailTemplate');
  const printButton = document.getElementById('printEmailTemplate');
  const resetButton = document.getElementById('resetEmailTemplate');
  let activeFormatId = emailFormats[0].id;

  const getActiveFormat = () => emailFormats.find((format) => format.id === activeFormatId) || emailFormats[0];

  const setFeedback = (message, isError = false) => {
    if (!feedbackNode) return;
    feedbackNode.textContent = message;
    feedbackNode.classList.remove('hidden');
    feedbackNode.classList.toggle('text-emerald-700', !isError);
    feedbackNode.classList.toggle('text-rose-700', isError);
    window.setTimeout(() => feedbackNode.classList.add('hidden'), 2500);
  };

  const hydrateFields = (values) => {
    fields.forEach((field) => {
      const key = field.getAttribute('data-email-field');
      field.textContent = values[key] || '';
    });
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = emailFormats
      .map((format) => {
        const activeClass = format.id === activeFormatId ? 'active' : '';
        return `<button type="button" class="filter-btn ${activeClass}" data-email-example="${format.id}">${format.label}</button>`;
      })
      .join('');

    switcher.querySelectorAll('[data-email-example]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-email-example');
        const selectedFormat = emailFormats.find((format) => format.id === id);
        if (!selectedFormat) return;
        activeFormatId = selectedFormat.id;
        hydrateFields(selectedFormat.values);
        renderSwitcher();
      });
    });
  };

  const buildEmailText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-email-field');
      values[key] = field.textContent.trim();
    });

    return `Subject: ${values.subject || ''}\n\n${values.greeting || ''}\n\n${values.opening || ''}\n\n${values.body || ''}\n\n${values.closing || ''}\n\n${values.signature || ''}`.trim();
  };

  const copyEmailText = async () => {
    try {
      await navigator.clipboard.writeText(buildEmailText());
      setFeedback('Email template copied. Paste and personalize before sending.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from the preview.', true);
    }
  };

  const resetActiveTemplate = () => {
    hydrateFields(getActiveFormat().values);
    setFeedback('Template reset to selected format defaults.');
  };

  renderSwitcher();
  hydrateFields(getActiveFormat().values);

  copyButton?.addEventListener('click', copyEmailText);
  printButton?.addEventListener('click', () => window.print());
  resetButton?.addEventListener('click', resetActiveTemplate);
});
