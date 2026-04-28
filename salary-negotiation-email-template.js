document.addEventListener('DOMContentLoaded', () => {
  const salaryVersions = [
    {
      id: 'soft-negotiation',
      label: 'Soft Negotiation',
      values: {
        subject: 'Subject: Offer Discussion for [Role] - [Your Name]',
        greeting: 'Dear [Hiring Manager Name],',
        appreciation: 'Thank you for sharing the offer and for the opportunity to join [Company Name]. I am genuinely excited about this role and the team.',
        offer: 'I appreciate the proposed compensation package of [Current Offer Amount].',
        discussion: 'I wanted to check if there is flexibility to discuss the base compensation, considering my expected range of [Expected Range].',
        justification: 'Based on my skills in [Skill 1], [Skill 2], and relevant project/internship outcomes, along with current market benchmarks for this role, I believe this range would be a fair alignment.',
        closing: 'I remain very interested in the role and would be happy to discuss this further. Thank you again for your time and consideration.\n\nBest regards,\n[Your Name]'
      }
    },
    {
      id: 'confident-negotiation',
      label: 'Confident Negotiation',
      values: {
        subject: 'Subject: Compensation Discussion - [Role] Offer | [Your Name]',
        greeting: 'Hello [Hiring Manager Name],',
        appreciation: 'Thank you for offering me the [Role] position at [Company Name]. I am excited about contributing to your team and delivering strong outcomes.',
        offer: 'I have reviewed the offer details, including the compensation package of [Current Offer Amount].',
        discussion: 'Before finalizing, I would like to request a revision of the base salary to [Expected Amount/Range].',
        justification: 'This request is based on my relevant capabilities in [Skill 1], [Skill 2], and [Skill 3], plus practical experience from [Project/Internship], and the current market range for similar roles.',
        closing: 'I am confident I can add value quickly in this role and would appreciate your consideration of this request. I look forward to your response.\n\nSincerely,\n[Your Name]'
      }
    }
  ];

  const fields = Array.from(document.querySelectorAll('[data-salary-field]'));
  const switcher = document.getElementById('salaryVersionSwitcher');
  const feedbackNode = document.getElementById('salaryTemplateFeedback');
  const copyButton = document.getElementById('copySalaryTemplate');
  const printButton = document.getElementById('printSalaryTemplate');
  const resetButton = document.getElementById('resetSalaryTemplate');
  let activeVersionId = salaryVersions[0].id;

  const fieldOrder = ['subject', 'greeting', 'appreciation', 'offer', 'discussion', 'justification', 'closing'];

  const getActiveVersion = () => salaryVersions.find((version) => version.id === activeVersionId) || salaryVersions[0];

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
      const key = field.getAttribute('data-salary-field');
      field.textContent = values[key] || '';
    });
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = salaryVersions
      .map((version) => {
        const activeClass = version.id === activeVersionId ? 'active' : '';
        return `<button type="button" class="filter-btn ${activeClass}" data-salary-version="${version.id}">${version.label}</button>`;
      })
      .join('');

    switcher.querySelectorAll('[data-salary-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const versionId = button.getAttribute('data-salary-version');
        const selectedVersion = salaryVersions.find((version) => version.id === versionId);
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const buildSalaryText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-salary-field');
      values[key] = field.textContent.trim();
    });

    return fieldOrder
      .map((key) => values[key] || '')
      .filter(Boolean)
      .join('\n\n')
      .trim();
  };

  const copySalaryText = async () => {
    try {
      await navigator.clipboard.writeText(buildSalaryText());
      setFeedback('Salary negotiation email copied. Personalize before sending.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from the preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Template reset to selected version defaults.');
  };

  const setNegotiationData = (payload) => {
    if (!payload || typeof payload !== 'object') return false;
    const targetVersion = salaryVersions.find((version) => version.id === activeVersionId);
    if (!targetVersion) return false;

    fieldOrder.forEach((key) => {
      if (typeof payload[key] === 'string' && payload[key].trim()) {
        targetVersion.values[key] = payload[key].trim();
      }
    });

    hydrateFields(targetVersion.values);
    return true;
  };

  window.ToolShalaSalaryNegotiationTemplateAPI = {
    getActiveVersion,
    setNegotiationData
  };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);

  copyButton?.addEventListener('click', copySalaryText);
  printButton?.addEventListener('click', () => window.print());
  resetButton?.addEventListener('click', resetActiveVersion);
});
