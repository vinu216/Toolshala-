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
        label: 'Choose from Gallery',
        type: 'file',
        accept: 'image/*',
        required: true,
        helperText: 'Choose an existing gallery image. JPEG, PNG or WEBP up to 8 MB.'
      }
    ]
  },

  {
    id: 'ats-resume-optimizer',
    title: 'ATS Resume Optimizer',
    category: 'Career Tool',
    description: 'Optimize your resume text for ATS scans, recruiter clarity, role keywords, and fresher-friendly formatting.',
    metaDescription: 'Free ATS Resume Optimizer for students, freshers, and job seekers. Paste resume text, add a target job title, and get ATS-friendly improvements with keywords.',
    ctaLabel: 'Optimize Resume',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: apna real resume paste karo, target role add karo, aur keywords naturally use karne ke suggestions lo.',
    promptInstructions: [
      'You are an ATS resume optimization assistant for Indian students, freshers, and job seekers.',
      'Do not invent fake degrees, companies, certifications, metrics, or experience. If a detail is missing, improve wording without adding unsupported facts.',
      'Return clean Markdown with exactly these sections: Short Summary, ATS-Friendly Resume Version, Keyword Suggestions, Improvement Notes.',
      'Make the resume version ATS-friendly: simple headings, plain text, clear bullets, action verbs, role-relevant keywords, and readable formatting.',
      'Use a friendly Hinglish tone in notes while keeping the resume content professional English.',
      'Include only practical keyword suggestions relevant to the target job title and optional user keywords.'
    ],
    tips: [
      'Paste your full resume text for best results; PDF formatting is not needed.',
      'Target job title zaroor add karo so keywords role ke according improve ho.',
      'AI suggestions ko final resume me use karne se pehle facts verify kar lo.'
    ],
    fields: [
      {
        key: 'resumeText',
        label: 'Resume Text',
        type: 'textarea',
        placeholder: 'Paste your resume text here: summary, education, skills, projects, internships, achievements...',
        required: true
      },
      {
        key: 'targetJobTitle',
        label: 'Target Job Title',
        type: 'text',
        placeholder: 'e.g. Data Analyst Intern, Frontend Developer Fresher',
        required: true
      },
      {
        key: 'keywords',
        label: 'Optional Keywords',
        type: 'text',
        placeholder: 'e.g. SQL, Excel, React, customer support, communication',
        required: false
      }
    ]
  },

  {
    id: 'job-description-to-resume-tailor',
    title: 'Job Description to Resume Tailor',
    category: 'Career Tool',
    description: 'Paste a job description and get resume keyword match suggestions, missing keywords, tailored summary, and improved bullet wording.',
    metaDescription: 'Free Job Description to Resume Tailor for job seekers. Parse a JD, match resume keywords, find missing keywords, and generate tailored resume summary and bullet improvements.',
    ctaLabel: 'Tailor Resume',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: JD paste karo, apna role/summary aur skills add karo, phir resume ko job ke keywords ke according tailor karo.',
    promptInstructions: [
      'You are a job description parser and resume tailoring assistant for Indian students, freshers, and job seekers.',
      'Do not invent fake experience, companies, certifications, tools, metrics, or achievements. Rewrite only from the user-provided summary/role and skills.',
      'Return clean Markdown with exactly these sections: Keyword Match Suggestions, Missing Keywords, Tailored Summary, Bullet Improvements.',
      'Keyword Match Suggestions must show which provided skills/phrases should be emphasized and where to place them in the resume.',
      'Missing Keywords must identify realistic JD keywords that are not visible in the provided resume summary/role or skills, and mark learn/verify items clearly.',
      'Tailored Summary must be a concise, ATS-friendly resume summary for the target title using truthful wording.',
      'Bullet Improvements must provide 4-6 improved resume bullet examples using action verbs, JD language, and measurable placeholders only when the user should fill real numbers.',
      'Use friendly Hinglish in guidance notes, but keep the tailored summary and bullet wording professional English.'
    ],
    tips: [
      'Full job description paste karne se keyword matching better hoti hai.',
      'Skills list me sirf wahi skills add karo jo aap genuinely know karte ho.',
      'Generated bullets me numbers/placeholders ko apne real results se replace karo.'
    ],
    fields: [
      {
        key: 'jobDescription',
        label: 'Job Description Text (JD paste karo)',
        type: 'textarea',
        placeholder: 'Paste the full job description, responsibilities, required skills, and qualifications here...',
        required: true,
        rows: 8
      },
      {
        key: 'resumeSummaryOrRole',
        label: 'Current Resume Summary / Role',
        type: 'textarea',
        placeholder: 'e.g. Final-year BCA student with projects in React and SQL, looking for frontend developer internships...',
        required: true,
        rows: 4
      },
      {
        key: 'skills',
        label: 'Skills List (comma separated)',
        type: 'text',
        placeholder: 'e.g. React, JavaScript, SQL, Excel, communication, problem solving',
        required: true
      },
      {
        key: 'targetTitle',
        label: 'Target Title',
        type: 'text',
        placeholder: 'e.g. Frontend Developer Intern, Data Analyst Fresher',
        required: true
      }
    ]
  },

  {
    id: 'salary-negotiation-script-generator',
    title: 'Salary Negotiation Script Generator',
    category: 'Career Tool',
    description: 'Generate polite, strong, and short salary negotiation scripts for offer discussions and counter offers.',
    metaDescription: 'Free Salary Negotiation Script Generator for job offers. Create polite scripts, strong counter offer wording, and short WhatsApp or email versions for offer discussion.',
    ctaLabel: 'Generate Scripts',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: offer amount, expected salary, role aur style add karo; script ko apni situation ke hisaab se personalize karke bhejo.',
    promptInstructions: [
      'You are a salary negotiation script assistant for job seekers after receiving a job offer.',
      'Do not guarantee salary increases or provide legal/financial advice. Keep the tone professional, simple, and respectful.',
      'Return clean Markdown with exactly these sections: Polite Script, Strong Script, Short WhatsApp/Email Version.',
      'Use the current offer amount, expected salary, role, experience level, and negotiation style naturally in each script.',
      'Make the polite script appreciative and collaborative, suitable for email or call.',
      'Make the strong script confident but not rude, with clear counter offer wording.',
      'Make the short WhatsApp/email version concise enough for a quick recruiter message.',
      'Include placeholders only for missing details like company name or hiring manager name; do not invent facts.'
    ],
    tips: [
      'Negotiation se pehle offer components like fixed pay, variable pay, joining bonus, and benefits clearly check karo.',
      'Expected salary realistic rakho and apne skills, experience, location, aur market range se justify karo.',
      'Script send karne se pehle company name, recruiter name, and exact numbers verify kar lo.'
    ],
    fields: [
      {
        key: 'currentOfferAmount',
        label: 'Current Offer Amount',
        type: 'text',
        placeholder: 'e.g. ₹4.5 LPA, ₹35,000/month, $70,000/year',
        required: true
      },
      {
        key: 'expectedSalary',
        label: 'Expected Salary',
        type: 'text',
        placeholder: 'e.g. ₹6 LPA, ₹45,000/month, $78,000/year',
        required: true
      },
      {
        key: 'role',
        label: 'Role / Job Title',
        type: 'text',
        placeholder: 'e.g. Software Developer, Marketing Executive, Data Analyst',
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
          { value: '1-3 years', label: '1-3 Years' },
          { value: '3+ years', label: '3+ Years' }
        ]
      },
      {
        key: 'negotiationStyle',
        label: 'Negotiation Style',
        type: 'select',
        required: true,
        options: [
          { value: 'polite', label: 'Polite' },
          { value: 'confident', label: 'Confident' },
          { value: 'data-backed', label: 'Data-backed' },
          { value: 'friendly', label: 'Friendly' }
        ]
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
    id: 'student-study-planner-generator',
    title: 'Student Study Planner Generator',
    category: 'Student Tool',
    description: 'Create a daily, weekly, and monthly exam study plan with clear timetable blocks, subject split, revision, breaks, and consistency tips.',
    metaDescription: 'Free Student Study Planner Generator for study planner, student timetable generator, and exam study plan needs. Build daily, weekly, and monthly plans from subjects, exam date, study hours, and weak topics.',
    ctaLabel: 'Generate Study Planner',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: exact exam date, weak topics, aur realistic daily hours add karo so planner practical rahe.',
    promptInstructions: [
      'You are a practical Student Study Planner Generator for Indian students.',
      'Do not provide generic filler. Use the exact class/stream, subjects, exam date, daily available hours, weak subjects/topics, and study goal from the user.',
      'Create a realistic study planner in student-friendly Hinglish tone. Keep it practical, motivating, and easy to follow.',
      'Use clear Markdown with exactly these sections: Planner Snapshot, Daily Timetable, Weekly Focus Plan, Monthly Roadmap, Subject-wise Split, Revision Blocks, Break Timing Suggestions, Motivation / Consistency Tips.',
      'Daily Timetable must include specific time blocks that fit the available study hours per day and include short breaks.',
      'Weekly Focus Plan must prioritize weak topics without ignoring other subjects.',
      'Monthly Roadmap must adapt to the exam date. If the exam is close, compress the roadmap into remaining days/weeks and state that clearly.',
      'Subject-wise Split must mention approximate time percentage or hours for each subject.',
      'Revision Blocks must include spaced revision, quick tests, and previous-paper/mock-test practice when relevant.',
      'Break Timing Suggestions must be realistic for students and avoid unhealthy all-night plans.',
      'End with 4-6 concise consistency tips in Hinglish.'
    ],
    tips: [
      'Exam date accurate add karo, plan automatically urgency ke according banega.',
      'Weak topics clearly likho so extra revision blocks wahin focus karein.',
      'Daily hours realistic rakho; repeat-use ke liye weekly plan update karte raho.'
    ],
    fields: [
      {
        key: 'classStream',
        label: 'Class / Stream',
        type: 'text',
        placeholder: 'e.g. Class 12 Science / NEET dropper / B.Com 2nd Year',
        required: true
      },
      {
        key: 'subjects',
        label: 'Subjects List',
        type: 'textarea',
        placeholder: 'e.g. Physics, Chemistry, Biology, English',
        required: true,
        rows: 3
      },
      {
        key: 'examDate',
        label: 'Exam Date',
        type: 'date',
        required: true,
        helperText: 'Use your next main exam date so daily, weekly, and monthly planning stays realistic.'
      },
      {
        key: 'hoursPerDay',
        label: 'Available Study Hours Per Day',
        type: 'number',
        placeholder: 'e.g. 4',
        required: true
      },
      {
        key: 'weakTopics',
        label: 'Weak Subjects / Topics',
        type: 'textarea',
        placeholder: 'e.g. Physics numericals, Organic Chemistry, Calculus integration, History dates',
        required: true,
        rows: 3
      },
      {
        key: 'studyGoal',
        label: 'Study Goal',
        type: 'select',
        required: true,
        options: [
          { value: 'revision', label: 'Revision' },
          { value: 'exam-prep', label: 'Exam Prep' },
          { value: 'backlog-cover', label: 'Backlog Cover' }
        ]
      }
    ]
  },

  {
    id: 'lecture-notes-summarizer',
    title: 'Lecture Notes Summarizer',
    category: 'Student Tool',
    description: 'Convert long lecture notes, class notes, or textbook text into a clear summary, key points, definitions, revision bullets, and memory tips.',
    metaDescription: 'Free Lecture Notes Summarizer for lecture notes summarizer, notes to summary, and study notes generator searches. Summarize class notes into revision-friendly study points.',
    ctaLabel: 'Summarize Lecture Notes',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: apne raw lecture notes paste karo; AI concise summary, definitions, aur revision bullets bana dega.',
    promptInstructions: [
      'You are a Lecture Notes Summarizer for students. Convert only the user-provided notes into an accurate, easy-to-revise study summary.',
      'Do not invent facts, examples, formulas, dates, definitions, or textbook details that are not supported by the notes. If something is unclear, mention it as unclear instead of guessing.',
      'Use a student-friendly Hinglish tone for guidance while keeping subject terms accurate.',
      'Follow the selected summary length: short means very concise, medium means balanced, detailed means fuller but still organized.',
      'Follow the selected style: bullet points, paragraph, or exam revision. Exam revision should prioritize scoring points, definitions, likely questions, and quick recall.',
      'Return clean Markdown with exactly these sections: Concise Summary, Key Points, Important Definitions, Revision-Friendly Bullets, Optional Memory Tips.',
      'Concise Summary must preserve the main concept flow and not miss important concepts visible in the notes.',
      'Key Points must list high-value concepts in simple language.',
      'Important Definitions must include terms and meanings found in the notes. If no clear definitions are present, say what terms should be reviewed.',
      'Revision-Friendly Bullets must be quick-to-scan and useful before exams.',
      'Optional Memory Tips should include mnemonics, chunking, or recall tips only when they fit the notes.'
    ],
    tips: [
      'Long lecture notes paste karne se summary zyada accurate hoti hai.',
      'Exam revision style choose karo agar quick test/semester prep karna hai.',
      'Generated summary ko apne class slides ya textbook ke saath once verify kar lo.'
    ],
    fields: [
      {
        key: 'notes',
        label: 'Lecture / Class Notes',
        type: 'textarea',
        placeholder: 'Paste long lecture notes, class notes, or textbook text here...',
        required: true,
        rows: 12
      },
      {
        key: 'summaryLength',
        label: 'Summary Length',
        type: 'select',
        required: true,
        options: [
          { value: 'short', label: 'Short' },
          { value: 'medium', label: 'Medium' },
          { value: 'detailed', label: 'Detailed' }
        ]
      },
      {
        key: 'summaryStyle',
        label: 'Summary Style',
        type: 'select',
        required: true,
        options: [
          { value: 'bullet-points', label: 'Bullet Points' },
          { value: 'paragraph', label: 'Paragraph' },
          { value: 'exam-revision', label: 'Exam Revision' }
        ]
      },
      {
        key: 'subject',
        label: 'Subject (optional)',
        type: 'text',
        placeholder: 'e.g. Biology, Economics, Java, History',
        required: false
      }
    ]
  },

  {
    id: 'flashcard-generator',
    title: 'Flashcard Generator',
    category: 'Student Tool',
    description: 'Generate quick Q&A study flashcards from a topic, lecture notes, or chapter text for daily revision.',
    metaDescription: 'Free Flashcard Generator for study flashcards and notes to flashcards. Turn topic notes or chapter content into concise Q&A cards with memory hints.',
    ctaLabel: 'Generate Flashcards',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: topic aur notes paste karo; AI short Q&A flashcards with memory hints bana dega.',
    promptInstructions: [
      'You are a Flashcard Generator for students. Create revision-friendly Q&A flashcards only from the user-provided topic and notes/chapter text.',
      'Do not invent unsupported facts. If the notes are unclear, keep the flashcard general and grounded in the visible content.',
      'Use student-friendly Hinglish guidance where helpful, but keep questions and answers clear and subject-accurate.',
      'Generate exactly the requested number of flashcards unless the notes are too short; if fewer are possible, say why briefly.',
      'Follow the selected difficulty: easy means basic recall, medium means concept understanding, hard means application or exam-style recall.',
      'Follow output style: simple means direct Q&A, exam revision means scoring/important points, advanced means deeper concept connections.',
      'Return clean Markdown only with a short heading and a numbered list of flashcards.',
      'Each flashcard must include exactly these labels: Question, Answer, Memory Hint.',
      'Questions must be short and direct. Answers must be accurate, concise, and easy to revise.',
      'Memory Hint can be one short mnemonic, keyword cue, formula cue, or recall trick. If no hint fits, write a brief recall cue.'
    ],
    tips: [
      'Best results ke liye chapter notes ya class notes ka important part paste karo.',
      'Exam revision style choose karo jab quick test preparation karni ho.',
      'Generated flashcards ko daily 5-10 minute active recall ke liye use karo.'
    ],
    fields: [
      {
        key: 'topicTitle',
        label: 'Topic / Chapter Title',
        type: 'text',
        placeholder: 'e.g. Photosynthesis, Indian Constitution, Java OOPs',
        required: true
      },
      {
        key: 'notesText',
        label: 'Notes or Chapter Text',
        type: 'textarea',
        placeholder: 'Paste your notes, textbook section, or chapter content here...',
        required: true,
        rows: 10
      },
      {
        key: 'flashcardCount',
        label: 'Number of Flashcards',
        type: 'number',
        placeholder: 'e.g. 10',
        required: true,
        helperText: 'Use 5-20 cards for focused revision.'
      },
      {
        key: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        required: true,
        options: [
          { value: 'easy', label: 'Easy' },
          { value: 'medium', label: 'Medium' },
          { value: 'hard', label: 'Hard' }
        ]
      },
      {
        key: 'outputStyle',
        label: 'Output Style',
        type: 'select',
        required: true,
        options: [
          { value: 'simple', label: 'Simple' },
          { value: 'exam-revision', label: 'Exam Revision' },
          { value: 'advanced', label: 'Advanced' }
        ]
      }
    ]
  },

  {
    id: 'quiz-mcq-generator',
    title: 'Quiz / MCQ Generator',
    category: 'Student Tool',
    description: 'Generate clear MCQ, short-answer, or mixed quiz questions from a topic, notes, or lesson content for study and teaching.',
    metaDescription: 'Free Quiz / MCQ Generator for quiz generator, MCQ generator, and question generator searches. Convert topic notes or lesson content into educational quiz questions with answers and explanations.',
    ctaLabel: 'Generate Quiz',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: topic aur lesson notes paste karo; AI teacher-friendly questions, answers, aur explanations bana dega.',
    promptInstructions: [
      'You are a Quiz / MCQ Generator for students, teachers, and educational creators. Generate quiz questions only from the user-provided topic and notes/lesson text.',
      'Do not invent unsupported facts. If the notes do not contain enough detail, make fewer grounded questions and mention the limitation briefly.',
      'Use a student-friendly Hinglish tone for any guidance, but keep questions, options, correct answers, and explanations clear and subject-accurate.',
      'Generate exactly the requested number of questions when the notes support it.',
      'Follow the selected difficulty: easy = basic recall, medium = concept understanding, hard = application or exam-style reasoning.',
      'Follow the question type selector: MCQ = all questions must have 4 options; short answer = no multiple-choice distractors; mixed = combine MCQ and short answer.',
      'Return clean Markdown only with a short quiz title and a numbered list.',
      'Each question must include exactly these labels: Question, Options, Correct Answer, Short Explanation.',
      'For MCQ questions, Options must include A, B, C, and D with sensible, non-ambiguous distractors and only one correct answer.',
      'For short-answer questions, write Options: N/A (Short Answer) and provide the expected answer under Correct Answer.',
      'Questions must be clear and educational. Explanations must be concise and useful for revision.'
    ],
    tips: [
      'Lesson ke main points paste karoge to MCQs zyada accurate banenge.',
      'Teachers quick class quiz ke liye 5-10 questions choose kar sakte hain.',
      'Students answers hide karke active recall practice kar sakte hain.'
    ],
    fields: [
      {
        key: 'topicSubject',
        label: 'Topic / Subject',
        type: 'text',
        placeholder: 'e.g. Photosynthesis, Indian Polity, Java OOPs, Marketing Basics',
        required: true
      },
      {
        key: 'notesText',
        label: 'Notes or Lesson Text',
        type: 'textarea',
        placeholder: 'Paste notes, lesson content, textbook text, or class material here...',
        required: true,
        rows: 10
      },
      {
        key: 'questionCount',
        label: 'Number of Questions',
        type: 'number',
        placeholder: 'e.g. 10',
        required: true,
        helperText: 'Use 3-25 questions for a focused quiz.'
      },
      {
        key: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        required: true,
        options: [
          { value: 'easy', label: 'Easy' },
          { value: 'medium', label: 'Medium' },
          { value: 'hard', label: 'Hard' }
        ]
      },
      {
        key: 'questionType',
        label: 'Question Type',
        type: 'select',
        required: true,
        options: [
          { value: 'mcq', label: 'MCQ' },
          { value: 'short-answer', label: 'Short Answer' },
          { value: 'mixed', label: 'Mixed' }
        ]
      }
    ]
  },

  {
    id: 'lesson-plan-generator-for-teachers',
    title: 'Lesson Plan Generator for Teachers',
    category: 'Teacher Tool',
    description: 'Create a classroom-ready lesson plan from subject, grade, topic, duration, learning objective, and teaching style.',
    metaDescription: 'Free Lesson Plan Generator for Teachers for lesson plan generator, teacher lesson plan, and class plan generator searches. Build classroom-ready objectives, activities, assessment, homework, and closure.',
    ctaLabel: 'Generate Lesson Plan',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: subject, class, topic, duration, aur objective clear likho so lesson plan classroom-ready aaye.',
    promptInstructions: [
      'You are a Lesson Plan Generator for Teachers. Create a practical, classroom-ready lesson plan only from the teacher-provided inputs.',
      'Use teacher-friendly Hinglish guidance where helpful, but keep the lesson plan clear, professional, and easy to edit.',
      'Adapt the plan to the class/grade, subject, topic, class duration, learning objective, and selected teaching style.',
      'Do not invent curriculum standards or textbook references unless the user provides them.',
      'Return clean Markdown only with exactly these sections: Lesson Objective, Introduction, Teaching Steps, Activity, Assessment, Homework, Closure.',
      'Lesson Objective must be measurable and aligned with the provided learning objective.',
      'Introduction must include a short hook or warm-up suitable for the grade level.',
      'Teaching Steps must be time-boxed and fit within the provided class duration.',
      'Activity must be practical for a normal classroom and match the selected teaching style.',
      'Assessment must include quick checks for understanding such as questions, exit ticket, oral check, worksheet, or mini task.',
      'Homework must be realistic and directly connected to the lesson.',
      'Closure must summarize key learning and give a smooth ending line teachers can use.'
    ],
    tips: [
      'Duration minutes me add karo, jaise 40 ya 60, so time-boxing practical rahe.',
      'Learning objective clear hoga to assessment aur activity better align hogi.',
      'Generated plan ko apne school syllabus aur class level ke according quickly edit kar lo.'
    ],
    fields: [
      {
        key: 'subject',
        label: 'Subject',
        type: 'text',
        placeholder: 'e.g. Science, English, Mathematics, Social Studies',
        required: true
      },
      {
        key: 'classGrade',
        label: 'Class / Grade',
        type: 'text',
        placeholder: 'e.g. Class 6, Grade 10, B.Com 1st Year',
        required: true
      },
      {
        key: 'topic',
        label: 'Topic',
        type: 'text',
        placeholder: 'e.g. Photosynthesis, Fractions, Direct and Indirect Speech',
        required: true
      },
      {
        key: 'classDuration',
        label: 'Class Duration (minutes)',
        type: 'number',
        placeholder: 'e.g. 45',
        required: true,
        helperText: 'Use total teaching time in minutes.'
      },
      {
        key: 'learningObjective',
        label: 'Learning Objective',
        type: 'textarea',
        placeholder: 'e.g. Students will be able to explain photosynthesis and identify raw materials needed for the process.',
        required: true,
        rows: 4
      },
      {
        key: 'teachingStyle',
        label: 'Teaching Style',
        type: 'select',
        required: true,
        options: [
          { value: 'interactive', label: 'Interactive' },
          { value: 'activity-based', label: 'Activity Based' },
          { value: 'lecture-discussion', label: 'Lecture + Discussion' },
          { value: 'blended', label: 'Blended' }
        ]
      }
    ]
  },

  {
    id: 'worksheet-practice-sheet-generator',
    title: 'Worksheet / Practice Sheet Generator',
    category: 'Teacher Tool',
    description: 'Generate printable topic-based worksheets, practice questions, homework sheets, and revision activity sheets for students and teachers.',
    metaDescription: 'Free Worksheet / Practice Sheet Generator for worksheet generator, practice sheet generator, and homework sheet maker searches. Create printable classroom-friendly worksheets with instructions, questions, and answer key.',
    ctaLabel: 'Generate Worksheet',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: subject, class, topic, difficulty, aur worksheet type choose karo; AI printable practice sheet bana dega.',
    promptInstructions: [
      'You are a Worksheet / Practice Sheet Generator for teachers and students. Create a printable, classroom-friendly worksheet from the user inputs.',
      'Use the subject, topic, class/grade, difficulty, worksheet type, and optional question count exactly as provided.',
      'If number of questions is not provided, generate a balanced worksheet with 10 questions.',
      'Do not invent curriculum standards, school names, textbook references, or answer facts that are not appropriate for the provided topic.',
      'Use teacher-friendly Hinglish guidance where helpful, but keep questions and answer key clear, printable, and easy to edit.',
      'Return clean Markdown only with exactly these sections: Worksheet Title, Instructions, Questions, Answer Key.',
      'Worksheet Title must include the subject, topic, class/grade, and worksheet type.',
      'Instructions must be short and classroom-ready, including time guidance if useful.',
      'Questions must match the selected difficulty and worksheet type: practice = skill-building, homework = independent work, revision = exam/recall focused.',
      'Use a mix of question formats when suitable, such as short answer, fill in the blanks, true/false, matching, MCQ, or word problems. Keep every question relevant to the topic.',
      'Answer Key is optional in the user request but should be included by default for teacher/student checking. If a question is open-ended, provide a sample answer or expected points.',
      'Keep the output printable: avoid long paragraphs, use numbering, and make questions clear and non-ambiguous.'
    ],
    tips: [
      'Class/grade clear likho so question level age-appropriate rahe.',
      'Revision worksheet exams ke pehle quick practice ke liye best hai.',
      'Answer key ko print karte time hide/remove kar sakte ho if students ke liye worksheet deni hai.'
    ],
    fields: [
      {
        key: 'subject',
        label: 'Subject',
        type: 'text',
        placeholder: 'e.g. Mathematics, Science, English, Social Studies',
        required: true
      },
      {
        key: 'topic',
        label: 'Topic',
        type: 'text',
        placeholder: 'e.g. Fractions, Photosynthesis, Tenses, Indian Constitution',
        required: true
      },
      {
        key: 'classGrade',
        label: 'Class / Grade',
        type: 'text',
        placeholder: 'e.g. Class 5, Grade 8, B.Com 1st Year',
        required: true
      },
      {
        key: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        required: true,
        options: [
          { value: 'easy', label: 'Easy' },
          { value: 'medium', label: 'Medium' },
          { value: 'hard', label: 'Hard' }
        ]
      },
      {
        key: 'worksheetType',
        label: 'Worksheet Type',
        type: 'select',
        required: true,
        options: [
          { value: 'practice', label: 'Practice' },
          { value: 'homework', label: 'Homework' },
          { value: 'revision', label: 'Revision' }
        ]
      },
      {
        key: 'questionCount',
        label: 'Number of Questions (optional)',
        type: 'number',
        placeholder: 'e.g. 10',
        required: false,
        helperText: 'Leave blank for a balanced 10-question worksheet.'
      }
    ]
  },

  {
    id: 'freelance-proposal-generator',
    title: 'Freelance Proposal Generator',
    category: 'Freelance Tool',
    description: 'Create polished freelance proposals with client-friendly openings, persuasive project fit, detailed approach, and closing CTA.',
    metaDescription: 'Free Freelance Proposal Generator for freelance proposal generator, proposal writer, and client pitch searches. Create polished client proposals from project requirements, role, tone, budget, and timeline.',
    ctaLabel: 'Generate Proposal',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: client ki requirements clearly paste karo; AI professional proposal, opening, aur closing CTA bana dega.',
    promptInstructions: [
      'You are a Freelance Proposal Generator for freelancers pitching client projects.',
      'Create a professional, persuasive proposal from the user-provided project title, optional client name, freelancer role/skill, project requirements, tone, and optional budget/timeline.',
      'Do not invent fake portfolio results, client names, certifications, guarantees, prices, timelines, or experience. Use only user-provided facts and careful placeholders where needed.',
      'Keep the proposal confident but not overly salesy. Address the client needs directly and show understanding of the project.',
      'Use polished freelancer-friendly English with light Hinglish guidance only when helpful.',
      'Return clean Markdown only with exactly these sections: Client-Friendly Opening, Short Proposal, Detailed Proposal, Closing CTA.',
      'Client-Friendly Opening must feel personalized and mention the project/client context naturally.',
      'Short Proposal must be concise and ready for platforms like Upwork, Fiverr, LinkedIn, or email.',
      'Detailed Proposal must include understanding of requirements, approach, deliverables, collaboration style, and budget/timeline note if provided.',
      'Closing CTA must be polite, action-oriented, and easy for the client to respond to.',
      'Avoid hype, pressure tactics, exaggerated claims, and generic filler.'
    ],
    tips: [
      'Requirements jitni specific hongi, proposal utna client-focused banega.',
      'Budget/timeline optional hai, but add karne se proposal more practical lagega.',
      'Generated draft me apna real portfolio link ya samples manually add kar sakte ho.'
    ],
    fields: [
      {
        key: 'projectTitle',
        label: 'Project Title',
        type: 'text',
        placeholder: 'e.g. Shopify store redesign, SEO blog writing, React landing page',
        required: true
      },
      {
        key: 'clientName',
        label: 'Client Name (optional)',
        type: 'text',
        placeholder: 'e.g. Priya, Acme Studio, Hiring Manager',
        required: false
      },
      {
        key: 'freelancerRole',
        label: 'Freelancer Role / Skill',
        type: 'text',
        placeholder: 'e.g. UI/UX Designer, Content Writer, WordPress Developer, Video Editor',
        required: true
      },
      {
        key: 'projectRequirements',
        label: 'Project Requirements',
        type: 'textarea',
        placeholder: 'Paste client brief, required deliverables, target audience, must-have features, problems to solve, or job post details...',
        required: true,
        rows: 8
      },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'friendly', label: 'Friendly' },
          { value: 'confident', label: 'Confident' },
          { value: 'concise', label: 'Concise' }
        ]
      },
      {
        key: 'budgetTimeline',
        label: 'Budget / Timeline (optional)',
        type: 'text',
        placeholder: 'e.g. ₹25,000 in 3 weeks / $500 fixed / 10 days delivery',
        required: false
      }
    ]
  },

  {
    id: 'freelance-rate-card-generator',
    title: 'Freelance Rate Card Generator',
    category: 'Freelance Tool',
    description: 'Build freelancer-friendly rate cards with pricing tiers, hourly or project-based rates, service packages, add-ons, and negotiation buffer suggestions.',
    metaDescription: 'Free Freelance Rate Card Generator for freelance rate card generator, pricing calculator, and service packages searches. Create realistic service pricing tiers, add-ons, and negotiation buffers.',
    ctaLabel: 'Generate Rate Card',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: service, niche, experience, currency, aur rate preference add karo; AI client-friendly pricing packages bana dega.',
    promptInstructions: [
      'You are a Freelance Rate Card Generator for freelancers creating client-facing service packages.',
      'Create realistic but flexible pricing guidance from the user-provided service type, experience level, currency, rate preference, niche, and package count.',
      'Do not promise exact market rates or guaranteed earnings. Make clear that rates are suggested starting points and should be adjusted by market, location, portfolio strength, demand, and client scope.',
      'Use freelancer-friendly and client-friendly language. Keep the output professional, practical, and easy to copy into a PDF, profile, proposal, or website.',
      'Use light Hinglish guidance where helpful, but keep package names, prices, deliverables, and notes clear.',
      'Return clean Markdown only with exactly these sections: Rate Card Snapshot, Starter / Standard / Premium Packages, Rate Justification, Add-on Services, Negotiation Buffer Suggestion.',
      'Starter / Standard / Premium Packages must always include Starter, Standard, and Premium tiers with price/rate, best-for use case, deliverables, timeline or scope note, and revision/support boundary.',
      'If the requested number of packages is more than 3, add extra tiers after Premium, such as Enterprise or Retainer. If it is 3, include only Starter, Standard, and Premium.',
      'Rate Justification must explain pricing logic based on experience level, niche complexity, service value, and rate preference without sounding defensive.',
      'Add-on Services must list relevant optional extras that can increase project value.',
      'Negotiation Buffer Suggestion must suggest a safe buffer percentage or amount, plus a line on when to discount and when not to discount.',
      'Pricing should be realistic, flexible, and not overly inflated. Avoid legal/financial guarantees.'
    ],
    tips: [
      'Starter package simple rakho so clients easily entry-level option choose kar saken.',
      'Premium package me strategy, priority, ya extra revisions jaise value-adds include karo.',
      'Rates final karne se pehle niche, client budget, aur apna portfolio level compare kar lo.'
    ],
    fields: [
      {
        key: 'serviceType',
        label: 'Service Type',
        type: 'text',
        placeholder: 'e.g. Logo design, SEO blog writing, WordPress website, Video editing',
        required: true
      },
      {
        key: 'experienceLevel',
        label: 'Experience Level',
        type: 'select',
        required: true,
        options: [
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'expert', label: 'Expert' }
        ]
      },
      {
        key: 'currency',
        label: 'Currency',
        type: 'select',
        required: true,
        options: [
          { value: 'INR', label: 'INR (₹)' },
          { value: 'USD', label: 'USD ($)' },
          { value: 'EUR', label: 'EUR (€)' },
          { value: 'GBP', label: 'GBP (£)' }
        ]
      },
      {
        key: 'ratePreference',
        label: 'Hourly or Project Rate Preference',
        type: 'select',
        required: true,
        options: [
          { value: 'project-based', label: 'Project Based' },
          { value: 'hourly', label: 'Hourly' },
          { value: 'both', label: 'Both' }
        ]
      },
      {
        key: 'niche',
        label: 'Niche',
        type: 'text',
        placeholder: 'e.g. D2C brands, coaches, restaurants, SaaS startups, local businesses',
        required: true
      },
      {
        key: 'packageCount',
        label: 'Number of Packages',
        type: 'number',
        placeholder: 'e.g. 3',
        required: true,
        helperText: 'Use 3-5 packages. Starter, Standard, and Premium are always included.'
      }
    ]
  },

  {
    id: 'social-media-content-calendar-generator',
    title: 'Social Media Content Calendar Generator',
    category: 'Social Tool',
    description: 'Generate weekly or monthly social media content calendars with day-wise post ideas, hooks, CTAs, themes, and posting schedule.',
    metaDescription: 'Free Social Media Content Calendar Generator for content planner and posting schedule searches. Create weekly or monthly calendars for Instagram, LinkedIn, YouTube, X, or multi-platform content.',
    ctaLabel: 'Generate Content Calendar',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: platform, niche, goal, frequency, tone, aur duration choose karo; AI practical content calendar bana dega.',
    promptInstructions: [
      'You are a Social Media Content Calendar Generator for creators, small businesses, and students.',
      'Create a practical weekly or monthly content calendar from the user-provided platform, niche/topic, content goal, posting frequency, tone, and duration.',
      'Do not invent brand facts, claims, offers, statistics, events, or guarantees. Keep ideas executable and adaptable.',
      'Use creator-friendly Hinglish guidance where helpful, but keep the calendar clear, professional, and easy to copy into a planner.',
      'Return clean Markdown only with exactly these sections: Calendar Snapshot, Day-wise Content Plan, Theme Ideas, Execution Tips.',
      'Calendar Snapshot must summarize platform, niche/topic, content goal, posting frequency, tone, and duration.',
      'Day-wise Content Plan must be organized by day or week depending on duration and posting frequency.',
      'Each planned post must include: Day/Date Placeholder, Post Type, Hook/Angle, CTA, and Notes.',
      'Post Type must fit the selected platform: reels/carousels/stories for Instagram, posts/documents for LinkedIn, videos/shorts/community for YouTube, threads/posts for X, or adapted formats for multi-platform.',
      'Theme Ideas must include recurring content pillars or weekly themes that support repeat use.',
      'Execution Tips must be concise and practical: batching, repurposing, captions, visuals, and review rhythm.',
      'Keep the plan realistic for the chosen posting frequency and avoid overwhelming the creator.'
    ],
    tips: [
      'Monthly duration choose karne par content pillars repeatable bante hain.',
      'Posting frequency realistic rakho so calendar execute ho sake.',
      'Multi-platform plan ko same idea ke adapted formats me reuse kar sakte ho.'
    ],
    fields: [
      {
        key: 'platform',
        label: 'Platform',
        type: 'select',
        required: true,
        options: [
          { value: 'instagram', label: 'Instagram' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'youtube', label: 'YouTube' },
          { value: 'x', label: 'X' },
          { value: 'multi-platform', label: 'Multi-platform' }
        ]
      },
      {
        key: 'nicheTopic',
        label: 'Niche / Topic',
        type: 'text',
        placeholder: 'e.g. fitness for beginners, student productivity, home bakery, personal finance',
        required: true
      },
      {
        key: 'contentGoal',
        label: 'Content Goal',
        type: 'select',
        required: true,
        options: [
          { value: 'growth', label: 'Growth' },
          { value: 'engagement', label: 'Engagement' },
          { value: 'education', label: 'Education' },
          { value: 'sales-leads', label: 'Sales / Leads' },
          { value: 'personal-branding', label: 'Personal Branding' }
        ]
      },
      {
        key: 'postingFrequency',
        label: 'Posting Frequency',
        type: 'select',
        required: true,
        options: [
          { value: '3-posts-week', label: '3 posts / week' },
          { value: '5-posts-week', label: '5 posts / week' },
          { value: 'daily', label: 'Daily' },
          { value: '2-posts-day', label: '2 posts / day' }
        ]
      },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'friendly', label: 'Friendly' },
          { value: 'educational', label: 'Educational' },
          { value: 'professional', label: 'Professional' },
          { value: 'witty', label: 'Witty' },
          { value: 'inspirational', label: 'Inspirational' }
        ]
      },
      {
        key: 'duration',
        label: 'Month / Week Duration',
        type: 'select',
        required: true,
        options: [
          { value: '1-week', label: '1 Week' },
          { value: '2-weeks', label: '2 Weeks' },
          { value: '1-month', label: '1 Month' }
        ]
      }
    ]
  },

  {
    id: 'reel-shorts-hook-generator',
    title: 'Reel / Shorts Hook Generator',
    category: 'Social Tool',
    description: 'Generate scroll-stopping hooks, opener variants, CTA lines, and caption openers for Instagram Reels, YouTube Shorts, and short-form videos.',
    metaDescription: 'Free Reel / Shorts Hook Generator for reel hook generator, shorts hook generator, and viral hook ideas searches. Create sharp hooks, opener variants, CTAs, and caption openers for short-form content.',
    ctaLabel: 'Generate Hooks',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: platform, niche, topic, audience, hook style, aur hook count add karo; AI sharp scroll-stopping hooks bana dega.',
    promptInstructions: [
      'You are a Reel / Shorts Hook Generator for creators making short-form videos.',
      'Create platform-appropriate hooks from the user-provided platform, content niche, video topic, audience type, hook style, and number of hooks.',
      'Do not invent fake results, statistics, claims, controversy, or clickbait that the creator cannot support. Hooks can be bold, but they must stay truthful and usable.',
      'Use creator-friendly Hinglish guidance where helpful, but keep hooks crisp, direct, and ready to say on camera.',
      'Return clean Markdown only with exactly these sections: Hook Options, Short Opener Variants, CTA Lines, Caption Opener.',
      'Hook Options must include the requested number of hooks. Each hook should be short, scroll-stopping, and suitable for the selected platform.',
      'Short Opener Variants must include 3-5 ultra-short first-line alternatives that can be spoken in the first 1-2 seconds.',
      'CTA Lines must include optional CTAs that match the audience and goal without sounding spammy.',
      'Caption Opener must include 2-3 first lines for captions that reinforce the video hook.',
      'Follow the selected hook style: curiosity, problem-solution, bold, emotional, or educational.',
      'Make hooks creator-friendly, repeat-use friendly, and easy to adapt for Instagram Reels, YouTube Shorts, or multi-platform short-form content.'
    ],
    tips: [
      'Best hook first 1-2 seconds me clear curiosity ya problem create karta hai.',
      'Bold hook use karte time claim ko truthful aur provable rakho.',
      'Regenerate karke multiple angles test karo: curiosity, problem-solution, aur educational.'
    ],
    fields: [
      {
        key: 'platform',
        label: 'Platform',
        type: 'select',
        required: true,
        options: [
          { value: 'instagram-reels', label: 'Instagram Reels' },
          { value: 'youtube-shorts', label: 'YouTube Shorts' },
          { value: 'both', label: 'Reels + Shorts' },
          { value: 'tiktok-reels', label: 'TikTok / Reels' }
        ]
      },
      {
        key: 'contentNiche',
        label: 'Content Niche',
        type: 'text',
        placeholder: 'e.g. fitness, study tips, finance, beauty, freelancing, food business',
        required: true
      },
      {
        key: 'videoTopic',
        label: 'Video Topic',
        type: 'textarea',
        placeholder: 'e.g. 5 mistakes beginners make while learning coding / How to price freelance design projects',
        required: true,
        rows: 4
      },
      {
        key: 'audienceType',
        label: 'Audience Type',
        type: 'text',
        placeholder: 'e.g. college students, beginner freelancers, busy parents, small business owners',
        required: true
      },
      {
        key: 'hookStyle',
        label: 'Hook Style',
        type: 'select',
        required: true,
        options: [
          { value: 'curiosity', label: 'Curiosity' },
          { value: 'problem-solution', label: 'Problem-Solution' },
          { value: 'bold', label: 'Bold' },
          { value: 'emotional', label: 'Emotional' },
          { value: 'educational', label: 'Educational' }
        ]
      },
      {
        key: 'hookCount',
        label: 'Number of Hooks',
        type: 'number',
        placeholder: 'e.g. 10',
        required: true,
        helperText: 'Use 5-25 hooks for quick testing and iteration.'
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
    id: 'cold-dm-outreach-message-generator',
    title: 'Cold DM / Outreach Message Generator',
    category: 'Writing Tool',
    description: 'Generate professional cold DM and outreach messages for LinkedIn, Instagram, email, and WhatsApp.',
    metaDescription: 'Free Cold DM Generator and outreach message generator for LinkedIn DM, Instagram, email, and WhatsApp. Create short DMs, polite follow-ups, and first-line suggestions.',
    ctaLabel: 'Generate Outreach',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: platform, recipient role, purpose aur value clear likho; message short, specific aur non-spammy rakho.',
    promptInstructions: [
      'You are a cold DM and outreach message assistant for students, freshers, creators, freelancers, and job seekers.',
      'Do not invent personal details, achievements, offers, prices, or relationships. Use only the provided context/value and placeholders for missing names.',
      'Return clean Markdown with exactly these sections: Short DM, Polite Follow-up Version, Subject Line / First Line Suggestions.',
      'Short DM must be platform-appropriate, concise, specific, and easy to copy.',
      'Polite Follow-up Version must be respectful, non-pushy, and suitable if there is no response after a few days.',
      'Subject Line / First Line Suggestions must include 3 options; for email include subject lines, and for LinkedIn/Instagram/WhatsApp include first-line hooks.',
      'Use the selected platform, recipient role, purpose, tone, and context/value naturally.',
      'Keep the outreach professional, simple, Hinglish-friendly, and avoid spammy or overly salesy wording.'
    ],
    tips: [
      'Recipient ko generic spam jaisa message mat bhejo; one specific reason add karo.',
      'Value/offer ko clear rakho: help, collaboration, portfolio, service, referral, ya quick question.',
      'Follow-up usually 3-5 days baad bhejo and pressure create mat karo.'
    ],
    fields: [
      {
        key: 'platform',
        label: 'Platform Select Karo',
        type: 'select',
        required: true,
        options: [
          { value: 'linkedin', label: 'LinkedIn DM' },
          { value: 'instagram', label: 'Instagram DM' },
          { value: 'email', label: 'Email' },
          { value: 'whatsapp', label: 'WhatsApp' }
        ]
      },
      {
        key: 'recipientRole',
        label: 'Recipient Role',
        type: 'text',
        placeholder: 'e.g. Recruiter, Founder, Creator, Marketing Manager, Alumni',
        required: true
      },
      {
        key: 'purpose',
        label: 'Purpose / Goal',
        type: 'text',
        placeholder: 'e.g. ask for internship referral, pitch design service, request collaboration',
        required: true
      },
      {
        key: 'tone',
        label: 'Tone',
        type: 'select',
        required: true,
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'friendly', label: 'Friendly' },
          { value: 'polite', label: 'Polite' },
          { value: 'confident', label: 'Confident' }
        ]
      },
      {
        key: 'contextValue',
        label: 'Context / Offer Value',
        type: 'textarea',
        placeholder: 'e.g. I built two React projects and can share my portfolio; I can help improve landing page conversions; I liked their recent post...',
        required: true,
        rows: 4
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
    id: 'project-idea-generator-students-freshers',
    title: 'Project Idea Generator for Students/Freshers',
    category: 'Career Tool',
    description: 'Generate practical student and fresher project ideas based on your stream, skills, career goal, and difficulty level.',
    metaDescription: 'Free Project Idea Generator for students and freshers. Get student project ideas, fresher projects, beginner and advanced variants, tech stack suggestions, and resume value notes.',
    ctaLabel: 'Generate Ideas',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: stream, skills, career goal aur difficulty clear add karo so ideas practical, resume-ready aur buildable rahen.',
    promptInstructions: [
      'You are a project idea mentor for students, freshers, and job seekers building portfolio-ready projects.',
      'Do not provide demo/static ideas unrelated to the user inputs. Tailor ideas to stream/domain, skill set, experience level, target career, and difficulty.',
      'Return clean Markdown with exactly these sections: Project Ideas, Beginner vs Advanced Variants, Tools/Tech Stack Suggestions, Resume Value Note.',
      'Project Ideas must include 5-10 practical ideas with a one-line problem statement and expected output for each idea.',
      'Beginner vs Advanced Variants must show how to simplify or upgrade the ideas based on the selected difficulty.',
      'Tools/Tech Stack Suggestions must recommend realistic tools, libraries, datasets, platforms, or no-code options where relevant.',
      'Resume Value Note must explain how the selected projects can be described on a fresher resume or portfolio.',
      'Keep the tone simple, encouraging, and Hinglish-friendly while keeping project names and resume wording professional.'
    ],
    tips: [
      'Apne current skills honestly add karo so project scope manageable rahe.',
      'Resume value ke liye project me problem, tech stack, outcome, and demo link clearly document karo.',
      'Beginner ho to mini project start karo; advanced ho to real dataset, users, auth, analytics, or deployment add karo.'
    ],
    fields: [
      {
        key: 'streamDomain',
        label: 'Stream / Domain',
        type: 'text',
        placeholder: 'e.g. Computer Science, BCom, Data Analytics, Digital Marketing, Mechanical, UI/UX',
        required: true
      },
      {
        key: 'skillSet',
        label: 'Skill Set',
        type: 'textarea',
        placeholder: 'e.g. HTML, CSS, JavaScript, Excel, SQL, Canva, Python basics, communication',
        required: true,
        rows: 4
      },
      {
        key: 'experienceLevel',
        label: 'Experience Level',
        type: 'select',
        required: true,
        options: [
          { value: 'beginner', label: 'Beginner' },
          { value: 'college-student', label: 'College Student' },
          { value: 'fresher', label: 'Fresher' },
          { value: 'internship-ready', label: 'Internship Ready' }
        ]
      },
      {
        key: 'targetCareer',
        label: 'Target Career',
        type: 'text',
        placeholder: 'e.g. Frontend Developer, Data Analyst, HR, Digital Marketer, Product Manager',
        required: true
      },
      {
        key: 'projectDifficulty',
        label: 'Project Difficulty',
        type: 'select',
        required: true,
        options: [
          { value: 'easy', label: 'Easy' },
          { value: 'medium', label: 'Medium' },
          { value: 'advanced', label: 'Advanced' },
          { value: 'mixed', label: 'Mixed Ideas' }
        ]
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
    id: 'follow-up-email-generator',
    title: 'Follow-up Email Generator',
    category: 'Writing Tool',
    description: 'Generate interview follow-up, application follow-up, and no-response follow-up emails with subject line ideas.',
    metaDescription: 'Free Follow-up Email Generator for interview follow up, application follow up, and no-response emails. Generate full emails, short versions, and subject line suggestions.',
    ctaLabel: 'Generate Follow-up',
    outputType: 'text',
    enableGenerateMore: true,
    helperText: 'Hinglish tip: follow-up type, company/recipient, role aur last interaction date add karo; polite email instantly ready ho jayega.',
    promptInstructions: [
      'You are a follow-up email writing assistant for students, freshers, and job seekers.',
      'Do not invent interview details, recruiter names, selection status, or promises. Use placeholders only for missing names or details.',
      'Return clean Markdown with exactly these sections: Subject Line Suggestions, Full Email, Short Version.',
      'Subject Line Suggestions must include 3 concise, professional subject lines.',
      'Full Email must be polished, respectful, and suitable for the selected follow-up type: interview follow-up, application follow-up, or no-response follow-up.',
      'Short Version must be concise enough for a quick email or LinkedIn message while remaining professional.',
      'Use the recipient/company, role, last interaction date, and tone naturally.',
      'Keep language simple, professional, and Hinglish-friendly in guidance, but write the actual email in polished English.'
    ],
    tips: [
      'Interview ke baad usually 24-48 hours me thank-you/follow-up bhejna helpful hota hai.',
      'Application follow-up ke liye 5-7 working days wait karna professional lagta hai.',
      'Final email send karne se pehle role, company, date, and recipient name verify kar lo.'
    ],
    fields: [
      {
        key: 'followUpType',
        label: 'Follow-up Type',
        type: 'select',
        required: true,
        options: [
          { value: 'interview-follow-up', label: 'Interview Follow-up' },
          { value: 'application-follow-up', label: 'Application Follow-up' },
          { value: 'no-response-follow-up', label: 'No-response Follow-up' }
        ]
      },
      {
        key: 'recipientCompany',
        label: 'Recipient / Company',
        type: 'text',
        placeholder: 'e.g. Hiring Manager at Acme, Ms. Sharma, ABC Technologies',
        required: true
      },
      {
        key: 'role',
        label: 'Role / Position',
        type: 'text',
        placeholder: 'e.g. Frontend Developer Intern, Data Analyst Fresher',
        required: true
      },
      {
        key: 'lastInteractionDate',
        label: 'Last Interaction Date',
        type: 'text',
        placeholder: 'e.g. 5 May 2026, last Monday, 3 days ago',
        required: true
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
