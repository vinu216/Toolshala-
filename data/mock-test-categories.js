window.mockTestData = (() => {
  const examCatalog = {
    bstc: { title: 'BSTC', link: './mock-test/bstc.html', level: 'Beginner', duration: '45 min' },
    ptet: { title: 'PTET', link: './mock-test/ptet.html', level: 'Intermediate', duration: '60 min' },
    reet: { title: 'REET', link: './mock-test/reet.html', level: 'Intermediate', duration: '60 min' },
    ctet: { title: 'CTET', link: './mock-test/ctet.html', level: 'Intermediate', duration: '60 min' },
    third-grade: { title: '3rd Grade', link: './mock-test/3rd-grade.html', level: 'Intermediate', duration: '60 min' },
    second-grade: { title: '2nd Grade', link: './mock-test/2nd-grade.html', level: 'Advanced', duration: '75 min' },
    first-grade: { title: '1st Grade', link: './mock-test/1st-grade.html', level: 'Advanced', duration: '90 min' },
    kvs: { title: 'KVs', link: './mock-test/kvs.html', level: 'Intermediate', duration: '60 min' },
    dsssb: { title: 'DSSSB', link: './mock-test/dsssb.html', level: 'Intermediate', duration: '60 min' },
    pti: { title: 'PTI', link: './mock-test/pti.html', level: 'Beginner', duration: '45 min' },
    assistant-professor: { title: 'Assistant Professor', link: './mock-test/assistant-professor.html', level: 'Advanced', duration: '90 min' },
    ras: { title: 'RAS', link: './mock-test/ras.html', level: 'Advanced', duration: '90 min' },
    'sub-inspector': { title: 'Sub Inspector', link: './mock-test/sub-inspector.html', level: 'Intermediate', duration: '60 min' },
    constable: { title: 'Constable', link: './mock-test/constable.html', level: 'Beginner', duration: '45 min' },
    'cet-12th': { title: 'CET 12th', link: './mock-test/cet-12th.html', level: 'Beginner', duration: '45 min' },
    'cet-graduation': { title: 'CET Graduation', link: './mock-test/cet-graduation.html', level: 'Intermediate', duration: '60 min' },
    vdo: { title: 'VDO', link: './mock-test/vdo.html', level: 'Intermediate', duration: '60 min' },
    patwar: { title: 'Patwar', link: './mock-test/patwar.html', level: 'Intermediate', duration: '60 min' },
    'jail-prahari': { title: 'Jail Prahari', link: './mock-test/jail-prahari.html', level: 'Beginner', duration: '45 min' },
    'lab-assistant': { title: 'Lab Assistant', link: './mock-test/lab-assistant.html', level: 'Beginner', duration: '45 min' },
    'woman-supervisor': { title: 'Woman Supervisor', link: './mock-test/woman-supervisor.html', level: 'Intermediate', duration: '60 min' },
    librarian: { title: 'Librarian', link: './mock-test/librarian.html', level: 'Intermediate', duration: '60 min' },
    stenographer: { title: 'Stenographer', link: './mock-test/stenographer.html', level: 'Beginner', duration: '45 min' },
    ldc: { title: 'LDC', link: './mock-test/ldc.html', level: 'Beginner', duration: '45 min' },
    upsc: { title: 'UPSC', link: './mock-test/upsc.html', level: 'Advanced', duration: '120 min' },
    ncert: { title: 'NCERT', link: './mock-test/ncert.html', level: 'Beginner', duration: '30 min' }
  };

  const categories = [
    { slug: 'teaching-exams', title: 'Teaching Exams', description: 'Practice teaching-focused exams with pedagogy and subject coverage.', exams: ['bstc','ptet','reet','ctet','third-grade','second-grade','first-grade','kvs','dsssb','pti','assistant-professor'] },
    { slug: 'rajasthan-govt-exams', title: 'Rajasthan Govt Exams', description: 'State-level mock tests for key Rajasthan recruitment exams.', exams: ['ras','sub-inspector','constable','cet-12th','cet-graduation','vdo','patwar','jail-prahari','lab-assistant','woman-supervisor','librarian','stenographer','ldc'] },
    { slug: 'central-govt-exams', title: 'Central Govt Exams', description: 'Prepare for central recruitments with structured mock tests.', exams: ['dsssb','constable','ldc'] },
    { slug: 'civil-services-exams', title: 'Civil Services Exams', description: 'Civil services prelims-oriented practice and revision mocks.', exams: ['ras','upsc','ncert'] },
    { slug: 'nursing-exams', title: 'Nursing Exams', description: 'Targeted nursing recruitment and entrance mock tests.', exams: ['dsssb'] },
    { slug: 'school-tuitions', title: 'School Tuitions', description: 'Class-wise practice tests for school-level preparation.', exams: ['ncert'] },
    { slug: 'other-state-govt-exams', title: 'Other State Govt Exams', description: 'Mock tests for state-level exams beyond Rajasthan.', exams: ['sub-inspector','constable','vdo'] },
    { slug: 'agriculture-exams', title: 'Agriculture Exams', description: 'Agriculture and allied sector mock tests for aspirants.', exams: ['lab-assistant'] },
    { slug: 'college-entrance-exams', title: 'College Entrance Exams', description: 'Exam practice for engineering and medical entrance pathways.', exams: ['ncert'] },
    { slug: 'miscellaneous-exams', title: 'Miscellaneous Exams', description: 'Additional topic-based and specialized exam practice tracks.', exams: ['assistant-professor','ldc'] }
  ];

  return { examCatalog, categories };
})();
