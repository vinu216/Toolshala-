# ToolShala

ToolShala is a modern multi-page website for Indian students, freshers, freelancers, and young creators.

Tagline: **AI Tools, Career Help, Opportunities & Templates**

## Tech Stack

- HTML
- Tailwind CSS (CDN in pages)
- Vanilla JavaScript

## Pages

- `index.html`
- `tools.html`
- `opportunities.html`
- `career.html`
- `templates.html`
- `about.html`
- `contact.html`

## Project Structure

- `styles.css`: shared design system (buttons, cards, hero gradients, logo styling, animation utilities)
- `script.js`: UI behavior + reusable render/filter utilities + tool generators
- `data/content.js`: structured content collections for tools, opportunities, templates, testimonials, and career guides
- `data/articles.js`: SEO guide architecture data (25 metadata-first article entries)
- `data/tool-definitions.js`: metadata + input schema for all working tools
- `tools-engine.js`: reusable tool runtime (form rendering, validation, loading, output, copy)
- `tool.html`: reusable tool detail page (`tool.html?tool=<tool-id>`)
- `guides.html`: listing page for SEO guide topics
- `guide.html`: reusable guide detail template powered by `slug` query param
- `data.js`: legacy compatibility adapter mapped from `data/content.js`

## Refactor Notes

- Content and UI are now separated through `ToolShalaContent.collections.*` plus shared render functions.
- Repeated listing patterns use reusable helpers in `script.js`:
  - `renderCollection(...)`
  - `createDataAttributes(...)`
  - `resolveToolLink(...)`
  - `resolveOpportunityLink(...)`
- Page filters are configured through a single `filterConfigs` array so adding a new filterable page is config-first.
- Legacy `ToolShalaData` is generated from `ToolShalaContent`, avoiding duplicate data maintenance.
- Working tools now use a config-driven architecture from `data/tool-definitions.js` so adding a new tool only requires:
  - one new tool object (metadata + field schema)
  - one generator function in `tools-engine.js`

## Setup Instructions

1. Clone or download this project.
2. Install dependencies:
   `npm install`
3. Start local development server:
   `npm run dev`
4. Open the URL shown in terminal (usually `http://localhost:5173`).
5. Build production bundle:
   `npm run build`

## Dynamic-Ready Data Architecture

Primary content source:

- `window.ToolShalaContent.collections.tools`
- `window.ToolShalaContent.collections.opportunities`
- `window.ToolShalaContent.collections.templates`
- `window.ToolShalaContent.collections.testimonials`
- `window.ToolShalaContent.collections.careerGuides`

Each content item now supports scaling fields such as:

- `id`
- `slug`
- `featured`
- `publishedAt`
- `tags`
- page-specific fields like `category`, `eligibility`, `mode`, `downloads`, `url`

This makes content portable to APIs/CMS later with minimal UI rewrite.

## Future: Convert Static Site to Dynamic Product

1. Expand the current JS-rendered card approach to all remaining static sections.
2. Move content to a backend collection schema that mirrors `ToolShalaContent.collections.*`.
3. Add a lightweight backend (Node.js + Express or serverless functions) with CRUD APIs for each collection.
4. Use a database (PostgreSQL, MongoDB, or Supabase) for persistent records and publishing workflows.
5. Create an admin dashboard for draft/publish, featured toggle, category tags, and slug editing.
6. Add authentication for admin and optional user features (bookmarks, saved templates).
7. Add API-driven search, filtering, sorting, and pagination based on `tags`, `category`, and `publishedAt`.
8. Integrate newsletter provider (ConvertKit, Mailchimp, or Brevo) for production lead capture.
9. Add analytics (GA4 or Plausible) to track top-performing content by `id` and `slug`.
10. Add caching/CDN and image optimization for faster pan-India performance.
11. Optionally migrate UI to component-based React pages once content/admin complexity grows.

## CMS/Admin Integration Notes

Suggested collection mapping:

- `tools`: `id`, `slug`, `title`, `category`, `description`, `featured`, `publishedAt`, `tags`, `url`
- `opportunities`: `id`, `slug`, `title`, `category`, `eligibility`, `deadline`, `mode`, `description`, `badge`, `featured`, `applyLink`
- `templates`: `id`, `slug`, `title`, `category`, `preview`, `content`, `downloads`, `featured`, `publishedAt`
- `testimonials`: `id`, `name`, `role`, `location`, `quote`, `publishedAt`, `featured`
- `careerGuides`: `id`, `slug`, `title`, `excerpt`, `audience`, `category`, `publishedAt`, `featured`, `url`

Because cards are now rendered from structured arrays in `script.js`, replacing `data/content.js` with API responses is straightforward.

## SEO Content Architecture (Metadata-First)

ToolShala now includes a scalable SEO guide architecture without full article bodies yet.

- Collection source: `window.ToolShalaArticleContent.collections.seoGuides`
- Total initial topics: 25
- Required fields per entry:
  - `id`, `title`, `slug`
  - `primaryKeyword`, `searchIntent`
  - `metaTitle`, `metaDescription`
  - `shortExcerpt`, `category`
  - `ctaText`, `relatedLinks`
  - `featuredImageAlt`, `status`
  - `publishDate`, `readingTime`, `author`, `featured`

### Routing Strategy

- Listing page: `guides.html`
- Detail template: `guide.html?slug=<article-slug>`
- Future pretty URL target: `/guides/<slug>`

Current static implementation maps `/guides/<slug>` style internal links to the template route automatically in `script.js`.

### Listing and Related Logic

- Homepage career preview can be hydrated from `seoGuides` via `#homeCareerGuidesGrid`.
- Career hub featured guides can be hydrated from `seoGuides` via `#careerGuidesGrid`.
- Guides listing page supports:
  - featured topic block (`#featuredSeoGuidesGrid`)
  - full topic grid (`#seoGuidesGrid`)
- Guide detail page supports related topics (`#relatedGuidesGrid`) via category/keyword/link scoring.

### How to Add Full Articles Later

1. Keep metadata in `data/articles.js` as the source of truth.
2. Add long-form fields progressively (for example: `sections`, `faq`, `toc`, `authorBio`, `lastUpdated`).
3. Update `renderSeoGuideDetail()` to render full sections below the existing placeholder block.
4. Keep slug stable once published to protect SEO URLs.
5. Add article-level FAQ schema only when matching visible content is added.
6. Optionally move article body to CMS/API while retaining this metadata contract.