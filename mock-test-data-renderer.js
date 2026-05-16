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

        return `<section class="mb-8" id="exam-${exam.slug}"><div class="section-head reveal"><h3>${idx + 1}. ${exam.title}</h3><p>${exam.practiceIntro}</p></div><div class="grid gap-5 sm:grid-cols-2"><article class="feature-card reveal"><p class="template-badge">${exam.difficulty || 'All levels'}</p><h3 class="mt-3">${exam.title}</h3><p>${exam.description}</p><p class="template-meta">${exam.questionsCount || 50} questions • ${exam.duration || '60 min'} • 10 mock tests</p><div class="template-actions mt-4"><a href="${examLink}" class="btn-primary" aria-label="Explore ${exam.title} mock tests">Explore ${exam.title}</a></div></article></div></section>`;
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

    document.title = `${exam.title} Mock Tests | Teaching Exams | ToolShala`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `Practice ${exam.title} with 10 full-length mock tests, timed questions, and exam-focused preparation on ToolShala.`);
    }

    const examTitle = document.getElementById('teaching-exam-title');
    const examIntro = document.getElementById('teaching-exam-intro');
    const examOverview = document.getElementById('teaching-exam-overview');
    const mockList = document.getElementById('teaching-exam-mocks');

    if (examTitle) examTitle.textContent = `${exam.title} Mock Tests`;
    if (examIntro) examIntro.textContent = `Prepare for ${exam.title} with structured practice. Attempt all 10 mock tests in sequence to improve speed, accuracy, and exam confidence.`;
    if (examOverview) examOverview.textContent = `${exam.title} practice pack includes 10 mock tests with ${exam.questionsCount || 50} questions each and ${exam.duration || '60 min'} duration.`;

    if (mockList) {
      mockList.innerHTML = Array.from({ length: 10 }, (_, index) => {
        const testNumber = index + 1;
        return cardForExam({
          ...exam,
          title: `${exam.title} Mock Test ${testNumber}`,
          description: `Mock Test ${testNumber} for ${exam.title} with exam-pattern questions and balanced difficulty coverage.`
        });
      }).join('');
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
