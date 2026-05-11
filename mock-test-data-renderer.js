(function () {
  const data = window.mockTestData;
  if (!data) return;

  function cardForExam(exam) {
    return `<article class="feature-card reveal"><p class="template-badge">${exam.level || 'All levels'}</p><h3 class="mt-3">${exam.title}</h3><p>Timed practice set curated for ${exam.title} preparation.</p><p class="template-meta">${exam.duration || '60 min'} • Mock Test</p><div class="template-actions mt-4"><a href="${exam.link}" class="btn-primary" aria-label="Open ${exam.title} mock test">Open Mock Test</a></div></article>`;
  }

  const grid = document.getElementById('mock-test-categories');
  if (grid) {
    grid.innerHTML = data.categories.map((cat) => `<article class="feature-card reveal"><p class="template-badge">Category</p><h3 class="mt-3">${cat.title}</h3><p>${cat.description}</p><p class="template-meta">${cat.exams.length} exam tracks</p><div class="template-actions mt-4"><a href="./mock-test/${cat.slug}.html" class="btn-primary">Explore ${cat.title}</a></div></article>`).join('');
    const search = document.getElementById('mock-test-search');
    if (search) {
      search.addEventListener('input', (event) => {
        const query = event.target.value.trim().toLowerCase();
        const filtered = data.categories.filter((cat) => (`${cat.title} ${cat.description}`).toLowerCase().includes(query));
        grid.innerHTML = filtered.map((cat) => `<article class="feature-card reveal"><p class="template-badge">Category</p><h3 class="mt-3">${cat.title}</h3><p>${cat.description}</p><p class="template-meta">${cat.exams.length} exam tracks</p><div class="template-actions mt-4"><a href="./mock-test/${cat.slug}.html" class="btn-primary">Explore ${cat.title}</a></div></article>`).join('');
      });
    }
  }

  const categorySlug = document.body.getAttribute('data-mock-category');
  if (categorySlug) {
    const category = data.categories.find((c) => c.slug === categorySlug);
    if (!category) return;
    document.getElementById('category-title').textContent = category.title;
    document.getElementById('category-intro').textContent = category.description;
    const examGrid = document.getElementById('category-exam-grid');
    const exams = category.exams.map((key) => data.examCatalog[key]).filter(Boolean);
    examGrid.innerHTML = exams.map(cardForExam).join('');

    const related = document.getElementById('related-categories');
    if (related) {
      related.innerHTML = data.categories.filter((c) => c.slug !== category.slug).slice(0, 3).map((c) => `<a href="./${c.slug}.html" class="btn-secondary">${c.title}</a>`).join('');
    }
  }
})();
