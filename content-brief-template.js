document.addEventListener('DOMContentLoaded', () => {
  const briefVersions = [
    {
      id: 'blog-content-brief',
      label: 'Blog Content Brief',
      values: {
        title: 'Content Title: [Working Title for Blog Post]',
        goal: 'Goal: Educate readers about [topic] and drive sign-ups for [offer/page].',
        audience: 'Target Audience: [e.g., students, freelancers, early-career marketers] who want to learn [specific outcome].',
        message: 'Main Message: [One clear takeaway readers should remember after reading the blog].',
        tone: 'Tone: Informative, practical, and easy to understand.',
        points: 'Key Points:\n- Problem overview\n- Actionable tips with examples\n- Common mistakes to avoid\n- Final checklist or framework',
        cta: 'CTA: Invite readers to [download guide / join newsletter / try tool].',
        references: 'References: [Include source links, internal pages, and research documents].',
        deadline: 'Deadline: Draft by [Date], final review by [Date].'
      }
    },
    {
      id: 'social-media-content-brief',
      label: 'Social Media Content Brief',
      values: {
        title: 'Content Title: [Campaign/Post Idea Name]',
        goal: 'Goal: Increase engagement and reach for [topic/product/service].',
        audience: 'Target Audience: [Platform-specific audience, e.g., Instagram creators / LinkedIn professionals].',
        message: 'Main Message: [Single idea the audience should understand in 5-10 seconds].',
        tone: 'Tone: Conversational, clear, and action-oriented.',
        points: 'Key Points:\n- Hook line\n- Core message\n- Supporting benefit\n- Suggested visual direction\n- Hashtag direction',
        cta: 'CTA: Ask audience to [comment/share/save/click link].',
        references: 'References: [Brand guidelines, campaign docs, example posts, competitor references].',
        deadline: 'Deadline: Content draft by [Date], approval by [Date], publish on [Date].'
      }
    }
  ];

  const fieldOrder = ['title', 'goal', 'audience', 'message', 'tone', 'points', 'cta', 'references', 'deadline'];
  const fields = Array.from(document.querySelectorAll('[data-brief-field]'));
  const switcher = document.getElementById('contentBriefSwitcher');
  const feedbackNode = document.getElementById('contentBriefFeedback');
  const copyButton = document.getElementById('copyContentBriefTemplate');
  const printButton = document.getElementById('printContentBriefTemplate');
  const resetButton = document.getElementById('resetContentBriefTemplate');
  let activeVersionId = briefVersions[0].id;

  const getActiveVersion = () => briefVersions.find((v) => v.id === activeVersionId) || briefVersions[0];
  const setFeedback = (message, isError = false) => window.ToolShalaTemplateFeedback?.setFeedback(feedbackNode, message, isError, 2600);

  const hydrateFields = (values) => {
    fields.forEach((field) => {
      const key = field.getAttribute('data-brief-field');
      field.textContent = values[key] || '';
    });
  };

  const buildBriefText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-brief-field');
      values[key] = field.textContent.trim();
    });
    return fieldOrder.map((key) => values[key] || '').filter(Boolean).join('\n\n').trim();
  };

  const downloadBriefText = () => {
    const slug = getActiveVersion().label.toLowerCase().replace(/\s+/g, '-');
    const blob = new Blob([buildBriefText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `content-brief-${slug}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = briefVersions.map((version) => `<button type="button" class="filter-btn ${version.id === activeVersionId ? 'active' : ''}" data-brief-version="${version.id}">${version.label}</button>`).join('');
    switcher.querySelectorAll('[data-brief-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const selectedVersion = briefVersions.find((version) => version.id === button.getAttribute('data-brief-version'));
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const copyBriefText = async () => {
    try {
      await navigator.clipboard.writeText(buildBriefText());
      setFeedback('Content brief copied. Customize before sharing with your team.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Content brief reset to selected version defaults.');
  };

  const setBriefData = (payload) => {
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

  window.ToolShalaContentBriefTemplateAPI = { getActiveVersion, buildBriefText, setBriefData };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);
  copyButton?.addEventListener('click', copyBriefText);
  printButton?.addEventListener('click', () => {
    downloadBriefText();
    window.print();
  });
  resetButton?.addEventListener('click', resetActiveVersion);
});
