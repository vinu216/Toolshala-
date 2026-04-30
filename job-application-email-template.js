document.addEventListener('DOMContentLoaded', () => {
  const jobVersions = [
    {
      id: 'fresher-job-application',
      label: 'Fresher Job Application Email',
      values: {
        subject: 'Subject: Application for [Job Role] - [Your Name]',
        greeting: 'Dear [Hiring Manager Name],',
        intro: 'My name is [Your Name], and I am a [Degree/Branch] graduate from [College Name]. I am writing to apply for the [Job Role] position at [Company Name].',
        role: 'I found this opening on [Job Portal/Company Careers Page] and I am excited to be considered for the [Job Role] opportunity.',
        skills: 'I have built practical skills in [Skill 1], [Skill 2], and [Skill 3]. In my project [Project Name], I [specific contribution], which helped me strengthen [relevant outcome].',
        interest: 'I admire [Company Name] for its work in [domain/product/value], and I would be grateful for a chance to contribute while learning from your team.',
        closing: 'Please find my resume attached for your review. Thank you for your time and consideration.\n\nSincerely,\n[Your Name]\n[Phone Number] | [Email Address]'
      }
    },
    {
      id: 'professional-job-application',
      label: 'Professional Job Application Email',
      values: {
        subject: 'Subject: Application for [Job Role] Position - [Your Name]',
        greeting: 'Respected [Hiring Manager Name],',
        intro: 'I hope you are doing well. I am [Your Name], and I am writing to submit my application for the [Job Role] position at [Company Name].',
        role: 'With a strong foundation in [field/technology], I believe my profile aligns well with the expectations of this role.',
        skills: 'My experience includes [Project/Internship], where I worked on [task] and delivered [result]. I am confident in using [Skill/Tool 1], [Skill/Tool 2], and [Skill/Tool 3] for practical outcomes.',
        interest: 'I am particularly interested in [Company Name] because of your work in [specific area], and I am eager to contribute to your team\'s goals.',
        closing: 'I have attached my resume for your kind review. I would appreciate the opportunity to discuss my fit for this role.\n\nRegards,\n[Your Name]\n[LinkedIn Profile] | [Contact Number]'
      }
    },
    {
      id: 'short-direct-application',
      label: 'Short Direct Application Email',
      values: {
        subject: 'Subject: Applying for [Job Role] - [Your Name]',
        greeting: 'Hello [Hiring Manager Name],',
        intro: 'I am [Your Name], a fresher in [Degree/Domain], and I am applying for the [Job Role] opening at [Company Name].',
        role: 'I am highly interested in this opportunity and believe my profile matches the role requirements.',
        skills: 'I have hands-on experience with [Skill 1], [Skill 2], and [Skill 3] through projects such as [Project Name].',
        interest: 'I would be excited to contribute and grow with your team.',
        closing: 'Resume attached for your consideration. Thank you.\n\nBest regards,\n[Your Name]'
      }
    }
  ];

  const fieldOrder = ['subject', 'greeting', 'intro', 'role', 'skills', 'interest', 'closing'];
  const fields = Array.from(document.querySelectorAll('[data-job-field]'));
  const switcher = document.getElementById('jobExampleSwitcher');
  const feedbackNode = document.getElementById('jobTemplateFeedback');
  const copyButton = document.getElementById('copyJobTemplate');
  const printButton = document.getElementById('printJobTemplate');
  const resetButton = document.getElementById('resetJobTemplate');
  let activeVersionId = jobVersions[0].id;

  const getActiveVersion = () => jobVersions.find((v) => v.id === activeVersionId) || jobVersions[0];

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
      const key = field.getAttribute('data-job-field');
      field.textContent = values[key] || '';
    });
  };

  const buildJobEmailText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-job-field');
      values[key] = field.textContent.trim();
    });

    return fieldOrder.map((key) => values[key] || '').filter(Boolean).join('\n\n').trim();
  };

  const downloadJobEmailText = () => {
    const slug = getActiveVersion().label.toLowerCase().replace(/\s+/g, '-');
    const blob = new Blob([buildJobEmailText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `job-application-email-${slug}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = jobVersions
      .map((version) => `<button type="button" class="filter-btn ${version.id === activeVersionId ? 'active' : ''}" data-job-version="${version.id}">${version.label}</button>`)
      .join('');

    switcher.querySelectorAll('[data-job-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const versionId = button.getAttribute('data-job-version');
        const selectedVersion = jobVersions.find((version) => version.id === versionId);
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const copyJobEmailText = async () => {
    try {
      await navigator.clipboard.writeText(buildJobEmailText());
      setFeedback('Job application email copied. Personalize and send confidently.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from the preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Template reset to selected version defaults.');
  };

  const setJobEmailData = (payload) => {
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

  window.ToolShalaJobApplicationTemplateAPI = {
    getActiveVersion,
    buildJobEmailText,
    setJobEmailData
  };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);

  copyButton?.addEventListener('click', copyJobEmailText);
  printButton?.addEventListener('click', () => {
    downloadJobEmailText();
    window.print();
  });
  resetButton?.addEventListener('click', resetActiveVersion);
});
