document.addEventListener('DOMContentLoaded', () => {
  const defaultContent = {
    header:
      'Aarav Sharma\n+91 98765 43210 | aarav.sharma@email.com | linkedin.com/in/aarav-sharma | Jaipur, Rajasthan',
    summary:
      'Motivated B.Tech final-year student targeting entry-level Software Developer roles. Skilled in JavaScript, React basics, and problem solving, with hands-on project experience and internship exposure.',
    education:
      'B.Tech in Computer Science, Arya College of Engineering, Jaipur | 2022 - 2026 | CGPA: 8.4/10\nClass XII, RBSE Board | 2022 | 89%',
    skills:
      'Technical Skills: HTML, CSS, JavaScript, SQL\nTools: Git, GitHub, VS Code, Postman\nSoft Skills: Communication, Team Collaboration, Time Management',
    projects:
      'Job Tracker Web App | HTML, CSS, JavaScript\n- Built a tracker to manage internship and job applications with status tags.\n- Improved follow-up consistency by organizing 50+ applications in one dashboard.\n\nPortfolio Website\n- Designed a personal portfolio to showcase projects and resume.\n- Optimized page speed and mobile responsiveness for better recruiter viewing.',
    internships:
      'Frontend Intern, BrightCode Labs | May 2025 - July 2025\n- Developed reusable UI components for student-focused web pages.\n- Collaborated with 3-member team and delivered 6 UI tasks before deadline.',
    certifications:
      'Google Data Analytics Foundations - Coursera (2025)\nJavaScript Essentials - Cisco Networking Academy (2024)',
    achievements:
      'Finalist - Inter-College Hackathon 2025\nTop 10% score in NPTEL Problem Solving Course\nLed college coding club workshop for 120+ attendees',
    languages: 'English (Fluent)\nHindi (Native)',
    optional: 'References available on request.'
  };

  const fields = Array.from(document.querySelectorAll('[data-field]'));
  const feedbackNode = document.getElementById('resumeTemplateFeedback');
  const copyBtn = document.getElementById('copyResumeTemplate');
  const printBtn = document.getElementById('printResumeTemplate');
  const resetBtn = document.getElementById('resetResumeTemplate');

  const setFeedback = (message, isError = false) => {
    if (!feedbackNode) return;
    feedbackNode.textContent = message;
    feedbackNode.classList.remove('hidden');
    feedbackNode.classList.toggle('text-emerald-700', !isError);
    feedbackNode.classList.toggle('text-rose-700', isError);
    window.setTimeout(() => feedbackNode.classList.add('hidden'), 2200);
  };

  const hydrateDefaults = () => {
    fields.forEach((field) => {
      const key = field.getAttribute('data-field');
      field.textContent = defaultContent[key] || '';
    });
  };

  const buildPlainText = () => {
    const sections = Array.from(document.querySelectorAll('.resume-section'));
    return sections
      .map((section) => {
        const title = section.querySelector('h2')?.textContent?.trim() || '';
        const content = section.querySelector('[data-field]')?.textContent?.trim() || '';
        return `${title}\n${content}`.trim();
      })
      .filter(Boolean)
      .join('\n\n');
  };

  const copyTemplateText = async () => {
    const text = buildPlainText();
    try {
      await navigator.clipboard.writeText(text);
      setFeedback('Template copied. Paste it into your preferred editor.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from the preview.', true);
    }
  };

  hydrateDefaults();

  copyBtn?.addEventListener('click', copyTemplateText);
  printBtn?.addEventListener('click', () => window.print());
  resetBtn?.addEventListener('click', () => {
    hydrateDefaults();
    setFeedback('Template reset to default sample content.');
  });
});
