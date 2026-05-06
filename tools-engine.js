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
    defaultEndpoint: '/api/generate',
    defaultProvider: 'nvidia',
    defaultLoadingMessages: ['Generating your result...', 'Preparing your content...', 'Just a moment...']
  };

  const PHOTO_TO_TEXT_CONFIG = {
    endpoint: '/api/photo-to-text',
    maxFileSize: 8 * 1024 * 1024,
    allowedTypes: new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
  };

  const buildPromptFromValues = (toolId, values = {}) => {
    const promptLines = Object.entries(values || {})
      .map(([key, value]) => `${key}: ${String(value || '').trim()}`)
      .filter((line) => !line.endsWith(':'));

    return [
      `Tool ID: ${toolId}`,
      'Generate a high-quality response based on the following user inputs.',
      ...promptLines
    ].join('\n');
  };

  const defaultApiProvider = {
    name: TOOL_ENGINE_CONFIG.defaultProvider,
    endpoint: TOOL_ENGINE_CONFIG.defaultEndpoint,
    async generate({ toolId, values }) {
      const response = await fetch(TOOL_ENGINE_CONFIG.defaultEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildPromptFromValues(toolId, values) })
      });

      const payload = await response.json().catch(() => {
        throw new Error('Invalid JSON response from /api/generate.');
      });

      if (!response.ok) {
        throw new Error(String(payload?.error || `Request failed with status ${response.status}`).trim());
      }

      const text = String(payload?.text || '').trim();
      if (!text) {
        throw new Error('The AI service returned an empty response.');
      }

      return { type: 'text', text };
    }
  };

  const getApiProvider = () => {
    const provider = window[TOOL_ENGINE_CONFIG.apiProviderGlobal];
    if (provider && typeof provider.generate === 'function') {
      return provider;
    }

    if (window.console && typeof window.console.warn === 'function') {
      window.console.warn('[ToolShala] Page-level AI provider missing. Using default /api/generate provider.');
    }

    return defaultApiProvider;
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

  const getToolFields = (tool) => {
    if (Array.isArray(tool?.fields) && tool.fields.length) {
      return tool.fields;
    }
    if (Array.isArray(tool?.inputs) && tool.inputs.length) {
      return tool.inputs;
    }
    return [];
  };

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

    'resume-bullet-point-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const role = String(values.role || '').trim();
      const experienceType = String(values.experienceType || '').trim();
      const task = String(values.task || '').trim();
      const result = String(values.result || '').trim();
      const tone = String(values.tone || 'professional').toLowerCase();
      const skills = normalizeCommaList(values.skills);
      const topSkills = skills.slice(0, 3);
      const primarySkill = topSkills[0] || 'relevant tools';
      const skillText = topSkills.join(', ');

      const actionByTone = {
        professional: ['Developed', 'Implemented', 'Optimized', 'Coordinated', 'Delivered'],
        strong: ['Led', 'Accelerated', 'Transformed', 'Streamlined', 'Spearheaded'],
        simple: ['Built', 'Improved', 'Managed', 'Created', 'Supported'],
        'ats-friendly': ['Developed', 'Executed', 'Analyzed', 'Improved', 'Collaborated']
      };
      const actions = actionByTone[tone] || actionByTone.professional;

      const templates = [
        `${actions[0]} ${experienceType.toLowerCase()} deliverables as a ${role} by ${task.toLowerCase()}, using ${skillText}, resulting in ${result.toLowerCase()}.`,
        `${actions[1]} key ${experienceType.toLowerCase()} responsibilities through ${primarySkill} and ${task.toLowerCase()}, which ${result.toLowerCase()}.`,
        `${actions[2]} workflows for ${experienceType.toLowerCase()} assignments with ${skillText} to ${task.toLowerCase()}, helping ${result.toLowerCase()}.`,
        `${actions[3]} cross-functional tasks as a ${role}, applying ${skillText} to ${task.toLowerCase()} and ${result.toLowerCase()}.`,
        `${actions[4]} measurable outcomes in ${experienceType.toLowerCase()} work by leveraging ${primarySkill} for ${task.toLowerCase()}, leading to ${result.toLowerCase()}.`
      ];

      const items = templates.map((textValue, index) => ({
        label: `Bullet Point ${index + 1}`,
        text: textValue.charAt(0).toUpperCase() + textValue.slice(1),
        hashtags: index === (variant % 5)
          ? ['Best Pick', 'ATS-Friendly', 'Strong Impact']
          : ['ATS-Friendly', 'Strong Impact'],
        bestPick: index === (variant % 5),
        copyText: `• ${textValue.charAt(0).toUpperCase() + textValue.slice(1)}`,
        note: 'Action + Skill + Result structure'
      }));

      return {
        type: 'cards',
        items: items.slice(0, 5),
        outputTips: [
          'Start with action verbs',
          'Mention tools or skills',
          'Keep bullets short and impactful'
        ],
        disclaimer: 'Use strong action words and measurable results.'
      };
    },

    'resume-summary-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const skills = normalizeCommaList(values.skills);
      const topSkills = skills.slice(0, 4);
      const skillSnippet = topSkills.join(', ');
      const tone = String(values.tone || 'professional').toLowerCase();
      const experience = String(values.experience || 'Fresher').trim();
      const achievement = String(values.achievement || '').trim();
      const industry = String(values.industry || '').trim();
      const role = String(values.role || '').trim();

      const careerStage = experience === 'Fresher'
        ? `Fresher ${role} candidate`
        : `${role} candidate with ${experience.toLowerCase()} exposure`;

      const toneOpeners = {
        professional: `${careerStage} with a strong foundation in ${skillSnippet}`,
        confident: `Motivated ${careerStage.toLowerCase()} focused on ${skillSnippet}`,
        simple: `${careerStage} skilled in ${skillSnippet}`,
        'ats-friendly': `${careerStage}; key skills: ${skillSnippet}`
      };

      const achievementLine = achievement
        ? `Strength highlight: ${achievement}.`
        : 'Brings a learning-first mindset, ownership, and consistent execution.';

      const domainLine = industry
        ? `Interested in ${industry} opportunities where practical contribution matters from day one.`
        : 'Open to internship and entry-level opportunities with real project impact.';

      const templates = [
        {
          text: `${toneOpeners[tone] || toneOpeners.professional}. ${achievementLine} ${domainLine}`,
          hashtags: ['Best Pick', 'ATS-Friendly', 'Skills Focused', 'Professional']
        },
        {
          text: `Aspiring ${role} with skills in ${skillSnippet}. Focused on delivering clean, role-aligned outcomes and growing through hands-on work.`,
          hashtags: ['ATS-Friendly', 'Skills Focused']
        },
        {
          text: `${experience === 'Fresher' ? 'Career starter' : `Early-career profile (${experience})`} targeting ${role} roles. Combines ${topSkills.slice(0, 3).join(', ')} with communication, adaptability, and attention to detail.`,
          hashtags: ['Professional', 'Entry-Level Ready']
        },
        {
          text: `${role} profile with practical strengths in ${skillSnippet}. ${achievement ? `Notable strength: ${achievement}.` : 'Known for reliability and quick learning in collaborative environments.'}`,
          hashtags: ['Professional', 'ATS-Friendly']
        },
        {
          text: `Prepared for internship and fresher-level ${role} opportunities with working knowledge of ${topSkills.slice(0, 3).join(', ')} and a problem-solving approach.`,
          hashtags: ['Simple', 'Job-Ready']
        }
      ];

      const finalItems = templates
        .map((_, index) => templates[(index + variant) % templates.length])
        .slice(0, 5)
        .map((item, index) => ({
          ...item,
          label: index === 0 ? 'Best Pick' : `Summary Option ${index + 1}`,
          bestPick: index === 0,
          copyText: item.text
        }));

      return {
        type: 'cards',
        items: finalItems,
        outputTips: [
          'Keep it concise.',
          'Match the target role.',
          'Mention strongest skills first.'
        ]
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
      const technicalSignals = ['how do you', 'what is', 'difference', 'algorithm', 'debug', 'api', 'database', 'javascript', 'react', 'sql', 'performance', 'architecture', 'optimize'];
      const isBehavioral = behavioralSignals.some((signal) => loweredQuestion.includes(signal));
      const isTechnical = technicalSignals.some((signal) => loweredQuestion.includes(signal));

      const toneLead = {
        professional: 'I answer this with a clear structure and practical focus.',
        confident: 'I answer this confidently with clear steps and measurable thinking.',
        friendly: 'I keep the answer practical and easy to connect with.',
        simple: 'I keep the answer clear, direct, and relevant.'
      };

      const exampleLine = achievement
        ? `A quick example is ${achievement}.`
        : `In project work related to ${role}, I used ${skill} to solve practical tasks.`;

      const shortAnswerText = `${toneLead[tone]} For a ${role} position, I focus on ${skill} and keep my approach outcome-oriented. ${exampleLine}`;
      const detailedAnswerText = `My approach is to explain context, action, and outcome in simple language. At the ${experience} level, I use ${skill} to deliver reliable work in ${role} responsibilities. ${exampleLine} This helps me prioritize, communicate clearly, and improve results with each iteration.`;
      const starAnswerText = `Situation: In a role-relevant project, I faced a challenge that affected progress.\nTask: I needed to resolve it while keeping quality and deadlines in check.\nAction: I used ${skill} to break the work into clear steps, aligned with team expectations, and implemented a practical fix.${achievement ? ` Example: ${achievement}.` : ''}\nResult: We achieved a smoother workflow, better clarity, and a stronger final output.`;
      const technicalAnswerText = `For technical questions, I first clarify requirements, then choose a practical solution using ${skill}. I explain trade-offs, test edge cases, and keep the implementation aligned to ${role} expectations. ${achievement ? `One relevant example is ${achievement}.` : 'I keep the explanation concise and focused on what works in real scenarios.'}`;

      const shortAnswer = {
        label: 'Short Answer',
        text: shortAnswerText,
        hashtags: ['Short Answer', 'Role-Relevant', 'Professional'],
        copyText: `${question}\n\n${shortAnswerText}`
      };

      const detailedAnswer = {
        label: 'Detailed Answer',
        text: detailedAnswerText,
        hashtags: ['Detailed Answer', 'Skills Focused', 'Interview Ready'],
         copyText: `${question}\n\n${detailedAnswerText}`
      };

      const starAnswer = {
        label: 'STAR Answer',
        text: starAnswerText,
        hashtags: ['STAR Answer', 'Behavioral Ready', 'Structured'],
        copyText: `${question}\n\n${starAnswerText}`
      };

      const technicalAnswer = {
        label: 'Detailed Answer',
        text: technicalAnswerText,
        hashtags: ['Technical', 'Practical', 'Detailed Answer'],
        copyText: `${question}\n\n${technicalAnswerText}`
      };

      const stylePriority = {
        short: 'Short Answer',
        detailed: 'Detailed Answer',
        star: 'STAR Answer'
      };

      const sortByStylePriority = (entries) => {
        const preferredLabel = stylePriority[preferredStyle];
        if (!preferredLabel) {
          return entries;
        }
        return [entries.find((entry) => entry.label === preferredLabel), ...entries.filter((entry) => entry.label !== preferredLabel)].filter(Boolean);
      };

      let variants = [shortAnswer, detailedAnswer, starAnswer];
      if (isBehavioral) {
        variants = [starAnswer, detailedAnswer, shortAnswer, technicalAnswer];
      } else if (isTechnical) {
        variants = [technicalAnswer, shortAnswer, detailedAnswer, starAnswer];
      } else {
        variants = [shortAnswer, detailedAnswer, starAnswer, technicalAnswer];
      }

      variants = sortByStylePriority(variants);
      const maxItems = isTechnical ? 3 : 4;
      const rotated = variants.map((_, index) => variants[(index + (variant % variants.length)) % variants.length]).slice(0, maxItems);
      const items = rotated.map((entry, index) => ({
        ...entry,
        bestPick: index === 0,
        hashtags: index === 0 ? ['Best Pick', ...(entry.hashtags || [])] : entry.hashtags
      }));

      return {
        type: 'cards',
        items,
        outputTips: ['Keep answers specific', 'Don’t over-explain', 'Use real examples']
      };
    },

    'notes-to-bullet-points-converter': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const topic = String(values.topic || '').trim();
      const notes = String(values.notes || '').trim();
      const educationLevel = String(values.educationLevel || 'school').trim();
      const summaryStyle = String(values.summaryStyle || 'short-bullets').trim();
      const focus = String(values.focus || '').trim();

      const sentences = splitSentences(notes);
      const baseSentences = (sentences.length ? sentences : notes.split(/[.?!]\s+/)).map((s) => s.trim()).filter(Boolean);
      const cleaned = baseSentences.map((s) => s.replace(/^[•\-]\s*/, ''));
      const primaryBullets = cleaned.slice(variant % 2, (variant % 2) + 5).map((line) => line.length > 140 ? `${line.slice(0, 137)}...` : line);
      const keywords = extractKeywords(`${topic} ${notes}`, 10);

      const focusNote = focus === 'definitions'
        ? 'Prioritize key definitions and exact meanings.'
        : focus === 'facts'
          ? 'Prioritize important facts, dates, and values.'
          : focus === 'formula-concepts'
            ? 'Prioritize formulas, core concepts, and usage steps.'
            : focus === 'important-terms'
              ? 'Prioritize important terms and exam keywords.'
              : 'Prioritize high-yield revision points.';

      const styleLabel = summaryStyle === 'exam-points'
        ? 'Exam Points'
        : summaryStyle === 'revision-points'
          ? 'Revision Points'
          : 'Short Bullets';

      return {
        type: 'cards',
        items: [
          {
            label: 'Best Pick Summary',
            title: `${topic} - ${styleLabel}`,
            text: 'Use these concise bullets for quick recall:',
            rows: primaryBullets.length ? primaryBullets : ['Read topic overview once.', 'List top 3 concepts.', 'Revise one solved example.'],
            hashtags: ['Best Pick', 'Revision Helper'],
            bestPick: true,
            copyText: (primaryBullets.length ? primaryBullets : ['Read topic overview once.', 'List top 3 concepts.', 'Revise one solved example.']).map((r) => `• ${r}`).join('\n')
          },
          {
            label: 'Important Keywords',
            rows: keywords.length ? keywords.slice(0, 8) : ['Add more detailed notes to extract stronger keywords.'],
            hashtags: ['Keywords', 'Exam Focus']
          },
          {
            label: 'Quick Revision Bullets',
            rows: cleaned.slice(0, 4).map((line, index) => `Point ${index + 1}: ${line}`),
            note: focusNote,
            hashtags: [educationLevel === 'competitive-exam' ? 'Competitive Exam' : educationLevel === 'college' ? 'College' : 'School', styleLabel]
          }
        ],
        outputTips: ['Keep points short', 'Highlight formulas', 'Revise repeatedly'],
        disclaimer: 'Use this as a revision helper and review once before exams.'
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
      const normalizedSentences = sentences.length
        ? sentences
        : String(notes)
          .replace(/\s+/g, ' ')
          .split(/[.?!]\s+/)
          .map((entry) => entry.trim())
          .filter(Boolean);

      const summarySentences = normalizedSentences.slice(variant % 2, (variant % 2) + 2).length
        ? normalizedSentences.slice(variant % 2, (variant % 2) + 2)
        : normalizedSentences.slice(0, 2);
      const summaryText = summarySentences.join(' ');

      const keywordList = extractKeywords(`${topic} ${notes}`, 8);
      const bulletBase = normalizedSentences.slice(0, 6).map((sentence) => sentence.replace(/^[•\-]\s*/, ''));
      const keywordRevision = keywordList.slice(0, 4).map((word, index) => `Point ${index + 1}: Revise ${word} and its practical use-case.`);
      const revisionPoints = (bulletBase.slice(0, 4).map((point, index) => `Point ${index + 1}: ${point}`)).concat(keywordRevision).slice(0, 4);

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

      const levelLine = educationLevel === 'competitive-exam'
        ? 'Prepared for competitive exam revision with high-value recall points.'
        : educationLevel === 'college'
          ? 'Prepared for college-level concept clarity and faster revision.'
          : 'Prepared for school-level understanding and quick recall.';
      
      const mnemonicSource = keywordList.slice(0, 4);
      const mnemonic = mnemonicSource.length >= 3
        ? `Mnemonic (${mnemonicSource.map((word) => word[0]?.toUpperCase()).join('')}): Remember ${mnemonicSource.join(', ')}.`
        : '';

      const shortNotesRows = summarySentences
        .map((entry, index) => `Note ${index + 1}: ${entry}`)
        .slice(0, 3);

      const bulletRows = outputStyle === 'short-notes'
        ? shortNotesRows
        : bulletBase.slice(0, 5);
      
      const cards = [
        {
          label: 'Summary',
          title: topic,
          text: summaryText || `This topic covers key ideas related to ${topic}.`,
          note: `${styleLine} ${toneLine} ${levelLine}`,
          hashtags: ['Summary', 'Exam Ready', 'Best Pick'],
          bestPick: true
        },
        {
          label: 'Bullet Points',
          text: 'Important bullet points from your notes:',
          rows: bulletRows.length ? bulletRows : ['Review the first concept and its meaning.', 'Connect the idea to one example.', 'Revise important terms once.'],
          hashtags: ['Bullet Summary', educationLevel.replace('-', ' ')],
          copyText: bulletRows.join('\n')
        },
        {
          label: 'Important Keywords',
          rows: keywordList.length ? keywordList.slice(0, 8).map((word) => word) : ['Keywords could not be extracted clearly. Try adding more content.'],
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

    'grammar-corrector-sentence-improver': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const originalText = String(values.originalText || '').trim();
      const outputStyle = String(values.outputStyle || 'simple').toLowerCase();
      const improvementLevel = String(values.improvementLevel || 'moderate').toLowerCase();
      const tone = String(values.tone || '').toLowerCase();

      const sentences = splitSentences(originalText);
      const normalized = sentences.length ? sentences : [originalText];

      const correctedSentences = normalized.map((sentence) => {
        let next = sentence.replace(/\s+/g, ' ').trim();
        if (next && !/[.!?]$/.test(next)) next = `${next}.`;
        next = next.replace(/\bi\b/g, 'I');
        next = next.replace(/\bim\b/gi, "I'm");
        next = next.replace(/\bdont\b/gi, "don't");
        next = next.replace(/\bcant\b/gi, "can't");
        next = next.replace(/\bwont\b/gi, "won't");
        next = next.replace(/\b([a-z])/g, (m, ch) => ch.toUpperCase());
        return next;
      });

      let improvedSentences = correctedSentences.map((sentence) => rewriteSentence(sentence, outputStyle));

      if (improvementLevel === 'light') {
        improvedSentences = correctedSentences.map((sentence) => sentence.replace(/\bvery\b\s+/gi, '').trim());
      } else if (improvementLevel === 'strong') {
        improvedSentences = correctedSentences.map((sentence) => {
          const rewired = rewriteSentence(sentence, outputStyle);
          return `To improve clarity, ${rewired.charAt(0).toLowerCase()}${rewired.slice(1)}`;
        });
      }

      if (tone) {
        improvedSentences = improvedSentences.map((sentence) => {
          if (tone === 'polite') return `Please note that ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`;
          if (tone === 'confident') return `Clearly, ${sentence}`;
          if (tone === 'academic') return `From an academic perspective, ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`;
          return sentence;
        });
      }

      if (variant % 2 === 1) {
        improvedSentences = improvedSentences.map((sentence) => sentence.replace(/\bin order to\b/gi, 'to'));
      }

      const correctedText = correctedSentences.join(' ');
      const improvedText = improvedSentences.join(' ');
      const bestPick = improvementLevel === 'light' ? correctedText : improvedText;

      return {
        type: 'cards',
        items: [
          { label: 'Corrected', text: correctedText, hashtags: ['Grammar', 'Readable'], copyText: correctedText },
          { label: 'Improved', text: improvedText, hashtags: ['Clarity', outputStyle], copyText: improvedText },
          { label: 'Best Pick', text: bestPick, note: 'Balanced for readability and natural tone.', bestPick: true, hashtags: ['Best Pick'], copyText: bestPick },
          {
            label: 'Improvement Tips',
            rows: [
              'Keep sentences short.',
              'Use active voice where possible.',
              'Remove repeated words before final use.'
            ],
            copyText: 'Keep sentences short.\nUse active voice where possible.\nRemove repeated words before final use.'
          }
        ],
        outputTips: ['Always review the final text before using it.']
      };
    },
    'paragraph-rewriter-humanizer': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const originalParagraph = String(values.originalParagraph || '').trim();
      const desiredTone = String(values.desiredTone || 'simple').toLowerCase();
      const rewriteStyle = String(values.rewriteStyle || 'same-length').toLowerCase();
      const focus = String(values.focus || '').toLowerCase();

      const sourceSentences = splitSentences(originalParagraph);
      const normalizedSentences = sourceSentences.length
        ? sourceSentences
        : originalParagraph
          .replace(/\s+/g, ' ')
          .split(/[.?!]\s+/)
          .map((entry) => entry.trim())
          .filter(Boolean);

      const rewrittenSentences = normalizedSentences.map((sentence) => {
        let next = rewriteSentence(sentence, desiredTone).trim();
        if (focus === 'clarity') {
          next = next.replace(/\bin order to\b/gi, 'to').replace(/\bdue to the fact that\b/gi, 'because');
        } else if (focus === 'fluency') {
          next = next.replace(/\s+/g, ' ').replace(/\bhowever\b/gi, 'still');
        } else if (focus === 'vocabulary') {
          next = next.replace(/\bgood\b/gi, 'effective').replace(/\bbad\b/gi, 'unhelpful');
        } else if (focus === 'readability') {
          next = next.replace(/,\s*which\s*/gi, '. This ');
        }
        return next;
      });

      let rewrittenText = rewrittenSentences.join(' ');
      if (rewriteStyle === 'shorter') {
        rewrittenText = rewrittenSentences.slice(0, Math.max(2, Math.ceil(rewrittenSentences.length * 0.65))).join(' ');
      } else if (rewriteStyle === 'longer') {
        rewrittenText = `${rewrittenText} This version keeps the core meaning intact while adding clearer transitions and context.`;
      } else if (rewriteStyle === 'more-natural') {
        rewrittenText = rewrittenText.replace(/\btherefore\b/gi, 'so').replace(/\bmoreover\b/gi, 'also');
      }

      const humanizedText = rewrittenText
        .replace(/\butilize\b/gi, 'use')
        .replace(/\bcommence\b/gi, 'start')
        .replace(/\badditionally\b/gi, 'also');

      const shortVersion = splitSentences(humanizedText).slice(0, 2).join(' ') || humanizedText.slice(0, 220);
      const bestPick = rewriteStyle === 'more-natural' ? humanizedText : rewrittenText;

      const bestPickNote = desiredTone === 'academic'
        ? 'Polished for academic readability with preserved meaning.'
        : desiredTone === 'professional'
          ? 'Polished for professional communication with smoother flow.'
          : 'Balanced for natural tone, clarity, and readability.';

      if (variant % 2 === 1) {
        rewrittenText = rewrittenText.replace(/\bimportant\b/gi, 'key');
      }

      return {
        type: 'cards',
        items: [
          { label: 'Rewritten', text: rewrittenText, hashtags: ['Rewritten', 'Meaning Preserved'], copyText: rewrittenText },
          { label: 'Humanized', text: humanizedText, hashtags: ['Natural Tone', 'Humanized'], copyText: humanizedText },
          { label: 'Best Pick', text: bestPick, note: bestPickNote, bestPick: true, hashtags: ['Best Pick'], copyText: bestPick },
          { label: 'Short Version', text: shortVersion, hashtags: ['Short Version'], copyText: shortVersion }
        ],
        outputTips: ['Break long sentences', 'Replace repeated words', 'Keep the meaning the same']
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
      const normalizedSentences = sentences.length
        ? sentences
        : originalText
          .replace(/\s+/g, ' ')
          .split(/[.?!]\s+/)
          .map((entry) => entry.trim())
          .filter(Boolean);

      const rewrittenSentences = normalizedSentences.map((sentence, index) => {
        const base = rewriteSentence(sentence, tone);
        if (variant % 2 === 1 && index % 2 === 0) {
          return base.replace(/\bIn conclusion\b/gi, 'Overall').replace(/\bFirstly\b/gi, 'First');
        }
        return base;
      });

      let rewrittenText = rewrittenSentences.join(' ');
      if (!rewrittenText) {
        rewrittenText = rewriteSentence(originalText, tone);
      }

      if (keyPoints) {
        rewrittenText = `${rewrittenText} Key focus included: ${keyPoints}`;
      }

      if (audience) {
        rewrittenText = `${rewrittenText} This version is adjusted for a ${audience} audience while keeping the original intent intact.`;
      }

      if (targetLength === 'shorter') {
        const shortened = splitSentences(rewrittenText);
        rewrittenText = shortened.slice(0, Math.max(2, Math.ceil(shortened.length * 0.7))).join(' ');
      }

      if (targetLength === 'longer') {
        rewrittenText = `${rewrittenText} In ${topic}, adding one practical example and one cause-effect explanation can improve clarity and depth for evaluators.`;
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
            note: 'Use this as a rewriting helper, then review it in your own words.',
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
        ? 'I am strongly motivated to build deeper expertise through focused learning and contribution.'
        : tone === 'confident'
          ? 'I am confident that my preparation and intent align with the outcomes of this program.'
          : tone === 'academic'
            ? 'My academic intent is centered on rigorous inquiry, practical application, and long-term scholarly growth.'
            : 'I respectfully submit this statement to present my academic intent and readiness for this opportunity.';

      const intro = `Introduction: I am applying for ${program} at ${university} to strengthen my domain foundation and pursue meaningful academic growth. ${toneLine}`;
      const academicSection = `Academic Background: ${background}`;
      const motivationSection = `Motivation: ${whyProgram}`;
      const goalsSection = `Goals: ${careerGoals}`;
      const achievementsSection = `Achievements / Projects: ${achievements}`;
      const conclusion = `Conclusion: I believe ${program} at ${university} is the right next step for my academic and professional journey, and I am prepared to contribute responsibly to the university community.`;

      const mediumDraftSections = [intro, academicSection, achievementsSection, motivationSection, goalsSection, conclusion];
      const longDraftExtra = 'I am eager to contribute to project-driven learning, collaborate with peers from diverse backgrounds, and apply classroom learning to practical outcomes.';

      let sopDraft = mediumDraftSections.join('\n\n');
      if (variant % 2 === 1) {
        sopDraft = [intro, motivationSection, academicSection, achievementsSection, goalsSection, conclusion].join('\n\n');
      }

      if (wordCount === 'short') {
        sopDraft = [intro, academicSection, motivationSection, conclusion].join('\n\n');
      } else if (wordCount === 'long') {
        sopDraft = `${sopDraft}\n\n${longDraftExtra}`;
      }

      const sectionRows = [
        `Introduction: Why you are applying to ${program} at ${university}.`,
        'Academic Background: Relevant academic preparation and learning trajectory.',
        'Motivation: Why this university/program is a fit for your profile.',
        'Achievements / Projects: Mention real projects, outcomes, and learning.',
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
            multiline: true,
            note: 'Customize the SOP for each university or program.',
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

      const compact = (value = '', limit = 290) => {
        const cleaned = String(value).replace(/\s+/g, ' ').trim();
        if (cleaned.length <= limit) {
          return cleaned;
        }
        return `${cleaned.slice(0, limit - 1).trimEnd()}…`;
      };

      const trimmedBackground = compact(background, 110);
      const sharedLine = sharedReference ? ` Shared point: ${sharedReference}.` : '';
      const connectionRequest = compact(`${greetingMap[recipientType]}, I am exploring ${targetRole} opportunities. ${trimmedBackground} I reached out because I value ${recipientContext[recipientType]}.${sharedLine} Would love to connect.`, 300);
      const followUp = compact(`${greetingMap[recipientType]}, following up on my earlier note regarding ${purpose}. I am preparing for ${targetRole} roles and would appreciate brief guidance.${sharedLine} ${toneTail[tone]}`, 300);
      const networkingIntro = compact(`${greetingMap[recipientType]}, I am focused on ${targetRole}. ${trimmedBackground} I am reaching out to learn from your experience around ${purpose}.${sharedLine} ${toneTail[tone]}`, 300);

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
          bestPick: index === 0,
          copyText: item.text
        })),
        outputTips: ['Mention why you’re reaching out', 'Keep it under 300 characters if possible', 'Personalize with a shared point']
      };
    },
    'job-description-analyzer': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const jobDescription = String(values.jobDescription || '').trim().toLowerCase();
      const userSkillsRaw = normalizeCommaList(values.userSkills);
      const userSkills = userSkillsRaw.map((skill) => skill.toLowerCase());
      const experienceLevel = String(values.experienceLevel || 'fresher').trim();
      const targetRole = String(values.targetRole || '').trim();
      const resumeSummary = String(values.resumeSummary || '').trim();
      const tone = String(values.tone || 'clear').toLowerCase();

      const jdKeywords = extractKeywords(jobDescription, 18);
      const matchedSkills = userSkillsRaw.filter((skill, index) => {
        const lowered = userSkills[index];
        return jdKeywords.some((keyword) => keyword.includes(lowered) || lowered.includes(keyword));
      });
      const missingSkills = jdKeywords
        .filter((keyword) => !userSkills.some((skill) => skill.includes(keyword) || keyword.includes(skill)))
        .slice(0, 7);
      const resumeKeywords = jdKeywords.slice(0, 10);

      const baseScore = Math.round((matchedSkills.length / Math.max(1, matchedSkills.length + missingSkills.length)) * 100);
      const experienceBonus = experienceLevel === '1-3 years' ? 8 : experienceLevel === '0-1 years' ? 4 : 0;
      const roleBoost = targetRole && jobDescription.includes(targetRole.toLowerCase()) ? 4 : 0;
      const rawScore = Math.min(92, Math.max(22, baseScore + experienceBonus + roleBoost));
      const fitLevel = rawScore >= 75 ? 'Strong Match' : rawScore >= 55 ? 'Moderate Match' : 'Low Match';
      const verdict = rawScore >= 75
        ? 'You appear to be a strong fit for this role. Keep your application specific and evidence-based.'
        : rawScore >= 55
          ? 'You are a partial fit. Improve key gaps and tailor your resume before applying.'
          : 'Current fit appears weak. Build missing skills first, then apply strategically to similar roles.';

      const tailoringTips = [
        `Place ${matchedSkills.slice(0, 3).join(', ') || 'your strongest relevant skills'} near the top of your resume.`,
        `Add role keywords such as ${resumeKeywords.slice(0, 4).join(', ')} in your summary and project bullets.`,
        missingSkills.length
          ? `Prioritize these gaps first: ${missingSkills.slice(0, 3).join(', ')}.`
          : 'You cover most visible skill signals from this job description. Focus on outcomes and evidence.'
      ];

      const toneNote = tone === 'detailed'
         ? `Detailed analysis mode. Experience level considered: ${experienceLevel}.`
        : tone === 'beginner-friendly'
          ? 'Beginner-friendly mode. Work on one skill gap at a time and apply in focused batches.'
          : 'Clear mode. Quick, practical analysis for faster decisions.';

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

      const interestLabelMap = {
        sports: 'Sports',
        women: 'Women',
        research: 'Research',
        'financial-support': 'Financial Support',
        stem: 'STEM',
        arts: 'Arts'
      };
      
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
          scholarshipType: `${specialInterest ? `${interestLabelMap[specialInterest] || specialInterest}-Focused Scholarship Categories` : 'Field and Profile-Based Scholarship Categories'}`,
          suitableFor: specialInterest
            ? `Students with profile focus in ${interestLabelMap[specialInterest] || specialInterest} and consistent academic record (${academicPerformance}).`
            : `Students with relevant achievements and consistent performance (${academicPerformance}).`,
          prepare: ['Proof of achievements/projects', 'Recommendation letter', 'Resume/CV', 'Statement of purpose'],
          nextStep: 'Shortlist official scholarship categories from trusted portals and compare document requirements.'
        }
      ];

      const rotated = baseTypes.map((_, index) => baseTypes[(index + (variant % baseTypes.length)) % baseTypes.length]);
      const items = rotated.map((entry, index) => ({
        label: `Recommendation ${index + 1}`,
        title: entry.scholarshipType,
        text: needType === 'need-based'
          ? 'Funding-first recommendation based on your profile context.'
          : needType === 'merit-based'
            ? 'Merit-first recommendation based on your academic profile.'
            : 'Balanced recommendation based on your profile and context.',
        rows: [
          `Who it suits: ${entry.suitableFor}`,
          `What to prepare: ${entry.prepare.join(', ')}`,
          `Next step: ${entry.nextStep}`
        ],
        bestPick: index === 0,
        copyText: `${entry.scholarshipType}\nWho it suits: ${entry.suitableFor}\nWhat to prepare: ${entry.prepare.join(', ')}\nNext step: ${entry.nextStep}`
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
      if (goal === 'freelancing') {
        pool.unshift({ title: 'Freelance Content & Growth Specialist', why: 'Freelancing goal aligns with service-based execution and portfolio building.', skills: ['Client communication', 'Proposal writing', 'Delivery systems'], step: 'Create 2 sample client projects and one profile page.' });
      }
      if (goal === 'higher-studies') {
        pool.unshift({ title: 'Research Preparation Track', why: 'Higher-studies goal aligns with structured academic exploration.', skills: ['Literature review', 'Academic writing', 'Problem framing'], step: 'Shortlist target programs and build one mini research portfolio.' });
      }

      const selected = pool.slice(0, 5).map((path, index) => {
        const strengthText = strengths.slice(0, 3).join(', ') || 'your current strengths';
        const stageLabel = stage === 'school' ? 'school stage' : stage === 'college' ? 'college stage' : stage === 'graduate' ? 'graduate stage' : 'fresher stage';
        return {
          label: 'Suitable Path',
          title: path.title,
          text: `Why it fits: ${path.why} Profile signals considered: ${workStyle} style, ${stageLabel}, strengths like ${strengthText}.`,
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
        rotated.forEach((item, index) => {
          item.bestPick = index === 0;
          item.label = index === 0 ? 'Best Match' : index <= 2 ? 'Suitable Path' : 'Beginner Friendly';
        });
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
        `Stop scrolling—${topic} is easier than you think.`,
        `Most creators get ${topic} wrong. Here’s the fix.`,
        `${audience ? `${audience},` : 'Quick one:'} this can save you time today.`
      ];
      const ctas = [
        'Comment your biggest takeaway.',
        'Follow for more practical creator strategies.',
        'Save this and test it today.'
      ];

      const makeScript = (index) => {
        const hook = hookTemplates[(index + variant) % hookTemplates.length];
        const mainPoints = isShort
          ? [`Point 1: Quick insight on ${topic}.`, `Point 2: One mistake to avoid for ${audience || 'your audience'}.`, `Point 3: Action step you can apply today.`]
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
            `Thumbnail text: ${keywords[0] ? `${keywords[0]} Mistakes to Avoid` : `${topic}: Start Here`}`,
            `Title variant: ${keywords[0] ? `${topic} for ${audience} (${keywords[0]} Edition)` : `${topic}: Do This Instead`}`
          ],
          bestPick: index === 0,
          note: length ? `Length target: ${length}` : '',
          copyText: `${title}\nHook: ${hook}\n${mainPoints.join('\n')}\nCTA: ${ctas[(index + variant) % ctas.length]}\n${shot}${length ? `\nLength target: ${length}` : ''}`
        };
      };

      const count = isShort ? 3 : (keywords.length ? 5 : 4);
      const items = Array.from({ length: count }, (_, i) => makeScript(i));
      return {
        type: 'cards',
        items,
        outputTips: ['Start with a question or bold statement', 'Keep the first line engaging', 'End with one clear CTA']
      };
    },

    'formal-letter-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const letterType = String(values.letterType || 'General').trim();
      const recipientType = String(values.recipientType || 'General').trim();
      const subject = String(values.subject || '').trim();
      const message = String(values.message || '').trim();
      const senderName = String(values.senderName || '').trim();
      const tone = String(values.tone || 'formal').toLowerCase();

      const recipientMap = {
        Teacher: 'Respected Teacher',
        Principal: 'Respected Principal',
        Manager: 'Respected Manager',
        Officer: 'Respected Officer',
        General: 'Respected Sir/Madam'
      };

      const toneLines = {
        formal: 'I am writing this letter to formally communicate the following matter.',
        polite: 'I hope you are doing well. I am writing with a polite request regarding the following matter.',
        respectful: 'With due respect, I would like to bring the following matter to your kind attention.',
        professional: 'I am writing to communicate this matter in a clear and professional manner.'
      };

      const closingSets = [
        'I shall be grateful for your kind consideration.',
        'I request you to kindly look into this matter at the earliest.',
        'Thank you for your time and support.',
        'I would appreciate your positive response.'
      ];

      const currentDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric'
      });

      const selectedClosing = closingSets[variant % closingSets.length];
      const cleanMessage = message.endsWith('.') ? message : `${message}.`;

      const letter = `Date: ${currentDate}

To,
The ${recipientType}

Subject: ${subject}

${recipientMap[recipientType] || recipientMap.General},

${toneLines[tone] || toneLines.formal}

This is a ${letterType.toLowerCase()} letter regarding: ${subject}.

${cleanMessage}

${selectedClosing}

Sincerely,
${senderName}`;

      return {
        type: 'text',
        text: letter,
        outputTips: [
          'Mention subject clearly',
          'Keep paragraphs short',
          'Be polite and direct'
        ],
        disclaimer: 'Keep the tone respectful and the message clear.'
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

    'hashtag-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const topic = String(values.topic || '').trim();
      const platform = String(values.platform || 'instagram').trim();
      const contentType = String(values.contentType || 'educational').trim();
      const tone = String(values.tone || 'professional').trim();
      const keywords = normalizeCommaList(values.keywords || '');

      const normalizedTopic = topic.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
      const topicTag = normalizedTopic.join('') || 'content';
      const keywordTags = keywords.map((k) => k.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);

      const broadByPlatform = {
        instagram: ['#instagood', '#contentcreator', '#explorepage'],
        youtube: ['#youtube', '#youtubecreator', '#youtubeshorts'],
        linkedin: ['#linkedin', '#careergrowth', '#professionaldevelopment'],
        'tiktok-reels': ['#reels', '#tiktok', '#viralreels']
      };
      const nicheByType = {
        educational: ['#learnsomethingnew', '#studytips', '#educationmatters'],
        motivational: ['#dailyinspiration', '#motivationdaily', '#mindsetmatters'],
        promotional: ['#brandgrowth', '#digitalmarketing', '#promocontent'],
        personal: ['#personalbrand', '#creatorjourney', '#behindthescenes'],
        trending: ['#trendingnow', '#viralcontent', '#trendalert']
      };
      const toneTags = {
        professional: ['#professional', '#qualitycontent'],
        casual: ['#casualvibes', '#everydaycontent'],
        trendy: ['#trendingreels', '#trendingsounds'],
        minimal: ['#minimalstyle', '#cleansimple']
      };

      const makeSet = (shift) => {
        const broad = broadByPlatform[platform] || broadByPlatform.instagram;
        const niche = nicheByType[contentType] || nicheByType.educational;
        const mixed = [
          broad[shift % broad.length],
          niche[(shift + 1) % niche.length],
          `#${topicTag}`,
          `#${topicTag}${platform === 'linkedin' ? 'insights' : 'tips'}`,
          ...(keywordTags.slice(0, 2).map((k) => `#${k}`)),
          ...(toneTags[tone] || toneTags.professional)
        ];
        return [...new Set(mixed)].slice(0, 8);
      };

      const items = [0, 1, 2, 3].map((offset, idx) => {
        const tags = makeSet(variant + offset);
        return {
          label: `Hashtag Set ${idx + 1}`,
          text: tags.join(' '),
          hashtags: idx === 0 ? ['Best Pick', 'Broad', 'Niche', 'Trending'] : ['Broad', 'Niche', 'Trending'],
          bestPick: idx === 0,
          note: idx === 0 ? 'Estimated use: balanced for discoverability and relevance.' : 'Estimated use: good mix for topic-specific reach.',
          copyText: tags.join(' ')
        };
      });

      return {
        type: 'cards',
        items,
        outputTips: ['Don’t use too many hashtags', 'Match hashtags to content', 'Keep them relevant'],
        disclaimer: 'Use a mix of broad and niche hashtags for better reach.'
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
    'instagram-bio-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const name = String(values.name || '').trim();
      const niche = String(values.niche || '').trim();
      const bioStyle = String(values.bioStyle || 'minimal').toLowerCase();
      const purpose = String(values.purpose || 'personal').toLowerCase();
      const keywords = normalizeCommaList(values.keywords);
      const cta = String(values.cta || '').trim();

      const purposeLine = {
        personal: 'Sharing my journey',
        creator: 'Creating content that helps',
        business: 'Helping people with smart solutions',
        student: 'Learning and building in public',
        freelancer: 'Open to quality freelance work'
      };

      const stylePool = {
        cute: ['✨', '🌸', '💫'],
        professional: ['📌', '✅', '📈'],
        aesthetic: ['🌙', '🕊️', '☁️'],
        funny: ['😂', '😎', '🙃'],
        minimal: ['', '', '']
      };

      const styleLabel = {
        cute: 'Cute',
        professional: 'Professional',
        aesthetic: 'Aesthetic',
        funny: 'Funny',
        minimal: 'Minimal'
      };

      const keywordSnippet = keywords.length ? ` | ${keywords.slice(0, 2).join(' • ')}` : '';
      const ctaLine = cta ? ` | ${cta}` : '';
      const baseIntent = purposeLine[purpose] || purposeLine.personal;
      const emojis = stylePool[bioStyle] || stylePool.minimal;

      const bios = Array.from({ length: 5 }, (_, index) => {
        const emoji = pick(emojis, variant + index);
        const lead = index % 2 === 0 ? `${name}` : `${name} • ${niche}`;
        const line = `${lead} ${emoji}`.trim();
        const second = `${baseIntent} in ${niche}${keywordSnippet}${ctaLine}`;
        const compact = second.replace(/\s+/g, ' ').trim();
        const text = [line, compact].filter(Boolean).join('\n');
        const cardLabel = index === (variant % 5) ? 'Best Pick' : (styleLabel[bioStyle] || 'Bio Option');
        return {
          label: cardLabel,
          text: text.slice(0, 160),
          hashtags: [`#${niche.replace(/[^a-zA-Z0-9]/g, '') || 'Creator'}`, '#InstagramBio', '#PersonalBrand'],
          bestPick: index === (variant % 5),
          copyText: text.slice(0, 160)
        };
      });

      return {
        type: 'cards',
        items: bios,
        outputTips: ['Use one clear identity', 'Add one CTA', 'Don’t overload with too many words']
      };
    },

    'linkedin-headline-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const name = String(values.name || '').trim();
      const currentStatus = String(values.currentStatus || 'Professional').trim();
      const targetRole = String(values.targetRole || '').trim();
      const industry = String(values.industry || '').trim();
      const goal = String(values.goal || '').trim();
      const tone = String(values.tone || 'professional').toLowerCase();
      const skills = normalizeCommaList(values.skills);
      const topSkills = skills.slice(0, 3);
      const skillText = topSkills.join(' | ');

      const toneLead = {
        professional: `${currentStatus} | ${targetRole}`,
        confident: `${targetRole} | Delivering impact in ${industry}`,
        simple: `${currentStatus} ${targetRole}`,
        modern: `${targetRole} • ${industry}`
      };

      const goalSnippet = goal ? ` | ${goal}` : '';

      const templates = [
        `${toneLead[tone] || toneLead.professional} | ${skillText}${goalSnippet}`,
        `${currentStatus} ${targetRole} | ${skillText} | ${industry}${goalSnippet}`,
        `${targetRole} aspiring to grow in ${industry} | Skills: ${skillText}${goalSnippet}`,
        `${name} | ${targetRole} | ${industry} | ${skillText}${goalSnippet}`,
        `${currentStatus} focused on ${targetRole} opportunities | ${skillText} | ${industry}${goalSnippet}`,
        `${targetRole} in ${industry} | ${skillText} | Open to meaningful collaborations`,
        `${currentStatus} building expertise in ${targetRole} | ${skillText} | ${industry}`
      ];

      const items = new Array(5).fill(null).map((_, index) => {
        const textValue = templates[(index + variant) % templates.length].replace(/\s+/g, ' ').trim();
        const labels = index === 0
          ? ['Best Pick', 'Professional', 'Keyword Friendly']
          : ['Professional', 'Keyword Friendly'];
        return {
          label: `Headline Option ${index + 1}`,
          text: textValue,
          hashtags: labels,
          bestPick: index === 0,
          copyText: textValue,
          note: textValue.length > 120 ? 'Consider trimming a few words to keep it crisp.' : 'Strong and concise for LinkedIn visibility.'
        };
      });

      return {
        type: 'cards',
        items,
        outputTips: [
          'Use important keywords',
          'Show your current role',
          'Keep it under a short character limit if possible'
        ],
        disclaimer: 'Keep your headline clear and role-focused.'
      };
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
    'email-subject-line-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const purpose = String(values.purpose || 'request').toLowerCase();
      const recipientType = String(values.recipientType || 'general').toLowerCase();
      const tone = String(values.tone || 'professional').toLowerCase();
      const context = String(values.context || '').trim();
      const style = String(values.style || 'clear').toLowerCase();

      const purposeMap = {
        'internship-application': 'Internship Application',
        'job-application': 'Job Application',
        'follow-up': 'Follow-up',
        request: 'Request',
        'thank-you': 'Thank You',
        complaint: 'Complaint'
      };

      const recipientCue = {
        recruiter: 'Recruiter',
        teacher: 'Teacher',
        manager: 'Manager',
        client: 'Client',
        general: 'Update'
      };

      const contextText = context ? ` - ${context}` : '';
      const base = purposeMap[purpose] || 'Email Update';
      const rec = recipientCue[recipientType] || 'Update';

      const styleTemplates = {
        short: [
          `${base}${contextText}`,
          `${base}: ${rec}`,
          `${rec} ${base}`
        ],
        'attention-grabbing': [
          `Quick ${base}${contextText}`,
          `${base} | Action Needed`,
          `${base}: Next Steps`
        ],
        formal: [
          `${base} Regarding ${rec}${contextText}`,
          `${base} Submission${contextText}`,
          `${base} - Request for Review`
        ],
        clear: [
          `${base}${contextText}`,
          `${base} - ${rec}`,
          `${base} Update${contextText}`
        ]
      };

      const tonePrefix = tone === 'friendly'
        ? ['Quick', 'Hello', 'Update']
        : tone === 'formal'
          ? ['Formal', 'Regarding', 'Submission']
          : tone === 'polite'
            ? ['Kind', 'Request', 'Follow-up']
            : ['Professional', 'Update', 'Request'];

      const templates = styleTemplates[style] || styleTemplates.clear;
      const items = Array.from({ length: 5 }, (_, index) => {
        const main = pick(templates, variant + index);
        const prefix = pick(tonePrefix, variant + index);
        const subject = `${prefix}: ${main}`.replace(/\s+/g, ' ').replace(/\s-\s-/g, ' - ').slice(0, 78).trim();
        return {
          label: index === (variant % 5) ? 'Best Pick' : (style === 'short' ? 'Short' : style === 'formal' ? 'Formal' : style === 'attention-grabbing' ? 'Attention-Grabbing' : 'Clear'),
          text: subject,
          bestPick: index === (variant % 5),
          copyText: subject
        };
      });

      return {
        type: 'cards',
        items,
        outputTips: ['Avoid spammy words', 'Mention the purpose clearly', 'Keep it under ~8 words when possible']
      };
    },
    'whatsapp-message-generator': (values, options = {}) => {
      const variant = Number(options.variant || 0);
      const purpose = String(values.purpose || 'request').toLowerCase();
      const recipientType = String(values.recipientType || 'friend').toLowerCase();
      const tone = String(values.tone || 'polite').toLowerCase();
      const details = String(values.details || '').trim();
      const length = String(values.length || 'medium').toLowerCase();

      const greetings = {
        friend: ['Hey!', 'Hi!', 'Hello!'],
        teacher: ['Hello Ma’am/Sir,', 'Good day,', 'Respected Ma’am/Sir,'],
        client: ['Hello,', 'Hi,', 'Good day,'],
        manager: ['Hello Sir/Ma’am,', 'Hi,', 'Good day,'],
        group: ['Hi everyone,', 'Hello team,', 'Hey all,']
      };
      const purposeTemplates = {
        'follow-up': ['Just following up on this.', 'Wanted to quickly follow up regarding this.', 'Following up to check if there is any update.'],
        request: ['Could you please help with this?', 'Can you please share an update on this?', 'Requesting your support on this.'],
        reminder: ['Quick reminder about this.', 'Gentle reminder regarding this.', 'Just a reminder so this stays on track.'],
        apology: ['Sorry for the delay from my side.', 'Apologies for the inconvenience caused.', 'I sincerely apologize for the confusion.'],
        thanks: ['Thank you for your help.', 'Really appreciate your support.', 'Thanks a lot for your time and guidance.'],
        invitation: ['You are invited to join this.', 'Would love to have you with us.', 'Please join us for this.']
      };
      const toneEndings = {
        formal: ['Please let me know.', 'Kindly confirm when possible.', 'Looking forward to your response.'],
        friendly: ['Let me know what you think 🙂', 'Happy to discuss anytime!', 'Thanks again!'],
        polite: ['Thank you for your time.', 'Would really appreciate your response.', 'Please let me know when convenient.'],
        short: ['Please confirm.', 'Let me know.', 'Thanks.']
      };

      const count = length === 'short' ? 3 : length === 'long' ? 5 : 4;
      const openers = greetings[recipientType] || greetings.friend;
      const bodyPool = purposeTemplates[purpose] || purposeTemplates.request;
      const enders = toneEndings[tone] || toneEndings.polite;
      const detailLine = details ? ` ${details}` : '';

      const items = Array.from({ length: count }, (_, index) => {
        const opener = pick(openers, variant + index);
        const body = pick(bodyPool, variant + index);
        const ending = pick(enders, variant + index);
        const message = `${opener} ${body}${detailLine} ${ending}`.replace(/\s+/g, ' ').trim();
        return {
          label: index === (variant % count) ? 'Best Pick' : (tone === 'short' ? 'Short' : tone === 'friendly' ? 'Friendly' : 'Professional'),
          text: message,
          bestPick: index === (variant % count),
          copyText: message
        };
      });

      return {
        type: 'cards',
        items,
        outputTips: ['Start with a greeting', 'Mention purpose quickly', 'Avoid long paragraphs']
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
    const provider = getApiProvider();
    let remoteResult = null;

    try {
      remoteResult = await provider.generate({
        toolId,
        values,
        variant: options.variant || 0
      });
    } catch (error) {
      if (provider !== defaultApiProvider) {
        if (window.console && typeof window.console.warn === 'function') {
          window.console.warn('[ToolShala] Primary provider failed. Retrying with default /api/generate provider.', error);
        }
        remoteResult = await defaultApiProvider.generate({
          toolId,
          values,
          variant: options.variant || 0
        });
      } else {
        throw error;
      }
    }

    if (!remoteResult || typeof remoteResult !== 'object') {
      throw new Error('The AI service returned an invalid response.');
    }
    return remoteResult;
  };
  
  const validate = (tool, values) => {
    const fieldErrors = {};

    for (const field of getToolFields(tool)) {
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


    if (tool.id === 'resume-bullet-point-generator') {
      const task = String(values.task || '').trim();
      const result = String(values.result || '').trim();
      const skills = normalizeCommaList(values.skills);
      if (skills.length < 2 || task.length < 12 || result.length < 8) {
        return {
          fieldErrors: Object.fromEntries(Object.entries({
            skills: skills.length < 2 ? 'Please add at least 2 skills separated by commas.' : '',
            task: task.length < 12 ? 'Please add a clearer task/responsibility.' : '',
            result: result.length < 8 ? 'Please add a measurable or meaningful outcome.' : ''
          }).filter(([, message]) => message)),
          formError: 'Please correct the highlighted fields.'
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


    if (tool.id === 'linkedin-headline-generator') {
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

    if (tool.id === 'notes-to-bullet-points-converter') {
      const notes = String(values.notes || '').trim();
      if (notes.length < 120) {
        return {
          fieldErrors: {
            notes: 'Please paste at least 120 characters so bullets stay meaningful.'
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


    if (tool.id === 'grammar-corrector-sentence-improver') {
      const text = String(values.originalText || '').trim();
      if (text.length < 20) {
        return {
          fieldErrors: {
            originalText: 'Please add at least 20 characters so we can improve grammar and flow properly.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    if (tool.id === 'paragraph-rewriter-humanizer') {
      const text = String(values.originalParagraph || '').trim();
      if (text.length < 80) {
        return {
          fieldErrors: {
            originalParagraph: 'Please add at least 80 characters so the rewritten paragraph stays meaningful.'
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

    if (tool.id === 'instagram-bio-generator') {
      const name = String(values.name || '').trim();
      const niche = String(values.niche || '').trim();
      if (name.length < 2 || niche.length < 3) {
        const fieldErrors = {};
        if (name.length < 2) fieldErrors.name = 'Please enter a valid name or brand name.';
        if (niche.length < 3) fieldErrors.niche = 'Please add a clearer niche/category.';
        return {
          fieldErrors,
          formError: 'Please correct the highlighted fields.'
        };
      }
    }

    if (tool.id === 'whatsapp-message-generator') {
      const details = String(values.details || '').trim();
      if (details && details.length < 8) {
        return {
          fieldErrors: {
            details: 'Please add a little more context or leave this field empty.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    if (tool.id === 'email-subject-line-generator') {
      const context = String(values.context || '').trim();
      if (context && context.length < 3) {
        return {
          fieldErrors: {
            context: 'Please add a clearer keyword/context or leave this field empty.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    if (tool.id === 'linkedin-networking-message-generator') {
      const purpose = String(values.purpose || '').trim();
      const background = String(values.background || '').trim();
      const role = String(values.targetRole || '').trim();
      if (purpose.length < 10 || background.length < 12 || role.length < 3) {
        const fieldErrors = {};
        if (purpose.length < 10) {
          fieldErrors.purpose = 'Please add a clearer purpose so the message sounds specific.';
        }
        if (background.length < 12) {
          fieldErrors.background = 'Please add a little more background so your message feels credible.';
        }
        if (role.length < 3) {
          fieldErrors.targetRole = 'Please enter your target role.';
        }
        return {
          fieldErrors,
          formError: 'Please correct the highlighted fields.'
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


    if (tool.id === 'hashtag-generator') {
      const topic = String(values.topic || '').trim();
      if (topic.length < 3) {
        return {
          fieldErrors: {
            topic: 'Please add a clearer topic or niche.'
          },
          formError: 'Please correct the highlighted field.'
        };
      }
    }

    if (tool.id === 'formal-letter-generator') {
      const subject = String(values.subject || '').trim();
      const message = String(values.message || '').trim();
      if (subject.length < 6 || message.length < 20) {
        return {
          fieldErrors: {
            ...(subject.length < 6 ? { subject: 'Please enter a clear subject.' } : {}),
            ...(message.length < 20 ? { message: 'Please add a slightly detailed reason/message.' } : {})
          },
          formError: 'Please correct the highlighted field(s).'
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
    } else if (field.type === 'file') {
      input = document.createElement('input');
      input.className = 'field-input';
      input.type = 'file';
      if (field.accept) {
        input.accept = field.accept;
      }
      if (field.capture) {
        input.setAttribute('capture', field.capture);
      }
    } else if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.className = 'field-textarea';
      input.rows = Number(field.rows) > 0 ? Number(field.rows) : 4;
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
      button.textContent = result.copyLabel || 'Copy';
      button.addEventListener('click', async () => {
        try {
          await copyText(result.text);
          showToast('success', 'Copied to clipboard.');
        } catch (error) {
          showToast('error', 'Could not copy right now.', 'Please copy manually.');
        }
      });
      actions.appendChild(button);

      if (Number.isFinite(result.characterCount)) {
        const count = document.createElement('p');
        count.className = 'tool-helper-text';
        count.textContent = `${result.characterCount} character${result.characterCount === 1 ? '' : 's'} extracted.`;
        outputNode.appendChild(count);
      }

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
        const textNode = document.createElement(content.multiline ? 'pre' : 'p');
        textNode.className = content.multiline ? 'tool-output-text mt-2' : 'mt-2 text-sm text-slate-700';
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

  const formatFileSize = (size = 0) => {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Could not read the selected image. Please try another file.'));
      reader.readAsDataURL(file);
    });

  const getSelectedPhoto = (formNode) => formNode.querySelector('input[type="file"][name="image"]')?.files?.[0] || null;

  const validatePhotoFile = (file) => {
    if (!file) {
      return 'Please select an image first.';
    }

    if (!PHOTO_TO_TEXT_CONFIG.allowedTypes.has(file.type)) {
      return 'Unsupported image type. Please upload a JPEG, PNG, WEBP, HEIC, or HEIF image.';
    }

    if (file.size > PHOTO_TO_TEXT_CONFIG.maxFileSize) {
      return `Image is too large (${formatFileSize(file.size)}). Please upload an image up to 8 MB.`;
    }

    return '';
  };

  const setupPhotoToTextTool = ({ formNode, outputNode, errorNode, loadingNode, resetButton, submitButton, tool }) => {
    const fileInput = formNode.querySelector('input[type="file"][name="image"]');
    if (!fileInput) {
      return false;
    }

    const fieldWrap = fileInput.closest('.field-wrap');
    const preview = document.createElement('div');
    preview.className = 'photo-preview hidden';
    preview.setAttribute('aria-live', 'polite');
    preview.innerHTML = '<img alt="Selected image preview" /><p data-photo-file-meta></p>';
    fieldWrap?.appendChild(preview);

    const previewImage = preview.querySelector('img');
    const previewMeta = preview.querySelector('[data-photo-file-meta]');
    let previewUrl = '';

    const clearPreview = () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = '';
      }
      preview.classList.add('hidden');
      if (previewImage) {
        previewImage.removeAttribute('src');
      }
      if (previewMeta) {
        previewMeta.textContent = '';
      }
    };

    const showError = (message) => {
      errorNode.textContent = message;
      errorNode.classList.remove('hidden');
      showToast('error', 'Please check the image.', message);
    };

    fileInput.addEventListener('change', () => {
      clearFieldError(fileInput);
      errorNode.textContent = '';
      errorNode.classList.add('hidden');
      renderOutput({ outputNode, result: null, tool });
      clearPreview();

      const file = getSelectedPhoto(formNode);
      if (!file) {
        return;
      }

      const validationMessage = validatePhotoFile(file);
      if (validationMessage) {
        setFieldError(formNode, 'image', validationMessage);
        showError(validationMessage);
        fileInput.value = '';
        return;
      }

      previewUrl = URL.createObjectURL(file);
      if (previewImage) {
        previewImage.src = previewUrl;
      }
      if (previewMeta) {
        previewMeta.textContent = `${file.name || 'Selected image'} · ${formatFileSize(file.size)}`;
      }
      preview.classList.remove('hidden');
    });

    formNode.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorNode.textContent = '';
      errorNode.classList.add('hidden');
      clearFieldError(fileInput);

      const file = getSelectedPhoto(formNode);
      const validationMessage = validatePhotoFile(file);
      if (validationMessage) {
        setFieldError(formNode, 'image', validationMessage);
        showError(validationMessage);
        return;
      }

      submitButton.disabled = true;
      submitButton.dataset.defaultLabel = submitButton.dataset.defaultLabel || submitButton.textContent;
      submitButton.textContent = 'Extracting...';
      loadingNode.textContent = 'Extracting text from your image...';
      loadingNode.classList.remove('hidden');

      try {
        const imageData = await readFileAsDataUrl(file);
        const response = await fetch(PHOTO_TO_TEXT_CONFIG.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData,
            filename: file.name || 'uploaded-image',
            mimeType: file.type
          })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(String(payload?.error || `Request failed with status ${response.status}`).trim());
        }

        const text = String(payload?.text || '').trim();
        if (!text) {
          throw new Error('No readable text was found in this image. Try a clearer or higher-resolution photo.');
        }

        renderOutput({
          outputNode,
          result: {
            type: 'text',
            text,
            copyLabel: 'Copy Text',
            characterCount: text.length
          },
          tool
        });
        showToast('success', 'Text extracted successfully.');
      } catch (error) {
        const message = error?.message || 'Text extraction failed. Please try another clear image.';
        errorNode.textContent = message;
        errorNode.classList.remove('hidden');
        showToast('error', 'Text extraction failed.', message);
      } finally {
        loadingNode.classList.add('hidden');
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.defaultLabel;
      }
    });

    resetButton.addEventListener('click', () => {
      formNode.reset();
      clearFieldError(fileInput);
      clearPreview();
      errorNode.textContent = '';
      errorNode.classList.add('hidden');
      loadingNode.classList.add('hidden');
      renderOutput({ outputNode, result: null, tool });
      showToast('success', 'Done successfully.');
    });

    window.addEventListener('beforeunload', clearPreview);
    return true;
  };

  const initToolDetailPage = () => {
    const root = document.querySelector('[data-tool-detail]');
    if (!root) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const toolId = params.get('tool') || toolDefinitions[0].id;
    const tool = getToolById(toolId) || toolDefinitions[0];
    const toolFields = getToolFields(tool);

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
        : tool.id === 'grammar-corrector-sentence-improver'
          ? 'Regenerate Improvement'
        : tool.id === 'paragraph-rewriter-humanizer'
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
        : tool.id === 'instagram-bio-generator'
          ? 'Regenerate Bios'
        : tool.id === 'whatsapp-message-generator'
          ? 'Regenerate Messages'
        : tool.id === 'email-subject-line-generator'
          ? 'Regenerate Subjects'
        : tool.outputType === 'text'
          ? 'Regenerate'
          : 'Generate More';
    }

    toolFields.forEach((field) => {
      formNode.appendChild(renderField(field));
    });

    if (tool.id === 'photo-to-text') {
      renderOutput({ outputNode, result: null, tool });
      setupPhotoToTextTool({ formNode, outputNode, errorNode, loadingNode, resetButton, submitButton, tool });
      return;
    }

    formNode.addEventListener('input', (event) => {
      clearFieldError(event.target);
    });

    renderOutput({ outputNode, result: null, tool });

    formNode.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorNode.textContent = '';
      errorNode.classList.add('hidden');

      const values = {};
      toolFields.forEach((field) => {
        const input = formNode.querySelector(`[name="${field.key}"]`);
        values[field.key] = input ? input.value.trim() : '';
      });

      toolFields.forEach((field) => {
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
      try {
        const result = await generateResult(tool.id, values, { variant: variantCount, mode: tool.generationMode || 'hybrid' });
        lastValues = values;
        renderOutput({ outputNode, result, tool });
        showToast('success', 'Your result is ready.');
      } catch (error) {
        errorNode.textContent = error?.message || 'AI service failed. Please try again.';
        errorNode.classList.remove('hidden');
        showToast('error', 'AI service issue.', 'Unable to generate a response right now.');
      } finally {
        loadingNode.classList.add('hidden');
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.defaultLabel;
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
        try {
          const result = await generateResult(tool.id, lastValues, { variant: variantCount, mode: tool.generationMode || 'hybrid' });
          renderOutput({ outputNode, result, tool });
          showToast('success', 'New result generated.');
        } catch (_error) {
          showToast('error', 'AI service issue.', 'Unable to generate a response right now.');
        } finally {
          loadingNode.classList.add('hidden');
          generateMoreButton.disabled = false;
        }
      });
    }

    resetButton.addEventListener('click', () => {
      formNode.reset();
      toolFields.forEach((field) => {
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
