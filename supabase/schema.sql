-- Samridhi Films & Television — Supabase schema
-- Run this in the Supabase SQL editor (https://supabase.com/dashboard > SQL Editor)

-- 1. Blog posts ---------------------------------------------------------------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',          -- markdown
  cover_image text,                           -- cloudinary url
  gallery text[] default '{}',                -- cloudinary urls
  video_url text,                             -- youtube/vimeo/cloudinary url
  meta_title text,
  meta_description text,
  keywords text,
  og_image text,                              -- cloudinary url (defaults to cover)
  status text not null default 'draft' check (status in ('draft','published')),
  author text default 'Samridhi Films & Television',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_slug_idx on posts (slug);
create index if not exists posts_status_idx on posts (status);

-- 2. Page content blocks --------------------------------------------------------
-- One row per editable block. `page` = home|about|weddings|artists|gallery|contact,
-- `section` groups blocks, `key` is the field name, `value` the text/html.
create table if not exists page_content (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  section text not null,
  key text not null,
  label text,                                 -- friendly name shown in admin
  value text not null default '',
  image_url text,                             -- optional cloudinary url for the block
  sort int not null default 0,
  updated_at timestamptz not null default now(),
  unique (page, section, key)
);

-- 3. Media library --------------------------------------------------------------
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  public_id text,                             -- cloudinary public id
  kind text not null default 'image' check (kind in ('image','video')),
  alt text,
  created_at timestamptz not null default now()
);

-- 4. Row Level Security ----------------------------------------------------------
alter table posts enable row level security;
alter table page_content enable row level security;
alter table media enable row level security;

-- Public (anon) can read published posts + all page content + media
create policy "public read published posts" on posts
  for select using (status = 'published');
create policy "public read page content" on page_content
  for select using (true);
create policy "public read media" on media
  for select using (true);

-- Everything else goes through the service-role key on the server (admin API),
-- so no write policies for anon/authenticated are needed.

-- 5. Seed default page content ----------------------------------------------------
insert into page_content (page, section, key, label, value, sort) values
-- HOME / HERO
('home','hero','eyebrow','Eyebrow','Chittorgarh • Since 1999',1),
('home','hero','title','Headline','Creating Experiences. Delivering Excellence.',2),
('home','hero','subtitle','Sub-headline','You Just Think & We Will Manage It! Weddings, celebrity shows, government & corporate events — planned and executed by one powerhouse team.',3),
('home','hero','cta_primary','Primary button text','Plan Your Event',4),
('home','hero','cta_secondary','Secondary button text','Explore Our Work',5),
-- HOME / ABOUT
('home','about','eyebrow','Eyebrow','About Us',1),
('home','about','title','Headline','A Complete Event Management Company',2),
('home','about','body','Body text','Founded in 1999 by Navratan Jain as Chittorgarh''s first digital local news channel, Samridhi Films & Television was transformed into a full-service event management company by his younger brother Sunil Jain. Today we deliver government programs, corporate events, weddings, cultural festivals and celebrity shows across India — with our sister branch NR Events carrying the founder''s name forward.',3),
-- HOME / STATS
('home','stats','stat1_value','Stat 1 value','1999',1),
('home','stats','stat1_label','Stat 1 label','Serving since',2),
('home','stats','stat2_value','Stat 2 value','1000+',3),
('home','stats','stat2_label','Stat 2 label','Events delivered',4),
('home','stats','stat3_value','Stat 3 value','500',5),
('home','stats','stat3_label','Stat 3 label','Devotional albums directed',6),
('home','stats','stat4_value','Stat 4 value','5.0',7),
('home','stats','stat4_label','Stat 4 label','Justdial rating',8),
-- HOME / CTA
('home','cta','title','Headline','Let''s Plan Your Celebration',1),
('home','cta','subtitle','Sub-headline','Call us or drop a message — we reply within one working day.',2),
-- CONTACT
('contact','info','phone1','Phone 1','+91 96022 28846',1),
('contact','info','phone2','Phone 2','+91 77372 89938',2),
('contact','info','email','Email','samridhifilms@yahoo.co.in',3),
('contact','info','address','Address','230/4, Main Collectorate Circle, Gandhi Nagar, Chittorgarh 312001, Rajasthan',4),
('contact','info','instagram','Instagram URL','https://www.instagram.com/samridhi_films_and_television/',5),
('contact','info','facebook','Facebook URL','https://www.facebook.com/SamridhiFilmsAndTelevision',6),
('contact','info','youtube','YouTube URL','https://www.youtube.com/@SONAMUSICLIVE',7)
on conflict (page, section, key) do nothing;
