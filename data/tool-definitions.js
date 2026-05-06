window.ToolShalaToolDefinitions = [
  {
    id: 'photo-to-text',
    title: 'Photo to Text',
    category: 'AI Tool',
    description: 'Extract visible text from uploaded images, screenshots, and camera photos with OCR.',
    ctaLabel: 'Extract Text',
    outputType: 'text',
    generationMode: 'photo-ocr',
    helperText: 'Upload a clear image with readable text. For best OCR results, crop extra background and avoid blur.',
    tips: [
      'Use a clear, well-lit photo for better text extraction.',
      'Screenshots and document photos usually work best.',
      'Review extracted text before using it in applications or assignments.'
    ],
    fields: [
      {
        key: 'image',
        label: 'Upload Image',
        type: 'file',
        accept: 'image/jpeg,image/png,image/webp,image/heic,image/heif',
        capture: 'environment',
        required: true,
        helperText: 'JPEG, PNG, WEBP, HEIC or HEIF up to 8 MB.'
      }
    ]
  },

  {
    id: 'resume-headline-generator',
    title: 'Resume Headline Generator',
    category: 'Career Tool',
    description: 'Generate strong, professional resume headlines for internships, jobs, and entry-level roles.',
    ctaLabel: 'Use Tool',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Student tip: add real skills and your genuine focus area for better internship-ready headlines.',
    tips: [
      'Keep your resume headline clear, skill-focused, and aligned with the role you want.'
    ],
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Rohan Verma', required: true },
      { key: 'role', label: 'Target Role', type: 'text', placeholder: 'e.g. Frontend Developer Intern', required: true },
      {
        key: 'experience',
        label: 'Experience Level',
        type: 'select',
        required: true,
        options: [
          { value: 'fresher', label: 'Fresher' },
          { value: '0-1 years', label: '0-1 Years' },
          { value: '1-3 years', label: '1-3 Years' }
        ]
      },
      { key: 'skills', label: 'Key Skills (comma separated)', type: 'text', placeholder: 'e.g. React, JavaScript, UI Design', required: true },
      {
        key: 'strength',
        label: 'Strength / Focus Area (optional)',
        type: 'text',
        placeholder: 'e.g. problem-solving and clean UI delivery',
        required: false
      }
    ]
  },

  {
    id: 'resume-bullet-point-generator',
    title: 'Resume Bullet Point Generator',
    category: 'Career Tool',
    description: 'Generate strong resume bullet points for projects, internships, achievements, and responsibilities.',
    ctaLabel: 'Generate Bullets',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Use strong action words and measurable results.',
    tips: [
      'Start with action verbs.',
      'Mention tools or skills.',
      'Keep bullets short and impactful.'
    ],
    fields: [
      { key: 'role', label: 'Role / Job Title', type: 'text', placeholder: 'e.g. Frontend Developer Intern', required: true },
      {
        key: 'experienceType',
        label: 'Experience Type',
        type: 'select',
        required: true,
        options: [
          { value: 'Internship', label: 'Internship' },
          { value: 'Project', label: 'Project' },
          { value: 'Work Experience', label: 'Work Experience' },
          { value: 'Volunteer', label: 'Volunteer' },
          { value: 'Academic', label: 'Academic' }
        ]
      },
      { key: 'task', label: 'Task / Responsibility', type: 'textarea', placeholder: 'e.g. Built dashboard components and improved page speed.', required: true },
      { key: 'skills', label: 'Skills Used', type: 'text', placeholder: 'e.g. React, JavaScript, Tailwind CSS, Git', required: true },
      { key: 'result', label: 'Result / Outcome', type: 'text', placeholder: 'e.g. Reduced load time by 28% and improved user engagement.', required: true },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'strong', label: 'Strong' },
          { value: 'simple', label: 'Simple' },
          { value: 'ats-friendly', label: 'ATS-Friendly' }
        ]
      }
    ]
  },

  {
    id: 'resume-summary-generator',
    title: 'Resume Summary Generator',
    category: 'Career Tool',
    description: 'Generate ATS-friendly, role-aligned resume summary options for internships, fresher jobs, and entry-level roles.',
    ctaLabel: 'Generate Summaries',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Keep your summary aligned with the role you want.',
    tips: [
      'Keep it concise and easy to scan.',
      'Match your summary to the exact target role.',
      'Mention your strongest, most relevant skills first.'
    ],
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Aanya Mehta', required: true },
      { key: 'role', label: 'Target Role', type: 'text', placeholder: 'e.g. Data Analyst Intern', required: true },
      {
        key: 'experience',
        label: 'Experience Level',
        type: 'select',
        required: true,
        options: [
          { value: 'Fresher', label: 'Fresher' },
          { value: '0–1 Years', label: '0–1 Years' },
          { value: '1–3 Years', label: '1–3 Years' }
        ]
      },
      {
        key: 'skills',
        label: 'Key Skills',
        type: 'text',
        placeholder: 'e.g. Excel, SQL, Python, Data Visualization',
        required: true
      },
      {
        key: 'achievement',
        label: 'Optional Achievement / Strength',
        type: 'textarea',
        placeholder: 'e.g. Built a dashboard project that improved reporting clarity in college club work.',
        required: false
      },
      {
        key: 'industry',
        label: 'Optional Industry / Domain',
        type: 'text',
        placeholder: 'e.g. FinTech, EdTech, E-commerce',
        required: false
      },
      {
        key: 'tone',
        label: 'Optional Tone',
        type: 'select',
        required: false,
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'confident', label: 'Confident' },
          { value: 'simple', label: 'Simple' },
          { value: 'ats-friendly', label: 'ATS-Friendly' }
        ]
      }
    ]
  },
  {
    id: 'interview-answer-generator',
    title: 'Interview Answer Generator',
    category: 'Career Tool',
    description: 'Generate natural interview answer variations in short, detailed, and STAR formats for students and freshers.',
    ctaLabel: 'Generate Answers',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Keep your answer honest, structured, and role-relevant.',
    tips: [
      'Keep answers specific and connected to the asked question.',
      'Do not over-explain. Keep focus on role-relevant outcomes.',
      'Use real examples from projects, internships, academics, or teamwork.'
    ],
    fields: [
      {
        key: 'question',
        label: 'Interview Question',
        type: 'textarea',
        placeholder: 'e.g. Tell me about a time you handled a difficult deadline.',
        required: true
      },
      { key: 'role', label: 'Target Role', type: 'text', placeholder: 'e.g. Frontend Developer Intern', required: true },
      {
        key: 'experience',
        label: 'Experience Level',
        type: 'select',
        required: true,
        options: [
          { value: 'Fresher', label: 'Fresher' },
          { value: '0–1 Years', label: '0–1 Years' },
          { value: '1–3 Years', label: '1–3 Years' }
        ]
      },
      {
        key: 'skill',
        label: 'Key Skill / Strength',
        type: 'text',
        placeholder: 'e.g. problem-solving, communication, JavaScript debugging',
        required: true
      },
      {
        key: 'achievement',
        label: 'Optional Achievement / Project',
        type: 'textarea',
        placeholder: 'e.g. Built a team project that reduced manual reporting effort by 30%.',
        required: false
      },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'confident', label: 'Confident' },
          { value: 'friendly', label: 'Friendly' },
          { value: 'simple', label: 'Simple' }
        ]
      },
      {
        key: 'answerStyle',
        label: 'Answer Style',
        type: 'select',
        required: true,
        options: [
          { value: 'short', label: 'Short Answer' },
          { value: 'detailed', label: 'Detailed Answer' },
          { value: 'star', label: 'STAR Method' }
        ]
      }
    ]
  },
  {
    id: 'leave-application-generator',
    title: 'Leave Application Generator',
    category: 'Writing Tool',
    description: 'Create a formal leave application letter in professional English for school, college, or office use.',
    ctaLabel: 'Generate Now',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Always review names, dates, and reason before submitting.',
    tips: [
      'Always review names, dates, and reason before submitting.',
      'Keep reason short and professional.',
      'Use Generate More if you want a different tone for the same details.'
    ],
    fields: [
      { key: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Sneha Gupta', required: true },
      {
        key: 'recipientType',
        label: 'Recipient Type',
        type: 'select',
        required: true,
        options: [
          { value: 'teacher', label: 'Teacher' },
          { value: 'principal', label: 'Principal' },
          { value: 'manager', label: 'Manager' }
        ]
      },
      {
        key: 'reason',
        label: 'Reason for Leave',
        type: 'text',
        placeholder: 'e.g. medical appointment, family function, personal work',
        required: true
      },
      { key: 'startDate', label: 'Start Date', type: 'date', required: true },
      { key: 'endDate', label: 'End Date', type: 'date', required: true },
      {
        key: 'additionalNote',
        label: 'Additional Note (optional)',
        type: 'textarea',
        placeholder: 'e.g. I will complete pending work immediately after rejoining.',
        required: false
      }
    ]
  },
  {
    id: 'instagram-caption-generator',
    title: 'Instagram Caption Generator',
    category: 'Social Tool',
    description: 'Generate 5 natural caption ideas for personal, educational, and brand-style posts with optional hashtags.',
    ctaLabel: 'Generate Captions',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Best captions are short, clear, and aligned with your post intent.',
    tips: [
      'Best captions are short, clear, and aligned with your post intent.',
      'Add optional keywords to improve relevance.',
      'Use Generate More to get a new style mix quickly.'
    ],
    fields: [
      { key: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. first internship day at startup', required: true },
      {
        key: 'contentType',
        label: 'Content Type',
        type: 'select',
        required: true,
        options: [
          { value: 'personal', label: 'Personal' },
          { value: 'educational', label: 'Educational' },
          { value: 'promotional', label: 'Promotional' },
          { value: 'motivational', label: 'Motivational' }
        ]
      },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'casual', label: 'Casual' },
          { value: 'professional', label: 'Professional' },
          { value: 'funny', label: 'Funny' },
          { value: 'inspirational', label: 'Inspirational' }
        ]
      },
      {
        key: 'keywords',
        label: 'Optional Keywords',
        type: 'text',
        required: false,
        placeholder: 'e.g. internship, growth, student life'
      }
    ]
  },
  {
    id: 'instagram-bio-generator',
    title: 'Instagram Bio Generator',
    category: 'Social Tool',
    description: 'Generate short and memorable Instagram bio options tailored to your niche, purpose, and style.',
    ctaLabel: 'Generate Bios',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Keep your bio short, clear, and easy to remember.',
    tips: [
      'Use one clear identity.',
      'Add one CTA.',
      'Don’t overload with too many words.'
    ],
    fields: [
      { key: 'name', label: 'Name / Brand Name', type: 'text', placeholder: 'e.g. Neha Creates / GrowthSprint Studio', required: true },
      { key: 'niche', label: 'Niche / Category', type: 'text', placeholder: 'e.g. Study tips, Fitness, Design, Personal Branding', required: true },
      {
        key: 'bioStyle',
        label: 'Bio Style',
        type: 'select',
        required: true,
        options: [
          { value: 'cute', label: 'Cute' },
          { value: 'professional', label: 'Professional' },
          { value: 'aesthetic', label: 'Aesthetic' },
          { value: 'funny', label: 'Funny' },
          { value: 'minimal', label: 'Minimal' }
        ]
      },
      {
        key: 'purpose',
        label: 'Purpose',
        type: 'select',
        required: true,
        options: [
          { value: 'personal', label: 'Personal' },
          { value: 'creator', label: 'Creator' },
          { value: 'business', label: 'Business' },
          { value: 'student', label: 'Student' },
          { value: 'freelancer', label: 'Freelancer' }
        ]
      },
      { key: 'keywords', label: 'Optional Keywords / Interests', type: 'text', placeholder: 'e.g. productivity, reels, ui/ux, startups', required: false },
      { key: 'cta', label: 'Optional Call to Action', type: 'text', placeholder: 'e.g. DM for collabs | Download free guide', required: false }
    ]
  },

  {
    id: 'linkedin-headline-generator',
    title: 'LinkedIn Headline Generator',
    category: 'Career Tool',
    description: 'Generate strong, role-focused LinkedIn headline options that are concise, keyword-friendly, and professional.',
    ctaLabel: 'Generate Headlines',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Keep your headline clear and role-focused.',
    tips: [
      'Use important keywords related to your target role and industry.',
      'Show your current role or status so recruiters understand your stage quickly.',
      'Keep it short and scannable to improve profile readability.'
    ],
    fields: [
      { key: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Priya Sharma', required: true },
      {
        key: 'currentStatus',
        label: 'Current Status',
        type: 'select',
        required: true,
        options: [
          { value: 'Student', label: 'Student' },
          { value: 'Fresher', label: 'Fresher' },
          { value: 'Freelancer', label: 'Freelancer' },
          { value: 'Professional', label: 'Professional' }
        ]
      },
      { key: 'targetRole', label: 'Target Role / Field', type: 'text', placeholder: 'e.g. Data Analyst | UI/UX Designer', required: true },
      { key: 'skills', label: 'Key Skills', type: 'text', placeholder: 'e.g. Excel, SQL, Tableau, Storytelling', required: true },
      { key: 'industry', label: 'Industry / Niche', type: 'text', placeholder: 'e.g. FinTech, EdTech, Marketing', required: true },
      { key: 'goal', label: 'Optional Goal', type: 'text', placeholder: 'e.g. Looking for internship opportunities', required: false },
      {
        key: 'tone',
        label: 'Optional Tone',
        type: 'select',
        required: false,
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'confident', label: 'Confident' },
          { value: 'simple', label: 'Simple' },
          { value: 'modern', label: 'Modern' }
        ]
      }
    ]
  },

  {
    id: 'linkedin-bio-generator',
    title: 'LinkedIn Bio Generator',
    category: 'Career Tool',
    description: 'Create professional LinkedIn About section options for students, freshers, freelancers, and creators.',
    ctaLabel: 'Build Bio',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Edit the final version to match your real background and voice.',
    tips: [
      'Keep your summary clear and role-focused for better recruiter visibility.',
      'Use 3 to 5 relevant skills instead of listing everything.',
      'Edit the final version to match your real background and voice.'
    ],
    fields: [
      { key: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Aditi Sharma', required: true },
      {
        key: 'status',
        label: 'Current Status',
        type: 'select',
        required: true,
        options: [
          { value: 'student', label: 'Student' },
          { value: 'fresher', label: 'Fresher' },
          { value: 'freelancer', label: 'Freelancer' },
          { value: 'creator', label: 'Creator' }
        ]
      },
      { key: 'domain', label: 'Field / Domain', type: 'text', placeholder: 'e.g. Digital Marketing', required: true },
      { key: 'skills', label: 'Skills (comma separated)', type: 'text', placeholder: 'e.g. Content Writing, SEO, Canva', required: true },
      { key: 'careerGoal', label: 'Career Goal', type: 'text', placeholder: 'e.g. Build a career in digital marketing and growth', required: true },
      {
        key: 'tone',
        label: 'Personality Tone (optional)',
        type: 'select',
        required: false,
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'friendly', label: 'Friendly' },
          { value: 'confident', label: 'Confident' }
        ]
      }
    ]
  },
  {
    id: 'cover-letter-generator',
    title: 'Cover Letter Generator',
    category: 'Career Tool',
    description: 'Create clean, professional cover letters for internship and entry-level role applications.',
    ctaLabel: 'Generate Cover Letter',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Personalizing your cover letter for each company improves your chances.',
    tips: [
      'Personalizing your cover letter for each company improves your chances.',
      'Keep your skills and interest section specific and practical.',
      'Review role and company names before sending.'
    ],
    fields: [
      { key: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Rahul Singh', required: true },
      { key: 'role', label: 'Role Applying For', type: 'text', placeholder: 'e.g. Content Writing Intern', required: true },
      { key: 'company', label: 'Company Name', type: 'text', placeholder: 'e.g. LearnSphere', required: true },
      { key: 'skills', label: 'Skills (comma separated)', type: 'text', placeholder: 'e.g. Research, Writing, SEO Basics', required: true },
      {
        key: 'interestReason',
        label: 'Why You Are Interested',
        type: 'textarea',
        placeholder: 'e.g. I enjoy creating student-first content and want hands-on internship exposure.',
        required: true
      },
      {
        key: 'experienceLevel',
        label: 'Experience Level',
        type: 'select',
        required: true,
        options: [
          { value: 'fresher', label: 'Fresher' },
          { value: '0-1 years', label: '0-1 Years' },
          { value: '1-3 years', label: '1-3 Years' }
        ]
      },
      {
        key: 'achievement',
        label: 'Optional Achievement / Project',
        type: 'textarea',
        placeholder: 'e.g. Created 10 educational blog drafts and improved student page engagement by 22%.',
        required: false
      }
    ]
  },
  {
    id: 'study-timetable-generator',
    title: 'Study Timetable Generator',
    category: 'Student Tool',
    description: 'Generate a structured weekly study timetable based on your subjects, available hours, and exam goal.',
    ctaLabel: 'Plan My Week',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Treat this as a flexible plan, not a rigid rule.',
    tips: [
      'Treat this as a flexible plan, not a rigid rule. Adjust based on your energy and deadlines.',
      'Keep daily hours realistic so you can stay consistent.',
      'Review the plan weekly and update weak-subject focus.'
    ],
    fields: [
      {
        key: 'level',
        label: 'Class / Level',
        type: 'text',
        placeholder: 'e.g. Class 12 Science / 2nd Year B.Com',
        required: true
      },
      {
        key: 'subjects',
        label: 'Subjects (comma separated)',
        type: 'text',
        placeholder: 'e.g. Maths, Physics, Chemistry, English',
        required: true
      },
      {
        key: 'hoursPerDay',
        label: 'Daily Study Hours',
        type: 'number',
        placeholder: 'e.g. 3',
        required: true
      },
      {
        key: 'studyTime',
        label: 'Preferred Study Time',
        type: 'select',
        required: true,
        options: [
          { value: 'morning', label: 'Morning' },
          { value: 'evening', label: 'Evening' },
          { value: 'flexible', label: 'Flexible' }
        ]
      },
      {
        key: 'examGoal',
        label: 'Exam Goal',
        type: 'select',
        required: true,
        options: [
          { value: 'school-exam', label: 'School Exam' },
          { value: 'boards', label: 'Boards' },
          { value: 'competitive-exam', label: 'Competitive Exam' }
        ]
      },
      {
        key: 'weakSubjects',
        label: 'Weak Subjects (optional, comma separated)',
        type: 'text',
        placeholder: 'e.g. Physics, Chemistry',
        required: false
      }
    ]
  },

  {
    id: 'notes-to-bullet-points-converter',
    title: 'Notes to Bullet Points Converter',
    category: 'Student Tool',
    description: 'Convert long notes into short, useful bullet points for revision and quick studying.',
    ctaLabel: 'Convert Notes',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Use this as a revision helper and review once before exams.',
    tips: [
      'Keep points short',
      'Highlight formulas',
      'Revise repeatedly'
    ],
    fields: [
      { key: 'topic', label: 'Topic / Chapter Name', type: 'text', placeholder: 'e.g. Cell Division, Indian Constitution', required: true },
      { key: 'notes', label: 'Notes / Text', type: 'textarea', placeholder: 'Paste your long notes here...', required: true, rows: 10 },
      {
        key: 'educationLevel',
        label: 'Education Level',
        type: 'select',
        required: true,
        options: [
          { value: 'school', label: 'School' },
          { value: 'college', label: 'College' },
          { value: 'competitive-exam', label: 'Competitive Exam' }
        ]
      },
      {
        key: 'summaryStyle',
        label: 'Summary Style',
        type: 'select',
        required: true,
        options: [
          { value: 'short-bullets', label: 'Short Bullets' },
          { value: 'exam-points', label: 'Exam Points' },
          { value: 'revision-points', label: 'Revision Points' }
        ]
      },
      {
        key: 'focus',
        label: 'Optional Focus',
        type: 'select',
        required: false,
        options: [
          { value: 'definitions', label: 'Definitions' },
          { value: 'facts', label: 'Facts' },
          { value: 'formula-concepts', label: 'Formula / Concepts' },
          { value: 'important-terms', label: 'Important Terms' }
        ]
      }
    ]
  },

  {
    id: 'study-notes-summarizer',
    title: 'Study Notes Summarizer',
    category: 'Student Tool',
    description: 'Convert long notes and chapters into concise revision blocks: summary, bullets, keywords, quick revision, and optional memory aid.',
    ctaLabel: 'Summarize Notes',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Always review the summary once and adjust it for your exam needs.',
    tips: [
      'Read once after summarizing to check accuracy.',
      'Highlight formulas, terms, and definitions while revising.',
      'Revise using short bullet points for faster recall.'
    ],
    fields: [
      {
        key: 'topic',
        label: 'Topic / Chapter Name',
        type: 'text',
        placeholder: 'e.g. Photosynthesis, Trigonometry Basics, Indian Polity',
        required: true
      },
      {
        key: 'notes',
        label: 'Notes / Text',
        type: 'textarea',
        placeholder: 'Paste your long notes or chapter text here for summarization...',
        required: true,
        rows: 10
      },
      {
        key: 'educationLevel',
        label: 'Education Level',
        type: 'select',
        required: true,
        options: [
          { value: 'school', label: 'School' },
          { value: 'college', label: 'College' },
          { value: 'competitive-exam', label: 'Competitive Exam' }
        ]
      },
      {
        key: 'outputStyle',
        label: 'Output Style',
        type: 'select',
        required: true,
        options: [
          { value: 'bullet-summary', label: 'Bullet Summary' },
          { value: 'short-notes', label: 'Short Notes' },
          { value: 'exam-revision-points', label: 'Exam Revision Points' }
        ]
      },
      {
        key: 'focus',
        label: 'Optional Focus',
        type: 'select',
        required: false,
        options: [
          { value: 'definitions', label: 'Definitions' },
          { value: 'important-facts', label: 'Important Facts' },
          { value: 'formula-concepts', label: 'Formula / Concepts' },
          { value: 'full-revision', label: 'Full Revision' }
        ]
      },
      {
        key: 'tone',
        label: 'Optional Tone',
        type: 'select',
        required: false,
        options: [
          { value: 'simple', label: 'Simple' },
          { value: 'academic', label: 'Academic' },
          { value: 'exam-friendly', label: 'Exam Friendly' }
        ]
      }
    ]
  },

  {
    id: 'grammar-corrector-sentence-improver',
    title: 'Grammar Corrector / Sentence Improver',
    category: 'Writing Tool',
    description: 'Correct grammar and improve readability while keeping your original meaning and natural tone.',
    ctaLabel: 'Generate',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Always review the final text before using it.',
    tips: [
      'Keep sentences short.',
      'Use active voice.',
      'Remove extra repetition.'
    ],
    fields: [
      {
        key: 'originalText',
        label: 'Original Text',
        type: 'textarea',
        placeholder: 'Paste your sentence or paragraph here...',
        required: true
      },
      {
        key: 'outputStyle',
        label: 'Output Style',
        type: 'select',
        required: true,
        options: [
          { value: 'simple', label: 'Simple' },
          { value: 'formal', label: 'Formal' },
          { value: 'professional', label: 'Professional' },
          { value: 'friendly', label: 'Friendly' }
        ]
      },
      {
        key: 'improvementLevel',
        label: 'Improvement Level',
        type: 'select',
        required: true,
        options: [
          { value: 'light', label: 'Light Correction' },
          { value: 'moderate', label: 'Moderate Improvement' },
          { value: 'strong', label: 'Strong Rewrite' }
        ]
      },
      {
        key: 'tone',
        label: 'Optional Tone',
        type: 'select',
        required: false,
        options: [
          { value: '', label: 'No specific tone' },
          { value: 'polite', label: 'Polite' },
          { value: 'confident', label: 'Confident' },
          { value: 'clear', label: 'Clear' },
          { value: 'academic', label: 'Academic' }
        ]
      }
    ]
  },
  {
    id: 'paragraph-rewriter-humanizer',
    title: 'Paragraph Rewriter / Humanizer',
    category: 'Writing Tool',
    description: 'Rewrite your paragraph for natural flow, stronger readability, and human tone without changing the meaning.',
    ctaLabel: 'Generate',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Use this as a writing helper, then review it before submitting.',
    tips: [
      'Break long sentences.',
      'Replace repeated words.',
      'Keep the meaning the same.'
    ],
    fields: [
      {
        key: 'originalParagraph',
        label: 'Original Paragraph',
        type: 'textarea',
        placeholder: 'Paste your paragraph here...',
        required: true,
        rows: 10
      },
      {
        key: 'desiredTone',
        label: 'Desired Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'formal', label: 'Formal' },
          { value: 'simple', label: 'Simple' },
          { value: 'academic', label: 'Academic' },
          { value: 'professional', label: 'Professional' },
          { value: 'friendly', label: 'Friendly' }
        ]
      },
      {
        key: 'rewriteStyle',
        label: 'Rewrite Style',
        type: 'select',
        required: true,
        options: [
          { value: 'same-length', label: 'Same Length' },
          { value: 'shorter', label: 'Shorter' },
          { value: 'longer', label: 'Longer' },
          { value: 'more-natural', label: 'More Natural' }
        ]
      },
      {
        key: 'focus',
        label: 'Optional Focus',
        type: 'select',
        required: false,
        options: [
          { value: '', label: 'No specific focus' },
          { value: 'clarity', label: 'Clarity' },
          { value: 'fluency', label: 'Fluency' },
          { value: 'vocabulary', label: 'Vocabulary' },
          { value: 'readability', label: 'Readability' }
        ]
      }
    ]
  },
  {
    id: 'assignment-rewriter',
    title: 'Assignment Rewriter / Paraphraser',
    category: 'Writing Tool',
    description: 'Rewrite assignment drafts into clearer, polished, and original wording while preserving meaning.',
    ctaLabel: 'Rewrite Assignment',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Use this as a rewriting helper, then review it in your own words.',
    tips: [
      'Check facts after rewriting.',
      'Add your own understanding and class context.',
      'Keep citations and references if your assignment needs them.'
    ],
    fields: [
      {
        key: 'originalText',
        label: 'Original Text',
        type: 'textarea',
        placeholder: 'Paste your assignment paragraph or draft here...',
        required: true,
        rows: 10
      },
      {
        key: 'topic',
        label: 'Subject / Topic',
        type: 'text',
        placeholder: 'e.g. Climate Change, DBMS Normalization, Shakespearean Drama',
        required: true
      },
      {
        key: 'tone',
        label: 'Desired Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'formal', label: 'Formal' },
          { value: 'simple', label: 'Simple' },
          { value: 'academic', label: 'Academic' },
          { value: 'professional', label: 'Professional' }
        ]
      },
      {
        key: 'targetLength',
        label: 'Target Length',
        type: 'select',
        required: true,
        options: [
          { value: 'same', label: 'Same Length' },
          { value: 'shorter', label: 'Shorter' },
          { value: 'longer', label: 'Longer' }
        ]
      },
      {
        key: 'keyPoints',
        label: 'Optional Key Points',
        type: 'textarea',
        placeholder: 'e.g. Include impact on students, mention one real example',
        required: false,
        rows: 4
      },
      {
        key: 'audience',
        label: 'Optional Audience',
        type: 'select',
        required: false,
        options: [
          { value: 'school', label: 'School' },
          { value: 'college', label: 'College' },
          { value: 'university', label: 'University' }
        ]
      }
    ]
  },
  {
    id: 'sop-generator',
    title: 'SOP Generator',
    category: 'Career Tool',
    description: 'Generate a polished Statement of Purpose draft for university admissions, scholarships, and academic programs.',
    ctaLabel: 'Generate SOP',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Customize the SOP for each university or program.',
    tips: [
      'Be specific about your learning journey and motivation.',
      'Mention relevant projects and measurable outcomes.',
      'Keep it genuine and aligned with your real profile.'
    ],
    fields: [
      { key: 'program', label: 'Program / Course', type: 'text', placeholder: 'e.g. MSc Data Science', required: true },
      { key: 'university', label: 'University / Institution', type: 'text', placeholder: 'e.g. University of Melbourne', required: true },
      {
        key: 'academicBackground',
        label: 'Academic Background',
        type: 'textarea',
        placeholder: 'e.g. B.Tech in Computer Science with focus on analytics and applied ML.',
        required: true,
        rows: 6
      },
      {
        key: 'careerGoals',
        label: 'Career Goals',
        type: 'textarea',
        placeholder: 'e.g. Build expertise in data-driven product strategy and work in healthcare analytics.',
        required: true,
        rows: 6
      },
      {
        key: 'achievements',
        label: 'Achievements / Projects',
        type: 'textarea',
        placeholder: 'e.g. Built capstone model, internship outcomes, published paper, major project results.',
        required: true,
        rows: 6
      },
      {
        key: 'whyProgram',
        label: 'Why This Program / University',
        type: 'textarea',
        placeholder: 'e.g. Curriculum fit, faculty interest, labs, research ecosystem, scholarship alignment.',
        required: true,
        rows: 6
      },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'formal', label: 'Formal' },
          { value: 'motivated', label: 'Motivated' },
          { value: 'confident', label: 'Confident' },
          { value: 'academic', label: 'Academic' }
        ]
      },
      {
        key: 'wordCount',
        label: 'Optional Word Count',
        type: 'select',
        required: false,
        options: [
          { value: 'short', label: 'Short' },
          { value: 'medium', label: 'Medium' },
          { value: 'long', label: 'Long' }
        ]
      }
    ]
  },
  {
    id: 'linkedin-networking-message-generator',
    title: 'LinkedIn Networking Message Generator',
    category: 'Career Tool',
    description: 'Generate short, polite, and effective LinkedIn connection and follow-up messages for networking.',
    ctaLabel: 'Generate Messages',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Keep messages short, respectful, and specific.',
    tips: [
      'Mention why you’re reaching out.',
      'Keep it under 300 characters if possible.',
      'Personalize with a shared point.'
    ],
    fields: [
      {
        key: 'recipientType',
        label: 'Recipient Type',
        type: 'select',
        required: true,
        options: [
          { value: 'recruiter', label: 'Recruiter' },
          { value: 'alumni', label: 'Alumni' },
          { value: 'founder', label: 'Founder' },
          { value: 'professional', label: 'Professional' }
        ]
      },
      {
        key: 'purpose',
        label: 'Purpose',
        type: 'text',
        placeholder: 'e.g. Seek guidance for internships, ask for role insights, request a brief chat',
        required: true
      },
      {
        key: 'background',
        label: 'Your Background',
        type: 'textarea',
        placeholder: 'e.g. Final-year BBA student with internship in growth marketing.',
        required: true
      },
      {
        key: 'targetRole',
        label: 'Target Role',
        type: 'text',
        placeholder: 'e.g. Product Analyst Intern',
        required: true
      },
      {
        key: 'sharedReference',
        label: 'Shared Interest / Reference (optional)',
        type: 'text',
        placeholder: 'e.g. We are from the same university / I liked your post on hiring tips',
        required: false
      },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'polite', label: 'Polite' },
          { value: 'professional', label: 'Professional' },
          { value: 'friendly', label: 'Friendly' },
          { value: 'confident', label: 'Confident' }
        ]
      }
    ]
  },
  {
    id: 'job-description-analyzer',
    title: 'Job Description Analyzer',
    category: 'Career Tool',
    description: 'Analyze job descriptions to estimate fit, identify missing skills, and improve your application strategy.',
    ctaLabel: 'Analyze Job',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Always read the full job description carefully before applying.',
    tips: [
      'Tailor resume keywords to the role.',
      'Match relevant skills first in your profile.',
      'Check responsibilities carefully before applying.'
    ],
    fields: [
      {
        key: 'jobDescription',
        label: 'Job Description Text',
        type: 'textarea',
        placeholder: 'Paste the full job description here...',
        required: true,
        rows: 10
      },
      {
        key: 'userSkills',
        label: 'User Skills',
        type: 'text',
        placeholder: 'e.g. JavaScript, React, SQL, Problem Solving',
        required: true
      },
      {
        key: 'experienceLevel',
        label: 'Experience Level',
        type: 'select',
        required: true,
        options: [
          { value: 'fresher', label: 'Fresher' },
          { value: '0-1 years', label: '0-1 Years' },
          { value: '1-3 years', label: '1-3 Years' }
        ]
      },
      {
        key: 'targetRole',
        label: 'Target Role',
        type: 'text',
        placeholder: 'e.g. Frontend Developer Intern',
        required: true
      },
      {
        key: 'resumeSummary',
        label: 'Optional Resume Summary',
        type: 'textarea',
        placeholder: 'Paste your current summary if available.',
        required: false
      },
      {
        key: 'tone',
        label: 'Optional Tone',
        type: 'select',
        required: false,
        options: [
          { value: 'clear', label: 'Clear' },
          { value: 'detailed', label: 'Detailed' },
          { value: 'beginner-friendly', label: 'Beginner Friendly' }
        ]
      }
    ]
  },
  {
    id: 'scholarship-finder',
    title: 'Scholarship Finder / Scholarship Recommender',
    category: 'Student Tool',
    description: 'Get scholarship category recommendations based on your profile, need type, and academic context.',
    ctaLabel: 'Find Scholarships',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Always verify eligibility and deadlines from official sources.',
    tips: [
      'Prepare documents in advance.',
      'Check official portal before applying.',
      'Review eligibility criteria carefully.'
    ],
    fields: [
      {
        key: 'educationLevel',
        label: 'Current Education Level',
        type: 'select',
        required: true,
        options: [
          { value: 'school', label: 'School' },
          { value: 'undergraduate', label: 'Undergraduate' },
          { value: 'postgraduate', label: 'Postgraduate' }
        ]
      },
      { key: 'state', label: 'State / Region', type: 'text', placeholder: 'e.g. Maharashtra, Karnataka, Delhi', required: true },
      { key: 'category', label: 'Category (optional)', type: 'text', placeholder: 'e.g. SC, ST, OBC, EWS, General', required: false },
      {
        key: 'academicPerformance',
        label: 'Academic Performance',
        type: 'text',
        placeholder: 'e.g. 8.2 CGPA / 85% in Class 12',
        required: true
      },
      {
        key: 'needType',
        label: 'Need Type',
        type: 'select',
        required: true,
        options: [
          { value: 'merit-based', label: 'Merit-based' },
          { value: 'need-based', label: 'Need-based' },
          { value: 'general', label: 'General' }
        ]
      },
      { key: 'fieldOfStudy', label: 'Field of Study (optional)', type: 'text', placeholder: 'e.g. Engineering, Commerce, Arts', required: false },
      {
        key: 'specialInterest',
        label: 'Optional Special Interest',
        type: 'select',
        required: false,
        options: [
          { value: 'sports', label: 'Sports' },
          { value: 'women', label: 'Women' },
          { value: 'research', label: 'Research' },
          { value: 'financial-support', label: 'Financial Support' },
          { value: 'stem', label: 'STEM' },
          { value: 'arts', label: 'Arts' }
        ]
      }
    ]
  },
  {
    id: 'career-path-quiz',
    title: 'Career Path Quiz / Career Path Suggestor',
    category: 'Career Tool',
    description: 'Find likely career directions based on your interests, strengths, work style, and coding preference.',
    ctaLabel: 'Suggest Career Paths',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'This tool gives direction, not a final decision. Use it as a starting point.',
    tips: [
      'Explore one path at a time.',
      'Learn core skills first.',
      'Try a small project before deciding.'
    ],
    fields: [
      {
        key: 'stage',
        label: 'Current Stage',
        type: 'select',
        required: true,
        options: [
          { value: 'school', label: 'School Student' },
          { value: 'college', label: 'College Student' },
          { value: 'graduate', label: 'Graduate' },
          { value: 'fresher', label: 'Fresher' }
        ]
      },
      { key: 'interests', label: 'Interests', type: 'textarea', placeholder: 'e.g. storytelling, business, design, data, helping people', required: true, rows: 5 },
      {
        key: 'workStyle',
        label: 'Preferred Work Style',
        type: 'select',
        required: true,
        options: [
          { value: 'creative', label: 'Creative' },
          { value: 'analytical', label: 'Analytical' },
          { value: 'people-focused', label: 'People-focused' },
          { value: 'independent', label: 'Independent' }
        ]
      },
      { key: 'strengths', label: 'Skills / Strengths', type: 'textarea', placeholder: 'e.g. communication, planning, problem-solving, Canva, Excel', required: true, rows: 5 },
    {
        key: 'codingPreference',
        label: 'Coding Preference',
        type: 'select',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        key: 'goal',
        label: 'Optional Goal',
        type: 'select',
        required: false,
        options: [
          { value: 'job', label: 'Job' },
          { value: 'freelancing', label: 'Freelancing' },
          { value: 'higher-studies', label: 'Higher Studies' },
          { value: 'entrepreneurship', label: 'Entrepreneurship' }
        ]
      }
    ]
  },
  {
    id: 'youtube-shorts-script-generator',
    title: 'YouTube / Shorts Script Generator',
    category: 'Social Tool',
    description: 'Generate engaging script ideas for YouTube videos, Shorts, Reels, and creator content.',
    ctaLabel: 'Generate Scripts',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'A strong hook in the first few seconds matters most.',
    tips: [
      'Start with a question or bold statement.',
      'Keep the first line engaging.',
      'End with one clear CTA.'
    ],
    fields: [
      { key: 'topic', label: 'Niche / Topic', type: 'text', placeholder: 'e.g. Productivity for Students, AI Tools, Fitness Myths', required: true },
      {
        key: 'platform',
        label: 'Platform',
        type: 'select',
        required: true,
        options: [
          { value: 'youtube-long', label: 'YouTube Long Video' },
          { value: 'youtube-shorts', label: 'YouTube Shorts' },
          { value: 'instagram-reels', label: 'Instagram Reels' },
          { value: 'linkedin-video', label: 'LinkedIn Video' }
        ]
      },
      {
        key: 'contentGoal',
        label: 'Content Goal',
        type: 'select',
        required: true,
        options: [
          { value: 'growth', label: 'Growth' },
          { value: 'education', label: 'Education' },
          { value: 'engagement', label: 'Engagement' },
          { value: 'promotion', label: 'Promotion' }
        ]
      },
      { key: 'audienceType', label: 'Audience Type', type: 'text', placeholder: 'e.g. college students, beginner creators, founders', required: true },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'energetic', label: 'Energetic' },
          { value: 'professional', label: 'Professional' },
          { value: 'casual', label: 'Casual' },
          { value: 'motivational', label: 'Motivational' }
        ]
      },
      { key: 'keywords', label: 'Optional Keywords', type: 'text', placeholder: 'e.g. hacks, beginner mistakes, tools', required: false },
      { key: 'videoLength', label: 'Optional Video Length', type: 'text', placeholder: 'e.g. 30 sec, 60 sec, 5 min, 10 min', required: false }
    ]
  },
  {
    id: 'ai-career-path-suggestor',
    title: 'AI Career Path Suggestor',
    category: 'AI Tool',
    description: 'Discover realistic career directions with role-fit reasons, skill roadmap, and practical next steps.',
    ctaLabel: 'Explore Path',
    outputType: 'cards',
    enableGenerateMore: true,
    tips: [
      'Be specific with your interests and strengths for better matches.',
      'Use the suggestions to shortlist 1-2 roles and test them through mini projects.',
      'Treat this as direction, then validate by talking to mentors and professionals.'
    ],
    fields: [
      {
        key: 'stage',
        label: 'Current Stage',
        type: 'select',
        required: true,
        options: [
          { value: 'school', label: 'School Student' },
          { value: 'college', label: 'College Student' },
          { value: 'graduate', label: 'Graduate' },
          { value: 'fresher', label: 'Fresher' }
        ]
      },
      {
        key: 'interests',
        label: 'Interests',
        type: 'textarea',
        placeholder: 'e.g. Storytelling, psychology, marketing, technology, helping people',
        required: true
      },
      {
        key: 'workStyle',
        label: 'Preferred Work Style',
        type: 'select',
        required: true,
        options: [
          { value: 'creative', label: 'Creative' },
          { value: 'analytical', label: 'Analytical' },
          { value: 'people-focused', label: 'People-focused' },
          { value: 'independent', label: 'Independent' }
        ]
      },
      {
        key: 'strengths',
        label: 'Skills / Strengths',
        type: 'textarea',
        placeholder: 'e.g. Communication, Canva, presentation, problem-solving, consistency',
        required: true
      },
      {
        key: 'codingPreference',
        label: 'Do you prefer coding? (optional)',
        type: 'select',
        required: false,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: 'scholarship-recommendation-tool',
    title: 'Scholarship Recommendation Tool',
    category: 'AI Tool',
    description: 'Find realistic scholarship categories and preparation steps based on your education profile.',
    ctaLabel: 'Find Scholarships',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Always verify final eligibility and deadlines from the official scholarship source.',
    tips: [
      'Use correct education level and need type for higher-fit recommendations.',
      'Keep documents ready early to avoid deadline stress.',
      'Apply to multiple matching categories instead of depending on one scholarship.'
    ],
    fields: [
      {
        key: 'currentEducationLevel',
        label: 'Current Education Level',
        type: 'select',
        required: true,
        options: [
          { value: 'school', label: 'School Student' },
          { value: 'after-12th', label: 'After 12th' },
          { value: 'undergraduate', label: 'Undergraduate' },
          { value: 'postgraduate', label: 'Postgraduate' },
          { value: 'professional-course', label: 'Professional Course' }
        ]
      },
      {
        key: 'stateOrRegion',
        label: 'State / Region',
        type: 'text',
        placeholder: 'e.g. Maharashtra, Karnataka, Delhi',
        required: true
      },
      {
        key: 'category',
        label: 'Category (optional)',
        type: 'select',
        required: false,
        options: [
          { value: 'general', label: 'General' },
          { value: 'obc', label: 'OBC' },
          { value: 'sc', label: 'SC' },
          { value: 'st', label: 'ST' },
          { value: 'ews', label: 'EWS' },
          { value: 'minority', label: 'Minority' },
          { value: 'pwd', label: 'PwD' }
        ]
      },
      {
        key: 'academicPerformance',
        label: 'Academic Performance',
        type: 'select',
        required: true,
        options: [
          { value: 'excellent', label: 'Excellent (85%+)' },
          { value: 'good', label: 'Good (70%-84%)' },
          { value: 'average', label: 'Average (55%-69%)' },
          { value: 'improving', label: 'Improving (<55%)' }
        ]
   },
      {
        key: 'needType',
        label: 'Need Type',
        type: 'select',
        required: true,
        options: [
          { value: 'merit-based', label: 'Merit-based' },
          { value: 'need-based', label: 'Need-based' },
          { value: 'category-based', label: 'Category-based' },
          { value: 'general', label: 'General' }
        ]
      },
      {
        key: 'fieldOfStudy',
        label: 'Field of Study (optional)',
        type: 'text',
        placeholder: 'e.g. Engineering, Commerce, Medicine, Arts',
        required: false
      }
    ]
  },

  {
    id: 'formal-letter-generator',
    title: 'Formal Letter Generator',
    category: 'Writing Tool',
    description: 'Generate professional formal letters for school, college, office, and general communication in ready-to-use format.',
    ctaLabel: 'Generate Letter',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Keep the tone respectful and the message clear.',
    tips: [
      'Mention subject clearly.',
      'Keep paragraphs short.',
      'Be polite and direct.'
    ],
    fields: [
      {
        key: 'letterType',
        label: 'Letter Type',
        type: 'select',
        required: true,
        options: [
          { value: 'Application', label: 'Application' },
          { value: 'Complaint', label: 'Complaint' },
          { value: 'Request', label: 'Request' },
          { value: 'Permission', label: 'Permission' },
          { value: 'Inquiry', label: 'Inquiry' },
          { value: 'General', label: 'General' }
        ]
      },
      {
        key: 'recipientType',
        label: 'Recipient Type',
        type: 'select',
        required: true,
        options: [
          { value: 'Teacher', label: 'Teacher' },
          { value: 'Principal', label: 'Principal' },
          { value: 'Manager', label: 'Manager' },
          { value: 'Officer', label: 'Officer' },
          { value: 'General', label: 'General' }
        ]
      },
      { key: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g. Request for 2 days leave due to medical appointment', required: true },
      { key: 'message', label: 'Reason / Message', type: 'textarea', placeholder: 'e.g. I am writing to request leave on 5th and 6th May due to...', required: true },
      { key: 'senderName', label: 'Sender Name', type: 'text', placeholder: 'e.g. Riya Sharma', required: true },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'formal', label: 'Formal' },
          { value: 'polite', label: 'Polite' },
          { value: 'respectful', label: 'Respectful' },
          { value: 'professional', label: 'Professional' }
        ]
      }
    ]
  },

  {
    id: 'professional-email-generator',
    title: 'Professional Email Generator',
    category: 'Writing Tool',
    description: 'Create polished professional emails for internships, jobs, follow-ups, requests, and leave applications.',
    ctaLabel: 'Generate Email',
    outputType: 'email',
    enableGenerateMore: true,
    helperText: 'Always review names, attachments, and company details before sending.',
    tips: [
      'Select a clear purpose and match it with the right tone.',
      'Use specific role/context details for better-quality drafts.',
      'Always review names, role details, and attachments before sending.'
    ],
    fields: [
      {
        key: 'emailPurpose',
        label: 'Email Purpose',
        type: 'select',
        required: true,
        options: [
          { value: 'internship-application', label: 'Internship Application' },
          { value: 'job-application', label: 'Job Application' },
          { value: 'follow-up', label: 'Follow-up' },
          { value: 'request', label: 'Request' },
          { value: 'leave', label: 'Leave' }
        ]
      },
      { key: 'recipientName', label: 'Recipient Name', type: 'text', placeholder: 'e.g. Ms. Sharma', required: true },
      { key: 'senderName', label: 'Sender Name', type: 'text', placeholder: 'e.g. Riya Verma', required: true },
      { key: 'roleContext', label: 'Role / Context', type: 'text', placeholder: 'e.g. Frontend Internship - Summer 2026', required: true },
      { key: 'mainMessage', label: 'Main Message', type: 'textarea', placeholder: 'Share your key intent, highlights, or request in 1-3 lines.', required: true },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'formal', label: 'Formal' },
          { value: 'polite', label: 'Polite' },
          { value: 'professional', label: 'Professional' }
        ]
      }
    ]
  },
  {
    id: 'email-subject-line-generator',
    title: 'Email Subject Line Generator',
    category: 'Writing Tool',
    description: 'Generate catchy, clear, and professional subject lines based on your email purpose and context.',
    ctaLabel: 'Generate Subject Lines',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Keep subject lines short, clear, and relevant.',
    tips: [
      'Avoid spammy words.',
      'Mention the purpose clearly.',
      'Keep it under ~8 words when possible.'
    ],
    fields: [
      {
        key: 'purpose',
        label: 'Email Purpose',
        type: 'select',
        required: true,
        options: [
          { value: 'internship-application', label: 'Internship Application' },
          { value: 'job-application', label: 'Job Application' },
          { value: 'follow-up', label: 'Follow-up' },
          { value: 'request', label: 'Request' },
          { value: 'thank-you', label: 'Thank You' },
          { value: 'complaint', label: 'Complaint' }
        ]
      },
      {
        key: 'recipientType',
        label: 'Recipient Type',
        type: 'select',
        required: true,
        options: [
          { value: 'recruiter', label: 'Recruiter' },
          { value: 'teacher', label: 'Teacher' },
          { value: 'manager', label: 'Manager' },
          { value: 'client', label: 'Client' },
          { value: 'general', label: 'General' }
        ]
      },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'polite', label: 'Polite' },
          { value: 'formal', label: 'Formal' },
          { value: 'friendly', label: 'Friendly' }
        ]
      },
      {
        key: 'context',
        label: 'Optional Keywords / Context',
        type: 'text',
        required: false,
        placeholder: 'e.g. frontend intern, interview follow-up, invoice delay'
      },
      {
        key: 'style',
        label: 'Optional Style',
        type: 'select',
        required: false,
        options: [
          { value: 'short', label: 'Short' },
          { value: 'attention-grabbing', label: 'Attention-Grabbing' },
          { value: 'formal', label: 'Formal' },
          { value: 'clear', label: 'Clear' }
        ]
      }
    ]
  },
  {
    id: 'whatsapp-message-generator',
    title: 'WhatsApp Message Generator',
    category: 'Writing Tool',
    description: 'Generate clear and WhatsApp-friendly message options for personal, academic, and professional communication.',
    ctaLabel: 'Generate Messages',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Keep it short, clear, and polite for WhatsApp.',
    tips: [
      'Start with a greeting.',
      'Mention purpose quickly.',
      'Avoid long paragraphs.'
    ],
    fields: [
      {
        key: 'purpose',
        label: 'Message Purpose',
        type: 'select',
        required: true,
        options: [
          { value: 'follow-up', label: 'Follow-up' },
          { value: 'request', label: 'Request' },
          { value: 'reminder', label: 'Reminder' },
          { value: 'apology', label: 'Apology' },
          { value: 'thanks', label: 'Thanks' },
          { value: 'invitation', label: 'Invitation' }
        ]
      },
      {
        key: 'recipientType',
        label: 'Recipient Type',
        type: 'select',
        required: true,
        options: [
          { value: 'friend', label: 'Friend' },
          { value: 'teacher', label: 'Teacher' },
          { value: 'client', label: 'Client' },
          { value: 'manager', label: 'Manager' },
          { value: 'group', label: 'Group' }
        ]
      },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'formal', label: 'Formal' },
          { value: 'friendly', label: 'Friendly' },
          { value: 'polite', label: 'Polite' },
          { value: 'short', label: 'Short' }
        ]
      },
      {
        key: 'details',
        label: 'Optional Details / Context',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Followed up last week about internship status.',
        rows: 5
      },
      {
        key: 'length',
        label: 'Optional Length',
        type: 'select',
        required: false,
        options: [
          { value: 'short', label: 'Short' },
          { value: 'medium', label: 'Medium' },
          { value: 'long', label: 'Long' }
        ]
      }
    ]
  },

  {
    id: 'hashtag-generator',
    title: 'Hashtag Generator',
    category: 'Social Tool',
    description: 'Generate platform-friendly hashtag sets based on topic, niche, content type, tone, and optional keywords.',
    ctaLabel: 'Generate Hashtags',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Use a mix of broad and niche hashtags for better reach.',
    tips: [
      'Don’t use too many hashtags',
      'Match hashtags to content',
      'Keep them relevant'
    ],
    fields: [
      { key: 'topic', label: 'Topic / Niche', type: 'text', placeholder: 'e.g. Study motivation, UI design, personal branding', required: true },
      {
        key: 'platform',
        label: 'Platform',
        type: 'select',
        required: true,
        options: [
          { value: 'instagram', label: 'Instagram' },
          { value: 'youtube', label: 'YouTube' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'tiktok-reels', label: 'TikTok / Reels' }
        ]
      },
      {
        key: 'contentType',
        label: 'Content Type',
        type: 'select',
        required: true,
        options: [
          { value: 'educational', label: 'Educational' },
          { value: 'motivational', label: 'Motivational' },
          { value: 'promotional', label: 'Promotional' },
          { value: 'personal', label: 'Personal' },
          { value: 'trending', label: 'Trending' }
        ]
      },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'casual', label: 'Casual' },
          { value: 'trendy', label: 'Trendy' },
          { value: 'minimal', label: 'Minimal' }
        ]
      },
      { key: 'keywords', label: 'Optional Keywords', type: 'text', placeholder: 'e.g. exams, productivity, growth, startup', required: false }
    ]
  },

  {
    id: 'content-idea-generator',
    title: 'Content Idea Generator for Creators',
    category: 'Creator Tool',
    description: 'Generate 10 platform-ready content ideas for creators, freelancers, and personal brands.',
    ctaLabel: 'Generate Ideas',
    outputType: 'cards',
    enableGenerateMore: true,
    helperText: 'Choose ideas that answer your audience’s real questions.',
    tips: [
      'Be specific with niche and audience for more relevant ideas.',
      'Pick a clear goal: growth, education, engagement, or promotion.',
      'Use regenerate to get a fresh angle and test what performs best.'
    ],
    fields: [
      { key: 'niche', label: 'Niche / Topic', type: 'text', placeholder: 'e.g. Student productivity', required: true },
      {
        key: 'platform',
        label: 'Platform',
        type: 'select',
        required: true,
        options: [
          { value: 'instagram', label: 'Instagram' },
          { value: 'youtube', label: 'YouTube' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'blog', label: 'Blog' }
        ]
      },
      {
        key: 'contentGoal',
        label: 'Content Goal',
        type: 'select',
        required: true,
        options: [
          { value: 'growth', label: 'Audience Growth' },
          { value: 'education', label: 'Education' },
          { value: 'engagement', label: 'Engagement' },
          { value: 'promotion', label: 'Promotion' }
        ]
      },
      { key: 'audienceType', label: 'Audience Type', type: 'text', placeholder: 'e.g. College students, early freelancers', required: true },
      { key: 'keywords', label: 'Optional Keywords', type: 'text', placeholder: 'e.g. reels strategy, hooks, productivity', required: false }
    ]
  }
];
