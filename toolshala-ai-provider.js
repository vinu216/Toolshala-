(function () {
  const SUPPORTED_TOOLS = new Set([
    'resume-headline-generator',
    'resume-summary-generator',
    'interview-answer-generator',
    'study-notes-summarizer',
    'assignment-rewriter',
    'sop-generator',
    'linkedin-networking-message-generator',
    'job-description-analyzer',
    'scholarship-finder',
    'career-path-quiz',
    'youtube-shorts-script-generator',
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
    const root = payload?.result && typeof payload.result === 'object'
      ? payload.result
      : payload;

    const items = Array.isArray(root?.headlines)
      ? root.headlines
          .map((entry, index) => {
            const text = String(entry?.text || '').trim();
            if (!text) return null;
            const tone = String(entry?.tone || 'Professional').trim();
            return { label: `Headline ${index + 1}`, text, note: `Tone: ${tone}`, copyText: text };
          })
          .filter(Boolean)
          .slice(0, 5)
      : Array.isArray(root?.items)
        ? root.items
        : [];

    return items.length ? { type: 'cards', items } : null;
  };

  const normalizeResumeSummaryResult = (payload) => {
    const root = payload?.result && typeof payload.result === 'object'
      ? payload.result
      : payload;

    const items = Array.isArray(root?.summaries)
      ? root.summaries
          .map((entry, index) => {
            const text = String(entry?.text || '').trim();
            if (!text) return null;
            const isBest = Boolean(entry?.bestPick) || index === 0;
            const tags = Array.isArray(entry?.tags)
              ? entry.tags.map((tag) => String(tag || '').trim()).filter(Boolean).slice(0, 4)
              : [];
            return {
              label: isBest ? 'Best Pick' : `Summary Option ${index + 1}`,
              text,
              hashtags: tags,
              bestPick: isBest,
              copyText: text
            };
          })
          .filter(Boolean)
          .slice(0, 5)
      : [];

    if (items.length < 3) return null;
    if (!items.some((item) => item.bestPick)) items[0].bestPick = true;
    return { type: 'cards', items };
  };

  const normalizeInterviewAnswerResult = (payload) => {
    const root = payload?.result && typeof payload.result === 'object'
      ? payload.result
      : payload;
    const answers = Array.isArray(root?.answers) ? root.answers : [];

    const items = answers
      .map((entry, index) => {
        const text = String(entry?.text || '').trim();
        if (!text) return null;
        const style = String(entry?.style || '').trim() || `Answer ${index + 1}`;
        const tags = Array.isArray(entry?.tags)
          ? entry.tags.map((tag) => String(tag || '').trim()).filter(Boolean).slice(0, 4)
          : [];
        const isBest = Boolean(entry?.bestPick) || index === 0;
        return {
          label: isBest ? 'Best Pick' : style,
          text,
          hashtags: tags,
          bestPick: isBest,
          copyText: text
        };
      })
      .filter(Boolean)
      .slice(0, 4);

    if (items.length < 2) return null;
    if (!items.some((item) => item.bestPick)) items[0].bestPick = true;

    return {
      type: 'cards',
      items,
      outputTips: ['Keep answers specific', 'Don’t over-explain', 'Use real examples']
    };
  };

  const normalizeStudyNotesResult = (payload) => {
    const root = payload?.result && typeof payload.result === 'object'
      ? payload.result
      : payload;

    const summary = String(root?.summary || '').trim();
    const bulletPoints = Array.isArray(root?.bulletPoints) ? root.bulletPoints.map((item) => String(item || '').trim()).filter(Boolean) : [];
    const keywords = Array.isArray(root?.keywords) ? root.keywords.map((item) => String(item || '').trim()).filter(Boolean) : [];
    const quickRevision = Array.isArray(root?.quickRevision) ? root.quickRevision.map((item) => String(item || '').trim()).filter(Boolean) : [];
    const mnemonic = String(root?.mnemonic || '').trim();

    if (!summary || !bulletPoints.length || !keywords.length || !quickRevision.length) return null;

    const items = [
      {
        label: 'Summary',
        text: summary,
        hashtags: ['Summary', 'Best Pick'],
        bestPick: true,
        copyText: summary
      },
      {
        label: 'Bullet Points',
        rows: bulletPoints.slice(0, 6),
        hashtags: ['Bullet Summary'],
        copyText: bulletPoints.slice(0, 6).join('\n')
      },
      {
        label: 'Important Keywords',
        text: keywords.slice(0, 10).join(', '),
        hashtags: ['Keywords'],
        copyText: keywords.slice(0, 10).join(', ')
      },
      {
        label: 'Quick Revision',
        rows: quickRevision.slice(0, 5),
        hashtags: ['Quick Revision'],
        copyText: quickRevision.slice(0, 5).join('\n')
      }
    ];

    if (mnemonic) {
      items.push({
        label: 'Optional Mnemonic',
        text: mnemonic,
        hashtags: ['Memory Aid'],
        copyText: mnemonic
      });
    }

    return {
      type: 'cards',
      items,
      outputTips: ['Read once after summarizing', 'Highlight formulas or terms', 'Revise with short bullet points']
    };
  };

  const normalizeAssignmentRewriterResult = (payload) => {
    const root = payload?.result && typeof payload.result === 'object'
      ? payload.result
      : payload;

    const rewrittenVersion = String(root?.rewrittenVersion || '').trim();
    const shortVersion = String(root?.shortVersion || '').trim();
    const improvementTips = Array.isArray(root?.improvementTips)
      ? root.improvementTips.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 5)
      : [];

    if (!rewrittenVersion || !shortVersion || !improvementTips.length) return null;

    return {
      type: 'cards',
      items: [
        {
          label: 'Rewritten Version',
          text: rewrittenVersion,
          bestPick: true,
          hashtags: ['Best Pick', 'Meaning Preserved'],
          copyText: rewrittenVersion
        },
        {
          label: 'Short Version',
          text: shortVersion,
          hashtags: ['Short Version'],
          copyText: shortVersion
        },
        {
          label: 'Improvement Tips',
          rows: improvementTips,
          hashtags: ['Review Tips'],
          copyText: improvementTips.join('\n')
        }
      ],
      outputTips: ['Check facts', 'Add your own understanding', 'Keep citations if needed']
    };
  };

  const normalizeSopResult = (payload) => {
    const root = payload?.result && typeof payload.result === 'object'
      ? payload.result
      : payload;

    const sopDraft = String(root?.sopDraft || '').trim();
    const breakdown = Array.isArray(root?.sectionBreakdown)
      ? root.sectionBreakdown.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 6)
      : [];

    if (!sopDraft) return null;

    const items = [
      {
        label: 'Full SOP Draft',
        text: sopDraft,
        bestPick: true,
        hashtags: ['SOP Draft', 'Best Pick'],
        copyText: sopDraft
      }
    ];

    if (breakdown.length) {
      items.push({
        label: 'Section-wise Breakdown',
        rows: breakdown,
        hashtags: ['Structure'],
        copyText: breakdown.join('\n')
      });
    }

    return {
      type: 'cards',
      items,
      outputTips: ['Be specific', 'Mention relevant projects', 'Keep it genuine']
    };
  };

  const normalizeLinkedinNetworkingMessageResult = (payload) => {
    const root = payload?.result && typeof payload.result === 'object'
      ? payload.result
      : payload;
    const connectionRequest = String(root?.connectionRequest || '').trim();
    const followUp = String(root?.followUp || '').trim();
    const networkingMessage = String(root?.networkingMessage || '').trim();
    if (!connectionRequest || !followUp || !networkingMessage) return null;

    return {
      type: 'cards',
      items: [
        {
          label: 'Best Pick',
          text: connectionRequest,
          bestPick: true,
          hashtags: ['Connection Request', 'Best Pick'],
          copyText: connectionRequest
        },
        {
          label: 'Follow-Up',
          text: followUp,
          hashtags: ['Follow-Up'],
          copyText: followUp
        },
        {
          label: 'Networking Message',
          text: networkingMessage,
          hashtags: ['Networking Message'],
          copyText: networkingMessage
        }
      ],
      outputTips: ['Mention why you’re reaching out', 'Keep it under 300 characters if possible', 'Personalize with a shared point']
    };
  };

  const normalizeJobDescriptionAnalyzerResult = (payload) => {
    const root = payload?.result && typeof payload.result === 'object'
      ? payload.result
      : payload;

    const fitScore = String(root?.fitScore || '').trim();
    const matchLevel = String(root?.matchLevel || '').trim();
    const matchedSkills = Array.isArray(root?.matchedSkills) ? root.matchedSkills.map((item) => String(item || '').trim()).filter(Boolean) : [];
    const missingSkills = Array.isArray(root?.missingSkills) ? root.missingSkills.map((item) => String(item || '').trim()).filter(Boolean) : [];
    const resumeKeywords = Array.isArray(root?.resumeKeywords) ? root.resumeKeywords.map((item) => String(item || '').trim()).filter(Boolean) : [];
    const tailoringTips = Array.isArray(root?.tailoringTips) ? root.tailoringTips.map((item) => String(item || '').trim()).filter(Boolean) : [];
    const verdict = String(root?.verdict || '').trim();

    if (!fitScore || !matchLevel) return null;

    return {
      type: 'cards',
      items: [
        {
          label: 'Fit Score',
          title: `${fitScore} - ${matchLevel}`,
          text: verdict || 'Review detailed matching signals before applying.',
          bestPick: true,
          hashtags: ['Fit Score', 'Best Pick'],
          copyText: `${fitScore} - ${matchLevel}\n${verdict}`
        },
        {
          label: 'Matched Skills',
          rows: matchedSkills.length ? matchedSkills : ['No clear matched skills identified.'],
          hashtags: ['Matched Skills']
        },
        {
          label: 'Missing Skills',
          rows: missingSkills.length ? missingSkills : ['No major missing skills identified.'],
          hashtags: ['Missing Skills']
        },
        {
          label: 'Resume Keywords',
          text: resumeKeywords.join(', '),
          hashtags: ['Resume Keywords']
        },
        {
          label: 'Application Tips',
          rows: tailoringTips.length ? tailoringTips : ['Tailor your resume headline and projects to the role responsibilities.'],
          hashtags: ['Application Tips']
        }
      ],
      outputTips: ['Tailor resume keywords', 'Match relevant skills first', 'Check responsibilities carefully']
    };
  };

  const normalizeScholarshipFinderResult = (payload) => {
    const root = payload?.result && typeof payload.result === 'object'
      ? payload.result
      : payload;
    const recommendations = Array.isArray(root?.recommendations) ? root.recommendations : [];
    if (!recommendations.length) return null;

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
          label: index === 0 ? 'Best Pick' : `Scholarship Type ${index + 1}`,
          title: scholarshipType,
          text: `Suitable for: ${suitableFor}`,
          rows: [
            `What to prepare: ${whatToPrepare.join(', ')}`,
            `Next step: ${nextStep}`
          ],
          bestPick: index === 0,
          copyText: `${scholarshipType}\nSuitable for: ${suitableFor}\nWhat to prepare: ${whatToPrepare.join(', ')}\nNext step: ${nextStep}`
        };
      })
      .filter(Boolean)
      .slice(0, 4);

    if (!items.length) return null;
    return {
      type: 'cards',
      items,
      disclaimer: String(root?.verificationReminder || 'Always verify eligibility and deadlines from official sources.').trim(),
      outputTips: ['Prepare documents', 'Check official portal', 'Review eligibility carefully']
    };
  };

  const normalizeCareerPathQuizResult = (payload) => {
    const root = payload?.result && typeof payload.result === 'object'
      ? payload.result
      : payload;
    const paths = Array.isArray(root?.paths) ? root.paths : [];
    if (paths.length < 3) return null;

    const items = paths
      .map((entry, index) => {
        const title = String(entry?.careerTitle || '').trim();
        const why = String(entry?.whyItFits || '').trim();
        const skills = Array.isArray(entry?.skillsToLearn) ? entry.skillsToLearn.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 5) : [];
        const nextStep = String(entry?.nextStep || '').trim();
        if (!title || !why || !skills.length || !nextStep) return null;
        return {
          label: index === 0 ? 'Best Match' : index === 1 ? 'Suitable Path' : 'Beginner Friendly',
          title,
          text: `Why it fits: ${why}`,
          rows: [`Skills to learn: ${skills.join(', ')}`, `Suggested next step: ${nextStep}`],
          bestPick: index === 0,
          copyText: `${title}\nWhy it fits: ${why}\nSkills to learn: ${skills.join(', ')}\nSuggested next step: ${nextStep}`
        };
      })
      .filter(Boolean)
      .slice(0, 5);

    if (items.length < 3) return null;
    return {
      type: 'cards',
      items,
      disclaimer: 'This tool gives direction, not a final decision. Use it as a starting point.',
      outputTips: ['Explore one path at a time', 'Learn core skills first', 'Try a small project before deciding']
    };
  };

  const normalizeYoutubeScriptResult = (payload) => {
    const root = payload?.result && typeof payload.result === 'object'
      ? payload.result
      : payload;
    const scripts = Array.isArray(root?.scripts) ? root.scripts : [];
    if (scripts.length < 3) return null;

    const items = scripts
      .map((entry, index) => {
        const title = String(entry?.titleIdea || '').trim();
        const hook = String(entry?.hook || '').trim();
        const mainPoints = Array.isArray(entry?.mainPoints) ? entry.mainPoints.map((p) => String(p || '').trim()).filter(Boolean).slice(0, 5) : [];
        const cta = String(entry?.cta || '').trim();
        const shot = String(entry?.shotSuggestion || '').trim();
        if (!title || !hook || !mainPoints.length || !cta) return null;
        return {
          label: index === 0 ? 'Best Starter Idea' : index === 1 ? 'Hook Strong' : 'Suitable Script',
          title,
          text: `Hook: ${hook}`,
          rows: [`Main points: ${mainPoints.join(' | ')}`, `CTA: ${cta}`, shot ? `Shot/Scene: ${shot}` : ''],
          bestPick: index === 0,
          copyText: `${title}\nHook: ${hook}\n${mainPoints.join('\n')}\nCTA: ${cta}${shot ? `\nShot/Scene: ${shot}` : ''}`
        };
      })
      .filter(Boolean)
      .slice(0, 5);

    if (items.length < 3) return null;
    return {
      type: 'cards',
      items,
      outputTips: ['Start with a question or bold statement', 'Keep the first line engaging', 'End with one clear CTA']
    };
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
    if (toolId === 'resume-summary-generator') return normalizeResumeSummaryResult(payload);
    if (toolId === 'interview-answer-generator') return normalizeInterviewAnswerResult(payload);
    if (toolId === 'study-notes-summarizer') return normalizeStudyNotesResult(payload);
    if (toolId === 'assignment-rewriter') return normalizeAssignmentRewriterResult(payload);
    if (toolId === 'sop-generator') return normalizeSopResult(payload);
    if (toolId === 'linkedin-networking-message-generator') return normalizeLinkedinNetworkingMessageResult(payload);
    if (toolId === 'job-description-analyzer') return normalizeJobDescriptionAnalyzerResult(payload);
    if (toolId === 'scholarship-finder') return normalizeScholarshipFinderResult(payload);
    if (toolId === 'career-path-quiz') return normalizeCareerPathQuizResult(payload);
    if (toolId === 'youtube-shorts-script-generator') return normalizeYoutubeScriptResult(payload);
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

      const configuredBase = typeof window !== 'undefined' ? String(window.TOOLSHALA_API_BASE || '').trim() : '';
      const host = typeof window !== 'undefined' ? window.location.hostname : '';
      const fallbackBase = (
        host.endsWith('github.io')
        || host === 'localhost'
        || host === '127.0.0.1'
        || host === '0.0.0.0'
      ) ? 'https://toolshala.in' : '';
      const apiBase = configuredBase || fallbackBase;
      const apiUrl = `${apiBase}/api/generate-tool`;

      const response = await fetch(apiUrl, {
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
