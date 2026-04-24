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
    'ai-career-path-suggestor': (values) => {
      const pathByInterest = {
        marketing: ['Digital Marketing Associate', 'Content Strategist', 'Growth Intern'],
        design: ['UI Designer', 'Graphic Designer', 'Brand Design Intern'],
        data: ['Data Analyst Intern', 'Business Analyst Trainee', 'Reporting Associate'],
        development: ['Frontend Intern', 'QA Analyst', 'Product Support Associate']
      };
      const stagePlan = {
        school: 'Start with career awareness + one foundational skill project.',
        college: 'Build portfolio projects + internship-ready resume in 60 days.',
        fresher: 'Target entry-level roles + weekly interview prep and applications.',
        creator: 'Combine personal brand output with service-based skill offers.'
      };
      const lowerInterest = values.interest.toLowerCase();
      const roles = lowerInterest.includes('market')
        ? pathByInterest.marketing
        : lowerInterest.includes('design')
          ? pathByInterest.design
          : lowerInterest.includes('data') || lowerInterest.includes('anal')
            ? pathByInterest.data
            : lowerInterest.includes('dev') || lowerInterest.includes('tech')
              ? pathByInterest.development
              : ['Operations Executive', 'Customer Success Associate', 'Project Coordinator'];
      return {
        type: 'cards',
        items: [
          `Suggested roles: ${roles.join(', ')}.`,
          `Your strengths (${values.strengths}) align with ${values.interest}.`,
          `90-day action: ${stagePlan[values.stage] || stagePlan.college}`,
          `12-month target fit: ${values.goal}. Build monthly proof of work to stay on track.`
        ]
      };
    },
    'scholarship-recommendation-tool': (values) => {
      const incomeAdvice = {
        'below-2': 'Prioritize need-based and government scholarships first.',
        '2-5': 'Target merit-cum-means and state scholarship portals.',
        '5-8': 'Look for private foundation and institution merit scholarships.',
        '8+': 'Focus on merit scholarships, grants, and competition-based funding.'
      };
      return {
        type: 'cards',
        items: [
          `Recommended scholarship buckets for ${values.educationLevel}: government schemes, private foundation grants, and institution-based aid.`,
          `Field fit: prioritize ${values.field} scholarships and allied domain grants.`,
          `State strategy: check ${values.state} state education portal + national scholarship portal weekly.`,
          incomeAdvice[values.incomeBracket] || 'Track all high-fit options in a deadline sheet.',
          'Application checklist: income proof, marksheets, ID documents, admission proof, bank details.'
        ]
      };
    },
    'professional-email-generator': (values) => {
      const openingByType = {
        'internship-application': `I am writing to apply for the ${values.subjectFocus} opportunity.`,
        'follow-up': `I am writing to follow up regarding ${values.subjectFocus}.`,
        networking: `I am reaching out to connect regarding ${values.subjectFocus}.`,
        'correction-request': `I am writing to request support regarding ${values.subjectFocus}.`
      };
      const email = `Subject: ${values.subjectFocus} - ${values.name}\n\nDear ${values.recipient},\n\n${openingByType[values.emailType] || openingByType['internship-application']}\n\nA quick context from my side: ${values.highlights}.\n\nI would appreciate your guidance on next steps and am happy to share additional details if required.\n\nThank you for your time and consideration.\n\nBest regards,\n${values.name}`;
      return { type: 'text', text: email };
    },
    'content-idea-generator': (values) => {
      const hooks = {
        growth: ['5 mistakes I made in', 'How I improved results in', 'Beginner roadmap for'],
        engagement: ['Unpopular opinion on', 'This changed my approach to', 'If you are stuck with'],
        authority: ['Framework I use for', 'Step-by-step guide to', 'What most people miss in'],
        leads: ['Before you hire for', 'Checklist to improve', 'Case study: how we fixed']
      };
      const formats = {
        instagram: 'Carousel + Reel combo',
        youtube: 'Short + long breakdown',
        linkedin: 'Text post + mini framework',
        x: 'Thread + single hook post'
      };
      const leadHooks = hooks[values.contentGoal] || hooks.growth;
      const items = Array.from({ length: 6 }, (_, index) => {
        const idea = `${pick(leadHooks, index)} ${values.niche.toLowerCase()} (${formats[values.platform] || formats.instagram}).`;
        return `${idea} Include one practical example and one quick action step.`;
      });
      return { type: 'cards', items };
    }
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
    label.textContent = field.label;

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

    document.title = `${tool.title} | ToolShala`;
    titleNode.textContent = tool.title;
    descriptionNode.textContent = tool.description;
    categoryNode.textContent = tool.category;
    submitButton.textContent = tool.ctaLabel || 'Generate';

    if (tipsNode) {
      tipsNode.innerHTML = (tool.tips || []).map((tip) => `<li>${escapeHtml(tip)}</li>`).join('');
    }

    if (generateMoreButton) {
      generateMoreButton.classList.toggle('hidden', !tool.enableGenerateMore);
      generateMoreButton.textContent = tool.id === 'study-timetable-generator'
        ? 'Regenerate Plan'
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
      loadingNode.classList.remove('hidden');

      await wait(700);
      const generator = generators[tool.id];
      const result = generator ? generator(values, { variant: variantCount }) : { type: 'text', text: 'This tool is under maintenance.' };
      lastValues = values;
      renderOutput({ outputNode, result, tool });
      loadingNode.classList.add('hidden');
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.defaultLabel;
      showToast('success', 'Your result is ready.');
    });

    if (generateMoreButton) {
      generateMoreButton.addEventListener('click', async () => {
        if (!lastValues) {
          showToast('error', 'Please fill in all required fields.');
          return;
        }

        const generator = generators[tool.id];
        if (!generator) {
          return;
        }

        variantCount += 1;
        generateMoreButton.disabled = true;
        loadingNode.classList.remove('hidden');
        await wait(500);
        const result = generator(lastValues, { variant: variantCount });
        renderOutput({ outputNode, result, tool });
        loadingNode.classList.add('hidden');
        generateMoreButton.disabled = false;
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
