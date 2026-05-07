document.addEventListener('DOMContentLoaded', () => {
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
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');
  const mobileLinks = document.querySelectorAll('[data-mobile-panel] a');

  const normalizePath = (value = '') => value.replace(/^\.\//, '').replace(/^\//, '');

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
      'about.html': 'about.html',
      'contact.html': 'contact.html',
      'privacy.html': 'index.html',
      'terms.html': 'index.html',
      'disclaimer.html': 'index.html'
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
      const safeDescription = description ? `<p>${description}</p>` : '';
      toast.innerHTML = `<strong>${title}</strong>${safeDescription}`;
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

  setupActiveNavigation();
  setupStickyNavShadow();
  setupTelegramFeedback();

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
    const footerTemplate = `
      <div class="footer-shell">
        <div class="footer-grid grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="./index.html" class="brand-logo" aria-label="ToolShala home">
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
              <li><a href="./index.html">Home</a></li>
              <li><a href="./tools.html">Tools</a></li>
              <li><a href="./opportunities.html">Opportunities</a></li>
              <li><a href="./career.html">Career</a></li>
              <li><a href="./templates.html">Templates</a></li>
              <li><a href="./about.html">About</a></li>
              <li><a href="./contact.html">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 class="foot-title">Categories</h3>
            <ul class="foot-list">
              <li><a href="./tools.html">AI Tools</a></li>
              <li><a href="./opportunities.html">Internships</a></li>
              <li><a href="./opportunities.html">Scholarships</a></li>
              <li><a href="./templates.html">Resume Templates</a></li>
              <li><a href="./career.html">Career Guides</a></li>
              <li><a href="./templates.html">LinkedIn Templates</a></li>
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
            <div class="mt-4 flex items-center gap-2">
              <a class="social-link" href="https://www.linkedin.com/company/toolshala" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5v9H3.95v-9h2.99zM5.44 3.92a1.73 1.73 0 110 3.46 1.73 1.73 0 010-3.46zM20.05 12.32v5.18h-2.99v-4.84c0-1.22-.43-2.05-1.52-2.05-.83 0-1.32.56-1.54 1.1-.08.19-.1.46-.1.74v5.05h-2.99v-9h2.99v1.27c.4-.61 1.11-1.47 2.7-1.47 1.96 0 3.45 1.28 3.45 4.02z"/></svg></a>
              <a class="social-link" href="https://www.instagram.com/toolshala" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm8.35 1.73h-8.2a4.17 4.17 0 00-4.17 4.17v8.2a4.17 4.17 0 004.17 4.17h8.2a4.17 4.17 0 004.17-4.17v-8.2a4.17 4.17 0 00-4.17-4.17zm-4.1 3.93A4.34 4.34 0 1112 16.34a4.34 4.34 0 010-8.68zm0 1.73a2.61 2.61 0 102.61 2.61A2.61 2.61 0 0012 9.39zm4.61-2.5a1.04 1.04 0 11-1.04 1.04 1.04 1.04 0 011.04-1.04z"/></svg></a>
              <a class="social-link" href="https://www.youtube.com/@toolshala" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 7.2a2.93 2.93 0 00-2.06-2.07C17.7 4.62 12 4.62 12 4.62s-5.7 0-7.52.5A2.93 2.93 0 002.42 7.2 30.3 30.3 0 002 12a30.3 30.3 0 00.42 4.8 2.93 2.93 0 002.06 2.07c1.82.5 7.52.5 7.52.5s5.7 0 7.52-.5a2.93 2.93 0 002.06-2.07A30.3 30.3 0 0022 12a30.3 30.3 0 00-.42-4.8zM10.09 15.02V8.98L15.27 12l-5.18 3.02z"/></svg></a>
            </div>
          </div>
        </div>

        <div class="legal-row flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; <span data-year></span> ToolShala. All rights reserved.</p>
          <div class="legal-links flex flex-wrap items-center gap-3 sm:gap-4">
            <span class="legal-label">Legal</span>
            <a href="./privacy.html">Privacy Policy</a>
            <a href="./terms.html">Terms &amp; Conditions</a>
            <a href="./disclaimer.html">Disclaimer</a>
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
      disclaimer: './disclaimer.html'
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

        if (aria === 'linkedin') {
          link.setAttribute('href', 'https://www.linkedin.com/company/toolshala');
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
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
  const seoGuides = Array.isArray(articleCollections?.seoGuides) ? articleCollections.seoGuides : [];

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
      '/guides': './guides.html'
    };

    if (path.startsWith('/guides/')) {
      const slug = path.replace('/guides/', '').replace(/^\/+/, '');
      return `./guide.html?slug=${encodeURIComponent(slug)}`;
    }

    return routeMap[path] || path;
  };

  const normalizeGuideSlug = (value = '') => String(value).replace(/^\/?guides\//, '').replace(/^\/+/, '');
  const getGuidePath = (guide) => {
    const rawSlug = typeof guide === 'string' ? guide : guide?.slug || '';
    if (rawSlug.startsWith('/guides/')) {
      return rawSlug;
    }
    return `/guides/${normalizeGuideSlug(rawSlug)}`;
  };
  const resolveGuideLink = (guide) => `./guide.html?slug=${encodeURIComponent(normalizeGuideSlug(guide?.slug || guide || ''))}`;

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
      .sort((a, b) => b.score - a.score || a.guide.title.localeCompare(b.guide.title));

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

    renderCollection({
      container,
      items: tools,
      renderer: (tool) => {
        const tags = normalizeTags(tool.tags);
        const cta = resolveToolLink(tool);
        const attrs = createDataAttributes({
          'data-id': tool.id,
          'data-slug': tool.slug,
          'data-featured': tool.featured ? 'true' : 'false',
          'data-published': tool.publishedAt,
          'data-tags': tags,
          'data-name': tool.title,
          'data-category': tool.category,
          'data-description': `${tool.description} ${tags}`
        });

        return `<article class="item-card reveal tool-card"${attrs}><p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">${escapeHtml(tool.categoryLabel || tool.category)}</p><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><p class="card-helper-text">Quick, practical, and built to save time.</p><p class="mt-3 text-xs text-slate-500">Updated ${formatPublishedDate(tool.publishedAt)}</p><a href="${escapeHtml(cta.href)}">${escapeHtml(cta.label)}</a></article>`;
      }
    });
  };

  const renderOpportunitiesFromData = () => {
    const featuredContainer = document.getElementById('featuredOpportunityGrid');
    const listContainer = document.getElementById('opportunityGrid');
    const opportunities = contentCollections?.opportunities;
    if (!listContainer || !Array.isArray(opportunities) || !opportunities.length) {
      return;
    }

    const badgeClassMap = {
      'Closing Soon': 'op-badge-soon',
      New: 'op-badge-new',
      Popular: 'op-badge-popular'
    };

    const createOpportunityCard = (opportunity, isFeatured) => {
      const tags = normalizeTags(opportunity.tags);
      const badge = opportunity.badge || '';
      const badgeClass = badgeClassMap[badge] || 'op-badge-new';
      const ctaClass = isFeatured ? 'btn-primary mt-4' : 'btn-secondary mt-4';
      const wrapperClass = isFeatured ? 'op-featured' : 'op-card';
      const applyLink = resolveOpportunityLink(opportunity);
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
        'data-description': opportunity.description,
        'data-apply-link': applyLink
      });
      return `<article class="${wrapperClass} reveal opportunity-card"${attrs}><div class="flex items-center justify-between gap-2"><span class="op-badge ${badgeClass}">${escapeHtml(badge || 'New')}</span><span class="op-mode">${escapeHtml(opportunity.mode)}</span></div><h3 class="mt-3">${escapeHtml(opportunity.title)}</h3><p class="mt-2 text-sm text-slate-600">${escapeHtml(opportunity.description)}</p><p class="card-helper-text">Always verify details from the official source before applying.</p><div class="op-meta"><p><strong>Category:</strong> ${escapeHtml(opportunity.categoryLabel)}</p><p><strong>Eligibility:</strong> ${escapeHtml(opportunity.eligibility)}</p></div><span class="op-deadline mt-3">Deadline: ${escapeHtml(opportunity.deadline)}</span><p class="mt-2 text-xs text-slate-500">Published ${formatPublishedDate(opportunity.publishedAt)}</p><button type="button" class="${ctaClass}" data-op-detail-button>${escapeHtml(opportunity.ctaLabel || 'View Details')}</button></article>`;
    };

    let featuredIds = [];
    if (featuredContainer) {
      const featuredItems = opportunities.filter((opportunity) => opportunity.featured).slice(0, 2);
      featuredIds = featuredItems.map((item) => item.id);
      if (featuredItems.length) {
        renderCollection({
          container: featuredContainer,
          items: featuredItems,
          renderer: (opportunity) => createOpportunityCard(opportunity, true)
        });
      }
    }

    const listingItems = opportunities.filter((opportunity) => !featuredIds.includes(opportunity.id));
    renderCollection({
      container: listContainer,
      items: listingItems,
      renderer: (opportunity) => createOpportunityCard(opportunity, false)
    });
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
          )}</p><a href="${escapeHtml(resolveGuideLink(guide))}" class="mt-3 inline-flex font-semibold text-indigo-700">${escapeHtml(
            guide.ctaText || 'Read Guide'
          )}</a></article>`
      });
    }

    if (listingContainer) {
      const listItems = seoGuides.filter((guide) => !featuredIds.has(guide.id));
      renderCollection({
        container: listingContainer,
        items: listItems,
        renderer: (guide) =>
          `<article class="item-card reveal"><p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">${escapeHtml(guide.category)}</p><h3>${escapeHtml(
            guide.title
          )}</h3><p>${escapeHtml(guide.shortExcerpt)}</p><p class="mt-2 text-xs text-slate-500">${escapeHtml(guide.readingTime)} • ${escapeHtml(
            guide.searchIntent
          )}</p><a href="${escapeHtml(resolveGuideLink(guide))}" class="btn-secondary mt-4">${escapeHtml(
            guide.ctaText || 'Read Guide'
          )}</a></article>`
      });
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
      root.innerHTML = `<section class="section-wrap"><div class="no-results"><p class="empty-title">This page doesn't seem to exist.</p><p class="empty-desc">Let's get you back to something useful.</p><div class="empty-actions"><a href="./guides.html" class="btn-primary">Browse All Guides</a><a href="./index.html" class="btn-secondary">Go Back Home</a></div></div></section>`;
      return;
    }

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
      const relatedLinks = Array.isArray(guide.relatedLinks) ? guide.relatedLinks.slice(0, 5) : [];
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
      const primaryCtaLink = content?.cta?.primaryLink || (Array.isArray(guide.relatedLinks) && guide.relatedLinks.length ? guide.relatedLinks[0] : '/tools');
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
      const links = Array.isArray(guide.relatedLinks) ? guide.relatedLinks : [];
      linkPoolNode.innerHTML = links
        .slice(0, 4)
        .map((link) => `<a href="${escapeHtml(resolveInternalPath(link))}" class="btn-secondary">${escapeHtml(link.replace('/guides/', '').replace(/-/g, ' '))}</a>`)
        .join('');
    }

    const relatedContainer = root.querySelector('#relatedGuidesGrid');
    const relatedGuides = getRelatedGuides(guide, 3);
    renderCollection({
      container: relatedContainer,
      items: relatedGuides,
      renderer: (entry) =>
        `<article class="item-card reveal"><p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">${escapeHtml(entry.category)}</p><h3>${escapeHtml(
          entry.title
        )}</h3><p>${escapeHtml(entry.shortExcerpt)}</p><a href="${escapeHtml(resolveGuideLink(entry))}" class="btn-secondary mt-4">Read Guide</a></article>`
    });

    const canonicalGuidePath = getGuidePath(guide);
    setMeta('meta[property="og:url"]', `https://toolshala.in${canonicalGuidePath}`);
    const canonicalNode = document.querySelector('link[rel="canonical"]');
    if (canonicalNode) {
      canonicalNode.setAttribute('href', `https://toolshala.in${canonicalGuidePath}`);
    }

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
        mainEntityOfPage: `https://toolshala.in${canonicalGuidePath}`
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

      if (noResultsNode) {
        noResultsNode.classList.toggle('hidden', visibleCount > 0);
      }

      if (resultCountNode) {
        const suffix = visibleCount === 1 ? '' : 's';
        resultCountNode.textContent = `${visibleCount} tool${suffix} found`;
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
      syncHash: true
    },
    {
      cardSelector: '#opportunityGrid .opportunity-card',
      filterSelector: '[data-op-filter]',
      filterAttr: 'data-op-filter',
      searchInput: document.getElementById('opportunitySearch'),
      searchAttrs: ['data-name', 'data-category', 'data-eligibility', 'data-mode', 'data-description'],
      clearButton: document.getElementById('opportunityClearFilters'),
      noResultsNode: document.getElementById('opportunityNoResults')
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
          await wait(750);
          setNewsletterStatus(statusNode, 'success', FEEDBACK_MESSAGES.newsletterSuccess);
          showToast('success', "You're subscribed successfully.", 'Useful updates will reach your inbox soon.');
          form.reset();
        } catch (error) {
          setNewsletterStatus(statusNode, 'error', FEEDBACK_MESSAGES.newsletterError);
          showToast('error', 'Something went wrong.', 'Please try again in a moment.');
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
    const errorNode = document.getElementById('instagramCaptionError');
    const loadingNode = document.getElementById('instagramCaptionLoading');

    const toneTemplates = {
      professional: [
        '{topic} - consistent progress, clean execution, real outcomes.',
        'Building with intent: {topic}. One focused step every day.',
        '{topic} in motion. Learning, shipping, improving.'
      ],
      motivational: [
        '{topic} journey starts now. Small wins, big energy.',
        'No shortcuts, just daily effort and {topic} grind.',
        '{topic} mode: on. Believe, build, repeat.'
      ],
      funny: [
        'POV: I said 10 mins, spent 3 hours on {topic}.',
        '{topic} is easy... said no one ever.',
        'Mood: pretending to relax while still thinking about {topic}.'
      ],
      casual: [
        'Current vibe: {topic} and chill.',
        '{topic} update. Slow and steady, but solid.',
        'Aaj ka focus: {topic}. Let us go.'
      ]
    };

    const platformTags = {
      instagram: '#Instagram #CreatorsOfIndia #DailyPost',
      reels: '#ReelsIndia #ReelItFeelIt #ContentCreator',
      linkedin: '#CareerGrowth #Students #Freshers',
      youtube: '#YouTubeShorts #BuildInPublic #CreatorLife'
    };

    const clearOutput = () => {
      outputGrid.innerHTML = '<p class="tool-empty">Generate captions to see 5 unique options here.</p>';
      showMessage(errorNode, '');
    };

    clearOutput();

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
        loadingNode.textContent = FEEDBACK_MESSAGES.loadingResult;
      }
      setButtonLoading(generateButton, true, FEEDBACK_MESSAGES.loadingResult);
      loadingNode.classList.remove('hidden');
      await wait(820);

      const templates = toneTemplates[tone] || toneTemplates.casual;
      const hashtags = platformTags[platform] || platformTags.instagram;
      const captions = new Set();

      for (let index = 0; captions.size < 5 && index < 14; index += 1) {
        const template = templates[index % templates.length];
        const suffix = [
          'DM for collab ideas.',
          'Save this for later.',
          'Tag your study buddy.',
          'Share if this is relatable.',
          'More coming soon.'
        ][index % 5];

        const caption = `${template.replace('{topic}', topic)} ${suffix} ${hashtags}`;
        captions.add(caption);
      }

      outputGrid.innerHTML = '';
      Array.from(captions).forEach((caption, index) => {
        outputGrid.appendChild(
          createGeneratedOutputCard({
            label: String(index + 1),
            content: caption,
            copyTextValue: caption,
            labelPrefix: 'Caption'
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
