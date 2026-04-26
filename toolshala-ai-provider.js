(function () {
  const SUPPORTED_TOOLS = new Set([
    'resume-headline-generator',
    'leave-application-generator',
    'instagram-caption-generator',
    'linkedin-bio-generator',
    'cover-letter-generator',
    'study-timetable-generator',
    'ai-career-path-suggestor',
    'scholarship-recommendation-tool',
    'professional-email-generator',
    'content-idea-generator'
  ]);

  const normalizeResumeResult = (payload) => {
    const items = Array.isArray(payload?.headlines)
      ? payload.headlines
          .map((entry, index) => {
            const text = String(entry?.text || '').trim();
            if (!text) return null;
            const tone = String(entry?.tone || 'Professional').trim();
            return { label: `Headline ${index + 1}`, text, note: `Tone: ${tone}`, copyText: text };
          })
          .filter(Boolean)
          .slice(0, 5)
      : Array.isArray(payload?.items)
        ? payload.items
        : [];

    return items.length ? { type: 'cards', items } : null;
  };

  const normalizeLeaveResult = (payload) => {
    const subject = String(payload?.subject || '').trim();
    const letter = String(payload?.letter || '').trim();
    const closing = String(payload?.closing || '').trim();
    if (!subject || !letter || !closing) return null;
    return {
      type: 'text',
      text: `Subject: ${subject}\n\n${letter}\n\n${closing}`,
      printable: true,
      className: 'tool-letter-box'
    };
  };

  const normalizeInstagramResult = (payload) => {
    const captions = Array.isArray(payload?.captions) ? payload.captions : [];
    if (captions.length !== 5) return null;

    const items = captions
      .map((entry, index) => {
        const text = String(entry?.text || '').trim();
        if (!text) return null;
        const style = String(entry?.style || 'General').trim();
        const hashtags = Array.isArray(entry?.hashtags)
          ? entry.hashtags.map((tag) => String(tag || '').trim()).filter(Boolean).slice(0, 5)
          : [];
        return {
          label: `Caption ${index + 1}`,
          text,
          note: `Style: ${style}`,
          hashtags,
          bestPick: Boolean(entry?.bestPick),
          copyText: [text, hashtags.join(' ')].filter(Boolean).join('\n\n')
        };
      })
      .filter(Boolean);

    if (items.length !== 5) return null;
    if (!items.some((item) => item.bestPick)) items[0].bestPick = true;
    return { type: 'cards', items };
  };

  const normalizeLinkedinResult = (payload) => {
    const bios = Array.isArray(payload?.bios) ? payload.bios : [];
    const items = bios
      .map((entry, index) => {
        const text = String(entry?.text || '').trim();
        if (!text) return null;
        const tone = String(entry?.tone || 'professional').trim();
        return { label: `Bio ${index + 1}`, text, note: `Tone: ${tone}`, copyText: text };
      })
      .filter(Boolean)
      .slice(0, 4);

    return items.length >= 2 ? { type: 'cards', items } : null;
  };

  const normalizeCoverLetterResult = (payload, values = {}) => {
    const subject = String(payload?.subject || '').trim();
    const letter = String(payload?.letter || '').trim();
    if (!subject || !letter) return null;
    const nameSlug = String(values?.name || 'cover-letter').trim().replace(/\s+/g, '-').toLowerCase();

    return {
      type: 'text',
      text: `Subject: ${subject}\n\n${letter}`,
      printable: true,
      downloadable: true,
      fileName: `${nameSlug}-cover-letter.txt`,
      className: 'tool-letter-box'
    };
  };

  const normalizeStudyTimetableResult = (payload, values = {}) => {
    const weeklyPlan = Array.isArray(payload?.weeklyPlan) ? payload.weeklyPlan : [];
    if (weeklyPlan.length !== 7) return null;

    const items = weeklyPlan
      .map((entry) => {
        const day = String(entry?.day || '').trim();
        const rows = Array.isArray(entry?.slots) ? entry.slots.map((slot) => String(slot || '').trim()).filter(Boolean) : [];
        if (!day || rows.length < 3) return null;
        return {
          label: day,
          rows,
          note: `${String(values?.level || '').trim()} | Goal: ${String(values?.examGoal || '').replace('-', ' ')}`.trim(),
          copyText: `${day}\n${rows.join('\n')}`
        };
      })
      .filter(Boolean);

    if (items.length !== 7) return null;

    const tips = Array.isArray(payload?.tips) ? payload.tips.map((tip) => String(tip || '').trim()).filter(Boolean).slice(0, 4) : [];
    const planTitle = String(payload?.planTitle || 'Weekly Study Timetable').trim();
    const planText = items.map((item) => `${item.label}\n${item.rows.join('\n')}`).join('\n\n');

    return {
      type: 'cards',
      items,
      copyText: `${planTitle}\nLevel: ${String(values?.level || '').trim()}\nGoal: ${String(values?.examGoal || '').replace('-', ' ')}\n\n${planText}`,
      downloadable: true,
      fileName: `${String(values?.level || 'study').trim().replace(/\s+/g, '-').toLowerCase()}-weekly-plan.txt`,
      disclaimer: tips.length ? `Tips: ${tips.join(' • ')}` : null
    };
  };

  const normalizeCareerPathResult = (payload, values = {}) => {
    const rawPaths = Array.isArray(payload?.paths) ? payload.paths : [];
    if (rawPaths.length < 3) return null;

    const bestTitle = String(payload?.bestMatch?.careerTitle || '').trim().toLowerCase();
    const items = rawPaths
      .map((entry, index) => {
        const title = String(entry?.careerTitle || '').trim();
        const whyItFits = String(entry?.whyItFits || '').trim();
        const skillsToLearn = Array.isArray(entry?.skillsToLearn)
          ? entry.skillsToLearn.map((skill) => String(skill || '').trim()).filter(Boolean).slice(0, 5)
          : [];
        const nextStep = String(entry?.nextStep || '').trim();
        if (!title || !whyItFits || !skillsToLearn.length || !nextStep) return null;

        const isBest = bestTitle && title.toLowerCase() === bestTitle;
        const skillsText = skillsToLearn.join(', ');
        return {
          label: isBest ? 'Best Match' : `Career Path ${index + 1}`,
          title,
          text: `Based on your profile, ${whyItFits}`,
          rows: [`Useful skills to learn: ${skillsText}`, `Next step recommendation: ${nextStep}`],
          note: `Profile signals used: ${String(values.workStyle || '').trim()} work style, interests and strengths.`,
          bestPick: Boolean(isBest),
          copyText: `${title}\nWhy it fits: ${whyItFits}\nUseful skills to learn: ${skillsText}\nNext step recommendation: ${nextStep}`
        };
      })
      .filter(Boolean)
      .slice(0, 5);

    if (items.length < 3) return null;
    if (!items.some((item) => item.bestPick)) {
      items[0].bestPick = true;
      items[0].label = 'Best Match';
    }

    const compiledText = items.map((item) => item.copyText).join('\n\n');
    return {
      type: 'cards',
      items,
      copyText: compiledText,
      shareText: compiledText,
      disclaimer: 'This tool gives direction, not a final decision. Use it as a starting point.',
      cta: {
        href: './career.html',
        label: 'Explore Career Guides',
        text: 'Want deeper guidance? Explore role roadmaps and practical planning resources.'
      }
    };
  };


  const normalizeScholarshipResult = (payload) => {
    const recommendations = Array.isArray(payload?.recommendations) ? payload.recommendations : [];
    if (recommendations.length < 3) return null;

    const items = recommendations
      .map((entry, index) => {
        const scholarshipType = String(entry?.scholarshipType || '').trim();
        const suitableFor = String(entry?.suitableFor || '').trim();
        const whatToPrepare = Array.isArray(entry?.whatToPrepare)
          ? entry.whatToPrepare.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 6)
          : [];
        const nextStep = String(entry?.nextStep || '').trim();

        if (!scholarshipType || !suitableFor || !whatToPrepare.length || !nextStep) return null;

        return {
          label: index === 0 ? 'Best Match' : `Scholarship Option ${index + 1}`,
          title: scholarshipType,
          text: `Suitable for: ${suitableFor}.`,
          rows: [
            `What to prepare: ${whatToPrepare.join(', ')}`,
            `Suggested next step: ${nextStep}`
          ],
          bestPick: index === 0,
          copyText: `${scholarshipType}
Suitable for: ${suitableFor}
What to prepare: ${whatToPrepare.join(', ')}
Suggested next step: ${nextStep}`
        };
      })
      .filter(Boolean)
      .slice(0, 5);

    if (items.length < 3) return null;

    return {
      type: 'cards',
      items,
      copyText: items.map((item) => item.copyText).join('\n\n'),
      disclaimer: String(payload?.verificationReminder || 'Always verify final eligibility and deadlines from the official scholarship source.').trim(),
      cta: {
        href: './opportunities.html',
        label: 'Browse Scholarships',
        text: 'Explore updated opportunities and scholarship listings in one place.'
      }
    };
  };

  const normalizeProfessionalEmailResult = (payload) => {
    const subjects = Array.isArray(payload?.subjects) ? payload.subjects.map((item) => String(item || '').trim()).filter(Boolean) : [];
    const email = String(payload?.email || '').trim();
    if (subjects.length < 2 || !email) return null;

    return {
      type: 'email',
      subject: subjects[0],
      subjectVariations: [subjects[1]],
      bodyText: email,
      note: 'Always review names, attachments, and company details before sending.'
    };
  };

  const normalizeContentIdeaResult = (payload) => {
    const ideas = Array.isArray(payload?.ideas) ? payload.ideas.map((idea) => String(idea || '').trim()).filter(Boolean) : [];
    const bestStarterIdea = String(payload?.bestStarterIdea || '').trim();
    if (ideas.length !== 10) return null;

    const items = ideas.map((idea, index) => {
      const isBest = bestStarterIdea && idea.toLowerCase() === bestStarterIdea.toLowerCase();
      return {
        label: `Idea ${index + 1}`,
        title: idea,
        text: 'Audience-first content angle that is practical to execute.',
        note: isBest ? 'Best Starter Idea' : 'Useful for consistent content planning.',
        bestPick: isBest,
        copyText: idea
      };
    });

    if (!items.some((item) => item.bestPick)) {
      items[0].bestPick = true;
      items[0].note = 'Best Starter Idea';
    }

    return {
      type: 'cards',
      items,
      copyText: ideas.join('\n\n'),
      disclaimer: 'Choose ideas that answer your audience’s real questions.'
    };
  };

  const normalizeResult = (toolId, payload, values = {}) => {
    if (toolId === 'resume-headline-generator') return normalizeResumeResult(payload);
    if (toolId === 'leave-application-generator') return normalizeLeaveResult(payload);
    if (toolId === 'instagram-caption-generator') return normalizeInstagramResult(payload);
    if (toolId === 'linkedin-bio-generator') return normalizeLinkedinResult(payload);
    if (toolId === 'cover-letter-generator') return normalizeCoverLetterResult(payload, values);
    if (toolId === 'study-timetable-generator') return normalizeStudyTimetableResult(payload, values);
    if (toolId === 'ai-career-path-suggestor') return normalizeCareerPathResult(payload, values);
    if (toolId === 'scholarship-recommendation-tool') return normalizeScholarshipResult(payload);
    if (toolId === 'professional-email-generator') return normalizeProfessionalEmailResult(payload);
    if (toolId === 'content-idea-generator') return normalizeContentIdeaResult(payload);
    return null;
  };

  window.ToolShalaAIProvider = {
    async generate({ toolId, values }) {
      if (!SUPPORTED_TOOLS.has(toolId)) throw new Error('Unsupported remote tool.');

      const response = await fetch('/api/generate-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId,
          values
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(String(payload?.error || 'Tool service is unavailable right now.').trim());
      }

      const normalized = normalizeResult(toolId, payload, values);
      if (!normalized) throw new Error('The service returned an invalid response format.');
      return normalized;
    }
  };
})();
