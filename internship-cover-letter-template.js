document.addEventListener('DOMContentLoaded', () => {
  const coverVersions = [
    {
      id: 'general-internship',
      label: 'General Internship',
      values: {
        applicant:
          '[Your Name]\n[Phone Number] | [Email Address]\n[LinkedIn/GitHub] | [City, State]',
        date: '[Date]',
        recipient: '[Recipient Name]\n[Designation]\n[Company Name]\n[Company Location]',
        subject: 'Subject: Application for Internship Opportunity - [Your Name]',
        opening:
          'Dear [Recipient Name],\n\nI am writing to express my interest in internship opportunities at [Company Name]. I am currently a [Year] student pursuing [Degree] at [College Name].',
        interest:
          'I am particularly interested in your organization because of its work in [domain/team/product area]. I am eager to learn in a professional environment and contribute to meaningful projects.',
        skills:
          'Through my academic projects and practical coursework, I have built skills in [Skill 1], [Skill 2], and [Skill 3]. In my [project name], I [specific contribution] which resulted in [outcome/impact].',
        closing:
          'I would be grateful for an opportunity to discuss how I can contribute as an intern. Thank you for your time and consideration.',
        signature: 'Sincerely,\n[Your Name]'
      }
    },
    {
      id: 'role-specific-internship',
      label: 'Role-Specific Internship',
      values: {
        applicant:
          '[Your Name]\n[Phone Number] | [Email Address]\n[LinkedIn/GitHub] | [City, State]',
        date: '[Date]',
        recipient: '[Hiring Manager Name]\n[Role], [Company Name]\n[Company Location]',
        subject: 'Subject: Application for [Role] Internship - [Your Name]',
        opening:
          'Dear [Hiring Manager Name],\n\nI am excited to apply for the [Role] Internship at [Company Name]. I am a [Year] [Degree] student at [College Name], and I have been actively building relevant skills for this role.',
        interest:
          'This internship interests me because [Company Name] is doing impactful work in [specific area]. I value your approach to [specific value/product], and I would love to contribute while learning from your team.',
        skills:
          'I have hands-on experience with [Skill/Tool 1], [Skill/Tool 2], and [Skill/Tool 3]. In my [project/internship], I [task], which improved [result/metric]. This experience prepared me to support your team from day one.',
        closing:
          'Thank you for reviewing my application. I would appreciate the opportunity to discuss my fit for the [Role] Internship role.',
        signature: 'Best regards,\n[Your Name]'
      }
    }
  ];

  const fields = Array.from(document.querySelectorAll('[data-cover-field]'));
  const switcher = document.getElementById('coverExampleSwitcher');
  const feedbackNode = document.getElementById('coverTemplateFeedback');
  const copyButton = document.getElementById('copyCoverTemplate');
  const printButton = document.getElementById('printCoverTemplate');
  const resetButton = document.getElementById('resetCoverTemplate');
  let activeVersionId = coverVersions[0].id;

  const getActiveVersion = () => coverVersions.find((version) => version.id === activeVersionId) || coverVersions[0];

  const setFeedback = (message, isError = false) => window.ToolShalaTemplateFeedback?.setFeedback(feedbackNode, message, isError, 2500);

  const hydrateFields = (values) => {
    fields.forEach((field) => {
      const key = field.getAttribute('data-cover-field');
      field.textContent = values[key] || '';
    });
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = coverVersions
      .map((version) => {
        const activeClass = version.id === activeVersionId ? 'active' : '';
        return `<button type="button" class="filter-btn ${activeClass}" data-cover-version="${version.id}">${version.label}</button>`;
      })
      .join('');

    switcher.querySelectorAll('[data-cover-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const versionId = button.getAttribute('data-cover-version');
        const selectedVersion = coverVersions.find((version) => version.id === versionId);
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const buildCoverText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-cover-field');
      values[key] = field.textContent.trim();
    });

    return [
      values.applicant,
      '',
      values.date,
      '',
      values.recipient,
      '',
      values.subject,
      '',
      values.opening,
      '',
      values.interest,
      '',
      values.skills,
      '',
      values.closing,
      '',
      values.signature
    ]
      .join('\n')
      .trim();
  };

  const copyCoverText = async () => {
    if (!buildCoverText().trim()) {
      setFeedback('Please add letter content before copying.', true);
      return;
    }
    try {
      await navigator.clipboard.writeText(buildCoverText());
      setFeedback('Cover letter copied. Personalize it before sending.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from the preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Template reset to selected version defaults.');
  };

  const setCoverData = (payload) => {
    if (!payload || typeof payload !== 'object') return false;
    const target = getActiveVersion();
    if (!target) return false;
    let updated = false;

    ['applicant', 'date', 'recipient', 'subject', 'opening', 'interest', 'skills', 'closing', 'signature'].forEach((key) => {
      if (typeof payload[key] === 'string' && payload[key].trim()) {
        target.values[key] = payload[key].trim();
        updated = true;
      }
    });

    if (updated) hydrateFields(target.values);
    return updated;
  };

  window.ToolShalaCoverLetterTemplateAPI = {
    getActiveVersion,
    getCoverText: buildCoverText,
    setCoverData
  };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);

  copyButton?.addEventListener('click', copyCoverText);
  printButton?.addEventListener('click', () => window.print());
  resetButton?.addEventListener('click', resetActiveVersion);
});
