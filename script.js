document.addEventListener('DOMContentLoaded', () => {

  const SITE_ORIGIN = 'https://toolshala.in';

  const setSeoMetaContent = (selector, value) => {
    if (!value) return;
    const node = document.querySelector(selector);
    if (node) {
      node.setAttribute('content', value);
    }
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

  const setRobotsMeta = (value) => {
    let robotsNode = document.querySelector('meta[name="robots"]');
    if (!robotsNode) {
      robotsNode = document.createElement('meta');
      robotsNode.setAttribute('name', 'robots');
      document.head.appendChild(robotsNode);
    }
    robotsNode.setAttribute('content', value);
  };

  const getCanonicalPathWithAllowedQuery = () => {
    const path = window.location.pathname || '/';
    const filePath = path.endsWith('/index.html') ? path.replace(/index\.html$/, '') : path;
    const params = new URLSearchParams(window.location.search);

    if (filePath.endsWith('/tool.html') && params.get('tool')) {
      return `${filePath}?tool=${encodeURIComponent(params.get('tool'))}`;
    }

    if (filePath.endsWith('/guide.html') && params.get('slug')) {
      return `${filePath}?slug=${encodeURIComponent(params.get('slug'))}`;
    }

    if (filePath.endsWith('/mock-test/exam.html') && params.get('exam')) {
      return `${filePath}?exam=${encodeURIComponent(params.get('exam'))}`;
    }

    return filePath || '/';
  };

  const setupCanonicalDefaults = () => {
    setCanonicalUrl(`${SITE_ORIGIN}${getCanonicalPathWithAllowedQuery()}`);
  };

  setupCanonicalDefaults();

  const FEEDBACK_MESSAGES = {
    newsletterSuccess: "You're subscribed successfully. Useful updates will reach your inbox soon.",
    newsletterError: 'Something went wrong. Please try again in a moment.',
    formSuccess: 'Message sent successfully. Thanks for reaching out to ToolShala.',
    formError: 'We could not send your message right now. Please try again.',
    copySuccess: 'Copied to clipboard.',
    copyError: 'Could not copy right now. Please copy manually.',
    toolSuccess: 'Your result is ready.',
    toolValidation: 'Please fill in all required fields.',
    downloadSuccess: 'Your download is starting.',
    filterReset: 'Filters cleared.',
    telegramOpen: 'Opening Telegram...',
    generalSuccess: 'Done successfully.',
    generalError: "Something didn't work as expected. Please try again.",
    loadingResult: 'Generating your result...',
    loadingResources: 'Loading useful resources...',
    loadingContent: 'Preparing your content...',
    loadingWait: 'Just a moment...'
  };

  const topNav = document.querySelector('.top-nav');

  const normalizePath = (value = '') => value.replace(/^\.\//, '').replace(/^\//, '');
  const getRelativeRootPath = () => {
    const path = window.location.pathname || '';
    if (path.includes('/mock-test/teaching-exams/')) return '../../';
    if (path.includes('/mock-test/')) return '../';
    return './';
  };

  const isMockTestSectionPage = () => {
    const path = window.location.pathname || '';
    return path.endsWith('/mock-test.html') || path.includes('/mock-test/');
  };

  const setupActiveNavigation = () => {
    const currentPath = normalizePath(window.location.pathname.split('/').pop() || 'index.html') || 'index.html';
    const toolsRelatedPages = new Set([
      'tools.html',
      'tool.html',
      'resume-headline-generator.html',
      'leave-application-generator.html',
      'instagram-caption-generator.html'
    ]);

    const routeMap = {
      'index.html': 'index.html',
      'opportunities.html': 'opportunities.html',
      'opportunity-details.html': 'opportunities.html',
      'guides.html': 'career.html',
      'guide.html': 'career.html',
      'career.html': 'career.html',
      'templates.html': 'templates.html',
      'mock-test.html': 'mock-test.html',
      'about.html': 'about.html',
      'contact.html': 'contact.html',
      'privacy.html': 'index.html',
      'terms.html': 'index.html',
      'disclaimer.html': 'index.html',
      'license.html': 'index.html'
    };

    const targetPath = toolsRelatedPages.has(currentPath) ? 'tools.html' : routeMap[currentPath] || currentPath;

    document.querySelectorAll('.nav-link.nav-active').forEach((node) => {
      node.classList.remove('nav-active');
      node.removeAttribute('aria-current');
    });

    document.querySelectorAll('.nav-link[href]').forEach((link) => {
      const href = normalizePath(link.getAttribute('href') || '');
      if (href === targetPath) {
        link.classList.add('nav-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  };

  const setupPrimaryHeaderNavigation = () => {
    const base = getRelativeRootPath();
    const desktopMenu = document.querySelector('header.top-nav [data-menu]');
    const mobilePanel = document.querySelector('header.top-nav [data-mobile-panel] .space-y-1');

    if (desktopMenu && !desktopMenu.querySelector('a[href$="mock-test.html"]')) {
      const mockTestLink = document.createElement('a');
      mockTestLink.className = 'nav-link';
      mockTestLink.href = `${base}mock-test.html`;
      mockTestLink.textContent = 'Mock Test';

      const aboutLink = desktopMenu.querySelector('a[href$="about.html"]');
      const contactLink = desktopMenu.querySelector('a[href$="contact.html"]');
      desktopMenu.insertBefore(mockTestLink, aboutLink || contactLink || null);
    }

    if (mobilePanel && !mobilePanel.querySelector('a[href$="mock-test.html"]')) {
      const mobileMockTestLink = document.createElement('a');
      mobileMockTestLink.className = 'nav-link mobile-nav-link';
      mobileMockTestLink.href = `${base}mock-test.html`;
      mobileMockTestLink.textContent = 'Mock Test';

      const mobileAboutLink = mobilePanel.querySelector('a[href$="about.html"]');
      const mobileContactLink = mobilePanel.querySelector('a[href$="contact.html"]');
      mobilePanel.insertBefore(mobileMockTestLink, mobileAboutLink || mobileContactLink || null);
    }
  };

  const setupStickyNavShadow = () => {
    if (!topNav) {
      return;
    }

    const applyState = () => {
      topNav.classList.toggle('is-scrolled', window.scrollY > 10);
    };

    applyState();
    window.addEventListener('scroll', applyState, { passive: true });
  };

  const setupToastSystem = () => {
    let container = document.querySelector('[data-toast-container]');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-stack';
      container.setAttribute('data-toast-container', 'true');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(container);
    }

    const showToast = (type = 'info', title = FEEDBACK_MESSAGES.generalSuccess, description = '') => {
      const toast = document.createElement('div');
      toast.className = `toast-message toast-${type}`;

      const titleNode = document.createElement('strong');
      titleNode.textContent = String(title || FEEDBACK_MESSAGES.generalSuccess);
      toast.appendChild(titleNode);

      if (description) {
        const descriptionNode = document.createElement('p');
        descriptionNode.textContent = String(description);
        toast.appendChild(descriptionNode);
      }

      container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.add('is-visible');
      });

      const removeToast = () => {
        toast.classList.remove('is-visible');
        toast.addEventListener(
          'transitionend',
          () => {
            toast.remove();
          },
          { once: true }
        );
      };

      setTimeout(removeToast, 2300);
    };

    window.ToolShalaToast = {
      show: showToast,
      messages: FEEDBACK_MESSAGES
    };

    return showToast;
  };

  const showToast = setupToastSystem();

  const setupTelegramFeedback = () => {
    document.querySelectorAll('a[href*="t.me/toolshala"]').forEach((link) => {
      link.addEventListener('click', () => {
        showToast('info', FEEDBACK_MESSAGES.telegramOpen);
      });
    });
  };

  const setupMockTestHeader = () => {
    if (!isMockTestSectionPage()) return;

    const base = getRelativeRootPath();
    const body = document.body;
    const categorySlug = body?.getAttribute('data-mock-category') || '';
    const examSlug = body?.getAttribute('data-mock-exam') || new URLSearchParams(window.location.search).get('exam') || '';
    const categoryLabelMap = {
      'teaching-exams': 'Teaching Exams',
      'rajasthan-govt-exams': 'Rajasthan Govt Exams',
      'central-govt-exams': 'Central Govt Exams',
      'civil-services-exams': 'Civil Services Exams',
      'nursing-exams': 'Nursing Exams',
      'school-test': 'School Test',
      'other-state-govt-exams': 'Other State Govt Exams',
      'agriculture-exams': 'Agriculture Exams',
      'college-entrance-exams': 'College Entrance Exams',
      'miscellaneous-exams': 'Miscellaneous Exams'
    };

    const currentContext = categoryLabelMap[categorySlug] || (examSlug ? 'Exam Page' : 'Mock Test Hub');
    const categoryCrumb = categoryLabelMap[categorySlug] ? `<span aria-hidden="true">/</span><span>${categoryLabelMap[categorySlug]}</span>` : '';
    const examCrumb = examSlug ? '<span aria-hidden="true">/</span><span>Practice Set</span>' : '';
    const header = document.querySelector('header.top-nav');
    if (!header) return;

    header.innerHTML = `
      <nav class="nav-shell" aria-label="Main navigation">
        <a href="${base}index.html" class="brand-logo" aria-label="ToolShala home"><span class="brand-mark">ToolShala</span><span class="brand-dot" aria-hidden="true"></span></a>
        <button class="menu-toggle inline-flex items-center justify-center p-2 md:hidden" data-menu-toggle aria-label="Toggle menu"><svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16" /></svg></button>
        <div class="hidden items-center gap-2 md:flex" data-menu><a class="nav-link" href="${base}index.html">Home</a><a class="nav-link" href="${base}tools.html">Tools</a><a class="nav-link" href="${base}career.html">Career</a><a class="nav-link" href="${base}templates.html">Templates</a><a class="nav-link nav-active" href="${base}mock-test.html">Mock Test</a><a class="nav-link" href="${base}about.html">About</a><a class="nav-link" href="${base}contact.html">Contact</a><a href="${base}mock-test.html#mock-test-library" class="btn-primary ml-1">Browse Categories</a></div>
      </nav>
      <div class="px-4 pb-3 text-xs font-medium text-slate-500 sm:px-6"><div class="mx-auto flex max-w-7xl items-center gap-2"><span>Mock Test</span>${categoryCrumb}${examCrumb}<span class="ml-auto hidden sm:inline">${currentContext}</span></div></div>
      <div class="menu-panel md:hidden" data-mobile-panel><div class="space-y-1 px-4 py-4"><a class="nav-link mobile-nav-link" href="${base}index.html">Home</a><a class="nav-link mobile-nav-link" href="${base}tools.html">Tools</a><a class="nav-link mobile-nav-link" href="${base}career.html">Career</a><a class="nav-link mobile-nav-link" href="${base}templates.html">Templates</a><a class="nav-link nav-active mobile-nav-link" href="${base}mock-test.html">Mock Test</a><a class="nav-link mobile-nav-link" href="${base}about.html">About</a><a class="nav-link mobile-nav-link" href="${base}contact.html">Contact</a><a href="${base}mock-test.html#mock-test-library" class="btn-primary mt-2 w-full text-center">Browse Categories</a></div></div>
    `;
  };

  setupMockTestHeader();
  setupPrimaryHeaderNavigation();
  setupActiveNavigation();
  setupStickyNavShadow();
  setupTelegramFeedback();

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');
  const mobileLinks = document.querySelectorAll('[data-mobile-panel] a');

  if (menuToggle && mobilePanel) {
    const iconPath = menuToggle.querySelector('path');
    const hamburgerPath = 'M4 7h16M4 12h16M4 17h16';
    const closePath = 'M6 6l12 12M18 6L6 18';
    menuToggle.dataset.state = 'closed';

    if (!mobilePanel.id) {
      mobilePanel.id = 'mobile-menu-panel';
    }
    menuToggle.setAttribute('aria-controls', mobilePanel.id);
    menuToggle.setAttribute('aria-expanded', 'false');

    const closeMenu = () => {
      mobilePanel.classList.remove('is-open');
      menuToggle.dataset.state = 'closed';
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      if (iconPath) {
        iconPath.setAttribute('d', hamburgerPath);
      }
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = mobilePanel.classList.toggle('is-open');
      menuToggle.dataset.state = isOpen ? 'open' : 'closed';
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
      if (iconPath) {
        iconPath.setAttribute('d', isOpen ? closePath : hamburgerPath);
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('click', (event) => {
      const isMenuOpen = mobilePanel.classList.contains('is-open');
      if (!isMenuOpen) {
        return;
      }

      if (mobilePanel.contains(event.target) || menuToggle.contains(event.target)) {
        return;
      }

      closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobilePanel.classList.contains('is-open')) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    });
  }

  const setupPremiumFooter = () => {
    const footerBasePath = getRelativeRootPath();
    const currentPath = window.location.pathname || '';
    const currentMockCategory = document.body?.getAttribute('data-mock-category') || '';
    const currentExamSlug = document.body?.getAttribute('data-mock-exam') || new URLSearchParams(window.location.search).get('exam') || '';
    const categories = window.mockTestData?.categories || [];
    const categoryBySlug = Object.fromEntries(categories.map((category) => [category.slug, category]));
    const examData = window.mockTestData?.exams || {};
    const isRajasthanPage = currentMockCategory === 'rajasthan-govt-exams';
    const isCentralPage = currentMockCategory === 'central-govt-exams';
    const isCivilPage = currentMockCategory === 'civil-services-exams';
    const isNursingPage = currentMockCategory === 'nursing-exams';
    const isSchoolPage = currentMockCategory === 'school-test';
    const isOtherStatePage = currentMockCategory === 'other-state-govt-exams';
    const isAgriculturePage = currentMockCategory === 'agriculture-exams';
    const isCollegeEntrancePage = currentMockCategory === 'college-entrance-exams';
    const isMiscPage = currentMockCategory === 'miscellaneous-exams';
    let examLinkHeading = isRajasthanPage ? 'Rajasthan Exam Links' : isCentralPage ? 'Central Exam Links' : isCivilPage ? 'Civil Services Links' : isNursingPage ? 'Nursing Exam Links' : isSchoolPage ? 'School Class Links' : isOtherStatePage ? 'Other State Exam Links' : isAgriculturePage ? 'Agriculture Exam Links' : isCollegeEntrancePage ? 'College Entrance Links' : isMiscPage ? 'Misc Exam Links' : 'Teaching Exam Links';
    let examLinks = isRajasthanPage
      ? [
        { href: `${footerBasePath}mock-test/exam.html?exam=ras`, label: 'RAS' },
        { href: `${footerBasePath}mock-test/exam.html?exam=sub-inspector`, label: 'Sub Inspector' },
        { href: `${footerBasePath}mock-test/exam.html?exam=cet-12th`, label: 'CET 12th' },
        { href: `${footerBasePath}mock-test/exam.html?exam=cet-graduation`, label: 'CET Graduation' },
        { href: `${footerBasePath}mock-test/exam.html?exam=vdo`, label: 'VDO' },
        { href: `${footerBasePath}mock-test/exam.html?exam=patwar`, label: 'Patwar' }
      ]
      : isCentralPage
        ? [
          { href: `${footerBasePath}mock-test/exam.html?exam=ssc-cgl`, label: 'SSC CGL' },
          { href: `${footerBasePath}mock-test/exam.html?exam=ssc-gd`, label: 'SSC GD' },
          { href: `${footerBasePath}mock-test/exam.html?exam=delhi-police`, label: 'Delhi Police' },
          { href: `${footerBasePath}mock-test/exam.html?exam=ssc-chsl`, label: 'SSC CHSL' },
          { href: `${footerBasePath}mock-test/exam.html?exam=mts`, label: 'MTS' },
          { href: `${footerBasePath}mock-test/exam.html?exam=ntpc`, label: 'NTPC' }
        ]
      : isCivilPage
        ? [
          { href: `${footerBasePath}mock-test/exam.html?exam=upsc`, label: 'UPSC' },
          { href: `${footerBasePath}mock-test/exam.html?exam=bpsc`, label: 'BPSC' },
          { href: `${footerBasePath}mock-test/exam.html?exam=uppcs`, label: 'UPPCS' },
          { href: `${footerBasePath}mock-test/exam.html?exam=ras`, label: 'RAS' },
          { href: `${footerBasePath}mock-test/exam.html?exam=eo-ro`, label: 'EO & RO' },
          { href: `${footerBasePath}mock-test/exam.html?exam=ncert`, label: 'NCERT' }
        ]
      : isNursingPage
        ? [
          { href: `${footerBasePath}mock-test/exam.html?exam=norcet-12`, label: 'NORCET 12' },
          { href: `${footerBasePath}mock-test/exam.html?exam=norcet-11`, label: 'NORCET 11' },
          { href: `${footerBasePath}mock-test/exam.html?exam=aiims-cre`, label: 'AIIMS-CRE' },
          { href: `${footerBasePath}mock-test/exam.html?exam=rrb`, label: 'RRB Nursing' },
          { href: `${footerBasePath}mock-test/exam.html?exam=rajasthan-staff-nurse`, label: 'Rajasthan Staff Nurse' },
          { href: `${footerBasePath}mock-test/exam.html?exam=ssc-nursing-officer`, label: 'SSC Nursing Officer' }
        ]
      : isSchoolPage
        ? [
          { href: `${footerBasePath}mock-test/exam.html?exam=class-10`, label: 'Class 10th' },
          { href: `${footerBasePath}mock-test/exam.html?exam=class-9`, label: 'Class 9th' },
          { href: `${footerBasePath}mock-test/exam.html?exam=class-8`, label: 'Class 8th' },
          { href: `${footerBasePath}mock-test/exam.html?exam=class-7`, label: 'Class 7th' },
          { href: `${footerBasePath}mock-test/exam.html?exam=class-6`, label: 'Class 6th' },
          { href: `${footerBasePath}mock-test/exam.html?exam=class-12-science`, label: 'Class 12th Science' }
        ]
      : isOtherStatePage
        ? [
          { href: `${footerBasePath}mock-test/exam.html?exam=up-constable`, label: 'UP Constable' },
          { href: `${footerBasePath}mock-test/exam.html?exam=up-sub-inspector`, label: 'UP Sub Inspector' },
          { href: `${footerBasePath}mock-test/exam.html?exam=up-home-guard`, label: 'UP Home Guard' },
          { href: `${footerBasePath}mock-test/exam.html?exam=high-court-ro-aro`, label: 'High Court RO/ARO' },
          { href: `${footerBasePath}mock-test/exam.html?exam=high-court-group-c-d`, label: 'High Court Group C & D' },
          { href: `${footerBasePath}mock-test/exam.html?exam=up-vdo`, label: 'UP VDO' }
        ]
      : isAgriculturePage
        ? [
          { href: `${footerBasePath}mock-test/exam.html?exam=agriculture-supervisor`, label: 'Agriculture Supervisor' },
          { href: `${footerBasePath}mock-test/exam.html?exam=veterinary-officer`, label: 'Veterinary Officer' },
          { href: `${footerBasePath}mock-test/exam.html?exam=jet`, label: 'JET' },
          { href: `${footerBasePath}mock-test/exam.html?exam=rssb-teaching-associate`, label: 'RSSB Teaching Associate' },
          { href: `${footerBasePath}mock-test/exam.html?exam=pashu-parichar`, label: 'Pashu Parichar' },
          { href: `${footerBasePath}mock-test/exam.html?exam=food-safety-officer`, label: 'Food Safety Officer' }
        ]
      : isCollegeEntrancePage
        ? [
          { href: `${footerBasePath}mock-test/exam.html?exam=jee-12`, label: 'JEE Adv Class 12' },
          { href: `${footerBasePath}mock-test/exam.html?exam=jee-11`, label: 'JEE Adv Class 11' },
          { href: `${footerBasePath}mock-test/exam.html?exam=neet-12`, label: 'NEET UG Class 12' },
          { href: `${footerBasePath}mock-test/exam.html?exam=neet-11`, label: 'NEET UG Class 11' }
        ]
      : isMiscPage
        ? [
          { href: `${footerBasePath}mock-test/exam.html?exam=state-judicial-services`, label: 'State Judicial Services' },
          { href: `${footerBasePath}mock-test/exam.html?exam=ssc-je`, label: 'SSC JE' },
          { href: `${footerBasePath}mock-test/exam.html?exam=rssb-je`, label: 'RSSB JE' },
          { href: `${footerBasePath}mock-test/exam.html?exam=rpsc-ae`, label: 'RPSC AE' },
          { href: `${footerBasePath}mock-test/exam.html?exam=mathematics`, label: 'Mathematics' },
          { href: `${footerBasePath}mock-test/exam.html?exam=reasoning`, label: 'Reasoning' }
        ]
      : [
        { href: `${footerBasePath}mock-test/teaching-exams/bstc.html`, label: 'BSTC' },
        { href: `${footerBasePath}mock-test/teaching-exams/ptet.html`, label: 'PTET' },
        { href: `${footerBasePath}mock-test/teaching-exams/reet.html`, label: 'REET' },
        { href: `${footerBasePath}mock-test/teaching-exams/ctet.html`, label: 'CTET' },
        { href: `${footerBasePath}mock-test/teaching-exams/kvs.html`, label: 'KVS' },
        { href: `${footerBasePath}mock-test/teaching-exams/dsssb.html`, label: 'DSSSB' }
      ];
    const isHomePage = /(^|\/)index\.html$/.test(currentPath) || currentPath === '/' || (currentPath.endsWith('/') && !currentPath.includes('/mock-test/'));
    const isAboutPage = /(^|\/)about\.html$/.test(currentPath);
    const isContactPage = /(^|\/)contact\.html$/.test(currentPath);
    const usesPrimaryCategoryFooter = isHomePage || isAboutPage || isContactPage;
    const primaryCategoryLinks = [
      { href: `${footerBasePath}tools.html`, label: 'AI Tools' },
      { href: `${footerBasePath}opportunities.html#internships`, label: 'Internships' },
      { href: `${footerBasePath}opportunities.html#student-programs`, label: 'Scholarships' },
      { href: `${footerBasePath}ats-friendly-resume-template.html`, label: 'Resume Templates' },
      { href: `${footerBasePath}guides.html`, label: 'View All Guides' },
      { href: `${footerBasePath}linkedin-summary-template.html`, label: 'LinkedIn Templates' }
    ];
    const isToolsPage = /(^|\/)tools\.html$/.test(currentPath);
    const isTranscriptionPage = /(^|\/)transcription-tool\.html$/.test(currentPath);
    const isOpportunitiesPage = /(^|\/)opportunities\.html$/.test(currentPath) || /(^|\/)opportunity-details\.html$/.test(currentPath);
    const isTemplatesPage = /(^|\/)templates\.html$/.test(currentPath) || /-template\.html$/.test(currentPath);
    const isCareerGuidePage = /(^|\/)career\.html$/.test(currentPath) || /(^|\/)guides\.html$/.test(currentPath) || /(^|\/)guide\.html$/.test(currentPath);
    const isMockTestPage = /(^|\/)mock-test\.html$/.test(currentPath) || currentPath.includes('/mock-test/');

    let quickLinks = [
      { href: `${footerBasePath}index.html`, label: 'Home' },
      { href: `${footerBasePath}tools.html`, label: 'AI Tools' },
      { href: `${footerBasePath}opportunities.html`, label: 'Opportunities' },
      { href: `${footerBasePath}templates.html`, label: 'Templates' },
      { href: `${footerBasePath}guides.html`, label: 'Career Guides' },
      { href: `${footerBasePath}mock-test.html`, label: 'Mock Test' },
      { href: `${footerBasePath}contact.html`, label: 'Contact' }
    ];

    if (isMockTestPage && currentExamSlug && !currentMockCategory) {
      const examEntry = Object.values(categoryBySlug).find((category) => category.exams.includes(currentExamSlug));
      if (examEntry) {
        quickLinks.splice(1, 0, { href: `${footerBasePath}mock-test/${examEntry.slug}.html`, label: examEntry.title });
      }
    }

    if (isToolsPage) {
      examLinkHeading = 'AI Tools';
      examLinks = [
        { href: `${footerBasePath}tools.html`, label: 'All AI Tools' },
        { href: `${footerBasePath}tools.html#writing`, label: 'Writing Tools' },
        { href: `${footerBasePath}tools.html#career`, label: 'Career Tools' },
        { href: `${footerBasePath}tools.html#study`, label: 'Study Tools' },
        { href: `${footerBasePath}templates.html`, label: 'Templates' },
        { href: `${footerBasePath}guides.html`, label: 'Career Guides' }
      ];
    } else if (isTranscriptionPage) {
      examLinkHeading = 'Other AI Tools';
      examLinks = [
        { href: `${footerBasePath}tool.html?tool=photo-to-text`, label: 'Photo to Text' },
        { href: `${footerBasePath}tool.html?tool=instagram-caption-generator`, label: 'Instagram Caption Generator' },
        { href: `${footerBasePath}tool.html?tool=content-idea-generator`, label: 'Content Idea Generator' },
        { href: `${footerBasePath}tool.html?tool=notes-to-bullet-points-converter`, label: 'Notes to Bullet Points' },
        { href: `${footerBasePath}tool.html?tool=reel-shorts-hook-generator`, label: 'Reel & Shorts Hook Generator' },
        { href: `${footerBasePath}tools.html`, label: 'All AI Tools' }
      ];
    } else if (isOpportunitiesPage) {
      examLinkHeading = 'Opportunities';
      examLinks = [
        { href: `${footerBasePath}opportunities.html`, label: 'All Opportunities' },
        { href: `${footerBasePath}opportunities.html`, label: 'Internships' },
        { href: `${footerBasePath}opportunities.html`, label: 'Scholarships' },
        { href: `${footerBasePath}opportunities.html`, label: 'Free Courses' },
        { href: `${footerBasePath}templates.html`, label: 'Application Templates' },
        { href: `${footerBasePath}career.html`, label: 'Career Guides' }
      ];
    } else if (isTemplatesPage) {
      examLinkHeading = 'Templates';
      examLinks = [
        { href: `${footerBasePath}templates.html`, label: 'Template Hub' },
        { href: `${footerBasePath}templates.html#resume`, label: 'Resume Templates' },
        { href: `${footerBasePath}templates.html#email`, label: 'Email Templates' },
        { href: `${footerBasePath}templates.html#cover-letter`, label: 'Cover Letter Templates' },
        { href: `${footerBasePath}tools.html#career`, label: 'Career Tools' },
        { href: `${footerBasePath}opportunities.html`, label: 'Opportunities' }
      ];
    } else if (isCareerGuidePage) {
      examLinkHeading = 'Career Guides';
      examLinks = [
        { href: `${footerBasePath}career.html`, label: 'Career Home' },
        { href: `${footerBasePath}guides.html`, label: 'All Guides' },
        { href: `${footerBasePath}templates.html`, label: 'Templates' },
        { href: `${footerBasePath}tools.html#career`, label: 'Career Tools' },
        { href: `${footerBasePath}opportunities.html`, label: 'Opportunities' },
        { href: `${footerBasePath}contact.html`, label: 'Contact' }
      ];
    }

    if (isHomePage && !isMockTestPage && categories.length > 0) {
      examLinkHeading = 'Exam Categories';
      examLinks = categories.map((category) => ({ href: `${footerBasePath}mock-test/${category.slug}.html`, label: category.title }));
    } else if (isMockTestPage && !currentMockCategory && !currentExamSlug && categories.length > 0) {
      examLinkHeading = 'Mock Test Categories';
      examLinks = categories.map((category) => ({ href: `${footerBasePath}mock-test/${category.slug}.html`, label: category.title }));
    } else if (isMockTestPage && currentMockCategory && categoryBySlug[currentMockCategory]) {
      const currentCategory = categoryBySlug[currentMockCategory];
      const relatedExamLinks = currentCategory.exams.slice(0, 6).map((examKey) => {
        const exam = examData[examKey];
        if (!exam) return null;
        const href = currentMockCategory === 'teaching-exams' ? `${footerBasePath}mock-test/teaching-exams/${exam.slug}.html` : `${footerBasePath}mock-test/exam.html?exam=${exam.slug}`;
        return { href, label: exam.title };
      }).filter(Boolean);

      examLinkHeading = `${currentCategory.title} Links`;
      examLinks = [
        { href: `${footerBasePath}mock-test.html`, label: 'Mock Test Home' },
        { href: `${footerBasePath}mock-test/${currentCategory.slug}.html`, label: currentCategory.title },
        ...relatedExamLinks
      ];
    }

    if (isMockTestPage) {
      quickLinks = [
        { href: `${footerBasePath}index.html`, label: 'Home' },
        { href: `${footerBasePath}mock-test.html`, label: 'Mock Test Home' },
        { href: `${footerBasePath}mock-test/teaching-exams.html`, label: 'Teaching Exams' },
        { href: `${footerBasePath}mock-test/rajasthan-govt-exams.html`, label: 'Rajasthan Govt Exams' },
        { href: `${footerBasePath}mock-test/central-govt-exams.html`, label: 'Central Govt Exams' },
        { href: `${footerBasePath}career.html`, label: 'Career Guides' },
        { href: `${footerBasePath}contact.html`, label: 'Contact' }
      ];
    }

    if (usesPrimaryCategoryFooter) {
      examLinkHeading = 'Categories';
      examLinks = primaryCategoryLinks;
    }

    const seenFooterLinks = new Set();
    examLinks = examLinks.filter((item) => {
      if (!item || !item.href || !item.label) return false;
      if (seenFooterLinks.has(item.href)) return false;
      seenFooterLinks.add(item.href);
      return true;
    });

    const footerTemplate = `
      <div class="footer-shell">
        <div class="footer-grid grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="${footerBasePath}index.html" class="brand-logo" aria-label="ToolShala home">
              <span class="brand-mark">ToolShala</span><span class="brand-dot" aria-hidden="true"></span>
            </a>
            <p class="footer-intro mt-3 max-w-xs text-sm text-slate-600">
              Useful tools and opportunities for students and freshers.
            </p>
            <p class="footer-mission mt-3 text-sm text-slate-500">Built to help students take better next steps.</p>
          </div>

          <div>
            <h3 class="foot-title">Quick Links</h3>
            <ul class="foot-list">
              ${quickLinks.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join('')}
            </ul>
          </div>

          <div>
            <h3 class="foot-title">${examLinkHeading}</h3>
            <ul class="foot-list">
              ${examLinks.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join('')}
            </ul>
          </div>

          <div>
            <h3 class="foot-title">Newsletter</h3>
            <p class="mt-2 text-sm text-slate-600">Get internships, scholarships, and free templates directly in your inbox.</p>
            <form class="newsletter-form mt-3" data-newsletter-form data-loading-label="Subscribing..." data-success-message="You are subscribed to ToolShala newsletter.">
              <label class="sr-only" for="footer-newsletter-email">Email address</label>
              <input id="footer-newsletter-email" type="email" required placeholder="Enter your email address" class="newsletter-input focus:border-indigo-500 focus:outline-none" />
              <button type="submit" class="btn-primary">Subscribe Free</button>
            </form>
            <ul class="footer-news-points">
              <li>Get daily internships</li>
              <li>Scholarships and templates in your inbox</li>
            </ul>
            <p class="newsletter-microcopy mt-2">Get practical updates, not unnecessary emails.</p>
            <p class="newsletter-status hidden" aria-live="polite"></p>
            <div class="footer-social mt-4">
              <h4 class="footer-social-title">Follow ToolShala</h4>
              <nav class="social-links" aria-label="ToolShala social media links">
                <a class="social-link" href="https://x.com/Toolshala1" target="_blank" rel="noopener noreferrer" aria-label="Follow ToolShala on X / Twitter"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.8 10.47 21.12 2h-1.73l-6.36 7.35L7.96 2H2.11l7.68 11.15L2.11 22h1.73l6.72-7.76L15.93 22h5.85l-7.98-11.53Zm-2.38 2.75-.78-1.11L4.45 3.3h2.68l4.99 7.11.78 1.11 6.49 9.24h-2.68l-5.29-7.54Z"/></svg></a>
                <a class="social-link" href="https://youtube.com/@toolshala" target="_blank" rel="noopener noreferrer" aria-label="Subscribe to ToolShala on YouTube"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.58 7.2a2.93 2.93 0 00-2.06-2.07C17.7 4.62 12 4.62 12 4.62s-5.7 0-7.52.5A2.93 2.93 0 002.42 7.2 30.3 30.3 0 002 12a30.3 30.3 0 00.42 4.8 2.93 2.93 0 002.06 2.07c1.82.5 7.52.5 7.52.5s5.7 0 7.52-.5a2.93 2.93 0 002.06-2.07A30.3 30.3 0 0022 12a30.3 30.3 0 00-.42-4.8zM10.09 15.02V8.98L15.27 12l-5.18 3.02z"/></svg></a>
                <a class="social-link" href="https://www.instagram.com/toolshala1" target="_blank" rel="noopener noreferrer" aria-label="Follow ToolShala on Instagram"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm8.35 1.73h-8.2a4.17 4.17 0 00-4.17 4.17v8.2a4.17 4.17 0 004.17 4.17h8.2a4.17 4.17 0 004.17-4.17v-8.2a4.17 4.17 0 00-4.17-4.17zm-4.1 3.93A4.34 4.34 0 1112 16.34a4.34 4.34 0 010-8.68zm0 1.73a2.61 2.61 0 102.61 2.61A2.61 2.61 0 0012 9.39zm4.61-2.5a1.04 1.04 0 11-1.04 1.04 1.04 1.04 0 011.04-1.04z"/></svg></a>
                <a class="social-link" href="https://t.me/toolshala" target="_blank" rel="noopener noreferrer" aria-label="Join ToolShala on Telegram"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.93 4.37a1.62 1.62 0 00-1.64-.26L3.18 10.72c-1.17.45-1.15 2.1.03 2.52l4.34 1.54 1.66 5.08c.36 1.1 1.78 1.39 2.54.51l2.42-2.79 4.44 3.25c.96.71 2.34.16 2.53-1.02l2.78-13.82c.13-.64-.14-1.27-.67-1.62Zm-3.05 3.31-8.43 7.61-.32 3.02-1.07-3.27 9.82-7.36Z"/></svg></a>
                <a class="social-link" href="https://www.reddit.com/user/Toolshala" target="_blank" rel="noopener noreferrer" aria-label="Follow ToolShala on Reddit"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.75 11.84a2.19 2.19 0 00-3.71-1.58 10.62 10.62 0 00-5.37-1.61l.91-4.29 2.98.63a1.7 1.7 0 103.38-.34 1.7 1.7 0 00-2.75-1.34l-3.86-.82a.74.74 0 00-.88.57L11.28 8.7a10.79 10.79 0 00-5.33 1.61 2.19 2.19 0 10-2.41 3.55c-.03.21-.05.43-.05.65 0 3.21 3.82 5.82 8.52 5.82s8.52-2.61 8.52-5.82c0-.23-.02-.46-.06-.68.77-.38 1.28-1.15 1.28-2Zm-14.16 1.6a1.49 1.49 0 112.98 0 1.49 1.49 0 01-2.98 0Zm7.77 3.92c-.97.72-2.04.91-3.36.91s-2.39-.19-3.36-.91a.68.68 0 11.81-1.09c.62.46 1.37.65 2.55.65s1.93-.19 2.55-.65a.68.68 0 11.81 1.09Zm.23-2.43a1.49 1.49 0 110-2.98 1.49 1.49 0 010 2.98Z"/></svg></a>
              </nav>
            </div>
          </div>
        </div>

        <div class="legal-row flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; <span data-year></span> ToolShala. All rights reserved.</p>
          <div class="legal-links flex flex-wrap items-center gap-3 sm:gap-4">
            <span class="legal-label">Legal</span>
            <a href="${footerBasePath}privacy.html">Privacy Policy</a>
            <a href="${footerBasePath}terms.html">Terms &amp; Conditions</a>
            <a href="${footerBasePath}disclaimer.html">Disclaimer</a>
            <a href="${footerBasePath}license.html">License</a>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll('footer').forEach((footer) => {
      footer.innerHTML = footerTemplate;
    });
  };

  setupPremiumFooter();

  document.querySelectorAll('[data-year]').forEach((yearNode) => {
    yearNode.textContent = String(new Date().getFullYear());
  });

  const setupGlobalLinkDefaults = () => {
    const legalMap = {
      'privacy policy': './privacy.html',
      terms: './terms.html',
      disclaimer: './disclaimer.html',
      license: './license.html'
    };

    document.querySelectorAll('a').forEach((link) => {
      const href = (link.getAttribute('href') || '').trim();
      const label = (link.textContent || '').trim().toLowerCase();
      const aria = (link.getAttribute('aria-label') || '').trim().toLowerCase();

      if (href === '#') {
        if (legalMap[label]) {
          link.setAttribute('href', legalMap[label]);
          return;
        }

        if (aria === 'instagram') {
          link.setAttribute('href', 'https://www.instagram.com/toolshala');
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
          return;
        }

        if (aria === 'youtube') {
          link.setAttribute('href', 'https://www.youtube.com/@toolshala');
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
          return;
        }

        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes('telegram')) {
          link.setAttribute('href', 'https://t.me/toolshala');
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
          return;
        }
      }
    });
  };

  const setupSkipLink = () => {
    const main = document.querySelector('main');
    if (!main) {
      return;
    }

    if (!main.id) {
      main.id = 'main-content';
    }

    if (document.querySelector('.skip-link')) {
      return;
    }

    const skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = `#${main.id}`;
    skipLink.textContent = 'Skip to main content';
    document.body.insertAdjacentElement('afterbegin', skipLink);
  };

  const setupFaqAccordion = () => {
    const groups = document.querySelectorAll('.faq-list[data-accordion="single"]');
    if (!groups.length) {
      return;
    }

    groups.forEach((group) => {
      const items = group.querySelectorAll('details.faq-item');
      items.forEach((item) => {
        item.addEventListener('toggle', () => {
          if (!item.open) {
            return;
          }

          items.forEach((other) => {
            if (other !== item) {
              other.open = false;
            }
          });
        });
      });
    });
  };

  const contentCollections = window.ToolShalaContent?.collections || null;
  const articleCollections = window.ToolShalaArticleContent?.collections || null;
  const rawSeoGuides = Array.isArray(articleCollections?.seoGuides) ? articleCollections.seoGuides : [];

  const formatPublishedDate = (value) => {
    if (!value) {
      return 'Recently updated';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const escapeHtml = (value = '') =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const normalizeTags = (tags) => (Array.isArray(tags) ? tags.join(' ') : '');

  const resolveToolLink = (tool) => {
    const hasLiveUrl = tool.url && tool.url !== '#';
    const category = String(tool.category || '').toLowerCase();
    const defaultLabel = category === 'ai' || category === 'social' ? 'Try Tool' : 'Use Tool';
    return {
      href: hasLiveUrl ? tool.url : `./contact.html?request=${encodeURIComponent(tool.slug || tool.id || 'tool')}`,
      label: hasLiveUrl ? tool.ctaLabel || defaultLabel : 'Request Access'
    };
  };

  const resolveOpportunityLink = (opportunity) =>
    opportunity.applyLink && opportunity.applyLink !== '#'
      ? opportunity.applyLink
      : `./contact.html?opportunity=${encodeURIComponent(opportunity.slug || opportunity.id || 'opportunity')}`;

  const resolveInternalPath = (path = '') => {
    const routeMap = {
      '/': './index.html',
      '/tools': './tools.html',
      '/templates': './templates.html',
      '/career': './career.html',
      '/opportunities': './opportunities.html',
      '/about': './about.html',
      '/contact': './contact.html',
      '/privacy': './privacy.html',
      '/terms': './terms.html',
      '/disclaimer': './disclaimer.html',
      '/license': './license.html',
      '/guides': './guides.html'
    };

    if (path.startsWith('/guides/')) {
      const slug = path.replace('/guides/', '').replace(/^\/+/, '');
      return `./guide.html?slug=${encodeURIComponent(slug)}`;
    }

    return routeMap[path] || path;
  };

  const normalizeGuideSlug = (value = '') => String(value).replace(/^\/?guides\//, '').replace(/^\/+/, '');
  const normalizeGuideCategory = (value = '') =>
    String(value || 'Guide')
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  const toGuideTimestamp = (value = '') => {
    const parsed = Date.parse(value || '');
    return Number.isNaN(parsed) ? 0 : parsed;
  };
  const toGuideOrderValue = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
  };
  const sortGuides = (guides = []) =>
    [...guides].sort((a, b) => {
      const featureDiff = Number(Boolean(b?.featured)) - Number(Boolean(a?.featured));
      if (featureDiff !== 0) return featureDiff;

      const orderDiff = toGuideOrderValue(a?.order) - toGuideOrderValue(b?.order);
      if (orderDiff !== 0) return orderDiff;

      const publishDiff = toGuideTimestamp(b?.publishDate) - toGuideTimestamp(a?.publishDate);
      if (publishDiff !== 0) return publishDiff;

      return String(a?.title || '').localeCompare(String(b?.title || ''), 'en', { sensitivity: 'base' });
    });
  const ensureUniqueGuidesBySlug = (guides = []) => {
    const seenSlugs = new Set();
    return guides.filter((guide) => {
      const slugKey = normalizeGuideSlug(guide?.slug || '');
      if (!slugKey || seenSlugs.has(slugKey)) {
        return false;
      }
      seenSlugs.add(slugKey);
      return true;
    });
  };
  const seoGuides = sortGuides(
    ensureUniqueGuidesBySlug(
      rawSeoGuides.map((guide) => ({
        ...guide,
        category: normalizeGuideCategory(guide?.category)
      }))
    )
  );
  const guideSlugAliases = {
    'business-analyst-roadmap-for-beginners': 'business-analyst-roadmap',
    'graphic-designer-roadmap-for-beginners': 'graphic-designer-roadmap',
    'no-code-automation-specialist-roadmap-for-beginners': 'no-code-automation-specialist-roadmap',
    'how-to-find-internship': 'internship-kaise-dhoondein'
  };
  const guideSlugSet = new Set(seoGuides.map((guide) => normalizeGuideSlug(guide.slug)));
  const resolveGuideSlugAlias = (value = '') => {
    const normalized = normalizeGuideSlug(value);
    return guideSlugAliases[normalized] || normalized;
  };
  const getValidGuidePath = (path = '') => {
    if (!path.startsWith('/guides/')) {
      return path;
    }
    const canonicalSlug = resolveGuideSlugAlias(path);
    if (guideSlugSet.has(canonicalSlug)) {
      return `/guides/${canonicalSlug}`;
    }
    console.warn(`[ToolShala] Skipping unknown guide link: ${path}`);
    return '';
  };
  const getGuidePath = (guide) => {
    const rawSlug = typeof guide === 'string' ? guide : guide?.slug || '';
    return getValidGuidePath(rawSlug.startsWith('/guides/') ? rawSlug : `/guides/${normalizeGuideSlug(rawSlug)}`);
  };
  const resolveGuideLink = (guide) => {
    const canonicalPath = getGuidePath(guide);
    const slug = normalizeGuideSlug(canonicalPath || guide?.slug || guide || '');
    return `./guide.html?slug=${encodeURIComponent(slug)}`;
  };

  const getRelatedGuides = (currentGuide, limit = 3) => {
    if (!currentGuide || !seoGuides.length) {
      return [];
    }

    const scored = seoGuides
      .filter((guide) => normalizeGuideSlug(guide.slug) !== normalizeGuideSlug(currentGuide.slug))
      .map((guide) => {
        let score = 0;
        if (guide.category === currentGuide.category) {
          score += 2;
        }
        if ((guide.primaryKeyword || '') === (currentGuide.primaryKeyword || '')) {
          score += 1;
        }

        const hasMutualLink = Array.isArray(currentGuide.relatedLinks)
          ? currentGuide.relatedLinks.some((link) => link === getGuidePath(guide))
          : false;
        if (hasMutualLink) {
          score += 2;
        }

        return { guide, score };
      })
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return sortGuides([a.guide, b.guide])[0] === a.guide ? -1 : 1;
      });

    return scored.slice(0, limit).map((entry) => entry.guide);
  };

  const createDataAttributes = (attributes = {}) =>
    Object.entries(attributes)
      .map(([key, value]) => ` ${key}="${escapeHtml(value ?? '')}"`)
      .join('');

  const renderCollection = ({ container, items, renderer }) => {
    if (!container || !Array.isArray(items) || !items.length) {
      return;
    }

    container.innerHTML = items.map(renderer).join('');
  };

  const renderToolsFromData = () => {
    const container = document.getElementById('toolsGrid');
    const featuredContainer = document.getElementById('featuredToolsGrid');
    const tools = contentCollections?.tools;

    const toolsCategoryConfig = [
      {
        key: 'writing',
        title: 'Writing Tool',
        subtitle: 'Draft, improve, humanize, and format practical writing for applications, messages, and everyday work.',
        icon: '✍️',
        accent: 'indigo'
      },
      {
        key: 'ai',
        title: 'AI Tool',
        subtitle: 'Use AI-powered helpers for text extraction, notes, summaries, flashcards, and quick content generation.',
        icon: '✨',
        accent: 'violet'
      },
      {
        key: 'freelance',
        title: 'Freelance Tool',
        subtitle: 'Create client-ready proposals, invoices, rate cards, checklists, and project communication faster.',
        icon: '🤝',
        accent: 'emerald'
      },
      {
        key: 'career',
        title: 'Career Tool',
        subtitle: 'Build stronger resumes, LinkedIn profiles, job applications, portfolios, and interview communication.',
        icon: '💼',
        accent: 'sky'
      },
      {
        key: 'productivity',
        title: 'Productivity Tool',
        subtitle: 'Plan priorities, organize tasks, and turn messy work into simple next actions.',
        icon: '✅',
        accent: 'amber'
      },
      {
        key: 'social',
        title: 'Social Tool',
        subtitle: 'Generate captions, hashtags, bios, hooks, calendars, and short-form ideas for social platforms.',
        icon: '📣',
        accent: 'pink'
      },
      {
        key: 'creator',
        title: 'Creator Tool',
        subtitle: 'Plan creator workflows for videos, newsletters, repurposing, scripts, and content production.',
        icon: '🎬',
        accent: 'orange'
      },
      {
        key: 'study',
        title: 'Student Tool',
        subtitle: 'Study smarter with planners, revision timetables, explainers, flashcards, quizzes, and scholarship helpers.',
        icon: '📚',
        accent: 'cyan'
      },
      {
        key: 'teacher',
        title: 'Teacher Tool',
        subtitle: 'Prepare lesson plans, classroom activities, worksheets, quiz sets, and parent communication notes.',
        icon: '🧑‍🏫',
        accent: 'lime'
      }
    ];

    const categoryMeta = new Map(toolsCategoryConfig.map((category) => [category.key, category]));
    const resolveToolCategoryKey = (tool = {}) => {
      const label = String(tool.categoryLabel || '').toLowerCase();
      const category = String(tool.category || '').toLowerCase();
      const tags = normalizeTags(tool.tags).toLowerCase();
      const haystack = `${label} ${category} ${tags}`;

      if (label.includes('freelance')) return 'freelance';
      if (label.includes('creator')) return 'creator';
      if (label.includes('productivity')) return 'productivity';
      if (label.includes('social')) return 'social';
      if (label.includes('writing')) return 'writing';
      if (label.includes('teacher')) return 'teacher';
      if (label.includes('student')) return 'study';
      if (label.includes('career')) return 'career';
      if (label.includes('ai') || label.includes('ocr')) return 'ai';
      if (haystack.includes('freelance')) return 'freelance';
      if (haystack.includes('creator') || haystack.includes('youtube') || haystack.includes('newsletter')) return 'creator';
      if (haystack.includes('productivity') || haystack.includes('priority') || haystack.includes('to-do')) return 'productivity';
      if (haystack.includes('social') || haystack.includes('instagram') || haystack.includes('whatsapp') || haystack.includes('hashtag') || haystack.includes('reel')) return 'social';
      if (haystack.includes('writing') || haystack.includes('email') || haystack.includes('letter') || haystack.includes('paragraph')) return 'writing';
      if (haystack.includes('teacher') || haystack.includes('classroom') || haystack.includes('lesson') || haystack.includes('worksheet')) return 'teacher';
      if (haystack.includes('student') || haystack.includes('study') || haystack.includes('exam') || haystack.includes('quiz') || haystack.includes('scholarship')) return 'study';
      if (haystack.includes('career') || haystack.includes('resume') || haystack.includes('linkedin') || haystack.includes('job')) return 'career';
      if (haystack.includes('ai') || haystack.includes('ocr') || category === 'ai') return 'ai';
      return category || 'ai';
    };

    if (featuredContainer && Array.isArray(tools) && tools.length) {
      const featuredOrder = [
        'photo-to-text',
        'resume-headline-generator',
        'freelance-proposal-generator',
        'freelance-rate-card-generator',
        'client-onboarding-checklist-generator',
        'freelancer-invoice-generator',
        'content-repurposing-generator-creators',
        'youtube-video-title-generator',
        'newsletter-subject-line-generator',
        'social-media-content-calendar-generator',
        'reel-shorts-hook-generator',
        'daily-priority-planner',
        'classroom-activity-planner-teachers',
        'parent-teacher-meeting-note-generator',
        'exam-revision-timetable-generator',
        'concept-simplifier-topic-explainer',
        'student-study-planner-generator',
        'lecture-notes-summarizer',
        'flashcard-generator',
        'quiz-mcq-generator',
        'lesson-plan-generator-for-teachers',
        'worksheet-practice-sheet-generator',
        'instagram-caption-generator',
        'youtube-shorts-script-generator',
        'hashtag-generator',
        'whatsapp-message-generator'
      ];
      const orderIndex = new Map(featuredOrder.map((slug, index) => [slug, index]));
      const featuredTools = tools
        .filter((tool) => tool.featured)
        .sort((a, b) => {
          const aIndex = orderIndex.has(a.slug) ? orderIndex.get(a.slug) : featuredOrder.length;
          const bIndex = orderIndex.has(b.slug) ? orderIndex.get(b.slug) : featuredOrder.length;
          return aIndex - bIndex || String(a.title || '').localeCompare(String(b.title || ''));
        })
        .slice(0, 8);

      renderCollection({
        container: featuredContainer,
        items: featuredTools,
        renderer: (tool, index) => {
          const cta = resolveToolLink(tool);
          const icon = ['✦', '📄', '🤝', '💸', '🗓️', '🎬', '📚', '📝'][index % 8];
          return `<article class="tools-featured-card"><div class="tools-featured-card-top"><span class="tools-featured-icon" aria-hidden="true">${escapeHtml(icon)}</span><span class="tools-featured-badge">${escapeHtml(tool.categoryLabel || tool.category)}</span></div><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><a href="${escapeHtml(cta.href)}" class="tools-featured-cta">${escapeHtml(cta.label || 'Try Tool')}</a></article>`;
        }
      });
    }

    if (!container || !Array.isArray(tools) || !tools.length) {
      return;
    }

    const groupedTools = tools.reduce((groups, tool) => {
      const key = resolveToolCategoryKey(tool);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(tool);
      return groups;
    }, new Map());

    const orderedSections = toolsCategoryConfig
      .filter((category) => groupedTools.has(category.key))
      .concat(
        Array.from(groupedTools.keys())
          .filter((key) => !categoryMeta.has(key))
          .map((key) => ({
            key,
            title: `${key.replace(/-/g, ' ')} Tool`,
            subtitle: 'Browse practical ToolShala tools in this category.',
            icon: '🧰',
            accent: 'slate'
          }))
      );

    container.innerHTML = orderedSections
      .map((category) => {
        const sectionTools = groupedTools.get(category.key) || [];
        const toolCountLabel = `${sectionTools.length} tool${sectionTools.length === 1 ? '' : 's'}`;
        const cards = sectionTools
          .map((tool) => {
            const tags = normalizeTags(tool.tags);
            const cta = resolveToolLink(tool);
            const attrs = createDataAttributes({
              'data-id': tool.id,
              'data-slug': tool.slug,
              'data-featured': tool.featured ? 'true' : 'false',
              'data-published': tool.publishedAt,
              'data-tags': tags,
              'data-name': tool.title,
              'data-category': category.key,
              'data-original-category': tool.category,
              'data-category-label': tool.categoryLabel,
              'data-description': `${tool.description} ${tool.categoryLabel || ''} ${tags}`
            });
            const topTags = tags
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((tag) => `<span>${escapeHtml(tag.replace(/-/g, ' '))}</span>`)
              .join('');

            return `<article class="item-card reveal tool-card tools-modern-card"${attrs}><div class="tools-card-top"><span class="tools-card-badge">${escapeHtml(tool.categoryLabel || category.title)}</span>${tool.featured ? '<span class="tools-popular-badge">Popular</span>' : ''}</div><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p>${topTags ? `<div class="tools-card-tags" aria-label="Tool tags">${topTags}</div>` : ''}<p class="tools-card-meta">Updated ${formatPublishedDate(tool.publishedAt)}</p><a href="${escapeHtml(cta.href)}">${escapeHtml(cta.label || 'Open Tool')}</a></article>`;
          })
          .join('');

        return `<section id="${escapeHtml(category.key)}" class="tools-category-section reveal" data-tool-section="${escapeHtml(category.key)}"><div class="tools-category-head"><div class="tools-category-title-wrap"><span class="tools-category-icon tools-category-icon-${escapeHtml(category.accent)}" aria-hidden="true">${escapeHtml(category.icon)}</span><div><p class="tools-category-kicker">${escapeHtml(toolCountLabel)}</p><h2>${escapeHtml(category.title)}</h2><p>${escapeHtml(category.subtitle)}</p></div></div><a class="tools-section-anchor" href="#${escapeHtml(category.key)}">#${escapeHtml(category.key)}</a></div><div class="tools-category-grid">${cards}</div></section>`;
      })
      .join('');
  };

  const renderOpportunitiesFromData = () => {
    const featuredContainer = document.getElementById('featuredOpportunityGrid');
    const listContainer = document.getElementById('opportunityGrid');
    const opportunities = contentCollections?.opportunities;
    if (!listContainer || !Array.isArray(opportunities) || !opportunities.length) {
      return;
    }

    const opportunityCategoryConfig = [
      {
        key: 'internships',
        title: 'Internships for Students',
        subtitle: 'Remote, paid, part-time, and domain-focused internship tracks for Indian students and freshers.',
        icon: '🎓'
      },
      {
        key: 'student-programs',
        title: 'Student Programs',
        subtitle: 'Scholarships, fellowships, bootcamps, hackathons, competitions, certifications, and campus programs.',
        icon: '🏆'
      },
      {
        key: 'freelance-gigs',
        title: 'Freelance Gigs',
        subtitle: 'Project-based writing, design, video editing, web, no-code, and AI automation work for freelancers.',
        icon: '💼'
      },
      {
        key: 'creator-opportunities',
        title: 'Creator Opportunities',
        subtitle: 'UGC projects, creator collabs, affiliate programs, ambassador roles, and social media work.',
        icon: '🎬'
      },
      {
        key: 'career-jobs',
        title: 'Career / Fresher Roles',
        subtitle: 'Entry-level jobs, apprenticeships, trainee roles, graduate openings, and skill-based hiring tracks.',
        icon: '🚀'
      }
    ];
    const categoryMeta = new Map(opportunityCategoryConfig.map((category) => [category.key, category]));

    const badgeClassMap = {
      'Closing Soon': 'op-badge-soon',
      New: 'op-badge-new',
      Popular: 'op-badge-popular'
    };

    const createOpportunityCard = (opportunity, isFeatured = false, index = 0) => {
      const tags = normalizeTags(opportunity.tags);
      const badge = opportunity.badge || '';
      const badgeClass = badgeClassMap[badge] || 'op-badge-new';
      const ctaClass = isFeatured ? 'btn-primary mt-4' : 'btn-secondary mt-4';
      const wrapperClass = isFeatured ? 'op-featured opportunity-card-modern' : 'op-card opportunity-card-modern';
      const applyLink = resolveOpportunityLink(opportunity);
      const isRemote = `${opportunity.mode || ''} ${opportunity.location || ''} ${tags}`.toLowerCase().includes('remote');
      const attrs = createDataAttributes({
        'data-id': opportunity.id,
        'data-slug': opportunity.slug,
        'data-featured': opportunity.featured ? 'true' : 'false',
        'data-published': opportunity.publishedAt,
        'data-tags': tags,
        'data-name': opportunity.title,
        'data-category': opportunity.category,
        'data-category-label': opportunity.categoryLabel,
        'data-eligibility': opportunity.eligibility,
        'data-deadline': opportunity.deadline,
        'data-mode': opportunity.mode,
        'data-location': opportunity.location || opportunity.mode,
        'data-description': `${opportunity.description} ${opportunity.categoryLabel || ''} ${opportunity.location || ''} ${tags}`,
        'data-apply-link': applyLink,
        'data-remote': isRemote ? 'true' : 'false',
        'data-sort-index': index
      });
      const topTags = tags
        .split(' ')
        .filter(Boolean)
        .slice(0, 3)
        .map((tag) => `<span>${escapeHtml(tag.replace(/-/g, ' '))}</span>`)
        .join('');

      return `<article class="${wrapperClass} reveal opportunity-card"${attrs}><div class="op-card-top"><span class="op-badge ${badgeClass}">${escapeHtml(badge || 'New')}</span><span class="op-mode">${escapeHtml(opportunity.mode || 'India')}</span></div><h3>${escapeHtml(opportunity.title)}</h3><p class="op-card-desc">${escapeHtml(opportunity.description)}</p><div class="op-card-meta"><p><strong>For:</strong> ${escapeHtml(opportunity.eligibility)}</p><p><strong>Location:</strong> ${escapeHtml(opportunity.location || opportunity.mode || 'India')}</p><p><strong>Type:</strong> ${escapeHtml(opportunity.categoryLabel)}</p></div>${topTags ? `<div class="op-card-tags" aria-label="Opportunity tags">${topTags}</div>` : ''}<div class="op-card-footer"><span class="op-deadline">${escapeHtml(opportunity.deadline)}</span><span class="op-published">Updated ${formatPublishedDate(opportunity.publishedAt)}</span></div><button type="button" class="${ctaClass}" data-op-detail-button>${escapeHtml(opportunity.ctaLabel || 'View Opportunity')}</button></article>`;
    };

    const featuredItems = opportunities.filter((opportunity) => opportunity.featured).slice(0, 3);
    if (featuredContainer && featuredItems.length) {
      renderCollection({
        container: featuredContainer,
        items: featuredItems,
        renderer: (opportunity, index) => createOpportunityCard(opportunity, true, index)
      });
    }

    const groupedOpportunities = opportunities.reduce((groups, opportunity) => {
      const key = opportunity.category || 'student-programs';
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(opportunity);
      return groups;
    }, new Map());

    const orderedSections = opportunityCategoryConfig
      .filter((category) => groupedOpportunities.has(category.key))
      .concat(
        Array.from(groupedOpportunities.keys())
          .filter((key) => !categoryMeta.has(key))
          .map((key) => ({
            key,
            title: key.replace(/-/g, ' '),
            subtitle: 'India-focused opportunities for students, freelancers, creators, and freshers.',
            icon: '📌'
          }))
      );

    let cardIndex = 0;
    listContainer.innerHTML = orderedSections
      .map((category) => {
        const sectionItems = groupedOpportunities.get(category.key) || [];
        const cards = sectionItems
          .map((opportunity) => createOpportunityCard(opportunity, false, cardIndex++))
          .join('');
        const countLabel = `${sectionItems.length} opportunity${sectionItems.length === 1 ? '' : 'ies'}`;
        return `<section id="${escapeHtml(category.key)}" class="op-category-section reveal" data-op-section="${escapeHtml(category.key)}"><div class="op-category-head"><div><p class="op-section-kicker"><span aria-hidden="true">${escapeHtml(category.icon)}</span> ${escapeHtml(countLabel)}</p><h3>${escapeHtml(category.title)}</h3><p>${escapeHtml(category.subtitle)}</p></div><a href="#${escapeHtml(category.key)}" class="op-section-link">#${escapeHtml(category.key)}</a></div><div class="op-category-grid">${cards}</div></section>`;
      })
      .join('');
  };

  const renderTemplatesFromData = () => {
    const container = document.getElementById('templateLibraryGrid');
    const templates = contentCollections?.templates;

    renderCollection({
      container,
      items: templates,
      renderer: (template) => {
        const tags = normalizeTags(template.tags);
        const attrs = createDataAttributes({
          'data-id': template.id,
          'data-slug': template.slug,
          'data-featured': template.featured ? 'true' : 'false',
          'data-published': template.publishedAt,
          'data-tags': tags,
          'data-name': template.title,
          'data-category': template.category,
          'data-category-label': template.categoryLabel,
          'data-description': `${template.description} ${tags}`,
          'data-preview': template.preview
        });

        const templateLink = template.pageUrl
          ? `<a href="${escapeHtml(template.pageUrl)}" class="btn-secondary">Open Template</a>`
          : `<button type="button" class="btn-secondary" data-template-preview>View Template</button>`;

        return `<article class="template-card reveal"${attrs}><span class="template-badge">${escapeHtml(template.categoryLabel)}</span><h3>${escapeHtml(template.title)}</h3><p>${escapeHtml(template.description)}</p><p class="card-helper-text">Use as a starting point and customize to fit your needs.</p><p class="template-meta">${Number(template.downloads || 0).toLocaleString('en-IN')}+ downloads • Updated ${formatPublishedDate(template.publishedAt)}</p><div class="template-actions">${templateLink}<button type="button" class="btn-primary" data-template-download>Download Template</button></div><pre class="hidden" data-template-body>${escapeHtml(template.content || template.preview || '')}</pre></article>`;
      }
    });
  };

  const renderTestimonialsFromData = () => {
    const container = document.getElementById('homeTestimonialsGrid');
    const testimonials = contentCollections?.testimonials;

    renderCollection({
      container,
      items: testimonials,
      renderer: (testimonial) => {
        const initials = (testimonial.name || '')
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();
        const roleLine = [testimonial.role, testimonial.location].filter(Boolean).join(' • ');
        const attrs = createDataAttributes({
          'data-id': testimonial.id,
          'data-slug': testimonial.slug,
          'data-published': testimonial.publishedAt
        });

        return `<article class="testimonial-card reveal"${attrs}><div class="testimonial-head"><span class="testimonial-avatar" aria-hidden="true">${escapeHtml(initials || 'TS')}</span><div><p class="testimonial-name">${escapeHtml(testimonial.name)}</p><p class="testimonial-role">${escapeHtml(roleLine || 'ToolShala Learner')}</p></div></div><p class="testimonial-quote">"${escapeHtml(testimonial.quote)}"</p></article>`;
      }
    });
  };

  const renderCareerGuidesFromData = () => {
    const container = document.getElementById('careerGuidesGrid');
    const fallbackGuides = contentCollections?.careerGuides;
    const guides = seoGuides.length
      ? seoGuides
          .filter((guide) => guide.featured)
          .slice(0, 6)
          .map((guide) => ({
            id: guide.id,
            slug: guide.slug,
            title: guide.title,
            excerpt: guide.shortExcerpt,
            category: (guide.category || 'Guide').toLowerCase().replace(/\s+/g, '-'),
            categoryLabel: guide.category,
            publishedAt: guide.publishDate,
            featured: guide.featured,
            url: resolveGuideLink(guide),
            ctaText: guide.ctaText,
            readingTime: guide.readingTime
          }))
      : fallbackGuides;

    if (container && (!Array.isArray(guides) || !guides.length)) {
      container.innerHTML = `
        <div class="no-results no-results-inline" id="careerGuidesEmpty">
          <p class="empty-title">No career guides available yet.</p>
          <p class="empty-desc">We're adding more practical guides soon.</p>
          <div class="empty-actions">
            <a href="./tools.html" class="btn-secondary">Explore All Tools</a>
            <a href="./index.html" class="btn-secondary">Go Back Home</a>
          </div>
        </div>
      `;
      return;
    }

    renderCollection({
      container,
      items: guides,
      renderer: (guide) => {
        const attrs = createDataAttributes({
          'data-id': guide.id,
          'data-slug': guide.slug,
          'data-featured': guide.featured ? 'true' : 'false',
          'data-published': guide.publishedAt,
          'data-category': guide.category
        });

        const meta = [guide.readingTime, guide.audience].filter(Boolean).join(' • ');
        return `<article class="feature-card career-guide-feature reveal"${attrs}><div class="career-guide-feature-head"><span class="path-badge">${escapeHtml(guide.categoryLabel || 'Career Guide')}</span>${meta ? `<span>${escapeHtml(meta)}</span>` : ''}</div><h3>${escapeHtml(guide.title)}</h3><p>${escapeHtml(guide.excerpt)}</p><p class="card-helper-text">Recommended next step: read the guide, note the skill list, then use ToolShala tools/templates to create proof of work.</p><a href="${escapeHtml(guide.url || './career.html')}" class="career-action-link mt-4">${escapeHtml(guide.ctaText || 'Read Guide')}</a></article>`;
      }
    });
  };

  const renderHomepageGuidesPreview = () => {
    const container = document.getElementById('homeCareerGuidesGrid');
    if (!container || !seoGuides.length) {
      return;
    }

    const previewGuides = seoGuides.filter((guide) => guide.featured).slice(0, 4);
    renderCollection({
      container,
      items: previewGuides,
      renderer: (guide, index) => {
        const tag = guide.category;
        const attrs = createDataAttributes({
          'data-id': guide.id,
          'data-slug': guide.slug,
          'data-category': guide.category,
          'data-published': guide.publishDate
        });

        const featureClass = index === 0 ? ' career-guide-featured' : '';
        return `<article class="item-card career-guide-card${featureClass} reveal" role="listitem"${attrs}><div class="career-guide-top"><span class="career-guide-tag">${escapeHtml(tag)}</span><span class="career-guide-meta">${escapeHtml(guide.readingTime)}</span></div><h3>${escapeHtml(guide.title)}</h3><p>${escapeHtml(guide.shortExcerpt)}</p><p class="career-guide-meta">By ${escapeHtml(guide.author)} </p><a href="${escapeHtml(resolveGuideLink(guide))}" class="btn-secondary mt-4">${escapeHtml(guide.ctaText || 'Read Guide')}</a></article>`;
      }
    });
  };

  const renderSeoGuidesListing = () => {
    const featuredContainer = document.getElementById('featuredSeoGuidesGrid');
    const listingContainer = document.getElementById('seoGuidesGrid');
    if (!seoGuides.length || (!featuredContainer && !listingContainer)) {
      return;
    }

    const featuredItems = seoGuides.filter((guide) => guide.featured).slice(0, 6);
    const featuredIds = new Set(featuredItems.map((guide) => guide.id));

    if (featuredContainer) {
      renderCollection({
        container: featuredContainer,
        items: featuredItems,
        renderer: (guide) =>
          `<article class="feature-card reveal"><p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">${escapeHtml(guide.category)}</p><h3>${escapeHtml(
            guide.title
          )}</h3><p>${escapeHtml(guide.shortExcerpt)}</p><p class="mt-2 text-xs text-slate-500">${escapeHtml(guide.readingTime)} • ${escapeHtml(
            formatPublishedDate(guide.publishDate)
          )}</p><a href="${escapeHtml(resolveGuideLink(guide))}" class="mt-3 inline-flex font-semibold text-indigo-700" aria-label="Read guide: ${escapeHtml(
            guide.title
          )}">${escapeHtml(
            guide.ctaText || 'Read Guide'
          )}</a></article>`
      });
    }

    if (listingContainer) {
      const listItems = seoGuides.filter((guide) => !featuredIds.has(guide.id));
      if (!listItems.length) {
        listingContainer.innerHTML =
          '<div class="no-results no-results-inline"><p class="empty-title">No additional guides right now.</p><p class="empty-desc">Please check featured guides above.</p></div>';
      } else {
        renderCollection({
          container: listingContainer,
          items: listItems,
          renderer: (guide) =>
            `<article class="item-card reveal"><p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">${escapeHtml(guide.category)}</p><h3>${escapeHtml(
              guide.title
            )}</h3><p>${escapeHtml(guide.shortExcerpt)}</p><p class="mt-2 text-xs text-slate-500">${escapeHtml(guide.readingTime)} • ${escapeHtml(
              guide.searchIntent
            )}</p><a href="${escapeHtml(resolveGuideLink(guide))}" class="btn-secondary mt-4" aria-label="Read guide: ${escapeHtml(
              guide.title
            )}">${escapeHtml(guide.ctaText || 'Read Guide')}</a></article>`
        });
      }
    }
  };

  const renderSeoGuideDetail = () => {
    const root = document.getElementById('seoGuideDetailPage');
    if (!root || !seoGuides.length) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const slug = normalizeGuideSlug(params.get('slug') || '');
    const guide = seoGuides.find((entry) => normalizeGuideSlug(entry.slug) === slug);

    if (!guide) {
      setRobotsMeta('noindex, follow');
      setCanonicalUrl(`${SITE_ORIGIN}/guides.html`);
      root.innerHTML = `<section class="section-wrap"><div class="no-results"><p class="empty-title">This page doesn't seem to exist.</p><p class="empty-desc">Let's get you back to something useful.</p><div class="empty-actions"><a href="./guides.html" class="btn-primary">Browse All Guides</a><a href="./index.html" class="btn-secondary">Go Back Home</a></div></div></section>`;
      return;
    }

    setRobotsMeta('index, follow');
    document.title = guide.metaTitle;
    const setMeta = (selector, value) => {
      const node = document.querySelector(selector);
      if (node && value) {
        node.setAttribute('content', value);
      }
    };

    setMeta('meta[name="description"]', guide.metaDescription);
    setMeta('meta[property="og:title"]', guide.metaTitle);
    setMeta('meta[property="og:description"]', guide.metaDescription);
    setMeta('meta[name="twitter:title"]', guide.metaTitle);
    setMeta('meta[name="twitter:description"]', guide.metaDescription);

    const h1Node = root.querySelector('[data-guide-title]');
    const excerptNode = root.querySelector('[data-guide-excerpt]');
    const keywordNode = root.querySelector('[data-guide-keyword]');
    const intentNode = root.querySelector('[data-guide-intent]');
    const readingNode = root.querySelector('[data-guide-reading]');
    const authorNode = root.querySelector('[data-guide-author]');
    const statusNode = root.querySelector('[data-guide-status]');
    const publishNode = root.querySelector('[data-guide-publish]');
    const ctaNode = root.querySelector('[data-guide-cta]');
    const ctaSecondaryNode = root.querySelector('[data-guide-cta-secondary]');
    const breadcrumbNode = root.querySelector('[data-guide-breadcrumb-current]');
    const linkPoolNode = root.querySelector('[data-guide-link-pool]');
    const introNode = root.querySelector('[data-guide-intro]');
    const snippetNode = root.querySelector('[data-guide-snippet]');
    const sectionsNode = root.querySelector('[data-guide-sections]');
    const faqListNode = root.querySelector('[data-guide-faq-list]');
    const faqWrapNode = root.querySelector('[data-guide-faq-wrap]');
    const conclusionWrapNode = root.querySelector('[data-guide-conclusion-wrap]');
    const conclusionNode = root.querySelector('[data-guide-conclusion]');
    const ctaTitleNode = root.querySelector('[data-guide-cta-title]');
    const ctaTextNode = root.querySelector('[data-guide-cta-text]');

    if (h1Node) h1Node.textContent = guide.title;
    if (excerptNode) excerptNode.textContent = guide.shortExcerpt;
    if (keywordNode) keywordNode.textContent = guide.primaryKeyword;
    if (intentNode) intentNode.textContent = guide.searchIntent;
    if (readingNode) readingNode.textContent = guide.readingTime;
    if (authorNode) authorNode.textContent = guide.author;
    if (statusNode) statusNode.textContent = guide.status;
    if (publishNode) publishNode.textContent = formatPublishedDate(guide.publishDate);
    if (breadcrumbNode) breadcrumbNode.textContent = guide.title;

    const content = guide.guideContent || guide.content || (guide.body ? { intro: guide.body } : null);
    if (introNode) {
      introNode.textContent = content?.overview || content?.intro || guide.shortExcerpt;
    }
    if (snippetNode) {
      if (content?.featuredSnippet) {
        snippetNode.textContent = content.featuredSnippet;
        snippetNode.classList.remove('hidden');
      } else {
        snippetNode.classList.add('hidden');
      }
    }

    if (sectionsNode) {
      const sections = Array.isArray(content?.sections) ? content.sections : [];
      const bodyParagraphs = typeof guide.body === 'string' && guide.body.trim() ? guide.body.split(/\n{2,}/).filter(Boolean) : [];
      const relatedLinks = Array.isArray(guide.relatedLinks)
        ? guide.relatedLinks.map((link) => getValidGuidePath(link)).filter(Boolean).slice(0, 5)
        : [];
      const linkSection = relatedLinks.length
        ? `<section class="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5"><h2 class="text-2xl font-extrabold text-slate-900">Explore Related ToolShala Resources</h2><p class="mt-3 text-slate-700">Use these internal resources to continue learning, build your portfolio, and polish applications.</p><div class="mt-4 flex flex-wrap gap-3">${relatedLinks
            .map((link) => `<a href="${escapeHtml(resolveInternalPath(link))}" class="btn-secondary">${escapeHtml(link.replace('/guides/', '').replace(/^\//, '').replace(/-/g, ' '))}</a>`)
            .join('')}</div></section>`
        : '';

      if (sections.length) {
        sectionsNode.innerHTML =
          sections
            .map((section) => {
              const paragraphs = (section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
              const bullets = (section.bullets || []).length
                ? `<ul class="mt-3 list-disc space-y-2 pl-5 text-slate-700">${section.bullets.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul>`
                : '';
              const subSections = (section.subSections || [])
                .map((subSection) => {
                  const subParagraphs = (subSection.paragraphs || [])
                    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
                    .join('');
                  const subBullets = (subSection.bullets || []).length
                    ? `<ul class="mt-2 list-disc space-y-2 pl-5 text-slate-700">${subSection.bullets
                        .map((point) => `<li>${escapeHtml(point)}</li>`)
                        .join('')}</ul>`
                    : '';
                  return `<div class="mt-4"><h3 class="text-lg font-bold text-slate-900">${escapeHtml(
                    subSection.heading || ''
                  )}</h3>${subParagraphs}${subBullets}</div>`;
                })
                .join('');

              return `<section><h2 class="text-2xl font-extrabold text-slate-900">${escapeHtml(
                section.heading || ''
              )}</h2><div class="mt-3 space-y-3 text-slate-700">${paragraphs}</div>${bullets}${subSections}</section>`;
            })
            .join('') + linkSection;
      } else if (bodyParagraphs.length) {
        sectionsNode.innerHTML = `<section><h2 class="text-2xl font-extrabold text-slate-900">${escapeHtml(
          guide.title
        )}</h2><div class="mt-3 space-y-3 text-slate-700">${bodyParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div></section>${linkSection}`;
      } else {
        sectionsNode.innerHTML = `<section><h2 class="text-2xl font-extrabold text-slate-900">${escapeHtml(
          guide.title
        )}</h2><p class="mt-3 text-slate-700">${escapeHtml(guide.shortExcerpt || guide.metaDescription || 'This guide is being prepared by ToolShala.')}</p></section>${linkSection}`;
      }
    }

    if (faqListNode) {
      const faqs = Array.isArray(content?.faq) ? content.faq : [];
      if (faqs.length) {
        faqListNode.innerHTML = faqs
          .map(
            (faq, index) =>
              `<details class="faq-item"${index === 0 ? ' open' : ''}><summary>${escapeHtml(faq.question || '')}</summary><p>${escapeHtml(
                faq.answer || ''
              )}</p></details>`
          )
          .join('');
        faqWrapNode?.classList.remove('hidden');
      } else {
        faqWrapNode?.classList.add('hidden');
      }
    }

    if (conclusionNode) {
      if (content?.conclusion) {
        conclusionNode.textContent = content.conclusion;
        conclusionWrapNode?.classList.remove('hidden');
      } else {
        conclusionWrapNode?.classList.add('hidden');
      }
    }

    if (ctaTitleNode) {
      ctaTitleNode.textContent = content?.cta?.title || 'Next Step';
    }
    if (ctaTextNode) {
      ctaTextNode.textContent = content?.cta?.text || 'Explore related resources to take action.';
    }

    if (ctaNode) {
      ctaNode.textContent = content?.cta?.primaryLabel || guide.ctaText || 'Read Guide';
      const primaryCtaLink = content?.cta?.primaryLink || (Array.isArray(guide.relatedLinks) && guide.relatedLinks.length ? getValidGuidePath(guide.relatedLinks[0]) || '/tools' : '/tools');
      ctaNode.setAttribute('href', resolveInternalPath(primaryCtaLink));
    }

    if (ctaSecondaryNode) {
      const secondaryLabel = content?.cta?.secondaryLabel;
      const secondaryLink = content?.cta?.secondaryLink;
      if (secondaryLabel && secondaryLink) {
        ctaSecondaryNode.textContent = secondaryLabel;
        ctaSecondaryNode.setAttribute('href', resolveInternalPath(secondaryLink));
        ctaSecondaryNode.classList.remove('hidden');
      } else {
        ctaSecondaryNode.classList.add('hidden');
      }
    }

    if (linkPoolNode) {
      const links = Array.isArray(guide.relatedLinks)
        ? guide.relatedLinks.map((link) => getValidGuidePath(link)).filter(Boolean)
        : [];
      linkPoolNode.innerHTML = links
        .slice(0, 4)
        .map((link) => `<a href="${escapeHtml(resolveInternalPath(link))}" class="btn-secondary">${escapeHtml(link.replace('/guides/', '').replace(/-/g, ' '))}</a>`)
        .join('');
    }

    const relatedContainer = root.querySelector('#relatedGuidesGrid');
    const relatedGuides = getRelatedGuides(guide, 3);
    if (relatedContainer) {
      if (relatedGuides.length) {
        renderCollection({
          container: relatedContainer,
          items: relatedGuides,
          renderer: (entry) =>
            `<article class="item-card reveal"><p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">${escapeHtml(entry.category)}</p><h3>${escapeHtml(
              entry.title
            )}</h3><p>${escapeHtml(entry.shortExcerpt)}</p><a href="${escapeHtml(resolveGuideLink(entry))}" class="btn-secondary mt-4">Read Guide</a></article>`
        });
      } else {
        relatedContainer.innerHTML = '<article class="item-card"><h3>No related guides available yet.</h3></article>';
      }
    }

    const canonicalGuidePath = getGuidePath(guide);
    const canonicalGuideUrl = `${SITE_ORIGIN}/guide.html?slug=${encodeURIComponent(normalizeGuideSlug(canonicalGuidePath))}`;
    setCanonicalUrl(canonicalGuideUrl);

    const schemaNode = document.getElementById('guideSchema');
    if (schemaNode) {
      const schemaPayload = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.metaDescription,
        datePublished: guide.publishDate,
        dateModified: guide.publishDate,
        author: {
          '@type': 'Organization',
          name: guide.author
        },
        publisher: {
          '@type': 'Organization',
          name: 'ToolShala',
          url: 'https://toolshala.in/'
        },
        mainEntityOfPage: canonicalGuideUrl
      };

      if (Array.isArray(content?.faq) && content.faq.length) {
        schemaPayload.mainEntity = content.faq.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }));
      }

      schemaNode.textContent = JSON.stringify(schemaPayload, null, 2);
    }
  };

  renderToolsFromData();
  renderOpportunitiesFromData();
  renderTemplatesFromData();
  renderTestimonialsFromData();
  renderCareerGuidesFromData();
  renderHomepageGuidesPreview();
  renderSeoGuidesListing();
  renderSeoGuideDetail();

  const setupCtaCopyPolish = () => {
    const exactReplacements = new Map([
      ['Latest Opportunities', 'Browse Opportunities'],
      ['View All Opportunities ->', 'See All Opportunities ->'],
      ['View All Templates ->', 'Explore Templates ->'],
      ['Explore Now', 'Start Exploring'],
      ['Use Featured Tool', 'Start Using'],
      ['Join Telegram Updates', 'Join Telegram Now'],
      ['Join Telegram Channel', 'Join Telegram Now'],
      ['Get Instant Alerts', 'Get Instant Updates'],
      ['Get Templates', 'Explore Templates'],
      ['Career Guides', 'View All Guides'],
      ['View', 'View Template'],
      ['Download', 'Download Template'],
      ['Read Career Guides', 'Start Learning'],
      ['See Career Roadmap', 'See Roadmap'],
      ['Explore Guides', 'Explore Career Paths'],
      ['Notify Me', 'Contact Team'],
      ['Generate Headlines', 'Generate Now'],
      ['Generate Application', 'Generate Now'],
      ['Generate Captions', 'Generate Now']
    ]);

    document.querySelectorAll('a, button').forEach((node) => {
      const original = node.textContent?.trim();
      if (!original) {
        return;
      }

      const replacement = exactReplacements.get(original);
      if (replacement) {
        node.textContent = replacement;
      }
    });

    // Keep newsletter CTAs consistent and action-focused.
    document
      .querySelectorAll('form[data-newsletter-form] button[type="submit"], footer form button[type="submit"]')
      .forEach((button) => {
        const inCompact = button.closest('.newsletter-compact');
        button.textContent = inCompact ? 'Get Updates' : 'Subscribe Free';
      });

    // Keep telegram actions concise and mobile-friendly.
    document.querySelectorAll('.telegram-cta .btn-primary').forEach((button) => {
      button.textContent = 'Join Telegram Now';
    });
    document.querySelectorAll('.telegram-cta .btn-secondary').forEach((button) => {
      button.textContent = 'Get Instant Updates';
    });
  };

  setupCtaCopyPolish();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  const setupFilter = ({
    cardSelector,
    filterSelector,
    filterAttr,
    searchInput,
    searchAttrs = ['data-name'],
    clearButton,
    noResultsNode,
    resultCountNode,
    resultLabel = 'tool',
    syncHash = false
  }) => {
    const cards = Array.from(document.querySelectorAll(cardSelector));
    const buttons = Array.from(document.querySelectorAll(filterSelector));
    if (!cards.length || !buttons.length) {
      return;
    }

    const initialActive = buttons.find((button) => button.classList.contains('active'));
    let activeCategory = (initialActive?.getAttribute(filterAttr) || 'all').toLowerCase();

    const setActiveButton = (nextCategory) => {
      activeCategory = nextCategory;
      buttons.forEach((btn) => {
        const value = (btn.getAttribute(filterAttr) || '').toLowerCase();
        btn.classList.toggle('active', value === nextCategory);
      });
    };

    const syncFilterFromHash = () => {
      if (!syncHash) {
        return;
      }

      const hashValue = window.location.hash.replace('#', '').toLowerCase();
      if (!hashValue) {
        setActiveButton('all');
        return;
      }

      const isValidCategory = buttons.some(
        (button) => (button.getAttribute(filterAttr) || '').toLowerCase() === hashValue
      );

      if (isValidCategory) {
        setActiveButton(hashValue);
      }
    };

    const render = () => {
      const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';
      let visibleCount = 0;

      cards.forEach((card) => {
        const category = (card.getAttribute('data-category') || '').toLowerCase();
        const categoryMatch = activeCategory === 'all' || category === activeCategory;
        const searchableText = searchAttrs
          .map((attr) => card.getAttribute(attr) || '')
          .join(' ')
          .toLowerCase();
        const searchMatch = !searchValue || searchableText.includes(searchValue);
        const isVisible = categoryMatch && searchMatch;
        card.classList.toggle('hidden', !isVisible);
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (cardSelector.includes('tool-card')) {
        const toolSections = Array.from(document.querySelectorAll('[data-tool-section]'));
        toolSections.forEach((section) => {
          const visibleCards = Array.from(section.querySelectorAll('.tool-card')).filter(
            (card) => !card.classList.contains('hidden')
          );
          section.classList.toggle('hidden', visibleCards.length === 0);
        });
      }

      if (cardSelector.includes('opportunity-card')) {
        const opportunitySections = Array.from(document.querySelectorAll('[data-op-section]'));
        opportunitySections.forEach((section) => {
          const visibleCards = Array.from(section.querySelectorAll('.opportunity-card')).filter(
            (card) => !card.classList.contains('hidden')
          );
          section.classList.toggle('hidden', visibleCards.length === 0);
        });
      }

      if (noResultsNode) {
        noResultsNode.classList.toggle('hidden', visibleCount > 0);
      }

      if (resultCountNode) {
        const label = resultLabel === 'opportunity'
          ? visibleCount === 1 ? 'opportunity' : 'opportunities'
          : `${resultLabel}${visibleCount === 1 ? '' : 's'}`;
        resultCountNode.textContent = `${visibleCount} ${label} found`;
      }

      if (clearButton) {
        const hasSearch = Boolean(searchInput && searchInput.value.trim());
        const hasCategory = activeCategory !== 'all';
        clearButton.disabled = !hasSearch && !hasCategory;
      }
    };

    if (searchInput) {
      searchInput.addEventListener('input', render);
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const selectedCategory = (button.getAttribute(filterAttr) || 'all').toLowerCase();
        setActiveButton(selectedCategory);

        if (syncHash) {
          const newHash = selectedCategory === 'all' ? '' : `#${selectedCategory}`;
          const nextUrl = `${window.location.pathname}${window.location.search}${newHash}`;
          window.history.replaceState(null, '', nextUrl);
        }

        render();
      });
    });

    if (clearButton) {
      clearButton.addEventListener('click', () => {
        setActiveButton('all');

        if (searchInput) {
          searchInput.value = '';
        }

        if (syncHash) {
          const nextUrl = `${window.location.pathname}${window.location.search}`;
          window.history.replaceState(null, '', nextUrl);
        }

        render();
        showToast('info', FEEDBACK_MESSAGES.filterReset);
      });
    }

    if (syncHash) {
      syncFilterFromHash();
      window.addEventListener('hashchange', () => {
        syncFilterFromHash();
        render();
      });
    }

    render();
  };

  const filterConfigs = [
    {
      cardSelector: '.tool-card',
      filterSelector: '[data-tool-filter]',
      filterAttr: 'data-tool-filter',
      searchInput: document.getElementById('toolSearch'),
      searchAttrs: ['data-name', 'data-category', 'data-description'],
      clearButton: document.getElementById('toolClearFilters'),
      noResultsNode: document.getElementById('toolNoResults'),
      resultCountNode: document.getElementById('toolResultsCount'),
      resultLabel: 'tool',
      syncHash: true
    },
    {
      cardSelector: '#opportunityGrid .opportunity-card',
      filterSelector: '[data-op-filter]',
      filterAttr: 'data-op-filter',
      searchInput: document.getElementById('opportunitySearch'),
      searchAttrs: ['data-name', 'data-category', 'data-category-label', 'data-eligibility', 'data-mode', 'data-location', 'data-description', 'data-tags'],
      clearButton: document.getElementById('opportunityClearFilters'),
      noResultsNode: document.getElementById('opportunityNoResults'),
      resultCountNode: document.getElementById('opportunityResultsCount'),
      resultLabel: 'opportunity'
    },
    {
      cardSelector: '#templateLibraryGrid .template-card',
      filterSelector: '[data-template-filter]',
      filterAttr: 'data-template-filter',
      searchInput: document.getElementById('templateSearch'),
      searchAttrs: ['data-name', 'data-category', 'data-description'],
      clearButton: document.getElementById('templateClearFilters'),
      noResultsNode: document.getElementById('templateNoResults')
    }
  ];

  filterConfigs.forEach((config) => setupFilter(config));

  const setupOpportunitySort = () => {
    const sortSelect = document.getElementById('opportunitySort');
    if (!sortSelect) {
      return;
    }

    const getTime = (card) => Date.parse(card.getAttribute('data-published') || '') || 0;
    const getOriginalIndex = (card) => Number(card.getAttribute('data-sort-index') || 0);

    const sortCards = () => {
      const sortValue = sortSelect.value || 'featured';
      document.querySelectorAll('[data-op-section] .op-category-grid').forEach((grid) => {
        const cards = Array.from(grid.querySelectorAll('.opportunity-card'));
        cards
          .sort((a, b) => {
            if (sortValue === 'newest') {
              return getTime(b) - getTime(a) || getOriginalIndex(a) - getOriginalIndex(b);
            }
            if (sortValue === 'remote') {
              const aRemote = a.getAttribute('data-remote') === 'true' ? 1 : 0;
              const bRemote = b.getAttribute('data-remote') === 'true' ? 1 : 0;
              return bRemote - aRemote || getTime(b) - getTime(a) || getOriginalIndex(a) - getOriginalIndex(b);
            }
            const aFeatured = a.getAttribute('data-featured') === 'true' ? 1 : 0;
            const bFeatured = b.getAttribute('data-featured') === 'true' ? 1 : 0;
            return bFeatured - aFeatured || getTime(b) - getTime(a) || getOriginalIndex(a) - getOriginalIndex(b);
          })
          .forEach((card) => grid.appendChild(card));
      });
    };

    sortSelect.addEventListener('change', sortCards);
    sortCards();
  };

  setupOpportunitySort();

  const setupOpportunityModal = () => {
    const modal = document.getElementById('opportunityModal');
    if (!modal) {
      return;
    }

    const titleNode = modal.querySelector('[data-modal-title]');
    const categoryNode = modal.querySelector('[data-modal-category]');
    const eligibilityNode = modal.querySelector('[data-modal-eligibility]');
    const deadlineNode = modal.querySelector('[data-modal-deadline]');
    const modeNode = modal.querySelector('[data-modal-mode]');
    const descriptionNode = modal.querySelector('[data-modal-description]');
    const applyNode = modal.querySelector('[data-modal-apply]');
    const closeButtons = modal.querySelectorAll('[data-modal-close]');
    const detailButtons = document.querySelectorAll('[data-op-detail-button]');

    const openModal = (card) => {
      if (!card) {
        return;
      }

      titleNode.textContent = card.getAttribute('data-name') || 'Opportunity Details';
      categoryNode.textContent = card.getAttribute('data-category-label') || card.getAttribute('data-category') || 'Opportunity';
      eligibilityNode.textContent = card.getAttribute('data-eligibility') || 'Open to all';
      deadlineNode.textContent = card.getAttribute('data-deadline') || 'Check listing';
      modeNode.textContent = card.getAttribute('data-mode') || 'Online';
      descriptionNode.textContent = card.getAttribute('data-description') || 'Please review eligibility and deadline before applying.';

      const applyLink = card.getAttribute('data-apply-link') || '#';
      applyNode.setAttribute('href', applyLink);

      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    };

    const closeModal = () => {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    };

    detailButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.opportunity-card');
        openModal(card);
      });
    });

    closeButtons.forEach((button) => {
      button.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  };

  setupOpportunityModal();

  const setupTemplateLibrary = () => {
    const modal = document.getElementById('templatePreviewModal');
    const previewButtons = document.querySelectorAll('[data-template-preview]');
    const downloadButtons = document.querySelectorAll('[data-template-download]');
    if (!previewButtons.length && !downloadButtons.length) {
      return;
    }

    const slugify = (value) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const getCardPayload = (card) => {
      const title = card.getAttribute('data-name') || 'ToolShala Template';
      const category = card.getAttribute('data-category-label') || card.getAttribute('data-category') || 'Template';
      const preview = card.getAttribute('data-preview') || 'Template preview';
      const bodyText = card.querySelector('[data-template-body]')?.textContent?.trim() || preview;
      return { title, category, preview, bodyText };
    };

    const downloadTemplate = ({ title, bodyText }) => {
      const blob = new Blob([bodyText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${slugify(title) || 'template'}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('success', FEEDBACK_MESSAGES.downloadSuccess);
    };

    downloadButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.template-card');
        if (!card) {
          return;
        }
        downloadTemplate(getCardPayload(card));
      });
    });

    if (!modal) {
      return;
    }

    const titleNode = modal.querySelector('[data-template-modal-title]');
    const categoryNode = modal.querySelector('[data-template-modal-category]');
    const previewNode = modal.querySelector('[data-template-modal-preview]');
    const bodyNode = modal.querySelector('[data-template-modal-body]');
    const copyButton = modal.querySelector('[data-template-modal-copy]');
    const downloadButton = modal.querySelector('[data-template-modal-download]');
    const closeButtons = modal.querySelectorAll('[data-template-modal-close]');
    const copyFeedback = document.getElementById('templateCopyFeedback');

    let activeTemplate = {
      title: 'ToolShala Template',
      category: 'Template',
      preview: 'Template preview',
      bodyText: ''
    };

    const openModal = (templateData) => {
      activeTemplate = templateData;
      titleNode.textContent = templateData.title;
      categoryNode.textContent = templateData.category;
      previewNode.textContent = templateData.preview;
      bodyNode.textContent = templateData.bodyText;
      showMessage(copyFeedback, '');
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    };

    const closeModal = () => {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    };

    previewButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.template-card');
        if (!card) {
          return;
        }
        openModal(getCardPayload(card));
      });
    });

    attachCopyHandler(copyButton, () => activeTemplate.bodyText, copyFeedback);

    downloadButton?.addEventListener('click', () => {
      downloadTemplate(activeTemplate);
    });

    closeButtons.forEach((button) => {
      button.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const postJson = async (url, payload) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.ok === false) {
      throw new Error(data?.error || 'Request failed.');
    }

    return data;
  };

  const getCurrentPagePath = () => `${window.location.pathname || '/'}${window.location.search || ''}`;

  const copyText = async (text) => {
    if (!text) {
      return false;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', 'true');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(helper);
    return copied;
  };

  const showMessage = (element, text) => {
    if (!element) {
      return;
    }

    if (!text) {
      element.textContent = '';
      element.classList.add('hidden');
      return;
    }

    element.textContent = text;
    element.classList.remove('hidden');
  };

  const setNewsletterStatus = (statusNode, type, message) => {
    if (!statusNode) {
      return;
    }

    const finalMessage = message;

    statusNode.classList.remove('hidden', 'is-success', 'is-error');
    statusNode.textContent = finalMessage;
    statusNode.classList.add(type === 'success' ? 'is-success' : 'is-error');
  };

  const ensureFooterNewsletterMeta = (form) => {
    if (!form.closest('footer')) {
      return;
    }

    const parent = form.parentElement;
    if (!parent) {
      return;
    }

    if (!parent.querySelector('.footer-news-points')) {
      const points = document.createElement('ul');
      points.className = 'footer-news-points';
      points.innerHTML = '<li>Daily internships and scholarships</li><li>Free templates and AI tools</li>';
      form.insertAdjacentElement('afterend', points);
    }

    if (!parent.querySelector('.newsletter-microcopy')) {
      const microcopy = document.createElement('p');
      microcopy.className = 'newsletter-microcopy mt-2';
      microcopy.textContent = 'Get practical updates, not unnecessary emails.';
      form.insertAdjacentElement('afterend', microcopy);
    }
  };

  const setupMicrocopyPolish = () => {
    const newsletterHelperText = 'No spam. Only useful updates for students, freshers, and creators.';

    document.querySelectorAll('.newsletter-microcopy').forEach((node) => {
      if (node.closest('.telegram-cta')) {
        return;
      }

      if (node.closest('footer')) {
        node.textContent = 'Get practical updates, not unnecessary emails.';
        return;
      }

      node.textContent = newsletterHelperText;
    });

    document.querySelectorAll('.telegram-cta').forEach((telegramBlock) => {
      const actions = telegramBlock.querySelector('.telegram-actions') || telegramBlock;
      if (actions.querySelector('.telegram-helper-text')) {
        return;
      }

      const helper = document.createElement('p');
      helper.className = 'telegram-helper-text';
      helper.textContent = 'Fast updates, zero clutter.';
      actions.appendChild(helper);
    });

    const ensureCardHelper = (selector, text) => {
      document.querySelectorAll(selector).forEach((card) => {
        if (card.querySelector('.card-helper-text')) {
          return;
        }

        const helper = document.createElement('p');
        helper.className = 'card-helper-text';
        helper.textContent = text;
        const target = card.querySelector('a, button') || card.lastElementChild;
        if (target) {
          target.insertAdjacentElement('beforebegin', helper);
        } else {
          card.appendChild(helper);
        }
      });
    };

    ensureCardHelper('.tool-card, .popular-tool-card', 'Quick, practical, and built to save time.');
    ensureCardHelper('.opportunity-card, .latest-op-card', 'Always verify details from the official source before applying.');
    ensureCardHelper('.template-card, .template-preview-card', 'Use as a starting point and customize to fit your needs.');
    ensureCardHelper('.career-guide-card', 'Simple guidance for better decisions.');

    const emptyStates = {
      toolNoResults: {
        title: 'No matching tools found.',
        description: 'Try a different keyword or explore all tools.',
        primaryCta: { label: 'Explore All Tools', href: './tools.html' },
        secondaryCta: { label: 'Clear Filters', action: 'clear' }
      },
      opportunityNoResults: {
        title: 'No opportunities match your current filters.',
        description: 'Try clearing filters or check back for new updates.',
        primaryCta: { label: 'View Opportunities', href: './opportunities.html' },
        secondaryCta: { label: 'Clear Filters', action: 'clear' }
      },
      templateNoResults: {
        title: 'No templates found for this category right now.',
        description: 'Browse other templates or return later for updates.',
        primaryCta: { label: 'Explore Templates', href: './templates.html' },
        secondaryCta: { label: 'Clear Filters', action: 'clear' }
      }
    };

    Object.entries(emptyStates).forEach(([id, config]) => {
      const node = document.getElementById(id);
      if (!node) {
        return;
      }

      const secondaryActionHtml =
        config.secondaryCta?.action === 'clear'
          ? `<button type="button" class="btn-secondary" data-empty-clear>${escapeHtml(config.secondaryCta.label)}</button>`
          : '';

      node.innerHTML = `
        <p class="empty-title">${escapeHtml(config.title)}</p>
        <p class="empty-desc">${escapeHtml(config.description)}</p>
        <div class="empty-actions">
          <a href="${escapeHtml(config.primaryCta.href)}" class="btn-secondary">${escapeHtml(config.primaryCta.label)}</a>
          ${secondaryActionHtml}
        </div>
      `;

      const clearAction = node.querySelector('[data-empty-clear]');
      if (clearAction) {
        clearAction.addEventListener('click', () => {
          const section = node.closest('section');
          const clearButton = section?.querySelector('.filter-clear-btn');
          clearButton?.click();
        });
      }
    });

    document.querySelectorAll('[data-empty-state="general"]').forEach((node) => {
      node.textContent = 'Nothing to show here right now. More useful resources are coming soon.';
    });

    document.querySelectorAll('[data-empty-state="newsletter-subscribers"]').forEach((node) => {
      node.textContent = 'No subscribers yet. Start growing your community with useful updates.';
    });
  };

  const setupNewsletterLeadCapture = () => {
    const newsletterForms = Array.from(document.querySelectorAll('form[data-newsletter-form], footer form[data-demo-submit]'));
    if (!newsletterForms.length) {
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    newsletterForms.forEach((form) => {
      const emailInput = form.querySelector('input[type="email"]');
      const submitButton = form.querySelector('button[type="submit"]');
      if (!emailInput || !submitButton) {
        return;
      }

      ensureFooterNewsletterMeta(form);

      const defaultLabel = submitButton.textContent.trim();
      const loadingLabel = form.getAttribute('data-loading-label') || 'Subscribing...';
      let statusNode = form.parentElement?.querySelector('.newsletter-status') || null;
      if (!statusNode) {
        statusNode = document.createElement('p');
        statusNode.className = 'newsletter-status hidden';
        statusNode.setAttribute('aria-live', 'polite');
        form.insertAdjacentElement('afterend', statusNode);
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        emailInput.classList.remove('is-invalid');
        statusNode.classList.add('hidden');

        const email = emailInput.value.trim();
        if (!emailPattern.test(email)) {
          emailInput.classList.add('is-invalid');
          setNewsletterStatus(statusNode, 'error', FEEDBACK_MESSAGES.newsletterError);
          showToast('error', 'Something went wrong.', 'Please try again in a moment.');
          return;
        }

        submitButton.disabled = true;
        submitButton.textContent = loadingLabel;

        try {
          await postJson('/api/newsletter', {
            email,
            source: form.getAttribute('data-newsletter-source') || (form.closest('footer') ? 'footer' : 'newsletter'),
            page: getCurrentPagePath()
          });
          setNewsletterStatus(statusNode, 'success', FEEDBACK_MESSAGES.newsletterSuccess);
          showToast('success', "You're subscribed successfully.", 'Useful updates will reach your inbox soon.');
          form.reset();
        } catch (error) {
          const message = error?.message || FEEDBACK_MESSAGES.newsletterError;
          setNewsletterStatus(statusNode, 'error', message);
          showToast('error', 'Something went wrong.', message);
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = defaultLabel;
        }
      });
    });
  };

  const setupDemoForms = () => {
    const forms = document.querySelectorAll('form[data-demo-submit]:not([data-newsletter-form])');
    forms.forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        showToast('success', FEEDBACK_MESSAGES.generalSuccess);
        form.reset();
      });
    });
  };

  const setButtonLoading = (button, isLoading, loadingLabel = FEEDBACK_MESSAGES.loadingResult) => {
    if (!button) {
      return;
    }

    if (!button.dataset.defaultLabel) {
      button.dataset.defaultLabel = button.textContent.trim();
    }

    button.disabled = isLoading;
    button.textContent = isLoading ? loadingLabel : button.dataset.defaultLabel;
  };

  const attachCopyHandler = (button, getText, feedbackNode) => {
    if (!button) {
      return;
    }

    button.addEventListener('click', async () => {
      const text = typeof getText === 'function' ? getText() : getText;
      if (!text) {
        return;
      }

      try {
        await copyText(text);
        showMessage(feedbackNode, FEEDBACK_MESSAGES.copySuccess);
        showToast('success', FEEDBACK_MESSAGES.copySuccess);
        setTimeout(() => showMessage(feedbackNode, ''), 1800);
      } catch (error) {
        showMessage(feedbackNode, FEEDBACK_MESSAGES.copyError);
        showToast('error', FEEDBACK_MESSAGES.copyError);
      }
    });
  };

  const createGeneratedOutputCard = ({
    label,
    content,
    copyTextValue,
    labelPrefix = 'Suggestion'
  }) => {
    const card = document.createElement('article');
    card.className = 'item-card';
    card.innerHTML = `<p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">${escapeHtml(labelPrefix)} ${label}</p><p class="mt-2 text-sm text-slate-700">${escapeHtml(content)}</p>`;

    const actions = document.createElement('div');
    actions.className = 'mt-4 flex flex-wrap items-center gap-3';

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'btn-secondary';
    copyButton.textContent = 'Copy';

    const feedbackNode = document.createElement('p');
    feedbackNode.className = 'copy-feedback hidden';

    attachCopyHandler(copyButton, copyTextValue || content, feedbackNode);

    actions.appendChild(copyButton);
    actions.appendChild(feedbackNode);
    card.appendChild(actions);

    return card;
  };

  const setupResumeHeadlineTool = () => {
    const form = document.getElementById('resumeHeadlineForm');
    if (!form) {
      return;
    }

    const generateButton = form.querySelector('button[type="submit"]');
    const resetButton = document.getElementById('resumeHeadlineReset');
    const outputGrid = document.getElementById('resumeHeadlineOutput');
    const errorNode = document.getElementById('resumeHeadlineError');
    const loadingNode = document.getElementById('resumeHeadlineLoading');

    const expMap = {
      fresher: 'Fresher',
      '0-1': '0-1 years',
      '1-3': '1-3 years',
      '3+': '3+ years'
    };

    const clearOutput = () => {
      outputGrid.innerHTML = '<p class="tool-empty">Your generated headlines will appear here.</p>';
      showMessage(errorNode, '');
    };

    clearOutput();

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      showMessage(errorNode, '');

      const name = (form.querySelector('#resumeName')?.value || '').trim();
      const role = (form.querySelector('#resumeRole')?.value || '').trim();
      const experience = (form.querySelector('#resumeExperience')?.value || '').trim();
      const skillsRaw = (form.querySelector('#resumeSkills')?.value || '').trim();
      const skillList = skillsRaw
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      if (name.length < 2 || role.length < 2 || !experience || skillList.length < 2) {
        showMessage(errorNode, 'Please fill all fields and add at least two comma-separated skills.');
        showToast('error', FEEDBACK_MESSAGES.toolValidation);
        return;
      }

      if (loadingNode) {
        loadingNode.textContent = FEEDBACK_MESSAGES.loadingResult;
      }
      setButtonLoading(generateButton, true, FEEDBACK_MESSAGES.loadingResult);
      loadingNode.classList.remove('hidden');
      await wait(850);

      const topSkills = skillList.slice(0, 3).join(', ');
      const skillBlock = skillList.join(', ');
      const expLabel = expMap[experience] || 'Early-career';

      const suggestions = [
        `${expLabel} ${role} with strong skills in ${topSkills}, focused on delivering practical results and continuous learning.`,
        `${name} | ${role} | ${skillBlock} | Detail-oriented professional with a growth mindset and strong execution ability.`,
        `Results-driven ${role} candidate with ${expLabel.toLowerCase()} experience, combining ${topSkills} with clear communication and ownership.`
      ];

      outputGrid.innerHTML = '';
      suggestions.forEach((headline, index) => {
        outputGrid.appendChild(
          createGeneratedOutputCard({
            label: String(index + 1),
            content: headline,
            copyTextValue: headline,
            labelPrefix: 'Suggestion'
          })
        );
      });

      showToast('success', FEEDBACK_MESSAGES.toolSuccess);
      setButtonLoading(generateButton, false, FEEDBACK_MESSAGES.loadingResult);
      loadingNode?.classList.add('hidden');
    });

    resetButton?.addEventListener('click', () => {
      form.reset();
      clearOutput();
      loadingNode?.classList.add('hidden');
    });
  };

  const setupLeaveApplicationTool = () => {
    const form = document.getElementById('leaveApplicationForm');
    if (!form) {
      return;
    }

    const generateButton = form.querySelector('button[type="submit"]');
    const resetButton = document.getElementById('leaveApplicationReset');
    const outputNode = document.getElementById('leaveApplicationOutput');
    const errorNode = document.getElementById('leaveApplicationError');
    const loadingNode = document.getElementById('leaveApplicationLoading');
    const copyButton = document.getElementById('leaveApplicationCopy');
    const feedbackNode = document.getElementById('leaveApplicationCopyFeedback');

    const clearOutput = () => {
      outputNode.textContent = 'Your formatted leave application will appear here.';
      copyButton.disabled = true;
      showMessage(errorNode, '');
      showMessage(feedbackNode, '');
    };

    clearOutput();

    let letterText = '';

    attachCopyHandler(copyButton, () => letterText, feedbackNode);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      showMessage(errorNode, '');

      const name = (form.querySelector('#leaveName')?.value || '').trim();
      const reason = (form.querySelector('#leaveReason')?.value || '').trim();
      const startDate = (form.querySelector('#leaveStartDate')?.value || '').trim();
      const endDate = (form.querySelector('#leaveEndDate')?.value || '').trim();
      const recipient = (form.querySelector('#leaveRecipient')?.value || '').trim();

      if (!name || !reason || !startDate || !endDate || !recipient) {
        showMessage(errorNode, 'Please fill all required fields before generating the application.');
        showToast('error', FEEDBACK_MESSAGES.toolValidation);
        return;
      }

      if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
        showMessage(errorNode, 'End date cannot be earlier than the start date.');
        return;
      }

      if (loadingNode) {
        loadingNode.textContent = FEEDBACK_MESSAGES.loadingContent;
      }
      setButtonLoading(generateButton, true, FEEDBACK_MESSAGES.loadingContent);
      loadingNode?.classList.remove('hidden');

      const prompt = [
        'Write a formal leave application letter.',
        `Name: ${name}`,
        `Reason: ${reason}`,
        `Leave start date: ${startDate}`,
        `Leave end date: ${endDate}`,
        `Recipient: ${recipient}`,
        'Keep the tone professional, concise, and ready to copy-paste.'
      ].join('\n');

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(String(payload?.error || 'Could not generate the leave application right now.'));
        }

        const generatedText = String(payload?.text || payload?.output_text || payload?.result || '').trim();
        if (!generatedText) {
          throw new Error('The generated response was empty. Please try again.');
        }

        letterText = generatedText;
        outputNode.textContent = letterText;
        copyButton.disabled = false;
        showToast('success', FEEDBACK_MESSAGES.toolSuccess);
      } catch (error) {
        copyButton.disabled = !letterText;
        showMessage(errorNode, error instanceof Error ? error.message : 'Could not generate the leave application right now.');
      } finally {
        setButtonLoading(generateButton, false, FEEDBACK_MESSAGES.loadingContent);
        loadingNode?.classList.add('hidden');
      }
    });

    resetButton?.addEventListener('click', () => {
      form.reset();
      letterText = '';
      clearOutput();
      loadingNode?.classList.add('hidden');
    });
  };

  const setupInstagramCaptionTool = () => {
    const form = document.getElementById('instagramCaptionForm');
    if (!form) {
      return;
    }

    const generateButton = form.querySelector('button[type="submit"]');
    const resetButton = document.getElementById('instagramCaptionReset');
    const outputGrid = document.getElementById('instagramCaptionOutput');
    const analysisNode = document.getElementById('instagramCaptionAnalysis');
    const errorNode = document.getElementById('instagramCaptionError');
    const loadingNode = document.getElementById('instagramCaptionLoading');
    const imageInput = document.getElementById('captionImage');
    const previewWrap = document.getElementById('captionImagePreviewWrap');
    const previewImage = document.getElementById('captionImagePreview');
    const imageNameNode = document.getElementById('captionImageName');
    const imageMetaNode = document.getElementById('captionImageMeta');
    const removeImageButton = document.getElementById('captionImageRemove');
    const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
    const maxImageBytes = 4 * 1024 * 1024;
    let selectedImage = null;
    let previewUrl = '';

    const formatFileSize = (bytes = 0) => {
      if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const clearSelectedImage = () => {
      selectedImage = null;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = '';
      if (imageInput) imageInput.value = '';
      if (previewImage) previewImage.removeAttribute('src');
      if (imageNameNode) imageNameNode.textContent = '';
      if (imageMetaNode) imageMetaNode.textContent = '';
      previewWrap?.classList.add('hidden');
    };

    const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Could not read the selected image. Please try again.'));
      reader.readAsDataURL(file);
    });

    const clearOutput = () => {
      if (analysisNode) {
        analysisNode.textContent = '';
        analysisNode.classList.add('hidden');
      }
      outputGrid.innerHTML = '<p class="tool-empty">Generate captions to see 5 unique options here.</p>';
      showMessage(errorNode, '');
    };

    const renderCaptions = ({ visualAnalysis, captions }) => {
      const safeAnalysis = String(visualAnalysis || '').trim();
      if (analysisNode) {
        if (safeAnalysis) {
          analysisNode.innerHTML = `<p class="text-xs font-semibold uppercase tracking-wide text-indigo-700">Image / Context Analysis</p><p class="mt-2">${escapeHtml(safeAnalysis)}</p>`;
          analysisNode.classList.remove('hidden');
        } else {
          analysisNode.textContent = '';
          analysisNode.classList.add('hidden');
        }
      }

      outputGrid.innerHTML = '';
      captions.forEach((entry, index) => {
        const hashtags = Array.isArray(entry.hashtags) ? entry.hashtags.filter(Boolean).join(' ') : '';
        const content = [entry.text, hashtags].filter(Boolean).join('\n\n');
        const card = createGeneratedOutputCard({
          label: String(index + 1),
          content,
          copyTextValue: content,
          labelPrefix: entry.bestPick ? 'Best Caption' : 'Caption'
        });
        const styleNode = document.createElement('p');
        styleNode.className = 'mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500';
        styleNode.textContent = `Style: ${entry.style || 'General'}`;
        card.insertBefore(styleNode, card.querySelector('.mt-4'));
        outputGrid.appendChild(card);
      });
    };

    clearOutput();

    imageInput?.addEventListener('change', async () => {
      showMessage(errorNode, '');
      const file = imageInput.files?.[0];
      clearSelectedImage();
      if (!file) return;

      if (!allowedImageTypes.has(file.type)) {
        showMessage(errorNode, 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.');
        showToast('error', FEEDBACK_MESSAGES.toolValidation);
        return;
      }

      if (file.size > maxImageBytes) {
        showMessage(errorNode, 'Image is too large. Please upload an image up to 4 MB.');
        showToast('error', FEEDBACK_MESSAGES.toolValidation);
        return;
      }

      try {
        const imageData = await readFileAsDataUrl(file);
        selectedImage = {
          imageBase64: imageData,
          mimeType: file.type,
          fileName: file.name
        };
        previewUrl = URL.createObjectURL(file);
        if (previewImage) previewImage.src = previewUrl;
        if (imageNameNode) imageNameNode.textContent = file.name;
        if (imageMetaNode) imageMetaNode.textContent = `${file.type.replace('image/', '').toUpperCase()} • ${formatFileSize(file.size)}`;
        previewWrap?.classList.remove('hidden');
      } catch (error) {
        clearSelectedImage();
        showMessage(errorNode, error instanceof Error ? error.message : 'Could not read the selected image. Please try again.');
      }
    });

    removeImageButton?.addEventListener('click', () => {
      clearSelectedImage();
      showMessage(errorNode, '');
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      showMessage(errorNode, '');

      const topic = (form.querySelector('#captionTopic')?.value || '').trim();
      const tone = (form.querySelector('#captionTone')?.value || '').trim();
      const platform = (form.querySelector('#captionPlatform')?.value || 'instagram').trim();

      if (topic.length < 2 || !tone) {
        showMessage(errorNode, 'Please add a topic and choose a tone before generating captions.');
        showToast('error', FEEDBACK_MESSAGES.toolValidation);
        return;
      }

      if (loadingNode) {
        loadingNode.textContent = selectedImage ? 'Analyzing image and generating captions...' : FEEDBACK_MESSAGES.loadingResult;
      }
      setButtonLoading(generateButton, true, selectedImage ? 'Analyzing image...' : FEEDBACK_MESSAGES.loadingResult);
      loadingNode?.classList.remove('hidden');

      try {
        const response = await fetch('/api/generate-instagram-caption', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic,
            tone,
            contentType: platform,
            ...(selectedImage || {})
          })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(String(payload?.error || 'Could not generate captions right now.'));
        }

        const captions = Array.isArray(payload?.captions) ? payload.captions : [];
        if (captions.length !== 5) {
          throw new Error('The caption response was incomplete. Please try again.');
        }

        renderCaptions({ visualAnalysis: payload.visualAnalysis, captions });
        showToast('success', FEEDBACK_MESSAGES.toolSuccess);
      } catch (error) {
        showMessage(errorNode, error instanceof Error ? error.message : 'Could not generate captions right now.');
        showToast('error', FEEDBACK_MESSAGES.generalError);
      } finally {
        setButtonLoading(generateButton, false, FEEDBACK_MESSAGES.loadingResult);
        loadingNode?.classList.add('hidden');
      }
    });

    resetButton?.addEventListener('click', () => {
      form.reset();
      clearSelectedImage();
      clearOutput();
      loadingNode?.classList.add('hidden');
    });
  };

  const setupGenericGenerateForm = () => {
    const form = document.getElementById('generateForm') || document.querySelector('form');
    const promptInput = document.getElementById('promptInput')
      || document.querySelector("[name='prompt']")
      || document.querySelector('textarea')
      || document.querySelector("input[type='text']");
    const generateBtn = document.getElementById('generateBtn') || document.querySelector("button[type='submit']");
    const resultBox = document.getElementById('generatedOutput')
      || document.getElementById('resultBox')
      || document.querySelector('.generated-output')
      || document.querySelector('.result');
    const errorBox = document.getElementById('errorBox')
      || document.querySelector('.error')
      || document.querySelector('[data-error]');

    if (!form || !promptInput || !resultBox || form.dataset.aiGenerateBound === '1') return;
    form.dataset.aiGenerateBound = '1';

    const renderResult = (text) => {
      resultBox.textContent = text;
      resultBox.style.whiteSpace = 'pre-wrap';
      const cardTextEls = resultBox.querySelectorAll('.card-text, .output-text, .description, [data-output-text]');
      cardTextEls.forEach((el) => { el.textContent = text; });
      if (!cardTextEls.length && resultBox.childElementCount === 0) resultBox.textContent = text;
    };

    const showError = (message) => {
      if (errorBox) {
        errorBox.textContent = message;
        errorBox.style.display = 'block';
      }
    };

    const clearError = () => {
      if (errorBox) {
        errorBox.textContent = '';
        errorBox.style.display = 'none';
      }
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const prompt = promptInput.value.trim();
      if (!prompt) return showError('Please enter a prompt.');
      clearError();
      resultBox.textContent = '';
      if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
      }
      renderResult('Generating...');

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Request failed');
        const text = String(data.text || data.output_text || data.result || '').trim();
        if (!text) throw new Error('Empty response from AI');
        renderResult(text);
      } catch (err) {
        showError(err.message || 'Something went wrong');
      } finally {
        if (generateBtn) {
          generateBtn.disabled = false;
          generateBtn.textContent = 'Generate';
        }
      }
    });
  };

  setupResumeHeadlineTool();
  setupLeaveApplicationTool();
  setupInstagramCaptionTool();
  setupGenericGenerateForm();
  setupTemplateLibrary();
  setupGlobalLinkDefaults();
  setupSkipLink();
  setupFaqAccordion();
  setupNewsletterLeadCapture();
  setupMicrocopyPolish();
  setupDemoForms();
});
