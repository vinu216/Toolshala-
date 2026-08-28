document.addEventListener('DOMContentLoaded', () => {
  const defaultKeywordBank = {
    communication: ['Articulate', 'Presentation', 'Stakeholder Communication', 'Cross-functional Collaboration', 'Negotiation'],
    leadership: ['Team Leadership', 'Ownership', 'Mentoring', 'Decision-Making', 'Initiative'],
    problemSolving: ['Root Cause Analysis', 'Troubleshooting', 'Critical Thinking', 'Process Improvement', 'Solution Design'],
    technicalSkills: ['JavaScript', 'Python', 'SQL', 'Git', 'API Integration'],
    marketing: ['Content Strategy', 'SEO', 'Campaign Planning', 'Audience Research', 'Brand Messaging'],
    sales: ['Lead Generation', 'Pipeline Management', 'Client Outreach', 'Objection Handling', 'Revenue Growth'],
    design: ['UI Design', 'Wireframing', 'Prototyping', 'Visual Hierarchy', 'User-Centered Design'],
    dataAnalytics: ['Data Analysis', 'Dashboarding', 'KPI Tracking', 'A/B Testing', 'Reporting'],
    projectManagement: ['Sprint Planning', 'Roadmapping', 'Risk Management', 'Resource Coordination', 'Timeline Management'],
    customerSupport: ['Issue Resolution', 'Customer Retention', 'Empathy', 'SLA Management', 'Ticket Handling']
  };

  const labels = {
    communication: 'Communication', leadership: 'Leadership', problemSolving: 'Problem Solving', technicalSkills: 'Technical Skills',
    marketing: 'Marketing', sales: 'Sales', design: 'Design', dataAnalytics: 'Data / Analytics', projectManagement: 'Project Management', customerSupport: 'Customer Support'
  };

  const grid = document.getElementById('keywordsGrid');
  const feedbackNode = document.getElementById('keywordsFeedback');
  const copyAllButton = document.getElementById('copyAllKeywords');
  const downloadButton = document.getElementById('downloadKeywords');
  const resetButton = document.getElementById('resetKeywords');
  let keywordBank = JSON.parse(JSON.stringify(defaultKeywordBank));

  const setFeedback = (message, isError = false) => window.ToolShalaTemplateFeedback?.setFeedback(feedbackNode, message, isError, 2600);

  const categoryText = (key) => `${labels[key]}:\n${(keywordBank[key] || []).join(', ')}`;
  const fullText = () => Object.keys(keywordBank).map((key) => categoryText(key)).join('\n\n').trim();

  const renderBank = () => {
    if (!grid) return;
    grid.innerHTML = Object.keys(keywordBank)
      .map((key) => `
        <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="mb-2 flex items-center justify-between gap-2">
            <h3 class="text-base font-semibold text-slate-900">${labels[key]}</h3>
            <button class="btn-secondary text-xs" type="button" data-copy-category="${key}">Copy</button>
          </div>
          <p class="text-sm leading-6 text-slate-700" contenteditable="true" data-keyword-category="${key}">${(keywordBank[key] || []).join(', ')}</p>
          <p class="mt-2 text-xs text-slate-500">Usage: Add 2-4 relevant keywords in summary, skills, and project bullets.</p>
        </article>
      `)
      .join('');

    grid.querySelectorAll('[data-copy-category]').forEach((button) => {
      button.addEventListener('click', async () => {
        const key = button.getAttribute('data-copy-category');
        try {
          await navigator.clipboard.writeText(categoryText(key));
          setFeedback(`${labels[key]} keywords copied.`);
        } catch {
          setFeedback('Copy failed. Please copy manually.', true);
        }
      });
    });

    grid.querySelectorAll('[data-keyword-category]').forEach((node) => {
      node.addEventListener('input', () => {
        const key = node.getAttribute('data-keyword-category');
        keywordBank[key] = node.textContent.split(',').map((v) => v.trim()).filter(Boolean);
      });
    });
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(fullText());
      setFeedback('Full keywords bank copied.');
    } catch {
      setFeedback('Copy failed. Please copy manually.', true);
    }
  };

  const downloadAll = () => {
    const blob = new Blob([fullText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-keywords-bank.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const resetBank = () => {
    keywordBank = JSON.parse(JSON.stringify(defaultKeywordBank));
    renderBank();
    setFeedback('Keywords bank reset to default categories.');
  };

  window.ToolShalaResumeKeywordsBankAPI = {
    getBank: () => JSON.parse(JSON.stringify(keywordBank)),
    setBank: (nextBank) => {
      if (!nextBank || typeof nextBank !== 'object') return false;
      keywordBank = { ...keywordBank, ...nextBank };
      renderBank();
      return true;
    },
    getBankText: fullText
  };

  renderBank();
  copyAllButton?.addEventListener('click', copyAll);
  downloadButton?.addEventListener('click', () => {
    downloadAll();
    window.print();
  });
  resetButton?.addEventListener('click', resetBank);
});
