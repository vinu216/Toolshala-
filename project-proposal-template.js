document.addEventListener('DOMContentLoaded', () => {
  const proposalVersions = [
    {
      id: 'freelance-project-proposal',
      label: 'Freelance Project Proposal',
      values: {
        title: '[Project Name] Proposal for [Client/Brand Name]',
        problem: 'The current challenge is [brief problem]. This is affecting [business/process outcome], and requires a practical execution plan.',
        objective: 'The objective is to deliver [clear result], improve [metric/outcome], and complete the project within the agreed timeline.',
        scope: 'Scope includes: [task 1], [task 2], [task 3]. Out-of-scope items: [item if any].',
        timeline: 'Estimated timeline: [X weeks]. Milestone 1: [date/task], Milestone 2: [date/task], Final delivery: [date].',
        deliverables: 'Deliverables: [deliverable 1], [deliverable 2], [deliverable 3], along with final handover documentation.',
        budget: 'Proposed budget: [amount/range]. Includes implementation, revisions, and support period of [duration].',
        conclusion: 'This proposal is designed to deliver measurable value with clear execution and communication. I would be happy to discuss and refine details as needed.\n\nRegards,\n[Your Name]'
      }
    },
    {
      id: 'academic-college-proposal',
      label: 'Academic / College Proposal',
      values: {
        title: '[Project Title] - Academic Proposal',
        problem: 'The identified problem is [problem/topic], which is relevant to [subject/department] and needs systematic analysis or implementation.',
        objective: 'The objective is to [primary objective] and demonstrate practical understanding of [concept/domain].',
        scope: 'Scope covers background research, planning, implementation, testing, and final documentation within semester/project guidelines.',
        timeline: 'Timeline: Week 1-2 (research), Week 3-4 (design/planning), Week 5-6 (implementation), Week 7 (review), Week 8 (submission).',
        deliverables: 'Deliverables include project report, prototype/model (if applicable), presentation slides, and final summary.',
        budget: 'Resources required: [software/tools/lab access], [team members], and approximate budget (if applicable): [amount].',
        conclusion: 'This proposal aims to ensure structured execution, clear outcomes, and meaningful learning impact. I request your approval to proceed.\n\nSincerely,\n[Your Name]'
      }
    }
  ];

  const fields = Array.from(document.querySelectorAll('[data-proposal-field]'));
  const switcher = document.getElementById('proposalVersionSwitcher');
  const feedbackNode = document.getElementById('proposalTemplateFeedback');
  const copyButton = document.getElementById('copyProposalTemplate');
  const printButton = document.getElementById('printProposalTemplate');
  const resetButton = document.getElementById('resetProposalTemplate');
  let activeVersionId = proposalVersions[0].id;

  const fieldOrder = ['title', 'problem', 'objective', 'scope', 'timeline', 'deliverables', 'budget', 'conclusion'];

  const getActiveVersion = () => proposalVersions.find((version) => version.id === activeVersionId) || proposalVersions[0];

  const setFeedback = (message, isError = false) => window.ToolShalaTemplateFeedback?.setFeedback(feedbackNode, message, isError, 2600);

  const hydrateFields = (values) => {
    fields.forEach((field) => {
      const key = field.getAttribute('data-proposal-field');
      field.textContent = values[key] || '';
    });
  };

  const renderSwitcher = () => {
    if (!switcher) return;

    switcher.innerHTML = proposalVersions
      .map((version) => {
        const activeClass = version.id === activeVersionId ? 'active' : '';
        return `<button type="button" class="filter-btn ${activeClass}" data-proposal-version="${version.id}">${version.label}</button>`;
      })
      .join('');

    switcher.querySelectorAll('[data-proposal-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const versionId = button.getAttribute('data-proposal-version');
        const selectedVersion = proposalVersions.find((version) => version.id === versionId);
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const buildProposalText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-proposal-field');
      values[key] = field.textContent.trim();
    });

    return fieldOrder
      .map((key) => values[key] || '')
      .filter(Boolean)
      .join('\n\n')
      .trim();
  };

  const copyProposalText = async () => {
    try {
      await navigator.clipboard.writeText(buildProposalText());
      setFeedback('Project proposal copied. Customize before sharing.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from the preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Template reset to selected version defaults.');
  };

  const setProposalData = (payload) => {
    if (!payload || typeof payload !== 'object') return false;
    const targetVersion = proposalVersions.find((version) => version.id === activeVersionId);
    if (!targetVersion) return false;

    fieldOrder.forEach((key) => {
      if (typeof payload[key] === 'string' && payload[key].trim()) {
        targetVersion.values[key] = payload[key].trim();
      }
    });

    hydrateFields(targetVersion.values);
    return true;
  };

  window.ToolShalaProjectProposalTemplateAPI = {
    getActiveVersion,
    setProposalData
  };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);

  copyButton?.addEventListener('click', copyProposalText);
  printButton?.addEventListener('click', () => window.print());
  resetButton?.addEventListener('click', resetActiveVersion);
});
