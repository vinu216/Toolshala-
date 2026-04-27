(function () {
  const toolDefinitions = Array.isArray(window.ToolShalaToolDefinitions) ? window.ToolShalaToolDefinitions : [];
  if (!toolDefinitions.length) {
    return;
  }

  const escapeHtml = (value = '') =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const showToast = (type, title, description = '') => {
    if (window.ToolShalaToast?.show) {
      window.ToolShalaToast.show(type, title, description);
    }
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const TOOL_ENGINE_CONFIG = {
    apiProviderGlobal: 'ToolShalaAIProvider',
    defaultLoadingMessages: ['Generating your result...', 'Preparing your content...', 'Just a moment...']
  };

  const getApiProvider = () => {
    const provider = window[TOOL_ENGINE_CONFIG.apiProviderGlobal];
    if (provider && typeof provider.generate === 'function') {
      return provider;
    }
    return null;
  };

  const copyText = async (text) => {
    if (!text) {
      return false;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', 'true');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(helper);
    return copied;
  };
  
  const shareText = async (title, text) => {
    if (!text) {
      return false;
    }

    if (navigator.share) {
      await navigator.share({
        title: title || 'ToolShala Result',
        text
      });
      return true;
    }

    await copyText(text);
    return false;
  };

  const toDateLabel = (value) =>
    new Date(value).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

  const getToolById = (toolId) => toolDefinitions.find((tool) => tool.id === toolId);

  const pick = (list, index) => list[index % list.length];

  const normalizeCommaList = (value) =>
    String(value || '')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);

  const splitSentences = (value = '') =>
    String(value)
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 20);

  const STOP_WORDS = new Set([
    'the', 'is', 'are', 'a', 'an', 'and', 'to', 'of', 'in', 'on', 'for', 'with', 'that', 'this', 'from', 'by', 'as',
    'be', 'was', 'were', 'or', 'it', 'at', 'can', 'will', 'into', 'about', 'than', 'their', 'them', 'which', 'also'
  ]);

  const extractKeywords = (text = '', limit = 8) => {
    const words = String(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 3 && !STOP_WORDS.has(word));

    const frequency = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => word);
  };

  const rewriteSentence = (sentence = '', tone = 'formal') => {
    let output = String(sentence).trim();
    const replacements = [
      [/\bvery\b/gi, 'highly'],
      [/\ba lot of\b/gi, 'many'],
      [/\bget\b/gi, 'obtain'],
      [/\bshows\b/gi, 'demonstrates'],
      [/\bimportant\b/gi, 'significant'],
      [/\bgood\b/gi, 'effective']
    ];
    replacements.forEach(([pattern, replacement]) => {
      output = output.replace(pattern, replacement);
    });

    if (tone === 'simple') {
      output = output
        .replace(/\btherefore\b/gi, 'so')
        .replace(/\bhowever\b/gi, 'but');
    }

    if (tone === 'academic') {
      output = output.replace(/\bso\b/gi, 'therefore');
    }

    if (tone === 'professional') {
      output = output.replace(/\bI think\b/gi, 'It can be observed');
    }

    return output;
  };

  const getFieldHelperText = (field) => {
    if (field.helperText) {
      return field.helperText;
    }

    if (field.type === 'textarea') {
      return 'Tip: keep it clear and specific for better results.';
    }

    if (field.type === 'date') {
      return 'Use a valid date format before generating.';
    }

    if (field.type === 'number') {
      return 'Enter numeric values only.';
    }

    if (field.type === 'select') {
      return 'Choose the most relevant option to improve output quality.';
    }

    return 'Use short, specific details for smarter suggestions.';
  };
  
  // This registry is intentionally isolated so each tool can be migrated
  // from local template logic to API-backed generation without UI rewrites.
  const generators = {
    'resume-headline-generator': (values, options = {}) => {
      const skills = normalizeCommaList(values.skills);
      const topSkills = skills.slice(0, 3).join(', ');
      const strength = String(values.strength || '').trim();
      const variant = Number(options.variant || 0);
      const baseFormals = [
        `${values.experience} ${values.role} with expertise in ${topSkills}, committed to delivering measurable outcomes.`,
        `${values.role} profile with ${values.experience.toLowerCase()} experience, strong command of ${topSkills}, and a quality-first approach.`,
        `Results-oriented ${values.role} candidate skilled in ${topSkills}, ready to contribute in internship and entry-level environments.`
      ];
      const modern = [
        `${values.role} | ${topSkills} | Building practical, high-impact solutions with consistent execution.`,
        `${values.name} - ${values.role} focused on ${topSkills} and growth through real project delivery.`,
        `Hands-on ${values.role} profile blending ${topSkills} with a modern, problem-solving mindset.`
      ];
      const skillFocused = [
        `${values.role} with core strengths in ${skills.join(', ')}, delivering structured and role-ready outcomes.`,
        `${values.experience} ${values.role} skilled in ${topSkills}, known for clarity, ownership, and steady execution.`,
        `Skill-driven ${values.role} profile with practical capability in ${skills.join(', ')}.`
      ];
      const goalFocused = [
        `Aspiring ${values.role} focused on leveraging ${topSkills} to create consistent, value-driven results.`,
        `${values.role} candidate committed to growth, practical learning, and impact through ${topSkills}.`,
        `Career-focused ${values.role} profile building expertise in ${topSkills} for long-term professional growth.`
      ];
      const toneSets = [baseFormals, modern, skillFocused, goalFocused];
      const headlines = toneSets.map((set, index) => pick(set, variant + index));
      if (strength) {
        headlines.push(`${values.role} profile with a strong focus on ${strength}, backed by ${topSkills}.`);
      }
      return {
        type: 'cards',
        items: headlines.slice(0, 5)
      };
    },
    'resume-summary-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const skills = normalizeCommaList(values.skills);
      const topSkills = skills.slice(0, 4);
      const tone = String(values.tone || 'professional').toLowerCase();
      const experience = String(values.experience || 'Fresher').trim();
      const achievement = String(values.achievement || '').trim();
      const industry = String(values.industry || '').trim();
      const role = String(values.role || '').trim();
      const name = String(values.name || '').trim();

      const experienceLine = experience === 'Fresher'
        ? 'fresher focused on practical learning and consistent execution'
        : `early-career ${role} profile with ${experience.toLowerCase()} experience`;

      const toneOpener = {
        professional: `${name} is a ${experienceLine}`,
        confident: `${name} is a driven ${role} candidate with a ${experience === 'Fresher' ? 'strong fresher mindset' : `solid ${experience.toLowerCase()} foundation`}`,
        simple: `${name} is building a career as a ${role}`,
        'ats-friendly': `${role} candidate with ${experience.toLowerCase()} exposure and role-relevant skills`
      };

      const strengthLine = achievement
        ? `Key strength: ${achievement}.`
        : 'Known for being reliable, detail-focused, and quick to learn in team environments.';

      const industryLine = industry
        ? `Interested in contributing to ${industry} roles with practical, job-ready execution.`
        : 'Open to internship and entry-level opportunities where impact and growth go together.';

      const templates = [
        {
          label: 'Best Pick',
          text: `${toneOpener[tone] || toneOpener.professional}. Skilled in ${topSkills.join(', ')}. ${strengthLine} ${industryLine}`,
          hashtags: ['Best Pick', 'ATS-Friendly', 'Skills Focused', 'Professional'],
          bestPick: true
        },
        {
          label: 'Summary Option 2',
          text: `Aspiring ${role} with strengths in ${topSkills.join(', ')} and a clear focus on delivering structured outcomes. ${industry ? `Focused on ${industry} use-cases and business impact.` : 'Focused on internship and fresher-level impact.'}`,
          hashtags: ['ATS-Friendly', 'Skills Focused']
        },
        {
          label: 'Summary Option 3',
          text: `${experience === 'Fresher' ? 'Motivated fresher' : `Early-career professional (${experience})`} targeting ${role} opportunities. Brings practical ability in ${topSkills.slice(0, 3).join(', ')} with a learning-first, ownership-driven approach.`,
          hashtags: ['Professional', 'Entry-Level Ready']
        },
        {
          label: 'Summary Option 4',
          text: `${role} profile with role-aligned skills in ${topSkills.join(', ')} and strong communication, collaboration, and execution habits. ${achievement ? `Notable strength: ${achievement}.` : 'Committed to continuous improvement and measurable contribution.'}`,
          hashtags: ['Professional', 'ATS-Friendly']
        },
        {
          label: 'Summary Option 5',
          text: `Career-focused ${role} candidate prepared for internships and entry-level roles. Combines ${topSkills.slice(0, 3).join(', ')} with discipline, adaptability, and a result-oriented mindset.`,
          hashtags: ['Simple', 'Job-Ready']
        }
      ];

      const rotated = templates.map((item, index) => templates[(index + variant) % templates.length]).slice(0, 5);
      const finalItems = rotated.map((item, index) => ({
        ...item,
        label: index === 0 ? 'Best Pick' : `Summary Option ${index + 1}`,
        bestPick: index === 0,
        copyText: item.text
      }));

      return {
        type: 'cards',
        items: finalItems
      };
    },
    'interview-answer-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const question = String(values.question || '').trim();
      const role = String(values.role || '').trim();
      const experience = String(values.experience || 'Fresher').trim();
      const skill = String(values.skill || '').trim();
      const achievement = String(values.achievement || '').trim();
      const tone = String(values.tone || 'professional').toLowerCase();
      const preferredStyle = String(values.answerStyle || 'short').toLowerCase();
      const loweredQuestion = question.toLowerCase();

      const behavioralSignals = ['tell me about a time', 'example of', 'situation', 'challenge', 'conflict', 'deadline', 'teamwork', 'leadership', 'mistake', 'pressure'];
      const technicalSignals = ['how do you', 'what is', 'difference', 'algorithm', 'debug', 'api', 'database', 'javascript', 'react', 'sql', 'performance', 'architecture'];
      const isBehavioral = behavioralSignals.some((signal) => loweredQuestion.includes(signal));
      const isTechnical = technicalSignals.some((signal) => loweredQuestion.includes(signal));

      const toneLead = {
        professional: 'I approach this in a structured and practical way.',
        confident: 'I am confident in my approach and focus on measurable outcomes.',
        friendly: 'I like to keep my approach practical and collaborative.',
        simple: 'I keep the approach clear and easy to follow.'
      };

      const projectLine = achievement
        ? `A relevant example is: ${achievement}`
        : `In my recent learning/project work for ${role}, I applied ${skill} in practical tasks.`;

      const shortAnswer = {
        label: 'Short Answer',
        text: `${toneLead[tone]} For a ${role} role, I rely on ${skill} to solve problems quickly and clearly. ${projectLine}`,
        hashtags: ['Short Answer', 'Role-Relevant', 'Professional'],
        copyText: `${question}\n\n${toneLead[tone]} For a ${role} role, I rely on ${skill} to solve problems quickly and clearly. ${projectLine}`
      };

      const detailedAnswer = {
        label: 'Detailed Answer',
        text: `For this question, I would answer with context, action, and result. I am currently at the ${experience} stage and I focus on ${skill} to deliver reliable work as a ${role}. ${projectLine} This taught me how to prioritize, communicate updates, and improve outcomes without overcomplicating the solution.`,
        hashtags: ['Detailed Answer', 'Skills Focused', 'Interview Ready'],
        copyText: `${question}\n\nFor this question, I would answer with context, action, and result. I am currently at the ${experience} stage and I focus on ${skill} to deliver reliable work as a ${role}. ${projectLine} This taught me how to prioritize, communicate updates, and improve outcomes without overcomplicating the solution.`
      };

      const starAnswer = {
        label: 'STAR Answer',
        text: `Situation: During a learning/project phase linked to ${role}, I faced a practical challenge.\nTask: I needed to use ${skill} to move the work forward on time.\nAction: I broke the task into steps, coordinated with stakeholders, and implemented a focused solution.${achievement ? ` I used this project context: ${achievement}` : ''}\nResult: The task was completed with better clarity, smoother execution, and a stronger final outcome.`,
        hashtags: ['STAR Answer', 'Behavioral Ready', 'Structured'],
        copyText: `${question}\n\nSituation: During a learning/project phase linked to ${role}, I faced a practical challenge.\nTask: I needed to use ${skill} to move the work forward on time.\nAction: I broke the task into steps, coordinated with stakeholders, and implemented a focused solution.${achievement ? ` I used this project context: ${achievement}` : ''}\nResult: The task was completed with better clarity, smoother execution, and a stronger final outcome.`
      };

      const technicalAnswer = {
        label: 'Detailed Answer',
        text: `For technical questions, I first clarify the requirement, then apply ${skill} to build a practical solution for ${role}-level expectations. I explain trade-offs, test edge cases, and share what I would improve next. ${achievement ? `Example: ${achievement}` : 'I keep the explanation concise and focused on real implementation.'}`,
        hashtags: ['Technical', 'Practical', 'Detailed Answer'],
        copyText: `${question}\n\nFor technical questions, I first clarify the requirement, then apply ${skill} to build a practical solution for ${role}-level expectations. I explain trade-offs, test edge cases, and share what I would improve next. ${achievement ? `Example: ${achievement}` : 'I keep the explanation concise and focused on real implementation.'}`
      };

      let variants = [shortAnswer, detailedAnswer, starAnswer];
      if (isBehavioral) {
        variants = [starAnswer, detailedAnswer, shortAnswer];
      } else if (isTechnical) {
        variants = [shortAnswer, technicalAnswer, detailedAnswer];
      }

      if (preferredStyle === 'short') variants = [shortAnswer, ...variants.filter((entry) => entry.label !== 'Short Answer')];
      if (preferredStyle === 'detailed') variants = [detailedAnswer, ...variants.filter((entry) => entry.label !== 'Detailed Answer')];
      if (preferredStyle === 'star') variants = [starAnswer, ...variants.filter((entry) => entry.label !== 'STAR Answer')];

      const rotated = variants.map((_, index) => variants[(index + (variant % variants.length)) % variants.length]).slice(0, 4);
      const items = rotated.map((entry, index) => ({
        ...entry,
        bestPick: index === 0,
        label: index === 0 ? 'Best Pick' : entry.label
      }));

      return {
        type: 'cards',
        items,
        outputTips: ['Keep answers specific', 'Don’t over-explain', 'Use real examples']
      };
    },
    'study-notes-summarizer': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const topic = String(values.topic || '').trim();
      const notes = String(values.notes || '').trim();
      const educationLevel = String(values.educationLevel || 'school').trim();
      const outputStyle = String(values.outputStyle || 'bullet-summary').trim();
      const focus = String(values.focus || 'full-revision').trim();
      const tone = String(values.tone || 'simple').trim();

      const sentences = splitSentences(notes);
      const sortedByLength = [...sentences].sort((a, b) => b.length - a.length);
      const summarySentences = sortedByLength.slice(variant % 2, (variant % 2) + 2).length
        ? sortedByLength.slice(variant % 2, (variant % 2) + 2)
        : sentences.slice(0, 2);
      const summaryText = summarySentences.join(' ');

      const keywordList = extractKeywords(`${topic} ${notes}`, 8);
      const bulletBase = sentences.slice(0, 6).map((sentence) => sentence.replace(/^[•\-]\s*/, ''));
      const revisionPoints = bulletBase.slice(0, 4).map((point, index) => `Point ${index + 1}: ${point}`);

      const focusLine = focus === 'definitions'
        ? 'Focus on term meanings and exact definitions.'
        : focus === 'important-facts'
          ? 'Focus on dates, facts, and high-value exam statements.'
          : focus === 'formula-concepts'
            ? 'Focus on formulas, methods, and concept application.'
            : 'Focus on complete revision flow from concept to recall.';

      const styleLine = outputStyle === 'short-notes'
        ? 'Structured as compact short notes for last-minute revision.'
        : outputStyle === 'exam-revision-points'
          ? 'Structured as exam-ready revision points with quick recall intent.'
          : 'Structured in bullet summary format for easy scanning.';

      const toneLine = tone === 'academic'
        ? 'Language tone: academic and concept-driven.'
        : tone === 'exam-friendly'
          ? 'Language tone: exam-friendly and recall-oriented.'
          : 'Language tone: simple and easy to understand.';

      const mnemonicSource = keywordList.slice(0, 4);
      const mnemonic = mnemonicSource.length >= 3
        ? `Mnemonic (${mnemonicSource.map((word) => word[0]?.toUpperCase()).join('')}): Remember ${mnemonicSource.join(', ')}.`
        : '';

      const cards = [
        {
          label: 'Summary',
          title: topic,
          text: summaryText || `This topic covers key ideas related to ${topic}.`,
          note: `${styleLine} ${toneLine}`,
          hashtags: ['Summary', 'Exam Ready', 'Best Pick'],
          bestPick: true
        },
        {
          label: 'Bullet Points',
          text: 'Important bullet points from your notes:',
          rows: bulletBase.slice(0, 5),
          hashtags: ['Bullet Summary', educationLevel.replace('-', ' ')],
          copyText: bulletBase.slice(0, 5).join('\n')
        },
        {
          label: 'Important Keywords',
          text: keywordList.length ? keywordList.join(', ') : 'Keywords could not be extracted clearly. Try adding more content.',
          hashtags: ['Keywords', 'Revision']
        },
        {
          label: 'Quick Revision',
          rows: revisionPoints.length ? revisionPoints : ['Revise core definitions', 'Review main concept flow', 'Practice one related question'],
          note: focusLine,
          hashtags: ['Quick Revision', 'Exam Friendly']
        }
      ];

      if (mnemonic) {
        cards.push({
          label: 'Optional Mnemonic',
          text: mnemonic,
          hashtags: ['Memory Aid']
        });
      }

      return {
        type: 'cards',
        items: cards.map((card, index) => ({
          ...card,
          bestPick: index === 0,
          copyText: card.copyText || [card.title, card.text, Array.isArray(card.rows) ? card.rows.join('\n') : '', card.note].filter(Boolean).join('\n')
        })),
        outputTips: ['Read once after summarizing', 'Highlight formulas or terms', 'Revise with short bullet points']
      };
    },
    'assignment-rewriter': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const originalText = String(values.originalText || '').trim();
      const topic = String(values.topic || '').trim();
      const tone = String(values.tone || 'formal').toLowerCase();
      const targetLength = String(values.targetLength || 'same').toLowerCase();
      const keyPoints = String(values.keyPoints || '').trim();
      const audience = String(values.audience || '').trim();

      const sentences = splitSentences(originalText);
      const rewrittenSentences = sentences.map((sentence, index) => {
        const base = rewriteSentence(sentence, tone);
        if (variant % 2 === 1 && index % 2 === 0) {
          return base.replace(/\bIn conclusion\b/gi, 'Overall');
        }
        return base;
      });

      let rewrittenText = rewrittenSentences.join(' ');
      if (!rewrittenText) {
        rewrittenText = rewriteSentence(originalText, tone);
      }

      if (keyPoints) {
        rewrittenText = `${rewrittenText} Key focus included: ${keyPoints}.`;
      }

      if (audience) {
        rewrittenText = `${rewrittenText} This version is adjusted for a ${audience} audience.`;
      }

      if (targetLength === 'shorter') {
        rewrittenText = splitSentences(rewrittenText).slice(0, Math.max(2, Math.ceil(splitSentences(rewrittenText).length * 0.7))).join(' ');
      }

      if (targetLength === 'longer') {
        rewrittenText = `${rewrittenText} This topic, ${topic}, can also be understood through practical examples and real-world relevance for better academic clarity.`;
      }

      const shortVersion = splitSentences(rewrittenText).slice(0, 2).join(' ') || rewrittenText.slice(0, 220);
      const tips = [
        'Check whether the rewritten version still matches your original meaning.',
        'Keep subject terms and references accurate for your assignment requirements.',
        'Add one personal understanding line to make the final submission authentic.'
      ];

      return {
        type: 'cards',
        items: [
          {
            label: 'Rewritten Version',
            title: topic,
            text: rewrittenText,
            bestPick: true,
            hashtags: ['Clarity Improved', 'Meaning Preserved', 'Best Pick'],
            copyText: rewrittenText
          },
          {
            label: 'Short Version',
            text: shortVersion,
            hashtags: ['Short Version', 'Revision Friendly'],
            copyText: shortVersion
          },
          {
            label: 'Improvement Tips',
            rows: tips,
            hashtags: ['Review Tips'],
            copyText: tips.join('\n')
          }
        ],
        outputTips: ['Check facts', 'Add your own understanding', 'Keep citations if needed']
      };
    },
    'sop-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const program = String(values.program || '').trim();
      const university = String(values.university || '').trim();
      const background = String(values.academicBackground || '').trim();
      const careerGoals = String(values.careerGoals || '').trim();
      const achievements = String(values.achievements || '').trim();
      const whyProgram = String(values.whyProgram || '').trim();
      const tone = String(values.tone || 'formal').toLowerCase();
      const wordCount = String(values.wordCount || 'medium').toLowerCase();

      const toneLine = tone === 'motivated'
        ? 'I am deeply motivated to continue this journey with purpose and discipline.'
        : tone === 'confident'
          ? 'I am confident that my preparation and intent align strongly with this opportunity.'
          : tone === 'academic'
            ? 'My academic intent is grounded in structured inquiry, applied learning, and scholarly growth.'
            : 'I respectfully present this statement to express my academic purpose and long-term commitment.';

      const intro = `I am applying for the ${program} at ${university} to strengthen my academic and professional foundation. ${toneLine}`;
      const academicSection = `Academic Background: ${background}`;
      const motivationSection = `Motivation: ${whyProgram}`;
      const goalsSection = `Goals: ${careerGoals}`;
      const achievementsSection = `Relevant Achievements / Projects: ${achievements}`;
      const conclusion = `Conclusion: I believe ${program} at ${university} is the right next step to help me contribute meaningfully in my domain through responsible and practical impact.`;

      let sopDraft = [intro, academicSection, achievementsSection, motivationSection, goalsSection, conclusion].join('\n\n');
      if (variant % 2 === 1) {
        sopDraft = [intro, motivationSection, academicSection, achievementsSection, goalsSection, conclusion].join('\n\n');
      }

      if (wordCount === 'short') {
        sopDraft = [intro, academicSection, goalsSection, conclusion].join('\n\n');
      } else if (wordCount === 'long') {
        sopDraft = `${sopDraft}\n\nI am eager to collaborate with peers, contribute to project-driven learning, and use this academic exposure to build lasting social and professional value.`;
      }

      const sectionRows = [
        `Introduction: Why you are applying to ${program}.`,
        'Academic Background: Relevant academic preparation and learning trajectory.',
        'Motivation: Why this university/program is a strong fit.',
        'Goals: Short-term and long-term direction.',
        'Conclusion: Readiness, fit, and contribution intent.'
      ];

      return {
        type: 'cards',
        items: [
          {
            label: 'Full SOP Draft',
            title: `${program} - ${university}`,
            text: sopDraft,
            bestPick: true,
            hashtags: ['SOP Draft', 'Best Pick', 'Application Ready'],
            copyText: sopDraft
          },
          {
            label: 'Section-wise Breakdown',
            rows: sectionRows,
            hashtags: ['Introduction', 'Motivation', 'Goals'],
            copyText: sectionRows.join('\n')
          }
        ],
        outputTips: ['Be specific', 'Mention relevant projects', 'Keep it genuine']
      };
    },
    'linkedin-networking-message-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const recipientType = String(values.recipientType || 'professional').toLowerCase();
      const purpose = String(values.purpose || '').trim();
      const background = String(values.background || '').trim();
      const targetRole = String(values.targetRole || '').trim();
      const sharedReference = String(values.sharedReference || '').trim();
      const tone = String(values.tone || 'polite').toLowerCase();

      const greetingMap = {
        recruiter: 'Hello',
        alumni: 'Hi',
        founder: 'Hello',
        professional: 'Hi'
      };
      const recipientContext = {
        recruiter: 'your hiring insights',
        alumni: 'your alumni journey',
        founder: 'your startup journey',
        professional: 'your professional experience'
      };
      const toneTail = {
        polite: 'Thank you for your time.',
        professional: 'Appreciate your consideration.',
        friendly: 'Thanks a lot for your time!',
        confident: 'I would value a quick response when convenient.'
      };

      const sharedLine = sharedReference ? ` ${sharedReference}.` : '';
      const connectionRequest = `${greetingMap[recipientType]}, I am exploring ${targetRole} opportunities. ${background} I reached out because I value ${recipientContext[recipientType]}.${sharedLine} Would love to connect.`;
      const followUp = `${greetingMap[recipientType]}, following up on my earlier note regarding ${purpose}. I am actively preparing for ${targetRole} roles and would appreciate any brief guidance.${sharedLine} ${toneTail[tone]}`;
      const networkingIntro = `${greetingMap[recipientType]}, I am currently focused on ${targetRole}. ${background} I am reaching out for networking and to learn from your experience related to ${purpose}.${sharedLine} ${toneTail[tone]}`;

      const optionsList = [
        {
          label: 'Connection Request',
          text: connectionRequest,
          hashtags: ['Connection Request', 'Best Pick'],
          bestPick: true
        },
        {
          label: 'Follow-Up',
          text: followUp,
          hashtags: ['Follow-Up', 'Polite']
        },
        {
          label: 'Networking Message',
          text: networkingIntro,
          hashtags: ['Networking Message', 'Concise']
        }
      ];

      const rotated = optionsList.map((_, index) => optionsList[(index + (variant % optionsList.length)) % optionsList.length]);

      return {
        type: 'cards',
        items: rotated.map((item, index) => ({
          ...item,
          label: index === 0 ? 'Best Pick' : item.label,
          bestPick: index === 0,
          copyText: item.text
        })),
        outputTips: ['Mention why you’re reaching out', 'Keep it under 300 characters if possible', 'Personalize with a shared point']
      };
    },
    'job-description-analyzer': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const jobDescription = String(values.jobDescription || '').toLowerCase();
      const userSkills = normalizeCommaList(values.userSkills).map((skill) => skill.toLowerCase());
      const experienceLevel = String(values.experienceLevel || 'fresher').trim();
      const targetRole = String(values.targetRole || '').trim();
      const resumeSummary = String(values.resumeSummary || '').trim();
      const tone = String(values.tone || 'clear').toLowerCase();

      const jdKeywords = extractKeywords(jobDescription, 18);
      const matchedSkills = userSkills.filter((skill) => jdKeywords.some((keyword) => keyword.includes(skill) || skill.includes(keyword)));
      const missingSkills = jdKeywords.filter((keyword) => !matchedSkills.some((skill) => skill.includes(keyword))).slice(0, 7);
      const resumeKeywords = jdKeywords.slice(0, 10);

      const rawScore = Math.min(95, Math.max(25, Math.round((matchedSkills.length / Math.max(1, matchedSkills.length + missingSkills.length)) * 100)));
      const fitLevel = rawScore >= 75 ? 'Strong Match' : rawScore >= 55 ? 'Moderate Match' : 'Low Match';
      const verdict = rawScore >= 75
        ? 'You appear to be a strong fit. Focus on role-specific examples and outcomes.'
        : rawScore >= 55
          ? 'You are a partial fit. Improve missing skills and tailor your resume to responsibilities.'
          : 'Current match is weak. Build core skills first and apply strategically.';

      const tailoringTips = [
        `Place ${matchedSkills.slice(0, 3).join(', ') || 'your strongest relevant skills'} near the top of your resume.`,
        `Add job-specific keywords like ${resumeKeywords.slice(0, 4).join(', ')} in projects and summary.`,
        missingSkills.length
          ? `Upskill on: ${missingSkills.slice(0, 3).join(', ')} before applying broadly.`
          : 'You already cover most visible skill signals from this job description.'
      ];

      const toneNote = tone === 'detailed'
        ? `Analysis depth: detailed. Experience level considered: ${experienceLevel}.`
        : tone === 'beginner-friendly'
          ? `Analysis depth: beginner friendly. Start with one core skill gap at a time.`
          : `Analysis depth: clear and concise.`;

      const cards = [
        {
          label: 'Fit Score',
          title: `${rawScore}% - ${fitLevel}`,
          text: `Target role: ${targetRole}. ${verdict}`,
          note: toneNote,
          hashtags: ['Fit Score', 'Best Pick'],
          bestPick: true
        },
        {
          label: 'Matched Skills',
          rows: matchedSkills.length ? matchedSkills.slice(variant % 2, (variant % 2) + 6) : ['No strong direct matches found from current skills input.'],
          hashtags: ['Matched Skills']
        },
        {
          label: 'Missing Skills',
          rows: missingSkills.length ? missingSkills : ['No major missing skills detected from visible job keywords.'],
          hashtags: ['Missing Skills']
        },
        {
          label: 'Resume Keywords',
          text: resumeKeywords.join(', '),
          hashtags: ['Keywords', 'Resume Tailoring']
        },
        {
          label: 'Application Tips',
          rows: tailoringTips,
          note: resumeSummary ? 'Resume summary detected. Update it using matched + missing-skill insights.' : 'Add a role-focused resume summary before applying.',
          hashtags: ['Practical Tips']
        }
      ];

      return {
        type: 'cards',
        items: cards.map((item) => ({
          ...item,
          copyText: [item.title, item.text, Array.isArray(item.rows) ? item.rows.join('\n') : '', item.note].filter(Boolean).join('\n')
        })),
        outputTips: ['Tailor resume keywords', 'Match relevant skills first', 'Check responsibilities carefully']
      };
    },
    'scholarship-finder': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const educationLevel = String(values.educationLevel || 'undergraduate').trim();
      const state = String(values.state || '').trim();
      const category = String(values.category || '').trim();
      const academicPerformance = String(values.academicPerformance || '').trim();
      const needType = String(values.needType || 'general').trim();
      const fieldOfStudy = String(values.fieldOfStudy || '').trim();
      const specialInterest = String(values.specialInterest || '').trim();

      const baseTypes = [
        {
          scholarshipType: `${needType === 'merit-based' ? 'Merit Scholarship' : needType === 'need-based' ? 'Need-Based Financial Aid' : 'General Academic Scholarship'} (${educationLevel})`,
          suitableFor: `${educationLevel} students in ${state}${fieldOfStudy ? ` with interest in ${fieldOfStudy}` : ''}.`,
          prepare: ['Academic transcripts', 'Identity and address proof', 'Income certificate (if required)', 'Personal statement'],
          nextStep: 'Search state scholarship portals and official institution aid pages.'
        },
        {
          scholarshipType: `${state} State Support Schemes`,
          suitableFor: `Students studying in or domiciled in ${state}${category ? ` under ${category} category criteria` : ''}.`,
          prepare: ['Domicile certificate', 'Category certificate (if applicable)', 'Bank account details', 'Recent marksheets'],
          nextStep: 'Check your state government scholarship portal and verify eligibility filters.'
        },
        {
          scholarshipType: `${specialInterest ? `${specialInterest.toUpperCase()}-Focused Scholarship Categories` : 'Field and Profile-Based Scholarship Categories'}`,
          suitableFor: specialInterest
            ? `Students with profile focus in ${specialInterest} and consistent academic record (${academicPerformance}).`
            : `Students with relevant achievements and consistent performance (${academicPerformance}).`,
          prepare: ['Proof of achievements/projects', 'Recommendation letter', 'Resume/CV', 'Statement of purpose'],
          nextStep: 'Shortlist official scholarship categories from trusted portals and compare document requirements.'
        }
      ];

      const rotated = baseTypes.map((_, index) => baseTypes[(index + (variant % baseTypes.length)) % baseTypes.length]);
      const items = rotated.map((entry, index) => ({
        label: index === 0 ? 'Best Pick' : `Scholarship Type ${index + 1}`,
        title: entry.scholarshipType,
        text: `Suitable for: ${entry.suitableFor}`,
        rows: [
          `What to prepare: ${entry.prepare.join(', ')}`,
          `Next step: ${entry.nextStep}`
        ],
        bestPick: index === 0,
        copyText: `${entry.scholarshipType}\nSuitable for: ${entry.suitableFor}\nWhat to prepare: ${entry.prepare.join(', ')}\nNext step: ${entry.nextStep}`
      }));

      return {
        type: 'cards',
        items,
        disclaimer: 'Verification reminder: Always check final eligibility and deadlines from official scholarship sources.',
        outputTips: ['Prepare documents', 'Check official portal', 'Review eligibility carefully']
      };
    },
    'career-path-quiz': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const stage = String(values.stage || 'college').trim();
      const interests = String(values.interests || '').toLowerCase();
      const workStyle = String(values.workStyle || 'creative').trim();
      const strengths = normalizeCommaList(values.strengths);
      const codingPreference = String(values.codingPreference || 'no').trim();
      const goal = String(values.goal || 'job').trim();

      const codingPaths = [
        { title: 'Frontend Developer', why: 'You show problem-solving and digital product interest.', skills: ['HTML/CSS', 'JavaScript', 'React basics'], step: 'Build 2 UI projects and publish on GitHub.' },
        { title: 'Data Analyst', why: 'Your analytical signals align with structured insight work.', skills: ['Excel', 'SQL', 'Data visualization'], step: 'Create one dashboard-based portfolio project.' },
        { title: 'QA / Test Engineer', why: 'Detail orientation and structured thinking fit quality roles.', skills: ['Testing basics', 'Bug reporting', 'Automation fundamentals'], step: 'Test one live app and write bug reports.' }
      ];

      const nonCodingPaths = [
        { title: 'Digital Marketing Associate', why: 'Creative + audience-focused interest fits growth roles.', skills: ['Content strategy', 'SEO basics', 'Campaign analytics'], step: 'Run a mini campaign and track results.' },
        { title: 'Business Development Executive', why: 'People-focused and communication strengths map well here.', skills: ['Lead qualification', 'Pitching', 'CRM basics'], step: 'Practice outreach scripts and mock calls.' },
        { title: 'Operations Coordinator', why: 'Independent execution and process thinking are valuable here.', skills: ['Process mapping', 'Spreadsheet workflows', 'Reporting'], step: 'Document and optimize one workflow project.' }
      ];

      const hybridPaths = [
        { title: 'Product Management Trainee', why: 'Interest + structured thinking fit product planning paths.', skills: ['User research', 'PRD writing', 'Roadmap basics'], step: 'Draft PRD for one simple app idea.' },
        { title: 'UI/UX Designer', why: 'Creative work style and user empathy fit this path.', skills: ['Figma', 'Wireframing', 'User testing'], step: 'Design one case study from problem to prototype.' },
        { title: 'Research Assistant', why: 'Good for learners targeting higher studies and analysis-heavy roles.', skills: ['Literature review', 'Documentation', 'Presentation'], step: 'Summarize one research paper weekly.' }
      ];

      let pool = codingPreference === 'yes' ? [...codingPaths, ...hybridPaths] : [...nonCodingPaths, ...hybridPaths];
      if (workStyle === 'analytical') pool = pool.sort((a, b) => Number(a.title.includes('Data')) - Number(b.title.includes('Data'))).reverse();
      if (interests.includes('design')) pool = pool.sort((a, b) => Number(a.title.includes('Designer')) - Number(b.title.includes('Designer'))).reverse();
      if (goal === 'entrepreneurship') {
        pool.unshift({ title: 'Startup Generalist', why: 'Broad ownership mindset fits early-stage entrepreneurship goals.', skills: ['Problem validation', 'Basic marketing', 'Execution discipline'], step: 'Solve one local problem with a simple MVP.' });
      }

      const selected = pool.slice(0, 5).map((path, index) => {
        const strengthText = strengths.slice(0, 3).join(', ') || 'your current strengths';
        return {
          label: index === 0 ? 'Best Match' : index === 1 ? 'Suitable Path' : 'Beginner Friendly',
          title: path.title,
          text: `Why it fits: ${path.why} Profile signals considered: ${workStyle} style, ${stage} stage, strengths like ${strengthText}.`,
          rows: [
            `Skills to learn: ${path.skills.join(', ')}`,
            `Suggested next step: ${path.step}`
          ],
          bestPick: index === 0,
          copyText: `${path.title}\nWhy it fits: ${path.why}\nSkills to learn: ${path.skills.join(', ')}\nSuggested next step: ${path.step}`
        };
      });

      const rotated = selected.map((_, index) => selected[(index + (variant % selected.length)) % selected.length]).slice(0, 5);
      if (rotated.length) {
        rotated[0].bestPick = true;
        rotated[0].label = 'Best Match';
      }

      return {
        type: 'cards',
        items: rotated,
        disclaimer: 'This tool gives direction, not a final decision. Use it as a starting point.',
        outputTips: ['Explore one path at a time', 'Learn core skills first', 'Try a small project before deciding']
      };
    },
    'youtube-shorts-script-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const topic = String(values.topic || '').trim();
      const platform = String(values.platform || 'youtube-shorts').trim();
      const goal = String(values.contentGoal || 'engagement').trim();
      const audience = String(values.audienceType || '').trim();
      const tone = String(values.tone || 'energetic').trim();
      const keywords = normalizeCommaList(values.keywords);
      const length = String(values.videoLength || '').trim();

      const isShort = platform === 'youtube-shorts' || platform === 'instagram-reels';
      const formatLabel = isShort ? 'Short Form' : 'Long Form';
      const hookTemplates = [
        `Stop scrolling if you care about ${topic}.`,
        `Most people get ${topic} wrong—here’s why.`,
        `If you are ${audience}, this will save you time.`
      ];
      const ctas = [
        'Comment your biggest takeaway.',
        'Follow for more practical creator strategies.',
        'Save this and test it today.'
      ];

      const makeScript = (index) => {
        const hook = hookTemplates[(index + variant) % hookTemplates.length];
        const mainPoints = isShort
          ? [`Point 1: Quick insight on ${topic}.`, `Point 2: One mistake to avoid for ${audience}.`, `Point 3: Action step you can apply today.`]
          : [`Intro: Why ${topic} matters for ${audience}.`, `Body 1: Core concept and common mistake.`, `Body 2: Real example or mini framework.`, `Outro: Summary + next action.`];
        const title = isShort
          ? `${topic}: ${goal} Script Idea ${index + 1}`
          : `${topic} Explained for ${audience} (${goal})`;
        const shot = isShort
          ? 'Shot idea: Fast jump cuts + on-screen text for each key point.'
          : 'Scene idea: Hook face-cam intro, then supporting visuals/slides for body.';

        return {
          label: index === 0 ? 'Best Starter Idea' : index === 1 ? 'Hook Strong' : formatLabel,
          title,
          text: `Hook: ${hook}`,
          rows: [
            `Main points: ${mainPoints.join(' | ')}`,
            `CTA: ${ctas[(index + variant) % ctas.length]}`,
            `Shot/Scene: ${shot}`,
            `Thumbnail/Title variant: ${keywords[0] ? `${topic} + ${keywords[0]} = Better Results` : `${topic}: Do This Instead`}`
          ],
          bestPick: index === 0,
          copyText: `${title}\nHook: ${hook}\n${mainPoints.join('\n')}\nCTA: ${ctas[(index + variant) % ctas.length]}\n${shot}${length ? `\nLength target: ${length}` : ''}`
        };
      };

      const count = isShort ? 3 : 4;
      const items = Array.from({ length: count }, (_, i) => makeScript(i));
      return {
        type: 'cards',
        items,
        outputTips: ['Start with a question or bold statement', 'Keep the first line engaging', 'End with one clear CTA']
      };
    },
    'leave-application-generator': (values, options = {}) => {
      const today = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const start = toDateLabel(values.startDate);
      const end = toDateLabel(values.endDate);
      const recipientMap = {
        teacher: 'Respected Teacher,',
        principal: 'Respected Principal,',
        manager: 'Respected Manager,'
      };
      const subjectMap = {
        teacher: `Leave Application from ${start} to ${end}`,
        principal: `Application for Leave (${start} to ${end})`,
        manager: `Leave Request: ${start} to ${end}`
      };
      const recipientTitleMap = {
        teacher: 'Class Teacher',
        principal: 'The Principal',
        manager: 'Reporting Manager'
      };
      const bodyVariants = [
        `I am ${values.name}. I kindly request leave from ${start} to ${end} due to ${values.reason}.`,
        `This is to request leave for the period ${start} to ${end} as I need time for ${values.reason}.`,
        `I would like to apply for leave from ${start} to ${end} on account of ${values.reason}.`
      ];
      const supportVariants = [
        'I will complete pending work and stay aligned with required updates after rejoining.',
        'I assure you that all pending responsibilities will be covered immediately after my return.',
        'I will ensure minimal disruption by managing pending tasks once I resume.'
      ];
      const variant = Number(options.variant || 0);
      const addNote = String(values.additionalNote || '').trim();
      const noteLine = addNote ? `\n\nAdditional Note: ${addNote}` : '';
      const letter = `Date: ${today}\n\nTo,\n${recipientTitleMap[values.recipientType] || 'Concerned Authority'}\n\nSubject: ${subjectMap[values.recipientType] || `Leave Application from ${start} to ${end}`}\n\n${recipientMap[values.recipientType] || 'Respected Sir/Madam,'}\n\n${pick(bodyVariants, variant)}\n\n${pick(supportVariants, variant)}${noteLine}\n\nKindly consider and approve my leave request.\n\nThank you for your time and support.\n\nSincerely,\n${values.name}`;
      return {
        type: 'text',
        text: letter,
        printable: true,
        className: 'tool-letter-box'
      };
    },
    'instagram-caption-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const topic = values.topic;
      const contentType = values.contentType || 'personal';
      const tone = values.tone || 'casual';
      const keywordList = normalizeCommaList(values.keywords);

      const toneTemplates = {
        casual: [
          `Little update: ${topic} and I am loving the progress so far.`,
          `${topic} day. Small wins, good energy, and steady growth.`,
          `Just showing up for ${topic} and getting better each day.`
        ],
        professional: [
          `${topic}: focused execution, clear goals, and measurable progress.`,
          `Working on ${topic} with consistency and practical implementation.`,
          `${topic} update: learning, applying, and improving with each step.`
        ],
        funny: [
          `Started ${topic} for 20 minutes... somehow became a full-day mission.`,
          `Me: quick task on ${topic}. Also me after 3 hours: still here.`,
          `${topic} looked easy in my head. Real life had other plans.`
        ],
        inspirational: [
          `Every small step in ${topic} is building a stronger future.`,
          `${topic} reminds me that consistency beats perfection every time.`,
          `Keep showing up for ${topic}; progress is already happening.`
        ]
      };

      const contentHooks = {
        personal: ['Real moment', 'Personal update', 'Current journey'],
        educational: ['What I learned', 'Quick takeaway', 'Study insight'],
        promotional: ['Now available', 'Built for you', 'Try this today'],
        motivational: ['Daily reminder', 'Keep going', 'Your next step']
      };

      const ctaTails = [
        'Save this for later.',
        'Share with someone who needs this.',
        'Comment your biggest takeaway.',
        'Tag a friend who is on the same path.',
        'More practical posts coming soon.'
      ];

      const emojiSetByTone = {
        casual: ['✨', '🚀', '🙂'],
        professional: ['', '', ''],
        funny: ['😂', '🤝', '🙌'],
        inspirational: ['🌱', '🔥', '💡']
      };

      const baseHashtags = {
        personal: ['#StudentLife', '#ToolShala'],
        educational: ['#StudyTips', '#LearnBetter'],
        promotional: ['#CreatorTools', '#DigitalGrowth'],
        motivational: ['#KeepGrowing', '#DailyProgress']
      };

      const extraTags = keywordList.map((keyword) => {
        const cleaned = keyword.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        if (!cleaned) {
          return '';
        }
        return `#${cleaned.replace(/\s+/g, '')}`;
      }).filter(Boolean);

      const templates = toneTemplates[tone] || toneTemplates.casual;
      const hooks = contentHooks[contentType] || contentHooks.personal;
      const emojis = emojiSetByTone[tone] || emojiSetByTone.casual;
      const hashtags = [...(baseHashtags[contentType] || baseHashtags.personal), ...extraTags].slice(0, 5);

      const items = Array.from({ length: 5 }, (_, index) => {
        const body = pick(templates, index + variant);
        const lead = `${pick(hooks, index + variant)}:`;
        const tail = pick(ctaTails, index + variant);
        const emoji = pick(emojis, index + variant);
        const captionText = [lead, body, tail, emoji].filter(Boolean).join(' ');
        return {
          text: captionText,
          hashtags,
          bestPick: index === (variant % 5)
        };
      });

      return { type: 'cards', items };
    },
    'linkedin-bio-generator': (values, options = {}) => {
      const skills = normalizeCommaList(values.skills);
      const topSkills = skills.slice(0, 3).join(', ');
      const statusLabelMap = {
        student: 'student',
        fresher: 'fresher',
        freelancer: 'freelancer',
        creator: 'creator'
      };
      const statusLabel = statusLabelMap[values.status] || 'professional';
      const domain = values.domain;
      const goal = values.careerGoal;
      const tone = values.tone || 'professional';
      const variant = Number(options.variant || 0);

      const professional = [
        `I am ${values.name}, a ${statusLabel} focused on ${domain}. I am developing practical capability in ${topSkills} and actively seeking opportunities where I can contribute with structured execution and continuous learning. My current goal is to ${goal.toLowerCase()}.`,
        `${values.name} | ${statusLabel} profile in ${domain}. I bring working knowledge of ${topSkills}, with strong interest in hands-on projects and growth-focused roles. I am currently working toward ${goal.toLowerCase()}.`
      ];

      const friendly = [
        `Hi, I am ${values.name}. I am a ${statusLabel} building my path in ${domain}. I enjoy working on practical projects using ${topSkills}, and I am always open to learning from meaningful opportunities. Right now, my focus is to ${goal.toLowerCase()}.`,
        `I am ${values.name}, exploring ${domain} with a practical and curious mindset. I have been improving skills in ${topSkills} and enjoy turning ideas into useful output. I am currently aiming to ${goal.toLowerCase()}.`
      ];

      const confident = [
        `${values.name} is a ${statusLabel} focused on ${domain}, with strengths in ${topSkills}. I take a practical, ownership-driven approach to learning and execution, and I am actively building toward ${goal.toLowerCase()}.`,
        `I am ${values.name}, building a growth-focused profile in ${domain}. With hands-on skills in ${topSkills}, I am ready to contribute in high-accountability environments and move steadily toward ${goal.toLowerCase()}.`
      ];

      const setByTone = {
        professional,
        friendly,
        confident
      };

      const selectedSet = setByTone[tone] || professional;
      const secondarySet = tone === 'professional' ? friendly : professional;
      const thirdSet = tone === 'confident' ? friendly : confident;
      const items = [
        pick(selectedSet, variant),
        pick(secondarySet, variant + 1),
        pick(thirdSet, variant + 2)
      ];

      if (tone) {
        items.push(`I am ${values.name}, a ${statusLabel} interested in ${domain}. My core skills include ${topSkills}, and my current goal is to ${goal.toLowerCase()}. I am open to internships, entry-level roles, and collaboration opportunities.`);
      }

      return {
        type: 'cards',
        items: items.slice(0, 4)
      };
    },
    'cover-letter-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const skills = normalizeCommaList(values.skills);
      const topSkills = (skills.length ? skills : [String(values.skills || '').trim()]).filter(Boolean).slice(0, 4).join(', ');
      const achievement = String(values.achievement || '').trim();

      const introByExperience = {
        fresher: `I am ${values.name}, a fresher with strong interest in practical learning and role-aligned execution.`,
        '0-1 years': `I am ${values.name} with early-stage experience and a hands-on approach to delivery and growth.`,
        '1-3 years': `I am ${values.name} with 1-3 years of practical exposure and consistent ownership of assigned work.`
      };

      const valueLines = [
        `My key strengths include ${topSkills}, and I focus on delivering clear, structured work that supports team goals.`,
        `I bring practical capability in ${topSkills} and a reliable approach to communication, timelines, and quality output.`,
        `I have developed role-relevant strengths in ${topSkills}, with focus on consistency, collaboration, and measurable outcomes.`
      ];

      const closeLines = [
        'Thank you for considering my application. I would value the opportunity to discuss how I can contribute to your team.',
        'Thank you for your time and consideration. I would be glad to discuss my application and suitability in detail.',
        'Thank you for reviewing my application. I would appreciate the chance to contribute and learn through this opportunity.'
      ];

      const achievementBlock = achievement
        ? `\n\nA relevant achievement that reflects my readiness for this role: ${achievement}`
        : '';

      const letter = `Dear Hiring Manager,\n\nI am writing to apply for the ${values.role} position at ${values.company}. ${introByExperience[values.experienceLevel] || introByExperience.fresher}\n\n${pick(valueLines, variant)}\n\nI am particularly interested in this opportunity because ${values.interestReason}.${achievementBlock}\n\n${pick(closeLines, variant)}\n\nSincerely,\n${values.name}`;
      return {
        type: 'text',
        text: letter,
        printable: true,
        downloadable: true,
        fileName: `${String(values.name || 'cover-letter').trim().replace(/\s+/g, '-').toLowerCase()}-cover-letter.txt`,
        className: 'tool-letter-box'
      };
    },
    'study-timetable-generator': (values, options = {}) => {
      const subjects = normalizeCommaList(values.subjects);
      const weakSubjects = normalizeCommaList(values.weakSubjects);
      const weakMap = new Set(weakSubjects.map((subject) => subject.toLowerCase()));
      const weightedSubjects = subjects.flatMap((subject) => (weakMap.has(subject.toLowerCase()) ? [subject, subject, subject] : [subject, subject]));
      const dailyHours = Math.max(1, Number(values.hoursPerDay || 1));
      const variant = Number(options.variant || 0);
      const totalMinutes = dailyHours * 60;
      const studyLabelByPreference = {
        morning: ['6:30 - 7:30 AM', '7:45 - 8:30 AM', '8:45 - 9:15 AM'],
        evening: ['5:30 - 6:30 PM', '6:45 - 7:30 PM', '7:45 - 8:15 PM'],
        flexible: ['Session 1', 'Session 2', 'Session 3']
      };
      const revisionMinutesByGoal = {
        'school-exam': 25,
        boards: 35,
        'competitive-exam': 45
      };
      const sessionSlots = dailyHours <= 2 ? 2 : dailyHours <= 4 ? 3 : 4;
      const revisionMinutes = revisionMinutesByGoal[values.examGoal] || 30;
      const breakMinutes = sessionSlots >= 4 ? 20 : 15;
      const focusedMinutes = Math.max(30, Math.floor((totalMinutes - revisionMinutes - breakMinutes) / sessionSlots));
      const timeSlots = studyLabelByPreference[values.studyTime] || studyLabelByPreference.flexible;

      const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const items = dayLabels.map((day, index) => {
        const rows = [];
        for (let slot = 0; slot < sessionSlots; slot += 1) {
          const subject = pick(weightedSubjects.length ? weightedSubjects : subjects, variant + index + slot);
          rows.push(`${timeSlots[slot] || `Session ${slot + 1}`}: ${subject} (${focusedMinutes} mins)`);
          if (slot === Math.floor(sessionSlots / 2) - 1) {
            rows.push(`Short Break: ${breakMinutes} mins`);
          }
        }
        rows.push(`${timeSlots[sessionSlots] || 'Final Block'}: Revision + recap (${revisionMinutes} mins)`);
        if (day === 'Saturday' && values.examGoal === 'competitive-exam') {
          rows.push('Extra Focus: 45 mins mock test + analysis');
        }
        if (day === 'Sunday') {
          rows.push('Weekly Reset: Review weak topics and plan next week targets');
        }

        return {
          label: day,
          rows,
          note: `${values.level} | Goal: ${values.examGoal.replace('-', ' ')}`,
          copyText: `${day}\n${rows.join('\n')}`
        };
      });

      const planText = items
        .map((item) => `${item.label}\n${item.rows.join('\n')}`)
        .join('\n\n');

      return {
        type: 'cards',
        items,
        copyText: `Weekly Study Timetable\nLevel: ${values.level}\nGoal: ${values.examGoal.replace('-', ' ')}\n\n${planText}`,
        downloadable: true,
        printable: true,
        fileName: `study-timetable-${String(values.level || 'plan').trim().replace(/\s+/g, '-').toLowerCase()}.txt`
      };
    },
    'ai-career-path-suggestor': (values, options = {}) => {
      const interests = `${values.interests || ''}`.toLowerCase();
      const strengths = normalizeCommaList(values.strengths || values.interests);
      const workStyle = values.workStyle || 'creative';
      const codingPreference = values.codingPreference || '';
      const stage = values.stage || 'college';
      const variant = Number(options.variant || 0);

      const roleLibrary = [
        {
          title: 'UI/UX Designer',
          tags: ['design', 'creative', 'visual', 'user', 'ui', 'ux', 'canva', 'figma'],
          styles: ['creative', 'independent'],
          coding: 'optional',
          why: 'You seem to enjoy visual thinking and creating user-friendly experiences.',
          skillsToLearn: ['Figma', 'Design thinking', 'User research basics', 'Wireframing'],
          nextStep: 'Redesign one app screen each week and publish your portfolio on Behance/Dribbble.'
        },
                {
          title: 'Digital Marketing Specialist',
          tags: ['marketing', 'content', 'social', 'brand', 'growth', 'storytelling', 'seo'],
          styles: ['creative', 'analytical', 'people-focused'],
          coding: 'no',
          why: 'Your interests align with communication, audience growth, and campaign execution.',
          skillsToLearn: ['SEO fundamentals', 'Performance marketing basics', 'Copywriting', 'Analytics dashboards'],
          nextStep: 'Run a 30-day campaign for a small page or project and document outcomes.'
        },
        {
          title: 'Data Analyst',
          tags: ['data', 'analysis', 'excel', 'numbers', 'statistics', 'business', 'research'],
          styles: ['analytical', 'independent'],
          coding: 'yes',
          why: 'You show signs of structured thinking and interest in problem-solving with data.',
          skillsToLearn: ['Excel/Sheets', 'SQL', 'Python basics', 'Power BI/Tableau'],
          nextStep: 'Build 2 portfolio dashboards from public datasets and share insights on LinkedIn.'
        },
                {
          title: 'Customer Success Associate',
          tags: ['people', 'communication', 'support', 'client', 'relationship', 'service'],
          styles: ['people-focused', 'analytical'],
          coding: 'no',
          why: 'Your strengths suggest empathy, communication, and ability to handle real user problems.',
          skillsToLearn: ['Business communication', 'CRM basics', 'Problem diagnosis', 'Product walkthroughs'],
          nextStep: 'Practice mock support scenarios and create a one-page customer issue-resolution framework.'
        },
        {
          title: 'Frontend Developer',
          tags: ['coding', 'development', 'web', 'react', 'javascript', 'frontend', 'tech'],
          styles: ['creative', 'analytical', 'independent'],
          coding: 'yes',
          why: 'You may enjoy building real digital products with logic and creativity.',
          skillsToLearn: ['HTML/CSS/JavaScript', 'React basics', 'Git/GitHub', 'API integration'],
          nextStep: 'Build 3 responsive projects and host them in a public GitHub portfolio.'
        },
                {
          title: 'HR & Talent Acquisition Coordinator',
          tags: ['people', 'hiring', 'interview', 'hr', 'organization', 'management'],
          styles: ['people-focused', 'analytical'],
          coding: 'no',
          why: 'Your profile indicates strong people interaction and coordination capability.',
          skillsToLearn: ['Interview screening', 'LinkedIn sourcing', 'Communication templates', 'Hiring workflows'],
          nextStep: 'Create sample JD + screening sheet and assist in campus/community hiring drives.'
        },
        {
          title: 'Business Analyst Trainee',
          tags: ['analysis', 'business', 'process', 'operations', 'problem-solving', 'documentation'],
          styles: ['analytical', 'people-focused'],
          coding: 'optional',
          why: 'You appear to enjoy understanding processes and improving decision quality.',
          skillsToLearn: ['Requirement gathering', 'Process mapping', 'SQL basics', 'Presentation storytelling'],
          nextStep: 'Analyze one real process (college club/startup) and present improvement ideas.'
        }
              ];

      const stagePrefix = {
        school: 'As a school student,',
        college: 'As a college student,',
        graduate: 'As a graduate,',
        fresher: 'As a fresher,'
      };

      const scored = roleLibrary
        .map((role) => {
          const keywordHits = role.tags.reduce((score, tag) => (interests.includes(tag) ? score + 2 : score), 0);
          const styleFit = role.styles.includes(workStyle) ? 3 : 0;
          const codingFit = codingPreference
            ? ((codingPreference === 'yes' && role.coding !== 'no') || (codingPreference === 'no' && role.coding !== 'yes') ? 2 : -1)
            : 1;
          const strengthFit = strengths.reduce((score, skill) => (role.tags.some((tag) => skill.toLowerCase().includes(tag)) ? score + 1 : score), 0);
          return {
            ...role,
            totalScore: keywordHits + styleFit + codingFit + strengthFit
          };
        })
        .sort((a, b) => b.totalScore - a.totalScore);

      const shift = variant % 2;
      const picks = scored.slice(shift, shift + 4);
      const chosen = picks.length >= 3 ? picks : scored.slice(0, 4);

        const items = chosen.map((role, index) => {
        const skillsToLearn = role.skillsToLearn.slice(0, 4).join(', ');
        return {
          label: index === 0 ? 'Best Match' : `Career Path ${index + 1}`,
          title: role.title,
          text: `${stagePrefix[stage] || 'Based on your profile,'} ${role.why}`,
          rows: [`Useful skills to learn: ${skillsToLearn}`, `Next step recommendation: ${role.nextStep}`],
          note: `Profile signals used: ${values.workStyle} work style, interests and strengths.`,
          bestPick: index === 0,
          copyText: `${role.title}\nWhy it fits: ${role.why}\nUseful skills to learn: ${skillsToLearn}\nNext step recommendation: ${role.nextStep}`
        };
      });

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
    },
    'scholarship-recommendation-tool': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const state = String(values.stateOrRegion || '').trim();
      const field = String(values.fieldOfStudy || '').trim();
      const category = String(values.category || '').trim();
      const education = values.currentEducationLevel || 'undergraduate';
      const needType = values.needType || 'general';
      const performance = values.academicPerformance || 'good';

      const educationProfiles = {
        school: 'school students with strong basics and consistent academics',
        'after-12th': 'students transitioning from class 12 to higher studies',
        undergraduate: 'undergraduate students pursuing degree programs',
        postgraduate: 'postgraduate students pursuing advanced or research-focused programs',
        'professional-course': 'students enrolled in professional or technical programs'
      };

      const scholarshipTypes = [
        {
          scholarshipType: 'State Government Scholarship Schemes',
          tags: ['general', 'need-based', 'category-based'],
          suitableFor: `learners from ${state} who match domicile and education-level criteria`,
          prepare: ['Domicile certificate', 'Previous marksheets', 'Income certificate', 'Bank account details'],
            nextStep: `Check ${state} state scholarship portal and shortlist active schemes by eligibility.`
        },
        {
          scholarshipType: 'National Merit Scholarship Programs',
          tags: ['merit-based', 'general'],
          suitableFor: 'students with strong academic records and exam performance',
          prepare: ['Latest marksheets', 'Merit proof/test score', 'Identity proof', 'Application essay'],
          nextStep: 'Track National Scholarship Portal updates and apply early in the cycle.'
        },
        {
          scholarshipType: 'Need-cum-Merit Scholarships',
          tags: ['need-based', 'merit-based'],
          suitableFor: 'students needing financial support with fair-to-strong academics',
          prepare: ['Family income documents', 'Academic transcripts', 'Bonafide/admission proof', 'Fee receipts'],
          nextStep: 'Prepare an income + academics folder and apply to both government and private schemes.'
        },
        {
          scholarshipType: 'Category Support Scholarships',
          tags: ['category-based'],
          suitableFor: 'eligible SC/ST/OBC/EWS/Minority/PwD students under notified schemes',
          prepare: ['Valid category certificate', 'Income proof (if required)', 'Aadhaar/ID', 'Institution details'],
          nextStep: 'Validate certificate format and upload-ready scans before portal deadlines.'
        },
        {
          scholarshipType: `${field || 'Domain'}-Specific Foundation Scholarships`,
          tags: ['general', 'merit-based', 'need-based'],
          suitableFor: `${field ? `${field} students` : 'students in focused fields'} with project or career intent`,
          prepare: ['Statement of purpose', 'Portfolio/projects (if applicable)', 'Recommendation letter', 'Academic records'],
          nextStep: 'Identify 3-5 trusted NGOs/foundations and align applications to their theme.'
        }
      ];

      const prioritized = scholarshipTypes
        .map((item) => {
          let score = item.tags.includes(needType) ? 3 : 1;
          if (performance === 'excellent' && item.tags.includes('merit-based')) {
            score += 2;
          }
          if ((performance === 'average' || performance === 'improving') && item.tags.includes('need-based')) {
            score += 2;
          }
          if (needType === 'category-based' && category && item.tags.includes('category-based')) {
            score += 2;
          }
          if (field && item.scholarshipType.toLowerCase().includes('specific')) {
            score += 1;
          }
          return { ...item, score };
        })
        .sort((a, b) => b.score - a.score);

      const selected = prioritized.slice(variant % 2, (variant % 2) + 4);
      const finalItems = (selected.length >= 3 ? selected : prioritized.slice(0, 4)).map((item, index) => ({
        label: index === 0 ? 'Best Match' : `Scholarship Option ${index + 1}`,
        title: item.scholarshipType,
        text: `Suitable for: ${item.suitableFor}. Profile context: ${educationProfiles[education] || educationProfiles.undergraduate}.`,
        rows: [
          `What to prepare: ${item.prepare.join(', ')}`,
          `Suggested next step: ${item.nextStep}`
        ],
        bestPick: index === 0,
        copyText: `${item.scholarshipType}\nSuitable for: ${item.suitableFor}\nWhat to prepare: ${item.prepare.join(', ')}\nSuggested next step: ${item.nextStep}`
      }));

      const checklistItems = [
        'Aadhaar / government-issued ID',
        'Latest marksheets and admission proof',
        'Income certificate (for need-based schemes)',
        'Category certificate (if applicable)',
        'Bank passbook or account details',
        'Calendar reminder for last date and correction window'
      ];

      const checklistCard = {
        label: 'Quick Preparation Checklist',
        title: 'Before You Apply',
        rows: checklistItems
      };
      
      return {
        type: 'cards',
        items: [...finalItems, checklistCard],
        copyText: finalItems.map((item) => item.copyText).join('\n\n'),
        disclaimer: 'Always verify final eligibility and deadlines from the official scholarship source.',
        cta: {
          href: './opportunities.html',
          label: 'Browse Scholarships',
          text: 'Explore updated opportunities and scholarship listings in one place.'
        }
      };
    },
    'professional-email-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const purpose = values.emailPurpose || 'internship-application';
      const tone = values.tone || 'professional';
      const recipient = values.recipientName || 'Hiring Team';
      const sender = values.senderName || 'Your Name';
      const context = values.roleContext || 'the opportunity';
      const message = values.mainMessage || '';

      const subjectBanks = {
        'internship-application': [
          `Application for ${context}`,
          `Internship Application - ${context}`,
          `Interest in ${context}`
        ],
        'job-application': [
          `Application for ${context}`,
          `Job Application - ${context}`,
          `Applying for ${context}`
        ],
        'follow-up': [
          `Follow-up regarding ${context}`,
          `Checking in on ${context}`,
          `Follow-up: ${context}`
        ],
       request: [
          `Request regarding ${context}`,
          `Support request: ${context}`,
          `Request for guidance - ${context}`
        ],
        leave: [
          `Leave request for ${context}`,
          `Application for leave - ${context}`,
          `Leave approval request: ${context}`
        ]
      };

      const openingsByPurpose = {
        'internship-application': [
          `I am writing to express my interest in the ${context}.`,
          `I would like to submit my application for the ${context}.`,
          `I am reaching out to apply for the ${context}.`
        ],
        'job-application': [
          `I am writing to apply for the ${context} role.`,
          `Please consider my application for ${context}.`,
          `I would like to express my interest in the ${context} position.`
        ],
        'follow-up': [
          `I am writing to follow up on ${context}.`,
          `This is a polite follow-up regarding ${context}.`,
          `I wanted to check in regarding ${context}.`
        ],
        request: [
          `I am writing to request your support regarding ${context}.`,
          `I would like to request your guidance on ${context}.`,
          `Please accept this request related to ${context}.`
        ],
        leave: [
          `I am writing to request leave in relation to ${context}.`,
          `I would like to formally request leave for ${context}.`,
          `Please consider my leave request regarding ${context}.`
        ]
      };

      const toneClosings = {
        formal: [
          'Thank you for your time and consideration.',
          'I appreciate your attention to this matter.',
          'Thank you for reviewing my request.'
        ],
        polite: [
          'Thank you for your support and guidance.',
          'I appreciate your help and consideration.',
          'Thank you for your valuable time.'
        ],
        professional: [
          'Thank you for your time and consideration. I look forward to your response.',
          'I appreciate your review and would be grateful for the next steps.',
          'Thank you for considering my email. I am happy to share further details if needed.'
        ]
      };

      const signOffs = {
        formal: 'Sincerely',
        polite: 'Warm regards',
        professional: 'Best regards'
      };

      const subjects = subjectBanks[purpose] || subjectBanks['internship-application'];
      const openings = openingsByPurpose[purpose] || openingsByPurpose['internship-application'];
      const closingSet = toneClosings[tone] || toneClosings.professional;
      const subject = pick(subjects, variant);

      const bodyParts = [
        `Dear ${recipient},`,
        '',
        pick(openings, variant),
        '',
        message,
        '',
        pick(closingSet, variant),
        '',
        `${signOffs[tone] || signOffs.professional},`,
        sender
      ];

      return {
        type: 'email',
        subject,
        subjectVariations: [pick(subjects, variant + 1), pick(subjects, variant + 2)],
        sections: {
          greeting: `Dear ${recipient},`,
          opening: pick(openings, variant),
          body: message,
          closing: `${pick(closingSet, variant)}\n\n${signOffs[tone] || signOffs.professional},\n${sender}`
        },
        bodyText: bodyParts.join('\n'),
        note: 'Always review names, role details, and attachments before sending.'
      }; 
    },
    'content-idea-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const niche = String(values.niche || '').trim();
      const platform = values.platform || 'instagram';
      const goal = values.contentGoal || 'growth';
      const audience = String(values.audienceType || '').trim();
      const keywords = normalizeCommaList(values.keywords).slice(0, 4);
      const keywordText = keywords.length ? ` Include: ${keywords.join(', ')}.` : '';

      const platformFormats = {
        instagram: {
          list: 'Carousel post with a strong first slide hook',
          tutorial: 'Reel + caption with steps and CTA',
          opinion: 'Talking-head Reel or text carousel',
          personal: 'Photo dump + story-led caption',
          trend: 'Trend audio Reel adapted to your niche'
        },
        youtube: {
          list: 'Listicle-style YouTube video with chapters',
          tutorial: 'Step-by-step tutorial video',
          opinion: 'Commentary video with examples',
          personal: 'Storytime video with lessons learned',
          trend: 'Reaction/analysis video on current trend'
        },
        linkedin: {
          list: 'Structured text post using numbered points',
          tutorial: 'How-to post with a simple framework',
          opinion: 'POV post with practical argument',
          personal: 'Founder/creator journey post',
          trend: 'Topical insight post tied to market trend'
        },
        blog: {
          list: 'SEO-friendly list blog article',
          tutorial: 'Long-form step-by-step guide',
          opinion: 'Opinion editorial with examples',
          personal: 'Personal journey blog with takeaways',
          trend: 'Trend breakdown article with predictions'
        }
      };
      
      const goalAngles = {
        growth: 'focus on discoverability and shareability',
        education: 'focus on practical learning and clarity',
        engagement: 'focus on interaction and comments',
        promotion: 'focus on conversion and offers'
      };

      const templatesByType = {
        list: [
          `7 common mistakes in ${niche} and how ${audience} can avoid them`,
          `10 tools every ${audience} should use for ${niche}`,
          `5 myths about ${niche} that slow down ${audience}`
        ],
        tutorial: [
          `Beginner guide: How ${audience} can start with ${niche} in 7 days`,
          `Step-by-step workflow for ${niche} that saves time for ${audience}`,
          `How to get your first result in ${niche} (simple tutorial)`
        ],
        opinion: [
          `Hot take: Most advice on ${niche} is outdated for ${audience}`,
          `Why consistency matters more than perfection in ${niche}`,
          `What people misunderstand about growing in ${niche}`
        ],
        personal: [
          `My journey in ${niche}: 3 lessons I wish I knew earlier`,
          `From confusion to clarity: my personal system for ${niche}`,
          `What changed when I started creating consistently in ${niche}`
        ],
        trend: [
          `Trend watch: What’s changing in ${niche} this month`,
          `Should ${audience} follow this ${niche} trend? Pros and cons`,
          `How to use current trends in ${niche} without losing authenticity`
        ]
      };
      
      const ideaTypes = ['list', 'tutorial', 'opinion', 'personal', 'trend', 'list', 'tutorial', 'opinion', 'personal', 'trend'];
      const formatMap = platformFormats[platform] || platformFormats.instagram;
      const angleText = goalAngles[goal] || goalAngles.growth;

      const items = ideaTypes.map((ideaType, index) => {
        const title = pick(templatesByType[ideaType], variant + index);
        const format = formatMap[ideaType];
        const starter = index === (variant % 10);
        return {
          label: `Idea ${index + 1}`,
          title,
          text: `${format}. Goal angle: ${angleText}.${keywordText}`,
          note: starter ? 'Start with this one for quick execution and audience relevance.' : `Designed for ${audience}.`,
          bestPick: starter,
          copyText: `${title}\nPlatform: ${platform}\nFormat: ${format}\nAudience: ${audience}\nGoal: ${goal}\n${angleText}${keywordText}`
        };
      });
      
      return {
        type: 'cards',
        items,
        copyText: items.map((item) => `${item.label}: ${item.title}\n${item.text}`).join('\n\n'),
        disclaimer: 'Choose ideas that match your audience’s questions, not just trends.',
        cta: platform === 'instagram'
          ? {
            href: './tool.html?tool=instagram-caption-generator',
            label: 'Generate Instagram Captions',
            text: 'Turn your selected Instagram idea into ready-to-post captions in one click.'
          }
          : null
      };
    }
  };

  const generateResult = async (toolId, values, options = {}) => {
    const localGenerator = generators[toolId];
    const provider = getApiProvider();
    const mode = options.mode || 'hybrid';

    if (provider && mode !== 'local') {
      try {
        const remoteResult = await provider.generate({
          toolId,
          values,
          variant: options.variant || 0
        });
        if (remoteResult && typeof remoteResult === 'object') {
          return remoteResult;
        }
      } catch (error) {
        console.warn('[ToolShala] API provider failed, falling back to local generator.', error);

        if (typeof localGenerator === 'function' && (
          toolId === 'resume-headline-generator'
          || toolId === 'resume-summary-generator'
          || toolId === 'interview-answer-generator'
          || toolId === 'study-notes-summarizer'
          || toolId === 'assignment-rewriter'
          || toolId === 'sop-generator'
          || toolId === 'linkedin-networking-message-generator'
          || toolId === 'job-description-analyzer'
          || toolId === 'scholarship-finder'
          || toolId === 'career-path-quiz'
          || toolId === 'youtube-shorts-script-generator'
          || toolId === 'leave-application-generator'
          || toolId === 'instagram-caption-generator'
          || toolId === 'linkedin-bio-generator'
          || toolId === 'cover-letter-generator'
          || toolId === 'study-timetable-generator'
          || toolId === 'ai-career-path-suggestor'
          || toolId === 'scholarship-recommendation-tool'
          || toolId === 'professional-email-generator'
          || toolId === 'content-idea-generator'
        )) {
          const fallback = localGenerator(values, options);
          const fallbackMessage = toolId === 'leave-application-generator'
            ? 'Live AI letter generation is temporarily unavailable. Showing a reliable fallback leave letter.'
            : toolId === 'resume-summary-generator'
              ? 'Live AI summary generation is temporarily unavailable. Showing a reliable fallback summary set.'
            : toolId === 'interview-answer-generator'
              ? 'Live AI interview answer generation is temporarily unavailable. Showing a reliable fallback answer set.'
            : toolId === 'study-notes-summarizer'
              ? 'Live AI summary generation is temporarily unavailable. Showing a reliable fallback notes summary set.'
            : toolId === 'assignment-rewriter'
              ? 'Live AI rewriting is temporarily unavailable. Showing a reliable fallback rewritten version.'
            : toolId === 'sop-generator'
              ? 'Live AI SOP generation is temporarily unavailable. Showing a reliable fallback SOP draft.'
            : toolId === 'linkedin-networking-message-generator'
              ? 'Live AI message generation is temporarily unavailable. Showing a reliable fallback message set.'
            : toolId === 'job-description-analyzer'
              ? 'Live AI analysis is temporarily unavailable. Showing a reliable fallback JD analysis.'
            : toolId === 'scholarship-finder'
              ? 'Live AI scholarship finder is temporarily unavailable. Showing reliable scholarship category guidance.'
            : toolId === 'career-path-quiz'
              ? 'Live AI career path analysis is temporarily unavailable. Showing reliable career direction guidance.'
            : toolId === 'youtube-shorts-script-generator'
              ? 'Live AI script generation is temporarily unavailable. Showing reliable fallback script ideas.'
            : toolId === 'instagram-caption-generator'
              ? 'Live AI caption generation is temporarily unavailable. Showing a reliable fallback caption set.'
            : toolId === 'linkedin-bio-generator'
                ? 'Live AI bio generation is temporarily unavailable. Showing a reliable fallback LinkedIn bio set.'
            : toolId === 'cover-letter-generator'
                ? 'Live AI cover letter generation is temporarily unavailable. Showing a reliable fallback cover letter.'
            : toolId === 'study-timetable-generator'
                ? 'Live AI timetable generation is temporarily unavailable. Showing a reliable fallback weekly plan.'
            : toolId === 'ai-career-path-suggestor'
                ? 'Live AI career guidance is temporarily unavailable. Showing a reliable fallback career path set.'
            : toolId === 'scholarship-recommendation-tool'
                ? 'Live AI scholarship recommendations are temporarily unavailable. Showing a reliable fallback recommendation set.'
            : toolId === 'professional-email-generator'
                ? 'Live AI email generation is temporarily unavailable. Showing a reliable fallback email draft.'
            : toolId === 'content-idea-generator'
                ? 'Live AI content idea generation is temporarily unavailable. Showing a reliable fallback idea set.'
                        : 'Live AI generation is temporarily unavailable. Showing reliable fallback headlines you can still use.';

          return {
            ...fallback,
            disclaimer: fallbackMessage,
            usedFallback: true
          };
        }
      }
    }

    if (typeof localGenerator === 'function') {
      return localGenerator(values, options);
    }

    return { type: 'text', text: 'This tool is under maintenance.' };
  };
  
  const validate = (tool, values) => {
    const fieldErrors = {};

    for (const field of tool.fields) {
      if (field.required && !String(values[field.key] || '').trim()) {
        fieldErrors[field.key] = `${field.label} is required.`;
      }
    }

    if (Object.keys(fieldErrors).length) {
      return {
        fieldErrors,
        formError: 'Please fill in all required fields.'
      };
    }

    if (tool.id === 'resume-headline-generator') {
      const skills = normalizeCommaList(values.skills);
      if (skills.length < 2) {
        return {
          fieldErrors: {
            skills: 'Please add at least 2 comma-separated skills.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    if (tool.id === 'resume-summary-generator') {
      const skills = normalizeCommaList(values.skills);
      if (skills.length < 2) {
        return {
          fieldErrors: {
            skills: 'Please add at least 2 key skills separated by commas.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    if (tool.id === 'interview-answer-generator') {
      const question = String(values.question || '').trim();
      if (question.length < 12) {
        return {
          fieldErrors: {
            question: 'Please enter a slightly more detailed question.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    if (tool.id === 'study-notes-summarizer') {
      const notes = String(values.notes || '').trim();
      if (notes.length < 120) {
        return {
          fieldErrors: {
            notes: 'Please add a bit more notes text (at least 120 characters) for better summarization.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    if (tool.id === 'assignment-rewriter') {
      const text = String(values.originalText || '').trim();
      if (text.length < 80) {
        return {
          fieldErrors: {
            originalText: 'Please add at least 80 characters so the rewriting stays meaningful.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    if (tool.id === 'sop-generator') {
      const background = String(values.academicBackground || '').trim();
      const goals = String(values.careerGoals || '').trim();
      if (background.length < 40 || goals.length < 30) {
        return {
          fieldErrors: {
            academicBackground: 'Please add a slightly more detailed academic background.',
            careerGoals: 'Please add clearer career goals (at least one concrete direction).'
          },
          formError: 'Please correct the highlighted fields.'
        };
      }
    }

    if (tool.id === 'linkedin-networking-message-generator') {
      const purpose = String(values.purpose || '').trim();
      if (purpose.length < 10) {
        return {
          fieldErrors: {
            purpose: 'Please add a clearer purpose so the message sounds specific.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    if (tool.id === 'job-description-analyzer') {
      const jd = String(values.jobDescription || '').trim();
      const skills = normalizeCommaList(values.userSkills);
      if (jd.length < 150 || skills.length < 2) {
        return {
          fieldErrors: {
            jobDescription: 'Please add more job description details (at least 150 characters).',
            userSkills: 'Please add at least 2 skills separated by commas.'
          },
          formError: 'Please correct the highlighted fields.'
        };
      }
    }

    if (tool.id === 'scholarship-finder') {
      const state = String(values.state || '').trim();
      const performance = String(values.academicPerformance || '').trim();
      if (state.length < 2 || performance.length < 4) {
        return {
          fieldErrors: {
            state: 'Please enter a valid state/region.',
            academicPerformance: 'Please add your academic performance in a clear format.'
          },
          formError: 'Please correct the highlighted fields.'
        };
      }
    }

    if (tool.id === 'career-path-quiz') {
      const interests = String(values.interests || '').trim();
      const strengths = String(values.strengths || '').trim();
      if (interests.length < 12 || strengths.length < 8) {
        return {
          fieldErrors: {
            interests: 'Please add clearer interests so suggestions are meaningful.',
            strengths: 'Please add at least 2 strengths or skills.'
          },
          formError: 'Please correct the highlighted fields.'
        };
      }
    }

    if (tool.id === 'youtube-shorts-script-generator') {
      const topic = String(values.topic || '').trim();
      const audience = String(values.audienceType || '').trim();
      if (topic.length < 3 || audience.length < 3) {
        return {
          fieldErrors: {
            topic: 'Please enter a clearer topic.',
            audienceType: 'Please enter your target audience type.'
          },
          formError: 'Please correct the highlighted fields.'
        };
      }
    }

    if (tool.id === 'linkedin-bio-generator') {
      const skills = normalizeCommaList(values.skills);
      if (skills.length < 2) {
        return {
          fieldErrors: {
            skills: 'Please add at least 2 comma-separated skills.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    if (tool.id === 'leave-application-generator') {
      if (new Date(values.endDate).getTime() < new Date(values.startDate).getTime()) {
        return {
          fieldErrors: {
            endDate: 'End date cannot be earlier than start date.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    if (tool.id === 'study-timetable-generator') {
      const hours = Number(values.hoursPerDay || 0);
      if (hours < 1 || hours > 12) {
        return {
          fieldErrors: {
            hoursPerDay: 'Please use daily study hours between 1 and 12.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
      if (normalizeCommaList(values.subjects).length < 2) {
        return {
          fieldErrors: {
            subjects: 'Please add at least 2 subjects.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    return null;
  };

  const clearFieldError = (input) => {
    if (!input) {
      return;
    }
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    const errorNode = input.parentElement?.querySelector('[data-field-error]');
    if (errorNode) {
      errorNode.textContent = '';
      errorNode.classList.add('hidden');
    }
  };

  const setFieldError = (formNode, fieldKey, message) => {
    const input = formNode.querySelector(`[name="${fieldKey}"]`);
    if (!input) {
      return;
    }
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    const errorNode = input.parentElement?.querySelector('[data-field-error]');
    if (errorNode) {
      errorNode.textContent = message;
      errorNode.classList.remove('hidden');
    }
  };

  const renderField = (field) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'field-wrap';

    const label = document.createElement('label');
    label.className = 'field-label';
    label.setAttribute('for', `tool-field-${field.key}`);
    label.innerHTML = `${escapeHtml(field.label)}${field.required ? ' <span class="field-required">*</span>' : ''}`;

    let input;
    if (field.type === 'select') {
      input = document.createElement('select');
      input.className = 'field-select';
      input.innerHTML = `<option value="">Select ${escapeHtml(field.label)}</option>${(field.options || [])
        .map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`)
        .join('')}`;
    } else if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.className = 'field-textarea';
      input.rows = 4;
      if (field.placeholder) {
        input.placeholder = field.placeholder;
      }
    } else {
      input = document.createElement('input');
      input.className = 'field-input';
      input.type = field.type || 'text';
      if (field.placeholder) {
        input.placeholder = field.placeholder;
      }
    }

    input.id = `tool-field-${field.key}`;
    input.name = field.key;
    if (field.required) {
      input.required = true;
    }

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    const helperText = getFieldHelperText(field);
    if (helperText) {
      const helper = document.createElement('p');
      helper.className = 'field-helper';
      helper.textContent = helperText;
      wrapper.appendChild(helper);
    }
    
    const error = document.createElement('p');
    error.className = 'field-error hidden';
    error.setAttribute('data-field-error', 'true');
    wrapper.appendChild(error);

    return wrapper;
  };

  const renderOutput = ({ outputNode, result, tool }) => {
    outputNode.innerHTML = '';
    if (!result) {
      outputNode.innerHTML = '<p class="tool-empty">Your generated result will appear here.</p>';
      return;
    }

    if (result.type === 'email') {
      const subjectWrap = document.createElement('div');
      subjectWrap.className = 'rounded-xl border border-indigo-100 bg-indigo-50 p-4';
      const subjectLabel = document.createElement('p');
      subjectLabel.className = 'text-xs font-semibold uppercase tracking-wide text-indigo-700';
      subjectLabel.textContent = 'Subject';
      const subjectValue = document.createElement('p');
      subjectValue.className = 'mt-2 text-sm font-semibold text-slate-800';
      subjectValue.textContent = result.subject || '';
      subjectWrap.appendChild(subjectLabel);
      subjectWrap.appendChild(subjectValue);
      outputNode.appendChild(subjectWrap);

      if (Array.isArray(result.subjectVariations) && result.subjectVariations.length) {
        const variantWrap = document.createElement('div');
        variantWrap.className = 'mt-4 rounded-xl border border-slate-200 bg-white p-4';
        variantWrap.innerHTML = '<p class="text-xs font-semibold uppercase tracking-wide text-slate-700">Subject Variations</p>';
        const list = document.createElement('ul');
        list.className = 'mt-2 item-card-list';
        result.subjectVariations.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = item;
          list.appendChild(li);
        });
        variantWrap.appendChild(list);
        outputNode.appendChild(variantWrap);
      }

      const bodyBox = document.createElement('pre');
      bodyBox.className = 'tool-output-text mt-4';
      bodyBox.textContent = result.bodyText || '';
      outputNode.appendChild(bodyBox);

      if (result.note) {
        const note = document.createElement('p');
        note.className = 'no-results-inline mt-3';
        note.textContent = result.note;
        outputNode.appendChild(note);
      }

      const actions = document.createElement('div');
      actions.className = 'tool-actions';
      const copyButton = document.createElement('button');
      copyButton.type = 'button';
      copyButton.className = 'btn-secondary';
      copyButton.textContent = 'Copy Email';
      copyButton.addEventListener('click', async () => {
        try {
          const payload = `Subject: ${result.subject || ''}\n\n${result.bodyText || ''}`;
          await copyText(payload);
          showToast('success', 'Copied to clipboard.');
        } catch (error) {
          showToast('error', 'Could not copy right now.', 'Please copy manually.');
        }
      });
      actions.appendChild(copyButton);
      outputNode.appendChild(actions);
      return;
    }
    if (result.type === 'text') {
      const pre = document.createElement('pre');
      pre.className = `tool-output-text ${result.className || ''}`.trim();
      pre.textContent = result.text;
      outputNode.appendChild(pre);

      const actions = document.createElement('div');
      actions.className = 'tool-actions';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-secondary';
      button.textContent = 'Copy';
      button.addEventListener('click', async () => {
        try {
          await copyText(result.text);
          showToast('success', 'Copied to clipboard.');
        } catch (error) {
          showToast('error', 'Could not copy right now.', 'Please copy manually.');
        }
      });
      actions.appendChild(button);

      if (result.printable) {
        const printButton = document.createElement('button');
        printButton.type = 'button';
        printButton.className = 'btn-secondary';
        printButton.textContent = 'Print';
        printButton.addEventListener('click', () => {
          window.print();
          showToast('success', 'Done successfully.', 'Your print dialog is ready.');
        });
        actions.appendChild(printButton);
      }

      if (result.downloadable) {
        const downloadButton = document.createElement('button');
        downloadButton.type = 'button';
        downloadButton.className = 'btn-secondary';
        downloadButton.textContent = 'Download';
        downloadButton.addEventListener('click', () => {
          const blob = new Blob([result.text || ''], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = result.fileName || 'generated-output.txt';
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
          showToast('success', 'Your download is starting.');
        });
        actions.appendChild(downloadButton);
      }

      outputNode.appendChild(actions);
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'grid gap-4';
    (result.items || []).forEach((item, index) => {
      const content = typeof item === 'string' ? { text: item } : item;
      const card = document.createElement('article');
      card.className = 'item-card';

      const topLabel = document.createElement('p');
      topLabel.className = 'text-xs font-semibold uppercase tracking-wide text-indigo-600';
      topLabel.textContent = content.label || `${tool.category} ${index + 1}`;
      card.appendChild(topLabel);

      if (content.title) {
        const title = document.createElement('h4');
        title.className = 'item-card-title';
        title.textContent = content.title;
        card.appendChild(title);
      }

      if (content.text) {
        const textNode = document.createElement('p');
        textNode.className = 'mt-2 text-sm text-slate-700';
        textNode.textContent = content.text;
        card.appendChild(textNode);
      }

      if (Array.isArray(content.rows) && content.rows.length) {
        const list = document.createElement('ul');
        list.className = 'item-card-list';
        content.rows.forEach((row) => {
          const li = document.createElement('li');
          li.textContent = row;
          list.appendChild(li);
        });
        card.appendChild(list);
      }

      if (content.note) {
        const note = document.createElement('p');
        note.className = 'item-card-note';
        note.textContent = content.note;
        card.appendChild(note);
      }

      if (content.bestPick) {
        const bestPick = document.createElement('p');
        bestPick.className = 'item-card-badge';
        bestPick.textContent = 'Best Pick';
        card.appendChild(bestPick);
      }

      if (Array.isArray(content.hashtags) && content.hashtags.length) {
        const tagNode = document.createElement('p');
        tagNode.className = 'item-card-tags';
        tagNode.textContent = content.hashtags.join(' ');
        card.appendChild(tagNode);
      }

      const actions = document.createElement('div');
      actions.className = 'mt-4 flex items-center gap-3';
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'btn-secondary';
      copy.textContent = 'Copy';
      copy.addEventListener('click', async () => {
        try {
          const copyPayload = content.copyText
            || [content.label, content.title, content.text, Array.isArray(content.rows) ? content.rows.join('\n') : '', content.note]
              .filter(Boolean)
              .join('\n');
          await copyText(copyPayload);
          showToast('success', 'Copied to clipboard.');
        } catch (error) {
          showToast('error', 'Could not copy right now.', 'Please copy manually.');
        }
      });
      actions.appendChild(copy);

        const shareButton = document.createElement('button');
      shareButton.type = 'button';
      shareButton.className = 'btn-secondary';
      shareButton.textContent = 'Share';
      shareButton.addEventListener('click', async () => {
        try {
          const sharePayload = content.copyText
            || [content.label, content.title, content.text, Array.isArray(content.rows) ? content.rows.join('\n') : '', content.note]
              .filter(Boolean)
              .join('\n');
          const shared = await shareText(content.title || tool.title, sharePayload);
          showToast('success', shared ? 'Share dialog opened.' : 'Copied to clipboard.', shared ? '' : 'Share is unavailable. Content copied instead.');
        } catch (error) {
          showToast('error', 'Could not share right now.', 'Please try again.');
        }
      });
      actions.appendChild(shareButton);
      card.appendChild(actions);
      grid.appendChild(card);
    });
    outputNode.appendChild(grid);

    if (result.copyText || result.downloadable || result.printable) {
      const actions = document.createElement('div');
      actions.className = 'tool-actions';

      if (result.copyText) {
        const copyAll = document.createElement('button');
        copyAll.type = 'button';
        copyAll.className = 'btn-secondary';
        copyAll.textContent = 'Copy Plan';
        copyAll.addEventListener('click', async () => {
          try {
            await copyText(result.copyText);
            showToast('success', 'Copied to clipboard.');
          } catch (error) {
            showToast('error', 'Could not copy right now.', 'Please copy manually.');
          }
        });
        actions.appendChild(copyAll);
      }

        if (result.shareText) {
        const shareAll = document.createElement('button');
        shareAll.type = 'button';
        shareAll.className = 'btn-secondary';
        shareAll.textContent = 'Share All';
        shareAll.addEventListener('click', async () => {
          try {
            const shared = await shareText(tool.title, result.shareText);
            showToast('success', shared ? 'Share dialog opened.' : 'Copied to clipboard.', shared ? '' : 'Share is unavailable. Content copied instead.');
          } catch (error) {
            showToast('error', 'Could not share right now.', 'Please try again.');
          }
        });
        actions.appendChild(shareAll);
            }
      
      if (result.downloadable) {
        const downloadButton = document.createElement('button');
        downloadButton.type = 'button';
        downloadButton.className = 'btn-secondary';
        downloadButton.textContent = 'Download Plan';
        downloadButton.addEventListener('click', () => {
          const payload = result.copyText || (result.items || []).map((entry) => (typeof entry === 'string' ? entry : entry.copyText || entry.text || '')).join('\n\n');
          const blob = new Blob([payload], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = result.fileName || 'generated-plan.txt';
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
          showToast('success', 'Your download is starting.');
        });
        actions.appendChild(downloadButton);
      }

      if (result.printable) {
        const printButton = document.createElement('button');
        printButton.type = 'button';
        printButton.className = 'btn-secondary';
        printButton.textContent = 'Print Plan';
        printButton.addEventListener('click', () => {
          window.print();
          showToast('success', 'Done successfully.', 'Your print dialog is ready.');
        });
        actions.appendChild(printButton);
      }

      outputNode.appendChild(actions);
    }

    if (result.disclaimer) {
      const disclaimerNode = document.createElement('p');
      disclaimerNode.className = 'mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900';
      disclaimerNode.textContent = result.disclaimer;
      outputNode.appendChild(disclaimerNode);
    }

    if (Array.isArray(result.outputTips) && result.outputTips.length) {
      const tipWrap = document.createElement('div');
      tipWrap.className = 'mt-5 rounded-2xl border border-slate-200 bg-white p-4';
      const tipTitle = document.createElement('p');
      tipTitle.className = 'tool-tips-title';
      tipTitle.textContent = 'Answer tips';
      tipWrap.appendChild(tipTitle);

      const tipList = document.createElement('ul');
      tipList.className = 'item-card-list mt-2';
      result.outputTips.forEach((tip) => {
        const item = document.createElement('li');
        item.textContent = tip;
        tipList.appendChild(item);
      });
      tipWrap.appendChild(tipList);
      outputNode.appendChild(tipWrap);
    }

    if (result.cta?.href && result.cta?.label) {
      const ctaWrap = document.createElement('div');
      ctaWrap.className = 'mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4';

      const ctaText = document.createElement('p');
      ctaText.className = 'text-sm text-indigo-900';
      ctaText.textContent = result.cta.text || 'Explore more guidance on ToolShala career resources.';
      ctaWrap.appendChild(ctaText);

      const ctaLink = document.createElement('a');
      ctaLink.className = 'btn-primary mt-3 inline-flex';
      ctaLink.href = result.cta.href;
      ctaLink.textContent = result.cta.label;
      ctaWrap.appendChild(ctaLink);
      outputNode.appendChild(ctaWrap);
    }
    
    if (tool.id === 'linkedin-bio-generator') {
      const helper = document.createElement('p');
      helper.className = 'no-results-inline';
      helper.textContent = 'Edit the final version to match your real background and voice.';
      outputNode.appendChild(helper);
    }
  };

  const initToolDetailPage = () => {
    const root = document.querySelector('[data-tool-detail]');
    if (!root) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const toolId = params.get('tool') || toolDefinitions[0].id;
    const tool = getToolById(toolId) || toolDefinitions[0];

    const titleNode = root.querySelector('[data-tool-title]');
    const descriptionNode = root.querySelector('[data-tool-description]');
    const categoryNode = root.querySelector('[data-tool-category]');
    const tipsNode = root.querySelector('[data-tool-tips]');
    const formNode = root.querySelector('[data-tool-form]');
    const outputNode = root.querySelector('[data-tool-output]');
    const helperTextNode = root.querySelector('[data-tool-helper-text]');
    const errorNode = root.querySelector('[data-tool-error]');
    const loadingNode = root.querySelector('[data-tool-loading]');
    const resetButton = root.querySelector('[data-tool-reset]');
    const submitButton = root.querySelector('[data-tool-submit]');
    const generateMoreButton = root.querySelector('[data-tool-generate-more]');

    if (!titleNode || !descriptionNode || !categoryNode || !tipsNode || !formNode || !outputNode || !errorNode || !loadingNode || !submitButton || !resetButton) {
      return;
    }

    let variantCount = 0;
    let lastValues = null;
    let loadingMessageIndex = 0;

    document.title = `${tool.title} | ToolShala`;
    titleNode.textContent = tool.title;
    descriptionNode.textContent = tool.description;
    categoryNode.textContent = tool.category;
    submitButton.textContent = tool.ctaLabel || 'Generate';

    if (tipsNode) {
      tipsNode.innerHTML = (tool.tips || []).map((tip) => `<li>${escapeHtml(tip)}</li>`).join('');
    }

    if (helperTextNode) {
      helperTextNode.textContent = tool.helperText || 'Tip: add clear and truthful details to get practical, role-ready output.';
    }
    
    if (generateMoreButton) {
      generateMoreButton.classList.toggle('hidden', !tool.enableGenerateMore);
      generateMoreButton.textContent = tool.id === 'study-timetable-generator'
        ? 'Regenerate Plan'
        : tool.id === 'ai-career-path-suggestor'
          ? 'Regenerate Suggestions'
        : tool.id === 'resume-summary-generator'
          ? 'Regenerate Summaries'
        : tool.id === 'interview-answer-generator'
          ? 'Regenerate Answers'
        : tool.id === 'study-notes-summarizer'
          ? 'Regenerate Summary'
        : tool.id === 'assignment-rewriter'
          ? 'Regenerate Rewrite'
        : tool.id === 'sop-generator'
          ? 'Regenerate SOP'
        : tool.id === 'linkedin-networking-message-generator'
          ? 'Regenerate Messages'
        : tool.id === 'job-description-analyzer'
          ? 'Reanalyze'
        : tool.id === 'scholarship-finder'
          ? 'Regenerate Recommendations'
        : tool.id === 'career-path-quiz'
          ? 'Regenerate Paths'
        : tool.id === 'youtube-shorts-script-generator'
          ? 'Regenerate Scripts'
        : tool.outputType === 'text'
          ? 'Regenerate'
          : 'Generate More';
    }

    tool.fields.forEach((field) => {
      formNode.appendChild(renderField(field));
    });

    formNode.addEventListener('input', (event) => {
      clearFieldError(event.target);
    });

    renderOutput({ outputNode, result: null, tool });

    formNode.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorNode.textContent = '';
      errorNode.classList.add('hidden');

      const values = {};
      tool.fields.forEach((field) => {
        const input = formNode.querySelector(`[name="${field.key}"]`);
        values[field.key] = input ? input.value.trim() : '';
      });

      tool.fields.forEach((field) => {
        const input = formNode.querySelector(`[name="${field.key}"]`);
        clearFieldError(input);
      });

      const validation = validate(tool, values);
      if (validation) {
        Object.entries(validation.fieldErrors || {}).forEach(([fieldKey, message]) => {
          setFieldError(formNode, fieldKey, message);
        });
        errorNode.textContent = validation.formError || 'Please check the form and try again.';
        errorNode.classList.remove('hidden');
        showToast('error', 'Please fill in all required fields.');
        return;
      }

      submitButton.disabled = true;
      submitButton.dataset.defaultLabel = submitButton.dataset.defaultLabel || submitButton.textContent;
      submitButton.textContent = 'Generating...';
      loadingNode.textContent = TOOL_ENGINE_CONFIG.defaultLoadingMessages[loadingMessageIndex % TOOL_ENGINE_CONFIG.defaultLoadingMessages.length];
      loadingMessageIndex += 1;
      loadingNode.classList.remove('hidden');

      await wait(700);
      const result = await generateResult(tool.id, values, { variant: variantCount, mode: tool.generationMode || 'hybrid' });
      lastValues = values;
      renderOutput({ outputNode, result, tool });
      loadingNode.classList.add('hidden');
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.defaultLabel;
      if (result?.usedFallback) {
        showToast('error', 'AI service issue.', 'Showing fallback headlines for now.');
      } else {
        showToast('success', 'Your result is ready.');
      }
    });

    if (generateMoreButton) {
      generateMoreButton.addEventListener('click', async () => {
        if (!lastValues) {
          showToast('error', 'Please fill in all required fields.');
          return;
        }
        
        variantCount += 1;
        generateMoreButton.disabled = true;
        loadingNode.textContent = TOOL_ENGINE_CONFIG.defaultLoadingMessages[loadingMessageIndex % TOOL_ENGINE_CONFIG.defaultLoadingMessages.length];
        loadingMessageIndex += 1;
        loadingNode.classList.remove('hidden');
        await wait(500);
        const result = await generateResult(tool.id, lastValues, { variant: variantCount, mode: tool.generationMode || 'hybrid' });
        renderOutput({ outputNode, result, tool });
        loadingNode.classList.add('hidden');
        generateMoreButton.disabled = false;
        if (result?.usedFallback) {
          showToast('error', 'AI service issue.', 'Showing fallback headlines for now.');
        } else {
          showToast('success', 'New result generated.');
        }
      });
    }

    resetButton.addEventListener('click', () => {
      formNode.reset();
      tool.fields.forEach((field) => {
        const input = formNode.querySelector(`[name="${field.key}"]`);
        clearFieldError(input);
      });
      lastValues = null;
      variantCount = 0;
      errorNode.textContent = '';
      errorNode.classList.add('hidden');
      loadingNode.classList.add('hidden');
      renderOutput({ outputNode, result: null, tool });
      showToast('success', 'Done successfully.');
    });
  };

  initToolDetailPage();
})();
