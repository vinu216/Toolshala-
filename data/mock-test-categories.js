window.mockTestData = (() => {
  const createExam = (slug, title, category, difficulty = 'Intermediate', duration = 60, questions = 50) => ({
    slug,
    title,
    category,
    description: `${title} focused MCQ practice for ${category.toLowerCase()}.`,
    practiceIntro: `Build confidence in ${title} with targeted topic-wise and full-length sets.`,
    difficulty,
    questionsCount: questions,
    duration: `${duration} min`,
    ctaText: 'Start Mock Test',
    ctaLink: `./exam.html?exam=${slug}`
  });

  const exams = {
    bstc: createExam('bstc', 'BSTC', 'Teaching Exams', 'Beginner', 45, 40),
    ptet: createExam('ptet', 'PTET', 'Teaching Exams'),
    reet: createExam('reet', 'REET', 'Teaching Exams'),
    ctet: createExam('ctet', 'CTET', 'Teaching Exams'),
    '3rd-grade': createExam('3rd-grade', '3rd GRADE', 'Teaching Exams'),
    '2nd-grade': createExam('2nd-grade', '2nd Grade', 'Teaching Exams', 'Advanced', 75, 60),
    '1st-grade': createExam('1st-grade', '1st Grade', 'Teaching Exams', 'Advanced', 90, 75),
    kvs: createExam('kvs', 'KVs', 'Teaching Exams'), dsssb: createExam('dsssb', 'DSSSB', 'Teaching Exams'), pti: createExam('pti', 'PTI', 'Teaching Exams', 'Beginner', 45, 40),
    'assistant-professor': createExam('assistant-professor', 'Assistant Professor', 'Teaching Exams', 'Advanced', 90, 75),
    ras: createExam('ras', 'RAS', 'Rajasthan Govt Exams', 'Advanced', 90, 75), 'sub-inspector': createExam('sub-inspector', 'Sub Inspector', 'Rajasthan Govt Exams'),
    constable: createExam('constable', 'Constable', 'Rajasthan Govt Exams', 'Beginner', 45, 40), 'cet-12th': createExam('cet-12th', 'CET 12th', 'Rajasthan Govt Exams', 'Beginner', 45, 40),
    'cet-graduation': createExam('cet-graduation', 'CET Graduation', 'Rajasthan Govt Exams'), vdo: createExam('vdo', 'VDO', 'Rajasthan Govt Exams'), patwar: createExam('patwar', 'Patwar', 'Rajasthan Govt Exams'),
    'jail-prahari': createExam('jail-prahari', 'Jail Prahari', 'Rajasthan Govt Exams', 'Beginner', 45, 40), 'lab-assistant': createExam('lab-assistant', 'Lab Assistant', 'Rajasthan Govt Exams', 'Beginner', 45, 40),
    'woman-supervisor': createExam('woman-supervisor', 'Woman Supervisor', 'Rajasthan Govt Exams'), librarian: createExam('librarian', 'Librarian', 'Rajasthan Govt Exams'),
    stenographer: createExam('stenographer', 'Stenographer', 'Rajasthan Govt Exams', 'Beginner', 45, 40), ldc: createExam('ldc', 'LDC', 'Rajasthan Govt Exams', 'Beginner', 45, 40),
    'ssc-cgl': createExam('ssc-cgl', 'SSC CGL', 'Central Govt Exams'), 'ssc-gd': createExam('ssc-gd', 'SSC GD (Constable)', 'Central Govt Exams', 'Beginner', 45, 40),
    'delhi-police': createExam('delhi-police', 'Delhi Police', 'Central Govt Exams'), 'ssc-chsl': createExam('ssc-chsl', 'SSC CHSL', 'Central Govt Exams'), mts: createExam('mts', 'MTS', 'Central Govt Exams', 'Beginner', 45, 40),
    ntpc: createExam('ntpc', 'NTPC', 'Central Govt Exams'), 'technician-grade-3': createExam('technician-grade-3', 'Technician Grade 3', 'Central Govt Exams'), 'technician-grade-1': createExam('technician-grade-1', 'Technician Grade 1', 'Central Govt Exams'),
    'crpf-constable': createExam('crpf-constable', 'CRPF Constable', 'Central Govt Exams'), army: createExam('army', 'Army', 'Central Govt Exams'), nda: createExam('nda', 'NDA', 'Central Govt Exams'),
    'airforce-x': createExam('airforce-x', 'Airforce X', 'Central Govt Exams'), 'airforce-y': createExam('airforce-y', 'Airforce Y', 'Central Govt Exams'), 'airforce-x-y': createExam('airforce-x-y', 'Airforce X and Y', 'Central Govt Exams'),
    'eo-ro': createExam('eo-ro', 'EO & RO', 'Civil Services Exams'), uppcs: createExam('uppcs', 'UPPCS', 'Civil Services Exams'), 'ro-aro': createExam('ro-aro', 'RO & ARO', 'Civil Services Exams'),
    bpsc: createExam('bpsc', 'BPSC', 'Civil Services Exams'), upsc: createExam('upsc', 'UPSC', 'Civil Services Exams', 'Advanced', 120, 100), ncert: createExam('ncert', 'NCERT', 'Civil Services Exams', 'Beginner', 30, 30),
    'norcet-11': createExam('norcet-11', 'NORCET 11', 'Nursing Exams'), 'norcet-12': createExam('norcet-12', 'NORCET 12', 'Nursing Exams'), rrb: createExam('rrb', 'RRB', 'Nursing Exams'),
    'rajasthan-staff-nurse': createExam('rajasthan-staff-nurse', 'Rajasthan Staff Nurse', 'Nursing Exams'), 'aiims-cre': createExam('aiims-cre', 'AIIMS-CRE', 'Nursing Exams'), 'ssc-nursing-officer': createExam('ssc-nursing-officer', 'SSC Nursing Officer', 'Nursing Exams'),
    'class-6': createExam('class-6', 'Class 6th', 'School Test', 'Beginner', 30, 30), 'class-7': createExam('class-7', 'Class 7th', 'School Test', 'Beginner', 30, 30), 'class-8': createExam('class-8', 'Class 8th', 'School Test', 'Beginner', 30, 30),
    'class-9': createExam('class-9', 'Class 9th', 'School Test', 'Beginner', 30, 30), 'class-10': createExam('class-10', 'Class 10th', 'School Test', 'Intermediate', 45, 40), 'class-11-arts': createExam('class-11-arts', 'Class 11th Arts', 'School Test'),
    'class-12-arts': createExam('class-12-arts', 'Class 12th Arts', 'School Test'), 'class-11-science': createExam('class-11-science', 'Class 11th Science', 'School Test'), 'class-12-science': createExam('class-12-science', 'Class 12th Science', 'School Test'), 'class-11-commerce': createExam('class-11-commerce', 'Class 11th Commerce', 'School Test'), 'class-12-commerce': createExam('class-12-commerce', 'Class 12th Commerce', 'School Test'),
    'up-sub-inspector': createExam('up-sub-inspector', 'UP Sub Inspector', 'Other State Govt Exams'), 'up-constable': createExam('up-constable', 'UP Constable', 'Other State Govt Exams', 'Beginner', 45, 40), 'up-home-guard': createExam('up-home-guard', 'UP Home Guard', 'Other State Govt Exams', 'Beginner', 45, 40),
    'high-court-ro-aro': createExam('high-court-ro-aro', 'High Court RO/ARO', 'Other State Govt Exams'), 'high-court-group-c-d': createExam('high-court-group-c-d', 'High Court Group C & D', 'Other State Govt Exams'), 'forest-guard': createExam('forest-guard', 'Forest Guard', 'Other State Govt Exams'), 'up-vdo': createExam('up-vdo', 'UP VDO', 'Other State Govt Exams'),
    'rssb-teaching-associate': createExam('rssb-teaching-associate', 'RSSB Teaching Associate', 'Agriculture Exams'), jet: createExam('jet', 'JET', 'Agriculture Exams'), 'agriculture-supervisor': createExam('agriculture-supervisor', 'Agriculture Supervisor', 'Agriculture Exams'), 'veterinary-officer': createExam('veterinary-officer', 'Veterinary Officer', 'Agriculture Exams'), 'pashu-parichar': createExam('pashu-parichar', 'Pashu Parichar', 'Agriculture Exams'), 'food-safety-officer': createExam('food-safety-officer', 'Food Safety Officer', 'Agriculture Exams'), 'grade-1-school-lecturer': createExam('grade-1-school-lecturer', 'Grade 1st School Lecturer', 'Agriculture Exams'), 'cuet-ug-agriculture': createExam('cuet-ug-agriculture', 'CUET UG Agriculture', 'Agriculture Exams'),
    'jee-11': createExam('jee-11', 'JEE Main & Advanced Class 11', 'College Entrance Exams', 'Advanced', 90, 75), 'jee-12': createExam('jee-12', 'JEE Main & Advanced Class 12', 'College Entrance Exams', 'Advanced', 120, 90), 'neet-11': createExam('neet-11', 'NEET UG Class 11', 'College Entrance Exams', 'Advanced', 90, 75), 'neet-12': createExam('neet-12', 'NEET UG Class 12', 'College Entrance Exams', 'Advanced', 120, 90),
    'state-judicial-services': createExam('state-judicial-services', 'State Judicial Services', 'Miscellaneous Exams'), 'ssc-je': createExam('ssc-je', 'SSC JE', 'Miscellaneous Exams'), 'rssb-je': createExam('rssb-je', 'RSSB JE', 'Miscellaneous Exams'), 'rpsc-ae': createExam('rpsc-ae', 'RPSC AE', 'Miscellaneous Exams'), reasoning: createExam('reasoning', 'Reasoning', 'Miscellaneous Exams'), mathematics: createExam('mathematics', 'Mathematics', 'Miscellaneous Exams'), 'general-hindi': createExam('general-hindi', 'General Hindi', 'Miscellaneous Exams'), 'general-english': createExam('general-english', 'General English', 'Miscellaneous Exams'), 'computer-knowledge': createExam('computer-knowledge', 'Computer Knowledge', 'Miscellaneous Exams'), history: createExam('history', 'History', 'Miscellaneous Exams'), geography: createExam('geography', 'Geography', 'Miscellaneous Exams'), psychology: createExam('psychology', 'Psychology', 'Miscellaneous Exams'), pedagogy: createExam('pedagogy', 'Pedagogy', 'Miscellaneous Exams'), 'teaching-methods': createExam('teaching-methods', 'Teaching Methods', 'Miscellaneous Exams')
  };

  const categories = [
    { slug: 'teaching-exams', title: 'Teaching Exams', description: 'Practice teaching-focused exams with pedagogy and subject coverage.', exams: ['bstc','ptet','reet','ctet','3rd-grade','2nd-grade','1st-grade','kvs','dsssb','pti','assistant-professor'] },
    { slug: 'rajasthan-govt-exams', title: 'Rajasthan Govt Exams', description: 'State-level mock tests for key Rajasthan recruitment exams.', exams: ['ras','sub-inspector','constable','cet-12th','cet-graduation','vdo','patwar','jail-prahari','lab-assistant','woman-supervisor','librarian','stenographer','ldc'] },
    { slug: 'central-govt-exams', title: 'Central Govt Exams', description: 'Prepare for central recruitments with structured mock tests.', exams: ['ssc-cgl','ssc-gd','delhi-police','ssc-chsl','mts','ntpc','technician-grade-3','technician-grade-1','crpf-constable','army','nda','airforce-x','airforce-y','airforce-x-y'] },
    { slug: 'civil-services-exams', title: 'Civil Services Exams', description: 'Civil services prelims-oriented practice and revision mocks.', exams: ['ras','eo-ro','uppcs','ro-aro','bpsc','upsc','ncert'] },
    { slug: 'nursing-exams', title: 'Nursing Exams', description: 'Targeted nursing recruitment and entrance mock tests.', exams: ['norcet-11','norcet-12','rrb','rajasthan-staff-nurse','dsssb','aiims-cre','ssc-nursing-officer'] },
    { slug: 'school-test', title: 'School Test', description: 'Class-wise practice tests for school-level preparation.', exams: ['class-6','class-7','class-8','class-9','class-10','class-11-arts','class-12-arts','class-11-science','class-12-science','class-11-commerce','class-12-commerce'] },
    { slug: 'other-state-govt-exams', title: 'Other State Govt Exams', description: 'Mock tests for state-level exams beyond Rajasthan.', exams: ['up-sub-inspector','up-constable','up-home-guard','high-court-ro-aro','high-court-group-c-d','forest-guard','up-vdo'] },
    { slug: 'agriculture-exams', title: 'Agriculture Exams', description: 'Agriculture and allied sector mock tests for aspirants.', exams: ['rssb-teaching-associate','jet','agriculture-supervisor','veterinary-officer','pashu-parichar','food-safety-officer','grade-1-school-lecturer','cuet-ug-agriculture'] },
    { slug: 'college-entrance-exams', title: 'College Entrance Exams', description: 'Exam practice for engineering and medical entrance pathways.', exams: ['jee-11','jee-12','neet-11','neet-12'] },
    { slug: 'miscellaneous-exams', title: 'Miscellaneous Exams', description: 'Additional topic-based and specialized exam practice tracks.', exams: ['state-judicial-services','ssc-je','rssb-je','rpsc-ae','reasoning','mathematics','general-hindi','general-english','computer-knowledge','history','geography','psychology','pedagogy','teaching-methods'] }
  ].map((category) => ({ ...category, featuredCount: category.exams.length, ctaText: 'Explore Category', ctaLink: `./mock-test/${category.slug}.html` }));

  return { exams, categories };
})();
