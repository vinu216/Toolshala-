import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const SITE_URL = 'https://toolshala.in';
const ROOT = process.cwd();

const loadBrowserGlobal = (file, globalName) => {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context, { filename: file });
  return context.window[globalName];
};

const content = loadBrowserGlobal('data/content.js', 'ToolShalaContent')?.collections || {};
const articleContent = loadBrowserGlobal('data/articles.js', 'ToolShalaArticleContent')?.collections || {};
const mockData = loadBrowserGlobal('data/mock-test-categories.js', 'mockTestData') || { categories: [], exams: {} };

const today = new Date().toISOString().slice(0, 10);
const existingHtml = new Set(
  fs.readdirSync(ROOT, { recursive: true })
    .filter((file) => typeof file === 'string' && file.endsWith('.html'))
    .filter((file) => !file.startsWith('node_modules/') && !file.startsWith('dist/'))
    .map((file) => file.replace(/\\/g, '/'))
);

const excludedHtml = new Set([
  '404.html',
  'components.html',
  'license.html',
  'tool.html',
  'guide.html',
  'opportunity-details.html',
  'mock-test/exam.html'
]);

const urls = new Map();
const normalizeDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? value : today;
const addUrl = (loc, { lastmod = today, changefreq = 'monthly', priority = '0.5' } = {}) => {
  if (!loc || loc.includes('?') || loc.includes('#')) return;
  const cleanPath = loc === '/' ? '/' : loc.replace(/^\.\//, '/').replace(/^([^/])/, '/$1');
  const fullLoc = `${SITE_URL}${cleanPath === '/' ? '/' : cleanPath}`;
  const existing = urls.get(cleanPath);
  if (existing && Number(existing.priority) >= Number(priority)) return;
  urls.set(cleanPath, { loc: fullLoc, lastmod: normalizeDate(lastmod), changefreq, priority });
};

addUrl('/', { priority: '1.0', changefreq: 'daily' });

for (const file of existingHtml) {
  if (excludedHtml.has(file)) continue;
  const urlPath = file === 'index.html' ? '/' : `/${file}`;
  const major = ['tools.html', 'opportunities.html', 'templates.html', 'career.html', 'guides.html', 'mock-test.html'].includes(file);
  const info = fs.statSync(path.join(ROOT, file));
  addUrl(urlPath, {
    lastmod: info.mtime.toISOString().slice(0, 10),
    changefreq: major ? 'weekly' : file.startsWith('mock-test/') ? 'monthly' : 'monthly',
    priority: major ? '0.9' : ['about.html', 'contact.html'].includes(file) ? '0.8' : file.includes('template') ? '0.7' : file.startsWith('mock-test/') ? '0.6' : '0.6'
  });
}

for (const tool of content.tools || []) {
  const slug = tool.slug || tool.id?.replace(/^tool-/, '');
  if (slug) addUrl(`/tools/${slug}`, { lastmod: tool.publishedAt, changefreq: 'weekly', priority: tool.featured ? '0.9' : '0.8' });
}

const guides = [...(content.guides || []), ...(articleContent.seoGuides || [])];
const seenGuides = new Set();
for (const guide of guides) {
  if (guide.status && !['ready', 'published'].includes(String(guide.status).toLowerCase())) continue;
  const rawSlug = String(guide.slug || '').replace(/^\/guides\//, '').replace(/^\/+|\/+$/g, '');
  if (!rawSlug || seenGuides.has(rawSlug)) continue;
  seenGuides.add(rawSlug);
  addUrl(`/guides/${rawSlug}`, { lastmod: guide.publishDate || guide.publishedAt, changefreq: 'monthly', priority: guide.featured ? '0.8' : '0.7' });
}

for (const category of mockData.categories || []) {
  if (category.slug && existingHtml.has(`mock-test/${category.slug}.html`)) {
    addUrl(`/mock-test/${category.slug}.html`, { changefreq: 'weekly', priority: category.slug === 'teaching-exams' ? '0.8' : '0.7' });
  }
}

const teachingPrioritySlugs = new Set(['ptet', 'bstc', 'reet', 'ctet', 'kvs', 'dsssb']);
for (const slug of teachingPrioritySlugs) {
  if (existingHtml.has(`mock-test/teaching-exams/${slug}.html`)) {
    addUrl(`/mock-test/teaching-exams/${slug}.html`, { changefreq: 'weekly', priority: '0.75' });
  }
}

const sorted = [...urls.values()].sort((a, b) => {
  if (a.loc === `${SITE_URL}/`) return -1;
  if (b.loc === `${SITE_URL}/`) return 1;
  return a.loc.localeCompare(b.loc);
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sorted.map((url) => `  <url>\n    <loc>${url.loc}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`Generated sitemap.xml with ${sorted.length} canonical URLs.`);
