import { supabasePublic } from "../lib/supabaseServer";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://samridhi-films.vercel.app";
  const urls = [
    { url: base, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
  ];
  try {
    const sb = supabasePublic();
    const { data } = await sb.from("posts").select("slug,updated_at").eq("status", "published");
    for (const p of data || []) {
      urls.push({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.updated_at) });
    }
  } catch { /* ignore */ }
  return urls;
}
