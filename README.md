# Samridhi Films & Television — Website

Dynamic website + admin panel. **Next.js 14** (public site + admin in one app),
**Supabase** (Postgres database + auth), **Cloudinary** (photo/video hosting),
deployed on **Vercel**.

## What's inside

| Area | URL | Notes |
|---|---|---|
| Public website | `/` | Hero, events, about, team, weddings, services, artists, clients, press, contact |
| Blog | `/blog`, `/blog/[slug]` | SEO meta per post, auto sitemap |
| Admin | `/admin` | Login-protected: dashboard, posts, media, page content |

### Admin capabilities
- **Blog posts**: title, auto slug, excerpt, Markdown body with live preview, cover image,
  photo gallery, YouTube video, status (draft/published), author.
- **SEO per post**: meta title + description with length meters, keywords, OG share image,
  live Google-result preview.
- **Media library**: upload photos/videos to Cloudinary, copy URL, delete.
- **Page content**: edit every headline, paragraph and contact detail on the site.

## Local development

```bash
cp .env.example .env   # fill in your keys
npm install
npm run dev            # http://localhost:3000
```

## Deploy

Follow **DEPLOY.md** — Supabase → Cloudinary → GitHub → Vercel (~30 min, all free tiers).

## Project structure

```
app/                  # pages & routes
  page.js             # home (reads page_content from Supabase, falls back to defaults)
  blog/               # blog index + [slug] posts
  admin/              # login, dashboard, posts editor, media, content editor
  api/
    admin/            # CRUD for posts / content / media (service-role, auth-checked)
    upload/           # file upload → Cloudinary → media table
    revalidate/       # on-demand cache refresh
lib/                  # supabase + cloudinary helpers, content defaults
supabase/schema.sql   # tables, RLS policies, seed content
public/images/        # site photography & brand assets
```
