(function () {
  const data = window.mockTestData;
  if (!data) return;

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
    document.getElementById('category-intro').textContent = category.description;
    const categoryOverview = document.getElementById('category-overview');
    if (categoryOverview) {
      categoryOverview.textContent = categorySlug === 'teaching-exams'
        ? `${category.title} includes ${category.exams.length} exam tracks with mock tests.`
        : `${category.title} includes ${category.exams.length} exam tracks with mock tests and practice sets.`;
    }

    const examSections = document.getElementById('category-exam-sections');
    if (examSections) {
      examSections.innerHTML = category.exams.map((key, idx) => {
        const exam = data.exams[key];
        if (!exam) return '';

        if (categorySlug === 'teaching-exams') {
          const mockTests = Array.from({ length: 10 }, (_, mockIdx) => {
            const testNumber = mockIdx + 1;
            return cardForExam({
              ...exam,
              title: `${exam.title} Mock Test ${testNumber}`,
              description: `Full-length mock test ${testNumber} for ${exam.title} exam preparation.`
            }, 'Start Mock Test');
          }).join('');

          return `<section class="mb-8" id="exam-${exam.slug}"><div class="section-head reveal"><h3>${idx + 1}. ${exam.title}</h3><p>${exam.practiceIntro}</p></div><div class="grid gap-5 sm:grid-cols-2">${mockTests}</div></section>`;
        }

        return `<section class="mb-8" id="exam-${exam.slug}"><div class="section-head reveal"><h3>${idx + 1}. ${exam.title}</h3><p>${exam.practiceIntro}</p></div><div class="grid gap-5 sm:grid-cols-2">${cardForExam(exam, 'Start Mock Test')}${cardForExam({ ...exam, title: `${exam.title} Practice Set`, description: `Revision-focused practice set for ${exam.title}.`, ctaLink: exam.ctaLink }, 'View Practice Set')}</div></section>`;
      }).join('');
    }

    const related = document.getElementById('related-categories');
    if (related) {
      related.innerHTML = data.categories.filter((c) => c.slug !== category.slug).slice(0, 4).map((c) => `<a href="./${c.slug}.html" class="btn-secondary">${c.title}</a>`).join('');
    }
  }

  const examSlug = new URLSearchParams(window.location.search).get('exam');
  const examPage = document.getElementById('mock-exam-page');
  if (examPage && examSlug) {
    const exam = data.exams[examSlug];
    if (!exam) return;
    document.getElementById('exam-title').textContent = exam.title;
    document.getElementById('exam-description').textContent = exam.description;
    document.getElementById('exam-meta').textContent = `${exam.category} • ${exam.questionsCount} questions • ${exam.duration}`;
  }
})();
