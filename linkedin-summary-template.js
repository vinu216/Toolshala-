document.addEventListener('DOMContentLoaded', () => {
  const summaryVersions = [
    {
      id: 'student-summary',
      label: 'Student Summary',
      values: {
        opening: 'I am a curious [Degree/Branch] student who enjoys building practical projects and learning by doing.',
        status: 'Currently in [Year] at [College Name], focused on strengthening core concepts and industry-ready skills.',
        skills: 'My key skills include [Skill 1], [Skill 2], [Skill 3], along with tools like [Tool 1] and [Tool 2].',
        interests: 'I am interested in internships and project opportunities in [Domain], especially where I can solve real problems.',
        goals: 'My current goal is to gain hands-on experience, build a strong portfolio, and grow toward an entry-level role in [Target Role].',
        cta: 'I am open to connecting with peers, mentors, and teams working on meaningful student and early-career opportunities.'
      }
    },
    {
      id: 'fresher-summary',
      label: 'Fresher Summary',
      values: {
        opening: 'I am a motivated fresher with a strong interest in [Domain] and a practical approach to learning and execution.',
        status: 'I recently completed [Degree/Program] and have worked on [Project/Internship Type] to apply my skills in real scenarios.',
        skills: 'I bring strengths in [Skill 1], [Skill 2], and [Skill 3], with working knowledge of [Tool/Platform].',
        interests: 'I am looking for entry-level roles and internships where I can contribute to outcomes and continue learning fast.',
        goals: 'My goal is to grow into a dependable professional in [Role/Industry] by delivering consistent work and improving every quarter.',
        cta: 'If you are hiring freshers or building early-career teams, I would love to connect and explore opportunities.'
      }
    },
    {
      id: 'freelancer-summary',
      label: 'Freelancer Summary',
      values: {
        opening: 'I am a freelance [Service Role] helping clients turn ideas into clear, high-quality deliverables.',
        status: 'I work with startups, students, and creators on [Service Type 1], [Service Type 2], and project-based support.',
        skills: 'My core strengths include [Skill 1], [Skill 2], and [Skill 3], with a focus on communication, quality, and deadlines.',
        interests: 'I am interested in long-term collaborations and growth-focused projects in [Industry/Domain].',
        goals: 'My goal is to build trusted client relationships, scale my service quality, and collaborate on impactful work.',
        cta: 'Open to freelance projects, retainers, and collaboration conversations—feel free to connect or message me directly.'
      }
    }
  ];

  const fields = Array.from(document.querySelectorAll('[data-linkedin-field]'));
  const switcher = document.getElementById('linkedInVersionSwitcher');
  const feedbackNode = document.getElementById('linkedInTemplateFeedback');
  const copyButton = document.getElementById('copyLinkedInTemplate');
  const printButton = document.getElementById('printLinkedInTemplate');
  const resetButton = document.getElementById('resetLinkedInTemplate');
  let activeVersionId = summaryVersions[0].id;

  const getActiveVersion = () => summaryVersions.find((version) => version.id === activeVersionId) || summaryVersions[0];

  const setFeedback = (message, isError = false) => window.ToolShalaTemplateFeedback?.setFeedback(feedbackNode, message, isError, 2600);

  const hydrateFields = (values) => {
    fields.forEach((field) => {
      const key = field.getAttribute('data-linkedin-field');
      field.textContent = values[key] || '';
    });
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = summaryVersions
      .map((version) => {
        const activeClass = version.id === activeVersionId ? 'active' : '';
        return `<button type="button" class="filter-btn ${activeClass}" data-linkedin-version="${version.id}">${version.label}</button>`;
      })
      .join('');

    switcher.querySelectorAll('[data-linkedin-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const versionId = button.getAttribute('data-linkedin-version');
        const selectedVersion = summaryVersions.find((version) => version.id === versionId);
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const buildSummaryText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-linkedin-field');
      values[key] = field.textContent.trim();
    });

    return [values.opening, values.status, values.skills, values.interests, values.goals, values.cta].filter(Boolean).join('\n\n').trim();
  };

  const copySummaryText = async () => {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      setFeedback('LinkedIn summary copied. Personalize before publishing.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from the summary.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Summary reset to selected version defaults.');
  };

  const setSummaryData = (payload) => {
    if (!payload || typeof payload !== 'object') return false;
    const targetVersion = summaryVersions.find((version) => version.id === activeVersionId);
    if (!targetVersion) return false;

    const keys = ['opening', 'status', 'skills', 'interests', 'goals', 'cta'];
    keys.forEach((key) => {
      if (typeof payload[key] === 'string' && payload[key].trim()) {
        targetVersion.values[key] = payload[key].trim();
      }
    });

    hydrateFields(targetVersion.values);
    return true;
  };

  window.ToolShalaLinkedInSummaryAPI = {
    getActiveVersion,
    setSummaryData
  };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);

  copyButton?.addEventListener('click', copySummaryText);
  printButton?.addEventListener('click', () => window.print());
  resetButton?.addEventListener('click', resetActiveVersion);
});
