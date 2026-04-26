const clean = (value = '') => String(value).trim();

const definitions = {
  'resume-headline-generator': {
    schema: {
      name: 'resume_headline_response',
      strict: true,
      schema: { type: 'object', additionalProperties: false, properties: { headlines: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'object', additionalProperties: false, properties: { text: { type: 'string' }, tone: { type: 'string' } }, required: ['text', 'tone'] } } }, required: ['headlines'] }
    },
    validate: (v) => v.name && v.role && v.experience && v.skills,
    prompt: (v) => ({
      system: 'You are a resume writing assistant for students and freshers. Keep headlines concise, truthful, and role-relevant.',
      user: `Generate 3-5 resume headlines in JSON.\nName: ${v.name}\nTarget Role: ${v.role}\nExperience: ${v.experience}\nSkills: ${v.skills}\nStrength: ${v.strength || 'Not provided'}`
    })
  },
  'leave-application-generator': {
    schema: {
      name: 'leave_application_response',
      strict: true,
      schema: { type: 'object', additionalProperties: false, properties: { subject: { type: 'string' }, letter: { type: 'string' }, closing: { type: 'string' } }, required: ['subject', 'letter', 'closing'] }
    },
    validate: (v) => v.name && v.recipientType && v.reason && v.startDate && v.endDate,
    prompt: (v) => ({
      system: 'You write formal leave applications for students and employees. Keep them clean and submission-ready.',
      user: `Generate leave application JSON.\nName: ${v.name}\nRecipient Type: ${v.recipientType}\nReason: ${v.reason}\nStart: ${v.startDate}\nEnd: ${v.endDate}\nAdditional Note: ${v.additionalNote || 'Not provided'}`
    })
  },
  'instagram-caption-generator': {
    schema: {
      name: 'instagram_caption_response', strict: true,
      schema: { type: 'object', additionalProperties: false, properties: { captions: { type: 'array', minItems: 5, maxItems: 5, items: { type: 'object', additionalProperties: false, properties: { text: { type: 'string' }, style: { type: 'string' }, bestPick: { type: 'boolean' }, hashtags: { type: 'array', items: { type: 'string' } } }, required: ['text', 'style', 'bestPick', 'hashtags'] } } }, required: ['captions'] }
    },
    validate: (v) => v.topic && v.contentType && v.tone,
    prompt: (v) => ({
      system: 'You are an Instagram content strategist. Generate practical, natural captions with style variety.',
      user: `Generate 5 caption options JSON with one bestPick=true.\nTopic: ${v.topic}\nContent Type: ${v.contentType}\nTone: ${v.tone}\nKeywords: ${v.keywords || 'Not provided'}`
    })
  },
  'linkedin-bio-generator': {
    schema: {
      name: 'linkedin_bio_response', strict: true,
      schema: { type: 'object', additionalProperties: false, properties: { bios: { type: 'array', minItems: 2, maxItems: 4, items: { type: 'object', additionalProperties: false, properties: { text: { type: 'string' }, tone: { type: 'string' } }, required: ['text', 'tone'] } } }, required: ['bios'] }
    },
    validate: (v) => v.name && v.status && v.domain && v.skills && v.careerGoal,
    prompt: (v) => ({
      system: 'You are a LinkedIn About-section assistant for students, freshers, freelancers, creators.',
      user: `Generate 2-4 LinkedIn bios JSON.\nName: ${v.name}\nStatus: ${v.status}\nDomain: ${v.domain}\nSkills: ${v.skills}\nCareer Goal: ${v.careerGoal}\nTone: ${v.tone || 'professional'}`
    })
  },
  'cover-letter-generator': {
    schema: {
      name: 'cover_letter_response', strict: true,
      schema: { type: 'object', additionalProperties: false, properties: { subject: { type: 'string' }, letter: { type: 'string' } }, required: ['subject', 'letter'] }
    },
    validate: (v) => v.name && v.role && v.company && v.skills && v.interestReason && v.experienceLevel,
    prompt: (v) => ({
      system: 'You write internship and entry-level cover letters. Avoid fake experience and keep concise.',
      user: `Generate cover letter JSON.\nName: ${v.name}\nRole: ${v.role}\nCompany: ${v.company}\nSkills: ${v.skills}\nInterest: ${v.interestReason}\nExperience: ${v.experienceLevel}\nAchievement: ${v.achievement || 'Not provided'}`
    })
  },
  'study-timetable-generator': {
    schema: {
      name: 'study_timetable_response', strict: true,
      schema: { type: 'object', additionalProperties: false, properties: { planTitle: { type: 'string' }, weeklyPlan: { type: 'array', minItems: 7, maxItems: 7, items: { type: 'object', additionalProperties: false, properties: { day: { type: 'string' }, slots: { type: 'array', minItems: 3, maxItems: 8, items: { type: 'string' } } }, required: ['day', 'slots'] } }, tips: { type: 'array', minItems: 2, maxItems: 4, items: { type: 'string' } } }, required: ['planTitle', 'weeklyPlan', 'tips'] }
    },
    validate: (v) => v.level && v.subjects && v.hoursPerDay && v.studyTime && v.examGoal,
    prompt: (v) => ({
      system: 'You are a student timetable planner. Build realistic weekly plans with breaks and revision.',
      user: `Generate weekly study timetable JSON.\nLevel: ${v.level}\nSubjects: ${v.subjects}\nDaily Hours: ${v.hoursPerDay}\nStudy Time: ${v.studyTime}\nExam Goal: ${v.examGoal}\nWeak Subjects: ${v.weakSubjects || 'Not provided'}`
    })
  },
  'ai-career-path-suggestor': {
    schema: {
      name: 'career_path_response', strict: true,
      schema: { type: 'object', additionalProperties: false, properties: { bestMatch: { type: 'object', additionalProperties: false, properties: { careerTitle: { type: 'string' }, whyItFits: { type: 'string' }, skillsToLearn: { type: 'array', minItems: 2, maxItems: 5, items: { type: 'string' } }, nextStep: { type: 'string' } }, required: ['careerTitle', 'whyItFits', 'skillsToLearn', 'nextStep'] }, paths: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'object', additionalProperties: false, properties: { careerTitle: { type: 'string' }, whyItFits: { type: 'string' }, skillsToLearn: { type: 'array', minItems: 2, maxItems: 5, items: { type: 'string' } }, nextStep: { type: 'string' } }, required: ['careerTitle', 'whyItFits', 'skillsToLearn', 'nextStep'] } } }, required: ['bestMatch', 'paths'] }
    },
    validate: (v) => v.stage && v.interests && v.workStyle && v.strengths,
    prompt: (v) => ({
      system: 'You are a practical career guidance assistant for students and freshers.',
      user: `Generate 3-5 career path recommendations JSON with one bestMatch.\nStage: ${v.stage}\nInterests: ${v.interests}\nWork Style: ${v.workStyle}\nStrengths: ${v.strengths}\nCoding Preference: ${v.codingPreference || 'not specified'}`
    })
  },
  'scholarship-recommendation-tool': {
    schema: {
      name: 'scholarship_recommendation_response', strict: true,
      schema: { type: 'object', additionalProperties: false, properties: { recommendations: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'object', additionalProperties: false, properties: { scholarshipType: { type: 'string' }, suitableFor: { type: 'string' }, whatToPrepare: { type: 'array', minItems: 2, maxItems: 6, items: { type: 'string' } }, nextStep: { type: 'string' } }, required: ['scholarshipType', 'suitableFor', 'whatToPrepare', 'nextStep'] } }, verificationReminder: { type: 'string' } }, required: ['recommendations', 'verificationReminder'] }
    },
    validate: (v) => v.currentEducationLevel && v.stateOrRegion && v.academicPerformance && v.needType,
    prompt: (v) => ({
      system: 'You recommend scholarship categories/types, not guaranteed outcomes.',
      user: `Generate scholarship recommendations JSON.\nEducation: ${v.currentEducationLevel}\nState: ${v.stateOrRegion}\nCategory: ${v.category || 'Not provided'}\nPerformance: ${v.academicPerformance}\nNeed Type: ${v.needType}\nField: ${v.fieldOfStudy || 'Not provided'}`
    })
  },
  'professional-email-generator': {
    schema: {
      name: 'professional_email_response', strict: true,
      schema: { type: 'object', additionalProperties: false, properties: { subjects: { type: 'array', minItems: 2, maxItems: 2, items: { type: 'string' } }, email: { type: 'string' } }, required: ['subjects', 'email'] }
    },
    validate: (v) => v.emailPurpose && v.recipientName && v.senderName && v.roleContext && v.mainMessage && v.tone,
    prompt: (v) => ({
      system: 'You are a professional email assistant for formal/polite/professional communication.',
      user: `Generate professional email JSON with 2 subjects and full email draft.\nPurpose: ${v.emailPurpose}\nRecipient: ${v.recipientName}\nSender: ${v.senderName}\nContext: ${v.roleContext}\nMessage: ${v.mainMessage}\nTone: ${v.tone}`
    })
  },
  'content-idea-generator': {
    schema: {
      name: 'content_idea_response', strict: true,
      schema: { type: 'object', additionalProperties: false, properties: { bestStarterIdea: { type: 'string' }, ideas: { type: 'array', minItems: 10, maxItems: 10, items: { type: 'string' } } }, required: ['bestStarterIdea', 'ideas'] }
    },
    validate: (v) => v.niche && v.platform && v.contentGoal && v.audienceType,
    prompt: (v) => ({
      system: 'You are a creator strategy assistant. Generate practical, platform-aware, audience-first content ideas.',
      user: `Generate 10 content ideas JSON and one bestStarterIdea.\nNiche: ${v.niche}\nPlatform: ${v.platform}\nGoal: ${v.contentGoal}\nAudience: ${v.audienceType}\nKeywords: ${v.keywords || 'Not provided'}`
    })
  }
};

export const getToolConfig = (toolId) => definitions[toolId] || null;
export const sanitizeValues = (values = {}) => {
  const out = {};
  Object.keys(values || {}).forEach((key) => {
    out[key] = clean(values[key]);
  });
  return out;
};
