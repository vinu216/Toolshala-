(() => {
  const VIEWS = [
    {
      id: 'weekly',
      label: 'Weekly View',
      rows: [
        ['Mon, 5 May', 'Educational', 'Carousel', '5 mistakes in resume bullets freshers make', 'Still writing generic resume points?', 'Save this and update one bullet today.', 'Draft', 'Repurpose into Story Q&A on Tuesday.'],
        ['Tue, 6 May', 'Engagement', 'Story', 'Ask audience: biggest interview fear', 'Quick poll for students and creators', 'Reply with your challenge — I will share a fix.', 'Scheduled', 'Use response screenshots for Friday post.'],
        ['Wed, 7 May', 'Motivational', 'Reel', 'Behind the scenes: building consistency', 'No fancy setup, just a repeatable system', 'Comment "PLAN" for my weekly workflow.', 'Idea', 'Add trending audio + subtitles.'],
        ['Thu, 8 May', 'Promotional', 'Reel', 'Show template walkthrough with before/after', 'Your content plan should take 20 mins, not 2 hours', 'Use the free template link in bio.', 'Draft', 'Mention student + freelancer use-cases.'],
        ['Fri, 9 May', 'Personal', 'Post', 'Lesson from a failed campaign', 'I posted daily and still got low reach. Here is why.', 'Share one lesson you learned this week.', 'Posted', 'Pin as trust-building post.']
      ]
    },
    {
      id: 'monthly',
      label: 'Monthly View',
      rows: [
        ['Week 1', 'Educational', 'Carousel + Story', 'Skill-building mini series for your niche', 'Start here if you are confused about content', 'Save this series and follow for part 2.', 'Planned', 'Aim: build profile authority.'],
        ['Week 2', 'Engagement', 'Story + Live', 'Polls, AMA, and objections from audience', 'What is your biggest blocker right now?', 'Drop your question and I will answer live.', 'Planned', 'Aim: comments, DMs, and insights.'],
        ['Week 3', 'Promotional', 'Reel + Post', 'Offer spotlight + social proof', 'Results after using a simple content system', 'DM "CALENDAR" to get the template.', 'Planned', 'Aim: conversion week.'],
        ['Week 4', 'Personal/Motivational', 'Reel + Carousel', 'Founder story + monthly reflection', 'What worked, what failed, what changed', 'Share your monthly win in comments.', 'Planned', 'Aim: strengthen creator connection.']
      ]
    }
  ];

  const IDEA_BANK = [
    '3 caption frameworks that increase saves.',
    'Before/after content audit in one carousel.',
    'One myth in your niche and the reality.',
    'Weekly workflow reel: idea to publish in 30 minutes.',
    'Client/follower FAQ answered with examples.'
  ];

  const switcher = document.getElementById('calendarViewSwitcher');
  const preview = document.getElementById('instagramCalendarPreview');
  const cards = document.getElementById('instagramMobileCards');
  const ideasBank = document.getElementById('ideasBank');
  const feedback = document.getElementById('instagramCalendarFeedback');
  const copyBtn = document.getElementById('copyInstagramCalendar');
  const printBtn = document.getElementById('printInstagramCalendar');
  const resetBtn = document.getElementById('resetInstagramCalendar');

  let activeView = VIEWS[0].id;

  const renderIdeas = () => {
    if (!ideasBank) return;
    ideasBank.innerHTML = IDEA_BANK.map((idea) => `<li>${idea}</li>`).join('');
  };

  const setFeedback = (message, isError = false) => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove('hidden');
    feedback.classList.toggle('text-red-600', isError);
    feedback.classList.toggle('text-emerald-700', !isError);
  };

  const getActive = () => VIEWS.find((v) => v.id === activeView) || VIEWS[0];

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = VIEWS.map((v) => `<button type="button" class="example-switch-btn${v.id === activeView ? ' active' : ''}" data-view="${v.id}">${v.label}</button>`).join('');
    switcher.querySelectorAll('[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeView = btn.getAttribute('data-view') || VIEWS[0].id;
        renderAll();
      });
    });
  };

  const renderTable = () => {
    const view = getActive();
    const rows = view.rows
      .map(
        (r) => `<tr>${r.map((c) => `<td contenteditable="true">${c}</td>`).join('')}</tr>`
      )
      .join('');
    preview.innerHTML = `
      <div class="insta-calendar-table-wrap">
        <table class="insta-calendar-table">
          <thead>
            <tr>
              <th>Date / Day</th><th>Content Pillar</th><th>Post Type</th><th>Topic / Caption Idea</th><th>Hook / First Line</th><th>CTA</th><th>Status</th><th>Notes</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  };

  const renderCards = () => {
    const view = getActive();
    cards.innerHTML = view.rows
      .map(
        (r) => `<article class="insta-calendar-card">${[
          ['Date / Day', r[0]],
          ['Content Pillar', r[1]],
          ['Post Type', r[2]],
          ['Topic / Caption Idea', r[3]],
          ['Hook / First Line', r[4]],
          ['CTA', r[5]],
          ['Status', r[6]],
          ['Notes', r[7]]
        ]
          .map(([k, v]) => `<p><strong>${k}:</strong> <span contenteditable="true">${v}</span></p>`)
          .join('')}</article>`
      )
      .join('');
  };

  const extractText = () => {
    const view = getActive();
    const lines = [view.label, ''];
    const tableRows = preview.querySelectorAll('tbody tr');
    tableRows.forEach((tr, idx) => {
      const vals = [...tr.querySelectorAll('td')].map((td) => td.textContent?.trim() || '');
      lines.push(`${idx + 1}. ${vals[0]} | ${vals[1]} | ${vals[2]}`);
      lines.push(`   Topic: ${vals[3]}`);
      lines.push(`   Hook: ${vals[4]}`);
      lines.push(`   CTA: ${vals[5]} | Status: ${vals[6]}`);
      lines.push(`   Notes: ${vals[7]}`);
      lines.push('');
    });
    lines.push('Ideas Bank:');
    lines.push(...IDEA_BANK.map((i) => `- ${i}`));
    return lines.join('\n');
  };

  const copyText = async () => {
    const text = extractText();
    try {
      await navigator.clipboard.writeText(text);
      setFeedback('Instagram calendar copied successfully.');
    } catch (e) {
      setFeedback('Copy failed. Please copy manually from preview.', true);
    }
  };

  const resetView = () => {
    activeView = VIEWS[0].id;
    renderAll();
    setFeedback('Calendar reset to weekly sample defaults.');
  };

  const renderAll = () => {
    renderSwitcher();
    renderTable();
    renderCards();
    renderIdeas();
  };

  copyBtn?.addEventListener('click', copyText);
  printBtn?.addEventListener('click', () => window.print());
  resetBtn?.addEventListener('click', resetView);

  renderAll();
})();
