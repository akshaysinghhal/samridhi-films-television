"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, published: 0, media: 0, blocks: 0, gallery: 0, weddings: 0, artists: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [p, m, c, g, w, a] = await Promise.all([
          api("/api/admin/posts"), api("/api/admin/media"), api("/api/admin/content"),
          api("/api/admin/gallery-items"), api("/api/admin/weddings"), api("/api/admin/artists"),
        ]);
        setStats({
          posts: p.posts.length,
          published: p.posts.filter((x) => x.status === "published").length,
          media: m.media.length,
          blocks: c.blocks.length,
          gallery: g.items.length,
          weddings: w.weddings.length,
          artists: a.artists.length,
        });
      } catch { /* ignore */ }
    })();
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      <p className="admin-sub">Everything on your website lives here — edit it and it goes live within a minute.</p>
      <div className="dash-cards">
        <div className="dash-card"><div className="n">{stats.posts}</div><div className="l">Blog posts</div></div>
        <div className="dash-card"><div className="n">{stats.published}</div><div className="l">Published</div></div>
        <div className="dash-card"><div className="n">{stats.gallery}</div><div className="l">Gallery items</div></div>
        <div className="dash-card"><div className="n">{stats.weddings}</div><div className="l">Weddings</div></div>
        <div className="dash-card"><div className="n">{stats.artists}</div><div className="l">Artists</div></div>
        <div className="dash-card"><div className="n">{stats.media}</div><div className="l">Media files</div></div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
        <Link className="btn btn-primary" href="/admin/posts/new">+ New Blog Post</Link>
        <Link className="btn btn-dark" href="/admin/gallery">Gallery & Videos</Link>
        <Link className="btn btn-dark" href="/admin/weddings">Weddings</Link>
        <Link className="btn btn-dark" href="/admin/artists">Artists</Link>
        <Link className="btn btn-dark" href="/admin/content">Edit Page Content</Link>
      </div>
      <div className="content-group" style={{ marginTop: 30 }}>
        <h2>How publishing works</h2>
        <p style={{ color: "#7a6a7c", fontSize: 15 }}>
          1. Write a post and press <b>Publish</b> (or save as <b>Draft</b>).<br />
          2. Add photos &amp; YouTube videos in <b>Gallery &amp; Videos</b> — they appear in the homepage Gallery tabs.<br />
          3. Add weddings in <b>Weddings</b> and press <b>☆ Pin</b> to feature up to 10 on the homepage.<br />
          4. Manage the artist line-up in <b>Artists</b>.<br />
          5. Change any headline, text or contact detail under <b>Page Content</b> — including the new Steps, Weddings and Artists page copy.<br />
          6. The public website refreshes itself within about a minute — no extra step needed.
        </p>
      </div>
    </>
  );
}
