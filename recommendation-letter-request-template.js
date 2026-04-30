document.addEventListener('DOMContentLoaded', () => {
  const recommendationVersions = [
    {
      id: 'professor-recommendation-request',
      label: 'Professor Recommendation Request',
      values: {
        greeting: 'Respected Professor [Name],',
        context: 'I hope you are doing well. I am [Your Name], your student from [Course/Batch], and I had the opportunity to learn under your guidance in [Subject/Class].',
        purpose: 'I am applying for [program/internship/scholarship], and I would be honored if you could provide a recommendation letter for my application.',
        deadline: 'The submission deadline is [Date], and the letter can be submitted via [portal/email link]. I can share my resume and additional details for your reference.',
        closing: 'I understand your schedule is busy, and I truly appreciate your time and support. Thank you for considering my request.',
        signature: 'Sincerely,\n[Your Name]\n[Course/Year]\n[Contact Number]'
      }
    },
    {
      id: 'manager-recommendation-request',
      label: 'Manager Recommendation Request',
      values: {
        greeting: 'Dear [Manager Name],',
        context: 'I hope you are doing well. I am [Your Name], and I worked with you as [Intern/Associate Role] in [Team/Department] at [Company Name].',
        purpose: 'I am currently applying for [job/program], and I am writing to request a recommendation letter based on my work under your supervision.',
        deadline: 'The recommendation is needed by [Date] and can be submitted through [platform/email]. I can share a summary of my contributions to make the process easier.',
        closing: 'Thank you for your guidance and support throughout my role. I would be grateful for your recommendation.',
        signature: 'Best regards,\n[Your Name]\n[LinkedIn Profile]\n[Email Address]'
      }
    },
    {
      id: 'short-polite-request',
      label: 'Short Polite Request',
      values: {
        greeting: 'Hello [Name],',
        context: 'I hope you are doing well. I am [Your Name], and I had the chance to work/study with you in [context].',
        purpose: 'I am applying for [opportunity], and I wanted to request if you could kindly provide a recommendation letter for me.',
        deadline: 'The deadline is [Date], and the submission link/details are [details].',
        closing: 'I would really appreciate your support. Thank you for your time and consideration.',
        signature: 'Warm regards,\n[Your Name]'
      }
    }
  ];

  const fieldOrder = ['greeting', 'context', 'purpose', 'deadline', 'closing', 'signature'];
  const fields = Array.from(document.querySelectorAll('[data-reco-field]'));
  const switcher = document.getElementById('recommendationExampleSwitcher');
  const feedbackNode = document.getElementById('recommendationTemplateFeedback');
  const copyButton = document.getElementById('copyRecommendationTemplate');
  const printButton = document.getElementById('printRecommendationTemplate');
  const resetButton = document.getElementById('resetRecommendationTemplate');
  let activeVersionId = recommendationVersions[0].id;

  const getActiveVersion = () => recommendationVersions.find((v) => v.id === activeVersionId) || recommendationVersions[0];

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
      const key = field.getAttribute('data-reco-field');
      field.textContent = values[key] || '';
    });
  };

  const buildRecommendationText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-reco-field');
      values[key] = field.textContent.trim();
    });
    return fieldOrder.map((key) => values[key] || '').filter(Boolean).join('\n\n').trim();
  };

  const downloadRecommendationText = () => {
    const slug = getActiveVersion().label.toLowerCase().replace(/\s+/g, '-');
    const blob = new Blob([buildRecommendationText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `recommendation-request-${slug}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = recommendationVersions.map((version) => `<button type="button" class="filter-btn ${version.id === activeVersionId ? 'active' : ''}" data-recommendation-version="${version.id}">${version.label}</button>`).join('');
    switcher.querySelectorAll('[data-recommendation-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const selectedVersion = recommendationVersions.find((version) => version.id === button.getAttribute('data-recommendation-version'));
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const copyRecommendationText = async () => {
    try {
      await navigator.clipboard.writeText(buildRecommendationText());
      setFeedback('Recommendation request copied. Personalize and send respectfully.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Template reset to selected version defaults.');
  };

  const setRecommendationData = (payload) => {
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

  window.ToolShalaRecommendationTemplateAPI = { getActiveVersion, buildRecommendationText, setRecommendationData };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);

  copyButton?.addEventListener('click', copyRecommendationText);
  printButton?.addEventListener('click', () => {
    downloadRecommendationText();
    window.print();
  });
  resetButton?.addEventListener('click', resetActiveVersion);
});
