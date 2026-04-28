document.addEventListener('DOMContentLoaded', () => {
  const sopStyles = [
    {
      id: 'academic-sop',
      label: 'Academic SOP',
      values: {
        introduction:
          'I am [Your Name], and I am applying to the [Program Name] at [University Name]. My interest in this field grew through [brief academic/personal trigger], which shaped my decision to pursue advanced study.',
        background:
          'I completed my [Degree Name] in [Subject] from [College/University]. During my studies, I developed a strong base in [key subjects], and consistently explored practical applications through coursework and academic activities.',
        motivation:
          'I am applying to this program to deepen my understanding of [specific area] and gain structured training in [specific skills]. This program aligns with my academic direction and long-term learning goals.',
        achievements:
          'One of my key projects was [Project Name], where I [your contribution]. This work helped me strengthen [skills] and resulted in [outcome/learning]. I have also achieved [award/publication/certification], which reflects my commitment to this domain.',
        goals:
          'In the short term, I want to build expertise in [specific field] through advanced coursework and research. In the long term, I aim to contribute to [industry/research/social impact area] as a [target role].',
        whyUniversity:
          'I am particularly drawn to [University Name] because of [faculty/research lab/curriculum/industry links]. The program\'s focus on [specific module/theme] and its practical learning opportunities make it the right fit for my academic journey.',
        conclusion:
          'I am confident that this program will help me grow academically and professionally. I look forward to contributing actively to your university community and making meaningful use of this opportunity.'
      }
    },
    {
      id: 'scholarship-sop',
      label: 'Scholarship SOP',
      values: {
        introduction:
          'I am [Your Name], a [current status] from [City/Country], applying for the [Scholarship Name]. This scholarship is an important step toward continuing my education in [field/program] with focused dedication.',
        background:
          'I completed my [Degree/Class] at [Institution], where I maintained strong academic performance while participating in [academic/community activities]. My learning journey has been shaped by curiosity, consistency, and purpose.',
        motivation:
          'I am applying for this scholarship because it will help me pursue quality education in [program/domain] and focus fully on academic development. It will also reduce financial pressure and allow me to contribute more effectively to my goals.',
        achievements:
          'I have worked on [project/research/community initiative], where I [specific contribution]. I also received [award/rank/recognition], which reflects both academic effort and leadership potential.',
        goals:
          'My short-term goal is to complete [program] with strong performance and practical exposure. In the long term, I aim to work in [career path] and contribute to [social/industry impact], especially in [specific area].',
        whyUniversity:
          'This university/program is ideal for my goals because of [specific curriculum/faculty/resources]. With scholarship support, I will be able to make full use of these opportunities and contribute as an active learner.',
        conclusion:
          'Receiving this scholarship will enable me to continue my education with commitment and purpose. I am prepared to use this opportunity responsibly and create meaningful outcomes through my academic journey.'
      }
    }
  ];

  const fields = Array.from(document.querySelectorAll('[data-sop-field]'));
  const switcher = document.getElementById('sopStyleSwitcher');
  const feedbackNode = document.getElementById('sopTemplateFeedback');
  const copyButton = document.getElementById('copySopTemplate');
  const printButton = document.getElementById('printSopTemplate');
  const resetButton = document.getElementById('resetSopTemplate');
  let activeStyleId = sopStyles[0].id;

  const getActiveStyle = () => sopStyles.find((style) => style.id === activeStyleId) || sopStyles[0];

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
      const key = field.getAttribute('data-sop-field');
      field.textContent = values[key] || '';
    });
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = sopStyles
      .map((style) => {
        const activeClass = style.id === activeStyleId ? 'active' : '';
        return `<button type="button" class="filter-btn ${activeClass}" data-sop-style="${style.id}">${style.label}</button>`;
      })
      .join('');

    switcher.querySelectorAll('[data-sop-style]').forEach((button) => {
      button.addEventListener('click', () => {
        const styleId = button.getAttribute('data-sop-style');
        const selectedStyle = sopStyles.find((style) => style.id === styleId);
        if (!selectedStyle) return;
        activeStyleId = selectedStyle.id;
        hydrateFields(selectedStyle.values);
        renderSwitcher();
      });
    });
  };

  const buildSopText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-sop-field');
      values[key] = field.textContent.trim();
    });

    return [
      'STATEMENT OF PURPOSE',
      '',
      values.introduction,
      '',
      values.background,
      '',
      values.motivation,
      '',
      values.achievements,
      '',
      values.goals,
      '',
      values.whyUniversity,
      '',
      values.conclusion
    ]
      .join('\n')
      .trim();
  };

  const copySopText = async () => {
    if (!buildSopText().trim()) {
      setFeedback('Please add SOP content before copying.', true);
      return;
    }
    try {
      await navigator.clipboard.writeText(buildSopText());
      setFeedback('SOP copied. Customize it for your target application.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from the preview.', true);
    }
  };

  const resetActiveStyle = () => {
    hydrateFields(getActiveStyle().values);
    setFeedback('Template reset to selected style defaults.');
  };

  const setSopData = (payload) => {
    if (!payload || typeof payload !== 'object') return false;
    const target = getActiveStyle();
    if (!target) return false;
    let updated = false;

    ['introduction', 'background', 'motivation', 'achievements', 'goals', 'whyUniversity', 'conclusion'].forEach((key) => {
      if (typeof payload[key] === 'string' && payload[key].trim()) {
        target.values[key] = payload[key].trim();
        updated = true;
      }
    });

    if (updated) hydrateFields(target.values);
    return updated;
  };

  window.ToolShalaSOPTemplateAPI = {
    getActiveStyle,
    getSopText: buildSopText,
    setSopData
  };

  renderSwitcher();
  hydrateFields(getActiveStyle().values);

  copyButton?.addEventListener('click', copySopText);
  printButton?.addEventListener('click', () => window.print());
  resetButton?.addEventListener('click', resetActiveStyle);
});
