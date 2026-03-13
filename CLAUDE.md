# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite exists.

## Code Style

- No semicolons, single quotes, trailing commas (enforced by `.prettierrc.js`)
- Path alias `@/*` maps to `./src/*`

## Architecture

Next.js 13 (pages router) personal blog with SSG, MDX content, and TypeScript.

### Content & Data Flow

- Blog posts are `.mdx` files in `/src/_posts/` with YAML front matter
- `/src/api/utils.ts` reads files with Node.js `fs` at build time — `getPost`, `getAllPosts`, `getPostsByTag`
- Pages use `getStaticProps` + `getStaticPaths` to pre-generate all routes
- Post front matter fields: `slug`, `date`, `thumbnail`, `title`, `description`, `tags[]`

### Pages

- `/` — Animated ASCII art hero; full art on desktop (≥815px), cropped on mobile
- `/thoughts` — Blog listing (all posts sorted by date)
- `/posts/[slug]` — MDX post rendered with `next-mdx-remote`
- `/tags/[slug]` — Posts filtered by tag
- `/about` — Static page

### Styling

- Dark theme (black bg, white text), monospace (Courier New) throughout
- CSS Modules per component + `globals.css`
- Mobile breakpoint: 814px

### MDX Components

`_app.tsx` wraps the app in `MDXProvider`. Custom components available in MDX: `Video` (for embeds), `Thumbnail` (Next.js Image wrapper).

### Static Assets

Images live in `/public/assets/` organized by post (e.g., `january_2024/`). Use `exiftool -recurse -overwrite_original -all= .` to strip metadata before committing images.

## Admin UI

Available at `localhost:3000/admin` only when `NODE_ENV=development`. Redirects to `/` in production. API routes return 403 in production.

- `/admin` — dashboard: lists all posts (including unpublished), publish toggle, delete, manual deploy button
- `/admin/new` — create post: title/date/description/tags/content editor/image upload → writes MDX file + images, then commits and pushes

**Deploy flow:** "publish post" and dashboard actions automatically run `git add src/_posts/ public/assets/` → `git commit` → `git push`. Vercel deploys on push. The admin tool must be used while on a branch that pushes to your deployment branch (main).

**Unpublish:** adds `published: false` to front matter. All public-facing pages filter out posts where `published === false`. Unpublished posts still appear in the admin dashboard.

**Setup:** no extra dependencies required. Optionally add `VERCEL_DEPLOY_HOOK_URL` to `.env.local` (not currently used — deploy is handled via git push).
