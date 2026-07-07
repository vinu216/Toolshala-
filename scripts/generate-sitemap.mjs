import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const SITE_ORIGIN = 'https://toolshala.in';
const ROOT = process.cwd();
const TODAY = '2026-07-07';

const context = { window: {}, console };
vm.createContext(context);

const runDataFile = (relativePath) => {
  const absolutePath = path.join(ROOT, relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  vm.runInContext(source, context, { filename: relativePath });
};

['data/content.js', 'data/tool-definitions.js', 'data/articles.js', 'data/mock-test-categories.js'].forEach(runDataFile);

const toolDefinitions = Array.isArray(context.window.ToolShalaToolDefinitions)
  ? context.window.ToolShalaToolDefinitions
  : [];
const articleCollections = context.window.ToolShalaArticleContent?.collections || {};
const seoGuides = Array.isArray(articleCollections.seoGuides) ? articleCollections.seoGuides : [];
const mockTestData = context.window.mockTestData || { categories: [], exams: {} };

const publicHtmlFiles = fs
  .readdirSync(ROOT, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
  .map((entry) => path.relative(ROOT, path.join(entry.parentPath, entry.name)).replaceAll(path.sep, '/'));

const excludedHtml = new Set([
  '404.html',
  'components.html',
  'guide.html',
  'tool.html',
  'mock-test/exam.html'
]);

const ignoredDirectories = [/^node_modules\//, /^dist\//, /^api\//, /^netlify\//, /^supabase\//, /^src\//];
const seen = new Set();
const urls = [];

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toUrl = (route) => `${SITE_ORIGIN}${route}`;

const addUrl = (route, options = {}) => {
  if (!route || route.includes('#')) return;
  const normalizedRoute = route === '/index.html' ? '/' : route;
  const absoluteUrl = normalizedRoute.startsWith('https://') ? normalizedRoute : toUrl(normalizedRoute);
  if (!absoluteUrl.startsWith(SITE_ORIGIN) || seen.has(absoluteUrl)) return;

  seen.add(absoluteUrl);
  urls.push({
    loc: absoluteUrl,
    lastmod: options.lastmod || TODAY,
    changefreq: options.changefreq || 'monthly',
    priority: options.priority || '0.60'
  });
};

const isIndexableHtml = (file) =>
  !excludedHtml.has(file) && !ignoredDirectories.some((pattern) => pattern.test(file));

const normalizeGuideSlug = (value = '') => String(value).replace(/^\/?guides\//, '').replace(/^\/+/, '').trim();

// Static, crawlable HTML pages.
addUrl('/', { changefreq: 'daily', priority: '1.00' });
publicHtmlFiles
  .filter(isIndexableHtml)
  .sort((a, b) => a.localeCompare(b))
  .forEach((file) => {
    if (file === 'index.html') return;

    const isCoreLanding = ['tools.html', 'opportunities.html', 'templates.html', 'career.html', 'guides.html', 'mock-test.html'].includes(file);
    const isLegal = ['privacy.html', 'terms.html', 'disclaimer.html', 'license.html'].includes(file);
    const isMockTest = file.startsWith('mock-test/');
    const isTemplate = file.endsWith('-template.html') || file.includes('template');

    addUrl(`/${file}`, {
      changefreq: isCoreLanding || isMockTest ? 'weekly' : 'monthly',
      priority: isCoreLanding ? '0.90' : isMockTest ? '0.75' : isTemplate ? '0.70' : isLegal ? '0.40' : '0.65'
    });
  });

// Dynamic tool pages backed by the live tool registry.
toolDefinitions
  .map((tool) => String(tool?.id || '').trim())
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b))
  .forEach((toolId) => {
    addUrl(`/tool.html?tool=${encodeURIComponent(toolId)}`, { changefreq: 'weekly', priority: '0.80' });
  });

// Dynamic guide/article pages backed by the SEO article registry.
seoGuides
  .map((guide) => normalizeGuideSlug(guide?.slug || ''))
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b))
  .forEach((slug) => {
    addUrl(`/guide.html?slug=${encodeURIComponent(slug)}`, { changefreq: 'monthly', priority: '0.70' });
  });

// Dynamic non-teaching exam pages. Teaching exam pages have dedicated static HTML hubs.
const teachingExamSlugs = new Set((mockTestData.categories || []).find((category) => category.slug === 'teaching-exams')?.exams || []);
Object.values(mockTestData.exams || {})
  .map((exam) => String(exam?.slug || '').trim())
  .filter((slug) => slug && !teachingExamSlugs.has(slug))
  .sort((a, b) => a.localeCompare(b))
  .forEach((slug) => {
    addUrl(`/mock-test/exam.html?exam=${encodeURIComponent(slug)}`, { changefreq: 'weekly', priority: '0.65' });
  });

urls.sort((a, b) => {
  const homeDiff = Number(b.loc === `${SITE_ORIGIN}/`) - Number(a.loc === `${SITE_ORIGIN}/`);
  if (homeDiff !== 0) return homeDiff;
  const priorityDiff = Number(b.priority) - Number(a.priority);
  if (priorityDiff !== 0) return priorityDiff;
  return a.loc.localeCompare(b.loc);
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
