window.ToolShalaToolDefinitions = [
  {
    id: 'resume-headline-generator',
    title: 'Resume Headline Generator',
    category: 'Career Tool',
    description: 'Generate strong, professional resume headlines for internships, jobs, and entry-level roles.',
    ctaLabel: 'Use Tool',
    outputType: 'cards',
    enableGenerateMore: true,
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
    id: 'leave-application-generator',
    title: 'Leave Application Generator',
    category: 'Writing Tool',
    description: 'Create a formal leave application letter in professional English for school, college, or office use.',
    ctaLabel: 'Generate Now',
    outputType: 'text',
    enableGenerateMore: true,
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
    id: 'linkedin-bio-generator',
    title: 'LinkedIn Bio Generator',
    category: 'Career Tool',
    description: 'Create professional LinkedIn About section options for students, freshers, freelancers, and creators.',
    ctaLabel: 'Build Bio',
    outputType: 'cards',
    enableGenerateMore: true,
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
    id: 'professional-email-generator',
    title: 'Professional Email Generator',
    category: 'Writing Tool',
    description: 'Create polished professional emails for internships, jobs, follow-ups, requests, and leave applications.',
    ctaLabel: 'Generate Email',
    outputType: 'email',
    enableGenerateMore: true,
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
    id: 'content-idea-generator',
    title: 'Content Idea Generator for Creators',
    category: 'Social Tool',
    description: 'Generate practical content ideas with hooks and format suggestions for creators.',
    ctaLabel: 'Try Tool',
    outputType: 'cards',
    tips: [
      'Use niche-specific topic for better idea quality.',
      'Pick platform before generating content ideas.',
      'Test ideas in batches and track engagement.'
    ],
    fields: [
      { key: 'niche', label: 'Content Niche', type: 'text', placeholder: 'e.g. Student productivity', required: true },
      {
        key: 'platform',
        label: 'Platform',
        type: 'select',
        required: true,
        options: [
          { value: 'instagram', label: 'Instagram' },
          { value: 'youtube', label: 'YouTube' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'x', label: 'X / Threads' }
        ]
      },
      {
        key: 'contentGoal',
        label: 'Content Goal',
        type: 'select',
        required: true,
        options: [
          { value: 'growth', label: 'Audience Growth' },
          { value: 'engagement', label: 'Engagement' },
          { value: 'authority', label: 'Build Authority' },
          { value: 'leads', label: 'Get Leads / Clients' }
        ]
      }
    ]
  }
];
