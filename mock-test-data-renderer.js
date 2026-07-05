(function () {
  const data = window.mockTestData;
  if (!data) return;

  const SITE_ORIGIN = 'https://toolshala.in';
  const setSeoMetaContent = (selector, value) => {
    if (!value) return;
    const node = document.querySelector(selector);
    if (node) node.setAttribute('content', value);
  };
  const setCanonicalUrl = (absoluteUrl) => {
    if (!absoluteUrl) return;
    let canonicalNode = document.querySelector('link[rel="canonical"]');
    if (!canonicalNode) {
      canonicalNode = document.createElement('link');
      canonicalNode.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalNode);
    }
    canonicalNode.setAttribute('href', absoluteUrl);
    setSeoMetaContent('meta[property="og:url"]', absoluteUrl);
  };
  const teachingExamHighlights = {
    bstc: 'BSTC aspirants ke liye foundational pedagogy + Rajasthan-focused MCQ practice sets.',
    ptet: 'PTET ke liye teaching aptitude, reasoning aur exam pattern based mock practice.',
    reet: 'REET level-1/2 pattern aligned pedagogy aur subject-mix practice tests.',
    ctet: 'CTET paper-wise practice with classroom pedagogy and child development topics.',
    kvs: 'KVS recruitment style teaching + aptitude mock tests for better score confidence.',
    dsssb: 'DSSSB teaching posts ke liye targeted section-wise and full-length practice.',
    '2nd-grade': '2nd Grade teacher exam pattern ke saath high-yield revision mock tests.',
    '3rd-grade': '3rd Grade recruitment prep ke liye easy-to-start progressive mocks.',
    '1st-grade': '1st Grade lecturer level depth ke liye advanced mock-test sequence.',
    pti: 'PTI teaching eligibility prep with sports-education and aptitude oriented MCQs.',
    'assistant-professor': 'Assistant Professor level conceptual + objective exam simulation practice.'
  };
  const rajasthanExamHighlights = {
    ras: 'RAS prelims-focused mock tests with GS coverage, reasoning, and exam-time strategy.',
    'sub-inspector': 'Sub Inspector prep ke liye reasoning, law-order basics aur mixed-practice sets.',
    'cet-12th': 'CET 12th level ke liye foundational aptitude + Rajasthan-specific mock practice.',
    'cet-graduation': 'CET Graduation aspirants ke liye balanced aptitude, GK, and speed practice.',
    vdo: 'VDO exam pattern aligned village administration + aptitude oriented mock tests.',
    patwar: 'Patwar preparation ke liye Rajasthan GK, math, and practical objective practice.',
    'jail-prahari': 'Jail Prahari recruitment style scoring mock tests for consistent practice flow.',
    'lab-assistant': 'Lab Assistant exams ke liye topic-wise and full-length mixed mock tests.',
    'woman-supervisor': 'Woman Supervisor role focused section-wise and full exam simulation mocks.',
    librarian: 'Librarian recruitment pattern ke according objective practice and revision support.',
    stenographer: 'Stenographer exam practice with aptitude and role-focused objective coverage.',
    ldc: 'LDC exams ke liye speed, accuracy aur repeated practice-ready mock sets.',
    constable: 'Constable recruitment ke liye level-based MCQ practice and timed test flow.'
  };
  const centralExamHighlights = {
    'ssc-cgl': 'SSC CGL ke liye tier-wise aptitude, reasoning, English aur GK aligned practice mocks.',
    'ssc-gd': 'SSC GD aspirants ke liye constable recruitment pattern based speed-focused mock tests.',
    'delhi-police': 'Delhi Police exam-oriented practice with mixed-difficulty objective question sets.',
    'ssc-chsl': 'SSC CHSL prep ke liye section-balanced mock tests and progressive revision practice.',
    mts: 'MTS exams ke liye straightforward mock flow for accuracy and question selection speed.',
    ntpc: 'NTPC recruitment focused mock tests with aptitude and logic-oriented practice coverage.',
    'technician-grade-3': 'Technician Grade 3 candidates ke liye level-based exam simulation practice.',
    'technician-grade-1': 'Technician Grade 1 preparation with structured mixed-topic mock questions.',
    'crpf-constable': 'CRPF Constable prep ke liye role-specific objective and timed practice support.',
    army: 'Army recruitment style practice tests with foundational aptitude and general awareness.',
    nda: 'NDA-oriented mock practice for speed, precision, and exam confidence building.',
    'airforce-x': 'Airforce X group pattern-focused objective mock tests for consistent preparation.',
    'airforce-y': 'Airforce Y group exam practice with balanced and accessible question coverage.',
    'airforce-x-y': 'Combined Airforce X & Y preparation path with broad mock test exposure.'
  };
  const civilExamHighlights = {
    upsc: 'UPSC aspirants ke liye prelims-focused GS, CSAT and current-affairs aligned mock tests.',
    bpsc: 'BPSC preparation ke liye state + national topic mix ke saath structured mock practice.',
    uppcs: 'UPPCS ke liye paper pattern aligned objective mocks with balanced section coverage.',
    ras: 'RAS civil services prep ke liye Rajasthan-focused GS and aptitude mock sets.',
    'eo-ro': 'EO & RO recruitment prep with administrative aptitude and exam-style objective practice.',
    'ro-aro': 'RO & ARO candidates ke liye speed, comprehension and accuracy oriented mock tests.',
    ncert: 'NCERT-based foundational revision mocks for core civil services concept clarity.'
  };
  const nursingExamHighlights = {
    'norcet-12': 'NORCET 12 ke liye AIIMS-style nursing officer pattern based mock practice.',
    'norcet-11': 'NORCET 11 aspirants ke liye structured nursing aptitude and objective revision.',
    rrb: 'RRB Nursing recruitment pattern ke saath balanced speed and accuracy practice mocks.',
    'rajasthan-staff-nurse': 'Rajasthan Staff Nurse exam-specific syllabus coverage ke saath focused mocks.',
    dsssb: 'DSSSB Nursing posts ke liye targeted section-wise and full-length objective preparation.',
    'aiims-cre': 'AIIMS-CRE ke liye clinical + general aptitude aligned mock test practice.',
    'ssc-nursing-officer': 'SSC Nursing Officer exam readiness ke liye practical and high-yield practice sets.'
  };
  const schoolExamHighlights = {
    'class-10': 'Class 10th ke liye board-oriented mock tests with concept + accuracy focus.',
    'class-9': 'Class 9th students ke liye subject-wise fundamentals and progress-based mock sets.',
    'class-8': 'Class 8th practice pack with chapter-level objective questions and revision support.',
    'class-7': 'Class 7th ke liye simple-to-advanced practice flow with regular mock improvement.',
    'class-6': 'Class 6th foundational mock tests for confidence building and concept clarity.',
    'class-11-arts': 'Class 11th Arts ke liye stream-focused mock practice and topic reinforcement.',
    'class-12-arts': 'Class 12th Arts preparation ke liye exam pattern aligned practice support.',
    'class-11-science': 'Class 11th Science ke liye conceptual mock tests and regular revision flow.',
    'class-12-science': 'Class 12th Science students ke liye exam-focused timed practice mocks.',
    'class-11-commerce': 'Class 11th Commerce ke liye subject-mix objective practice and prep.',
    'class-12-commerce': 'Class 12th Commerce exam readiness ke liye structured mock-test coverage.'
  };
  const otherStateExamHighlights = {
    'up-constable': 'UP Constable ke liye level-based mock tests with speed and accuracy practice.',
    'up-sub-inspector': 'UP Sub Inspector prep ke liye reasoning, law-order basics and mixed sets.',
    'up-home-guard': 'UP Home Guard candidates ke liye easy-to-follow progressive mock practice.',
    'high-court-ro-aro': 'High Court RO/ARO exams ke liye comprehension and objective mock preparation.',
    'high-court-group-c-d': 'High Court Group C & D ke liye practical recruitment-pattern mock tests.',
    'forest-guard': 'Forest Guard preparation ke liye state-level mixed-topic timed mock sets.',
    'up-vdo': 'UP VDO exam-focused objective practice for consistency and exam confidence.'
  };
  const agricultureExamHighlights = {
    'agriculture-supervisor': 'Agriculture Supervisor prep ke liye syllabus-focused objective mock practice.',
    'veterinary-officer': 'Veterinary Officer candidates ke liye subject-depth and timed practice mocks.',
    jet: 'JET aspirants ke liye agriculture entrance aligned revision and mock-test coverage.',
    'rssb-teaching-associate': 'RSSB Teaching Associate exams ke liye recruitment pattern-based practice sets.',
    'pashu-parichar': 'Pashu Parichar recruitment ke liye accessible level-based mock tests.',
    'food-safety-officer': 'Food Safety Officer prep ke liye practical, compliance, and aptitude style mocks.',
    'grade-1-school-lecturer': 'Grade 1st School Lecturer ke liye advanced objective and concept mock practice.',
    'cuet-ug-agriculture': 'CUET UG Agriculture aspirants ke liye exam-focused mock and speed drills.'
  };
  const collegeEntranceExamHighlights = {
    'jee-12': 'JEE Main & Advanced Class 12 ke liye high-intensity concept + speed mock coverage.',
    'jee-11': 'JEE Main & Advanced Class 11 students ke liye foundation-first progressive mock tests.',
    'neet-12': 'NEET UG Class 12 prep ke liye biology-led and mixed-subject timed practice flow.',
    'neet-11': 'NEET UG Class 11 ke liye concept-building objective practice and revision support.'
  };
  const miscellaneousExamHighlights = {
    'state-judicial-services': 'State Judicial Services prep ke liye law-aptitude and case-style objective practice.',
    'ssc-je': 'SSC JE candidates ke liye technical reasoning and recruitment-pattern mock support.',
    'rssb-je': 'RSSB JE prep ke liye section-balanced objective practice with timed mock flow.',
    'rpsc-ae': 'RPSC AE exam readiness ke liye engineering aptitude and mixed-topic mock tests.',
    mathematics: 'Mathematics scoring boost ke liye accuracy-focused concept and speed practice sets.',
    reasoning: 'Reasoning ke liye trick-based, progressive difficulty mock questions and timed drills.',
    'general-hindi': 'General Hindi ke liye language accuracy and comprehension style mock practice.',
    'general-english': 'General English prep ke liye grammar, vocabulary and usage-focused mock sets.',
    'computer-knowledge': 'Computer Knowledge objective prep with practical basics and revision-friendly mocks.',
    history: 'History preparation ke liye chronology and concept-recall based objective practice.',
    geography: 'Geography prep with map-awareness and concept-driven mixed mock questions.',
    psychology: 'Psychology topic practice with easy-to-revise objective format and scoring strategy.',
    pedagogy: 'Pedagogy section ke liye teaching-concept and learning-model focused practice sets.',
    'teaching-methods': 'Teaching Methods prep ke liye classroom-application and conceptual MCQ practice.'
  };



  const reetMockDescriptions = {
    1: 'REET Level 1/2 full-length mock with 150 questions covering CDP, Language I-II, Mathematics, EVS, Science and Social Studies for exam-pattern practice.',
    2: 'REET mock test for improving speed and accuracy with balanced pedagogy, language, maths and environmental studies question coverage.',
    3: 'Section-balanced REET practice paper designed to strengthen Child Development, teaching methods, language skills and subject knowledge.',
    4: 'REET full paper simulation with 150 MCQs and 150-minute timing to practise attempt order, accuracy and syllabus-based revision.',
    5: 'REET preparation mock focused on exam endurance, topic recall and mixed-difficulty questions across all major teacher eligibility sections.',
    6: 'REET revision test for identifying weak areas in pedagogy, language, maths, EVS, science and social studies before final practice.',
    7: 'REET exam-style mock test to build confidence with full-length timing, section-wise coverage and answer review support.',
    8: 'Advanced REET practice set for consistent scoring, better time management and focused revision across the complete syllabus.',
    9: 'Near-exam REET mock simulation for refining final strategy, reducing guesswork and checking readiness with 150 questions.',
    10: 'Final REET full-length mock test for complete self-assessment with exam-pattern questions, timer discipline and detailed review.'
  };

  const ptetMockDescriptions = {
    1: 'PTET exam-pattern full-length mock to balance reasoning, teaching aptitude, language skills, and Rajasthan awareness in one attempt.',
    2: 'Focused PTET practice set for improving speed and accuracy with mixed-difficulty questions across all key sections.',
    3: 'Section-balanced PTET mock designed for better time allocation and cleaner question selection under exam pressure.',
    4: 'Concept-reinforcement PTET test to strengthen reasoning flow, pedagogy judgment, and language usage accuracy.',
    5: 'Mid-preparation PTET mock for tracking consistency and building confidence in full-paper timed attempts.',
    6: 'PTET revision mock aimed at sharper accuracy, faster solving rhythm, and reduced guesswork in mixed questions.',
    7: 'Readiness-driven PTET set for identifying weak areas before final exam-phase practice and correction.',
    8: 'Advanced PTET full-length practice for maintaining focus and stable performance through all sections.',
    9: 'Near-exam PTET simulation to refine final strategy, attempt order, and time control across the complete paper.',
    10: 'Final PTET mock for comprehensive self-evaluation before exam day with end-to-end pattern practice.'
  };

  const bstcMockDescriptions = {
    1: 'Full BSTC pattern simulation with mixed pedagogy, reasoning, language, and Rajasthan GK practice in one timed set.',
    2: 'Balanced BSTC revision test to strengthen accuracy across all major sections with steady difficulty progression.',
    3: 'Exam-paced BSTC mock focused on question selection, time control, and consistent scoring across topics.',
    4: 'Comprehensive BSTC practice set for concept recall, elimination skills, and section-wise performance tuning.',
    5: 'Structured BSTC mock for mid-phase preparation with practical coverage of frequently tested objective formats.',
    6: 'High-utility BSTC test designed to improve speed while maintaining accuracy in mixed-topic MCQ attempts.',
    7: 'Readiness-focused BSTC mock that helps identify weak areas before final revision and full-length practice.',
    8: 'Advanced BSTC revision set for improving consistency under timed conditions and tighter attempt strategy.',
    9: 'Near-exam BSTC mock to practice endurance, maintain focus, and refine your final attempt plan.',
    10: 'Final BSTC full-length practice set for complete self-check before exam day with overall readiness review.'
  };

  function cardForExam(exam, ctaText = 'Start Mock Test') {
    return `<article class="feature-card reveal"><p class="template-badge">${exam.difficulty || 'All levels'}</p><h3 class="mt-3">${exam.title}</h3><p>${exam.description}</p><p class="template-meta">${exam.questionsCount || 50} questions • ${exam.duration || '60 min'}</p><div class="template-actions mt-4"><a href="${exam.ctaLink}" class="btn-primary" aria-label="${ctaText} for ${exam.title}">${ctaText}</a></div></article>`;
  }

  const grid = document.getElementById('mock-test-categories');
  if (grid) {
    const renderCategories = (categories) => {
      grid.innerHTML = categories.map((cat) => `<article class="feature-card reveal"><p class="template-badge">Category</p><h3 class="mt-3">${cat.title}</h3><p>${cat.description}</p><p class="template-meta">${cat.exams.length} exam tracks</p><div class="template-actions mt-4"><a href="./mock-test/${cat.slug}.html" class="btn-primary">Explore ${cat.title}</a></div></article>`).join('');
    };
    renderCategories(data.categories);
    const search = document.getElementById('mock-test-search');
    if (search) {
      search.addEventListener('input', (event) => {
        const query = event.target.value.trim().toLowerCase();
        const filtered = data.categories.filter((cat) => (`${cat.title} ${cat.description}`).toLowerCase().includes(query));
        renderCategories(filtered);
      });
    }
  }

  const categorySlug = document.body.getAttribute('data-mock-category');
  if (categorySlug) {
    const category = data.categories.find((c) => c.slug === categorySlug);
    if (!category) return;
    document.getElementById('category-title').textContent = category.title;
    document.getElementById('category-intro').textContent = category.slug === 'teaching-exams'
      ? 'Teaching Exams ke liye exam-wise preparation hub. Apna exam select karo aur BSTC, PTET, REET, CTET, KVS, DSSSB, 2nd Grade, 3rd Grade aur other tracks par smart practice start karo.'
      : category.slug === 'rajasthan-govt-exams'
        ? 'Rajasthan Govt Exams ke liye exam-wise preparation hub. RAS, Sub Inspector, CET 12th, CET Graduation, VDO, Patwar, Jail Prahari aur other tracks par structured practice start karo.'
        : category.slug === 'central-govt-exams'
          ? 'Central Govt Exams ke liye exam-wise preparation hub. SSC CGL, SSC GD, Delhi Police, SSC CHSL, MTS aur other tracks par structured mock practice start karo.'
          : category.slug === 'civil-services-exams'
            ? 'Civil Services Exams ke liye exam-wise preparation hub. UPSC, BPSC, UPPCS, RAS, EO & RO, NCERT aur other tracks par structured mock practice start karo.'
            : category.slug === 'nursing-exams'
              ? 'Nursing Exams ke liye exam-wise preparation hub. NORCET 11, NORCET 12, RRB Nursing, Rajasthan Staff Nurse, DSSSB, AIIMS-CRE aur SSC Nursing Officer tracks par focused practice start karo.'
              : category.slug === 'school-test'
                ? 'School Test ke liye class-wise preparation hub. Class 6th, 7th, 8th, 9th, 10th aur other streams par focused mock practice start karo.'
                : category.slug === 'other-state-govt-exams'
                  ? 'Other State Govt Exams ke liye exam-wise preparation hub. UP Sub Inspector, UP Constable, UP Home Guard, High Court RO/ARO, High Court Group C & D aur other tracks par focused practice start karo.'
                  : category.slug === 'agriculture-exams'
                    ? 'Agriculture Exams ke liye exam-wise preparation hub. RSSB Teaching Associate, JET, Agriculture Supervisor, Veterinary Officer, Pashu Parichar, Food Safety Officer aur more tracks par focused practice start karo.'
                    : category.slug === 'college-entrance-exams'
                      ? 'College Entrance Exams ke liye class-wise preparation hub. JEE Main & Advanced Class 11/12 aur NEET UG Class 11/12 tracks par focused mock practice start karo.'
                      : category.slug === 'miscellaneous-exams'
                        ? 'Miscellaneous Exams ke liye exam-wise preparation hub. State Judicial Services, SSC JE, RSSB JE, RPSC AE, Reasoning, Mathematics aur other technical tracks par focused mock practice start karo.'
        : category.description;
    const categoryOverview = document.getElementById('category-overview');
    if (categoryOverview) {
      categoryOverview.textContent = `${category.title} includes ${category.exams.length} exam tracks.`;
    }

    const examSections = document.getElementById('category-exam-sections');
    if (examSections) {
      examSections.innerHTML = category.exams.map((key, idx) => {
        const exam = data.exams[key];
        if (!exam) return '';

        const examLink = categorySlug === 'teaching-exams'
          ? `./teaching-exams/${exam.slug}.html`
          : `./exam.html?exam=${exam.slug}`;

        const examDescription = categorySlug === 'teaching-exams'
          ? (teachingExamHighlights[exam.slug] || exam.description)
          : categorySlug === 'rajasthan-govt-exams'
            ? (rajasthanExamHighlights[exam.slug] || exam.description)
            : categorySlug === 'central-govt-exams'
              ? (centralExamHighlights[exam.slug] || exam.description)
              : categorySlug === 'civil-services-exams'
                ? (civilExamHighlights[exam.slug] || exam.description)
                : categorySlug === 'nursing-exams'
                  ? (nursingExamHighlights[exam.slug] || exam.description)
                  : categorySlug === 'school-test'
                    ? (schoolExamHighlights[exam.slug] || exam.description)
                    : categorySlug === 'other-state-govt-exams'
                      ? (otherStateExamHighlights[exam.slug] || exam.description)
                      : categorySlug === 'agriculture-exams'
                        ? (agricultureExamHighlights[exam.slug] || exam.description)
                        : categorySlug === 'college-entrance-exams'
                          ? (collegeEntranceExamHighlights[exam.slug] || exam.description)
                          : categorySlug === 'miscellaneous-exams'
                            ? (miscellaneousExamHighlights[exam.slug] || exam.description)
            : exam.description;
        return `<section class="mb-8" id="exam-${exam.slug}"><div class="section-head reveal"><h3>${idx + 1}. ${exam.title}</h3><p>${exam.practiceIntro}</p></div><div class="grid gap-5 lg:grid-cols-2"><article class="feature-card reveal h-full"><p class="template-badge">${exam.difficulty || 'All levels'}</p><h3 class="mt-3">${exam.title}</h3><p>${examDescription}</p><p class="template-meta">${exam.questionsCount || 50} questions • ${exam.duration || '60 min'} • 10 mock tests</p><div class="template-actions mt-4"><a href="${examLink}" class="btn-primary" aria-label="Explore ${exam.title} mock tests">Explore ${exam.title}</a></div></article><article class="feature-card reveal h-full"><p class="template-badge">Practice Sets</p><h3 class="mt-3">${exam.title} Practice Sets</h3><p>Dedicated practice sets for ${exam.title} to improve accuracy, speed, and exam confidence with regular attempts.</p><p class="template-meta">Topic-wise + full-length • Exam-focused preparation</p><div class="template-actions mt-4"><a href="${examLink}" class="btn-primary" aria-label="Practice ${exam.title} now">Practice Now</a></div></article></div></section>`;
      }).join('');
    }

    const related = document.getElementById('related-categories');
    if (related) {
      related.innerHTML = data.categories.filter((c) => c.slug !== category.slug).slice(0, 4).map((c) => `<a href="./${c.slug}.html" class="btn-secondary">${c.title}</a>`).join('');
    }
  }

  const teachingExamSlug = document.body.getAttribute('data-mock-exam');
  if (teachingExamSlug) {
    const exam = data.exams[teachingExamSlug];
    if (!exam) return;

    const teachingSeo = teachingExamSlug === 'reet'
      ? {
          title: 'REET Mock Tests 1-10 | 150 Questions, 150 Minutes | ToolShala',
          description: 'Practice REET Mock Test 1 to 10 with 150 questions, 150-minute timer, section-wise pedagogy, language, maths, EVS, science and social studies coverage on ToolShala.'
        }
      : {
          title: `${exam.title} Mock Tests | Teaching Exams | ToolShala`,
          description: `Practice ${exam.title} with 10 full-length mock tests, timed questions, and exam-focused preparation on ToolShala.`
        };

    document.title = teachingSeo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', teachingSeo.description);
    }
    setSeoMetaContent('meta[property="og:title"]', teachingSeo.title);
    setSeoMetaContent('meta[property="og:description"]', teachingSeo.description);
    setCanonicalUrl(`${SITE_ORIGIN}/mock-test/teaching-exams/${encodeURIComponent(teachingExamSlug)}.html`);

    const examTitle = document.getElementById('teaching-exam-title');
    const examIntro = document.getElementById('teaching-exam-intro');
    const examOverview = document.getElementById('teaching-exam-overview');
    const mockList = document.getElementById('teaching-exam-mocks');

    if (examTitle) examTitle.textContent = `${exam.title} Mock Tests`;
    if (examIntro) examIntro.textContent = teachingExamSlug === 'reet'
      ? 'Prepare for REET with 10 full-length mock tests. Each paper follows a 150-question, 150-minute practice format for pedagogy, language and subject-wise revision.'
      : `Prepare for ${exam.title} with structured practice. Attempt all 10 mock tests in sequence to improve speed, accuracy, and exam confidence.`;
    if (examOverview) examOverview.textContent = `${exam.title} practice pack includes 10 mock tests with ${exam.questionsCount || 50} questions each and ${exam.duration || '60 min'} duration.`;

    if (mockList) {
      mockList.innerHTML = Array.from({ length: 10 }, (_, index) => {
        const testNumber = index + 1;
        const customCtaLink = teachingExamSlug === 'ptet' && testNumber === 1
          ? './ptet-mock-test-1.html'
          : teachingExamSlug === 'ptet' && testNumber === 2
          ? './ptet-mock-test-2.html'
          : teachingExamSlug === 'ptet' && testNumber === 3
          ? './ptet-mock-test-3.html'
          : teachingExamSlug === 'ptet' && testNumber === 4
          ? './ptet-mock-test-4.html'
          : teachingExamSlug === 'ptet' && testNumber === 5
          ? './ptet-mock-test-5.html'
          : teachingExamSlug === 'ptet' && testNumber === 6
          ? './ptet-mock-test-6.html'
          : teachingExamSlug === 'ptet' && testNumber === 7
          ? './ptet-mock-test-7.html'
          : teachingExamSlug === 'ptet' && testNumber === 8
          ? './ptet-mock-test-8.html'
          : teachingExamSlug === 'ptet' && testNumber === 9
          ? './ptet-mock-test-9.html'
          : teachingExamSlug === 'ptet' && testNumber === 10
          ? './ptet-mock-test-10.html'
          : teachingExamSlug === 'ctet' && testNumber === 1
          ? './ctet-mock-test-1.html'
          : teachingExamSlug === 'ctet' && testNumber === 2
          ? './ctet-mock-test-2.html'
          : teachingExamSlug === 'ctet' && testNumber === 3
          ? './ctet-mock-test-3.html'
          : teachingExamSlug === 'ctet' && testNumber === 4
          ? './ctet-mock-test-4.html'
          : teachingExamSlug === 'ctet' && testNumber === 5
          ? './ctet-mock-test-5.html'
          : teachingExamSlug === 'ctet' && testNumber === 7
          ? './ctet-mock-test-7.html'
          : teachingExamSlug === 'ctet' && testNumber === 6
          ? './ctet-mock-test-6.html'
          : teachingExamSlug === 'reet' && testNumber === 1
          ? './reet-mock-test-1.html'
          : teachingExamSlug === 'reet' && testNumber === 2
          ? './reet-mock-test-2.html'
          : teachingExamSlug === 'reet' && testNumber === 3
          ? './reet-mock-test-3.html'
          : teachingExamSlug === 'reet' && testNumber === 4
          ? './reet-mock-test-4.html'
          : teachingExamSlug === 'reet' && testNumber === 5
          ? './reet-mock-test-5.html'
          : teachingExamSlug === 'reet' && testNumber === 6
          ? './reet-mock-test-6.html'
          : teachingExamSlug === 'reet' && testNumber === 7
          ? './reet-mock-test-7.html'
          : teachingExamSlug === 'reet' && testNumber === 8
          ? './reet-mock-test-8.html'
          : teachingExamSlug === 'reet' && testNumber === 9
          ? './reet-mock-test-9.html'
          : teachingExamSlug === 'reet' && testNumber === 10
          ? './reet-mock-test-10.html'
          : teachingExamSlug === 'bstc' && testNumber === 1
          ? './bstc-mock-test-1.html'
          : teachingExamSlug === 'bstc' && testNumber === 2
            ? './bstc-mock-test-2.html'
            : teachingExamSlug === 'bstc' && testNumber === 3
              ? './bstc-mock-test-3.html'
              : teachingExamSlug === 'bstc' && testNumber === 4
                ? './bstc-mock-test-4.html'
                : teachingExamSlug === 'bstc' && testNumber === 5
                   ? './bstc-mock-test-5.html'
                   : teachingExamSlug === 'bstc' && testNumber === 6
                      ? './bstc-mock-test-6.html'
                      : teachingExamSlug === 'bstc' && testNumber === 7
                          ? './bstc-mock-test-7.html'
                      : teachingExamSlug === 'bstc' && testNumber === 8
                            ? './bstc-mock-test-8.html'
                            : teachingExamSlug === 'bstc' && testNumber === 9
                              ? './bstc-mock-test-9.html'
                                : teachingExamSlug === 'bstc' && testNumber === 10
                                 ? './bstc-mock-test-10.html'
              : `../exam.html?exam=${exam.slug}`;
        return cardForExam({
          ...exam,
          ...(teachingExamSlug === 'ctet' && ((testNumber >= 1 && testNumber <= 5) || testNumber === 7) ? { questionsCount: 150, duration: '150 min' } : {}),
          ctaLink: customCtaLink,
          title: `${exam.title} Mock Test ${testNumber}`,
          description: teachingExamSlug === 'bstc'
            ? (bstcMockDescriptions[testNumber] || `BSTC full-length practice set ${testNumber} for exam-ready revision and timed preparation.`)
            : teachingExamSlug === 'ptet'
              ? (ptetMockDescriptions[testNumber] || `PTET full-length practice set ${testNumber} for exam-focused revision and timed preparation.`)
              : teachingExamSlug === 'reet'
                ? (reetMockDescriptions[testNumber] || `REET Mock Test ${testNumber} with 150 questions and a 150-minute timer for full-length exam practice.`)
                : `Mock Test ${testNumber} for ${exam.title} with exam-pattern questions and balanced difficulty coverage.`
        });
      }).join('');
    }
  }

  const examSlug = new URLSearchParams(window.location.search).get('exam');
  const examPage = document.getElementById('mock-exam-page');
  if (examPage && examSlug) {
    const exam = data.exams[examSlug];
    if (!exam) return;
    document.title = `${exam.title} Mock Test Practice | ToolShala`;
    setSeoMetaContent('meta[name="description"]', `${exam.title} mock test practice with exam-focused MCQs, timing guidance, and preparation support on ToolShala.`);
    setCanonicalUrl(`${SITE_ORIGIN}/mock-test/exam.html?exam=${encodeURIComponent(exam.slug)}`);
    document.getElementById('exam-title').textContent = exam.title;
    document.getElementById('exam-description').textContent = exam.description;
    document.getElementById('exam-meta').textContent = `${exam.category} • ${exam.questionsCount} questions • ${exam.duration}`;
  }
})();
