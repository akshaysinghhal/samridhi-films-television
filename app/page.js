import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import GalleryTabs from "../components/GalleryTabs";
import { getContentMap, c } from "../lib/content";
import { supabasePublic } from "../lib/supabaseServer";
import { ytThumb } from "../lib/video";

export const revalidate = 60; // refresh content at most once a minute

const EVENTS = [
  { t: "Government Events", d: "Programs, cultural festivals, inaugurations & public shows.", col: "#00acc1", img: "/images/ig-kajli-teej-mela-stage.jpg" },
  { t: "Corporate Events", d: "Annual functions, award nights, launches & dealer meets.", col: "#7b1fa2", img: "/images/fb-performer-big-audience.jpg" },
  { t: "Weddings", d: "Complete planning, décor, sangeet & destination weddings.", col: "#e91e63", img: "/images/ig-haldi-decor-collage.jpg" },
  { t: "Celebrity & Artist Management", d: "Your event. Your artist. Our responsibility.", col: "#ff6f00", img: "/images/diwali-live-musical.jpg" },
  { t: "Entertainment & Live Shows", d: "Musical nights, folk shows, concerts & theme entertainment.", col: "#9c27b0", img: "/images/fb-folk-dancers-confetti.jpg" },
  { t: "Stage & Event Production", d: "Stage, LED walls, sound, lighting, VFX & special effects.", col: "#0097a7", img: "/images/ig-event-stage.jpg" },
];

const SERVICES = [
  { icon: "💒", t: "Wedding Planning", d: "Complete coordination, themes, venues & hospitality.", col: "#e91e63", img: "/images/ig-haldi-decor-collage.jpg", large: true },
  { icon: "🎤", t: "Celebrity Management", d: "Appearances, live performances & full coordination.", col: "#7b1fa2", img: "/images/diwali-live-musical.jpg", large: true },
  { icon: "🎬", t: "Films & Television", d: "Production expertise from devotional albums to TV shows.", col: "#00acc1" },
  { icon: "🏢", t: "Corporate Events", d: "Launches, conferences, award nights & brand activations.", col: "#ff6f00" },
  { icon: "💃", t: "Sangeet & Choreography", d: "Ladies sangeet, couple dances & professional choreography.", col: "#d81b60" },
  { icon: "🎂", t: "Birthdays & Social", d: "Theme parties, cocktail nights & private celebrations.", col: "#0097a7" },
  { icon: "🌍", t: "International Shows", d: "Taking Indian entertainment beyond borders.", col: "#5e35b1" },
  { icon: "📣", t: "Brand Promotions", d: "Road shows, mall activations & promotional events.", col: "#f4511e" },
  { icon: "✨", t: "Magic Shows", d: "Stage magic & illusion acts for all ages.", col: "#8e24aa" },
  { icon: "🎪", t: "Exhibitions", d: "Stall design, fabrication & event infrastructure.", col: "#00897b" },
  { icon: "🎧", t: "DJ & Sound", d: "Hi-fi sound systems, DJ setups & lighting.", col: "#3949ab" },
  { icon: "📺", t: "Media Management", d: "Print coverage, stage backdrops & projector systems.", col: "#6d4c41" },
];

const FALLBACK_ARTISTS = [
  { name: "Sonu Nigam", category: "Playback Singer" },
  { name: "Shreya Ghoshal", category: "Playback Singer" },
  { name: "Sunil Grover", category: "Comedy / Actor" },
  { name: "Govinda", category: "Bollywood Star" },
  { name: "Kailash Kher", category: "Sufi Singer" },
  { name: "Udit Narayan", category: "Playback Singer" },
  { name: "Preity Zinta", category: "Bollywood Star" },
  { name: "Shilpa Shetty", category: "Bollywood Star" },
];

const GRADS = [
  "linear-gradient(135deg,#7b1fa2,#e91e63)",
  "linear-gradient(135deg,#e91e63,#ff6f00)",
  "linear-gradient(135deg,#00acc1,#5e35b1)",
  "linear-gradient(135deg,#ff6f00,#ffc107)",
];

const CLIENTS = ["Hindustan Zinc", "Vedanta Group", "JK Cement", "Royal Enfield", "Honda", "Maruti Suzuki",
  "UltraTech Cement", "Wonder Cement", "JK White Cement", "Lafarge Cement"];

const FALLBACK_GALLERY = [
  ["/images/ig-couple-portrait.jpg", "Wedding couple portrait"],
  ["/images/fb-sunflower-wedding-stage.jpg", "Sunflower wedding stage"],
  ["/images/ig-floral-decor-closeup.jpg", "Floral décor detail"],
  ["/images/ig-sparkler-celebration.jpg", "Sparkler celebration"],
  ["/images/fb-floral-mandap-stage.jpg", "Floral mandap stage"],
  ["/images/ig-guests-celebrating.jpg", "Guests celebrating"],
];

async function getGalleryItems() {
  try {
    const sb = supabasePublic();
    const { data } = await sb.from("gallery_items").select("*").order("sort").order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

async function getWeddings(limit = 10) {
  try {
    const sb = supabasePublic();
    const { data } = await sb.from("weddings").select("*")
      .order("pinned", { ascending: false }).order("sort").order("created_at", { ascending: false })
      .limit(limit);
    return data || [];
  } catch {
    return [];
  }
}

async function getArtists(limit = 10) {
  try {
    const sb = supabasePublic();
    const { data } = await sb.from("artists").select("*").order("sort").order("created_at").limit(limit);
    return data && data.length ? data : FALLBACK_ARTISTS;
  } catch {
    return FALLBACK_ARTISTS;
  }
}

async function getPosts(limit = 3) {
  try {
    const sb = supabasePublic();
    const { data } = await sb.from("posts").select("title,slug,excerpt,cover_image,published_at")
      .eq("status", "published").order("published_at", { ascending: false }).limit(limit);
    return data || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const map = await getContentMap();
  const galleryItems = await getGalleryItems();
  const weddings = await getWeddings(10);
  const artists = await getArtists(10);
  const posts = await getPosts(3);

  const photos = galleryItems.filter((g) => g.kind === "photo").map((g) => ({ src: g.image_url, title: g.title }));
  const galleryPhotos = photos.length ? photos : FALLBACK_GALLERY.map(([src, title]) => ({ src, title }));
  const videos = galleryItems
    .filter((g) => g.kind === "video")
    .map((g) => ({ thumb: g.image_url || ytThumb(g.video_url), title: g.title, videoUrl: g.video_url }));

  const steps = [1, 2, 3, 4, 5].map((n) => ({
    title: c(map, "home", "steps", `step${n}_title`),
    desc: c(map, "home", "steps", `step${n}_desc`),
  }));

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="hero">
        <img className="hero-bg" src="/images/hero-concert.jpg" alt="Live concert with fireworks" />
        <div className="container hero-inner">
          <span className="eyebrow" style={{ color: "#ffe082" }}>{c(map, "home", "hero", "eyebrow")}</span>
          <h1>{c(map, "home", "hero", "title")}</h1>
          <p className="sub">{c(map, "home", "hero", "subtitle")}</p>
          <div className="hero-ctas">
            <a className="btn btn-white" href="#contact">{c(map, "home", "hero", "cta_primary")}</a>
            <a className="btn btn-outline" href="#events">{c(map, "home", "hero", "cta_secondary")}</a>
          </div>
          <div className="trust-chips">
            <span className="chip">★ Since 1999</span>
            <span className="chip">★ 1000+ Events</span>
            <span className="chip"><img src="/images/iso-badge.png" alt="ISO 9001:2015" /> ISO 9001:2015</span>
          </div>
        </div>
      </section>

      {/* EVENTS CAROUSEL */}
      <section className="section" id="events">
        <div className="container">
          <div className="center">
            <span className="eyebrow">Our Events</span>
            <h2 className="h2">Every Celebration, Signature Style</h2>
            <p className="lead">Swipe through the worlds we create — each one planned, produced and hosted end-to-end.</p>
          </div>
          <div className="carousel-wrap">
            <div className="carousel">
              {EVENTS.map((e) => (
                <a className="event-card" key={e.t} href="#contact" style={{ background: e.col }}>
                  <img src={e.img} alt={e.t} loading="lazy" />
                  <div className="body"><h3>{e.t}</h3><p>{e.d}</p></div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about" style={{ background: "#fff" }}>
        <div className="container">
          <div className="about-grid">
            <div>
              <span className="eyebrow">{c(map, "home", "about", "eyebrow")}</span>
              <h2 className="h2">{c(map, "home", "about", "title")}</h2>
              <p className="lead">{c(map, "home", "about", "body")}</p>
              <ul className="timeline">
                <li><strong>1999 — The Beginning</strong><span>Navratan Jain founds Samridhi as Chittorgarh&apos;s first digital local news channel.</span></li>
                <li><strong>The Transformation</strong><span>Sunil Jain, his younger brother, takes over and builds it into an event management company.</span></li>
                <li><strong>Today</strong><span>1000+ events across government, corporate, weddings &amp; entertainment — plus sister branch NR Events.</span></li>
              </ul>
            </div>
            <div>
              <img className="main" src="/images/diwali-stage-group.jpg" alt="Samridhi Films team on stage" />
            </div>
          </div>

          <div className="team-grid">
            <div className="team-card">
              <img src="/images/team-sunil-jain.jpg" alt="Sunil Jain" />
              <div className="body">
                <div className="role">Driving Force</div>
                <h3>Sunil Jain</h3>
                <p>Anchor with 20 years of expertise; Executive Producer for Zee Rajasthani shows and Mahuaa TV; judge on ETV Rajasthan&apos;s reality show; directed ~500 devotional music albums; represented India at the China Diwali Festival.</p>
              </div>
            </div>
            <div className="team-card">
              <div className="team-placeholder">RC</div>
              <div className="body">
                <div className="role">Finance &amp; Choreography</div>
                <h3>Rajkumari Chouhan</h3>
                <p>Leads the finance department and brings artistry as an acclaimed Bhawai dancer honoured by the State of Gujarat — also a choreographer who has acted in films and YouTube productions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WEDDINGS PREVIEW */}
      <section className="section" id="weddings">
        <div className="container">
          <div className="center">
            <span className="eyebrow">{c(map, "weddings", "hero", "eyebrow")}</span>
            <h2 className="h2">{c(map, "weddings", "hero", "title")}</h2>
            <p className="lead">{c(map, "weddings", "hero", "subtitle")}</p>
          </div>
          {weddings.length > 0 ? (
            <>
              <div className="wedding-grid">
                {weddings.map((w) => (
                  <Link className="wedding-card" key={w.id} href="/weddings" style={{ textDecoration: "none", color: "inherit" }}>
                    {w.cover_image && <img src={w.cover_image} alt={w.title} loading="lazy" />}
                    <div className="body">
                      {w.pinned && <span className="pin-badge">★ Featured</span>}
                      <h3>{w.title}</h3>
                      {(w.location || w.event_date) && (
                        <div className="wmeta">{[w.location, w.event_date ? new Date(w.event_date).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : ""].filter(Boolean).join(" • ")}</div>
                      )}
                      {w.description && <p>{w.description.slice(0, 110)}{w.description.length > 110 ? "…" : ""}</p>}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="center" style={{ marginTop: 34 }}>
                <Link className="btn btn-dark" href="/weddings">View All Weddings</Link>
              </div>
            </>
          ) : (
            <div className="masonry">
              {FALLBACK_GALLERY.map(([src, alt]) => (
                <figure key={src}><img src={src} alt={alt} loading="lazy" /><figcaption>{alt}</figcaption></figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY with photo/video tabs */}
      <section className="section" id="gallery" style={{ background: "#fff" }}>
        <div className="container">
          <div className="center">
            <span className="eyebrow">Gallery</span>
            <h2 className="h2">Moments &amp; Memories</h2>
            <p className="lead">Photos and films from our stages, weddings and celebrations — click any photo to view it up close.</p>
          </div>
          <GalleryTabs photos={galleryPhotos} videos={videos} />
        </div>
      </section>

      {/* SERVICES BENTO */}
      <section className="section" id="services">
        <div className="container">
          <div className="center">
            <span className="eyebrow" style={{ color: "#00acc1" }}>What We Do</span>
            <h2 className="h2">One Team, Every Celebration</h2>
            <p className="lead">Twelve signature services — pick your flavour, we handle the rest.</p>
          </div>
          <div className="bento">
            {SERVICES.map((s) => (
              <div className={`bento-tile ${s.img ? "" : "solid"} ${s.large ? "bento-large" : ""}`} key={s.t}
                style={s.img ? {} : { background: s.col }}>
                {s.img && <img className="bg" src={s.img} alt={s.t} loading="lazy" />}
                <div className="bento-body">
                  <div className="icon">{s.icon}</div>
                  <h3>{s.t}</h3><p>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTISTS */}
      <section className="section artist-band" id="artists">
        <div className="container">
          <span className="eyebrow">Entertainment &amp; Artists</span>
          <h2 className="h2" style={{ color: "#fff" }}>Nights They&apos;ll Never Forget</h2>
          <p className="lead">Singers, folk troupes, bands &amp; anchors — curated and stage-managed by us. A few of the artists we&apos;ve worked with:</p>
          <div className="artist-cards">
            {artists.map((a, i) => (
              <div className="artist-card" key={a.id || a.name}>
                {a.image_url ? (
                  <img src={a.image_url} alt={a.name} loading="lazy" />
                ) : (
                  <div className="aimg" style={{ background: GRADS[i % GRADS.length] }}>
                    {a.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                )}
                <div className="ainfo">
                  <h4>{a.name}</h4>
                  {a.category && <span className="acat">{a.category}</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link className="btn btn-primary" href="/artists">Meet All Artists</Link>
            <a className="btn btn-outline" href="#contact">Book an Artist</a>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="section steps-band">
        <div className="container">
          <div className="center">
            <span className="eyebrow" style={{ color: "#ff6f00" }}>{c(map, "home", "steps", "eyebrow")}</span>
            <h2 className="h2">{c(map, "home", "steps", "title")}</h2>
            <p className="lead">{c(map, "home", "steps", "subtitle")}</p>
          </div>
          <div className="steps">
            {steps.map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="center" style={{ marginTop: 36 }}>
            <a className="btn btn-primary" href="#contact">Start With Step 1</a>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="section">
        <div className="container">
          <div className="center">
            <span className="eyebrow">Clients</span>
            <h2 className="h2">Trusted by Leading Organisations</h2>
          </div>
          <div className="clients-wall">{CLIENTS.map((cl) => <span key={cl}>{cl}</span>)}</div>
        </div>
      </section>

      {/* STATS */}
      <section className="section stats-band">
        <div className="container">
          <div className="stats-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="num">{c(map, "home", "stats", `stat${i}_value`)}</div>
                <div className="lbl">{c(map, "home", "stats", `stat${i}_label`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container">
          <div className="center">
            <span className="eyebrow">Media &amp; Highlights</span>
            <h2 className="h2">In the Spotlight</h2>
            <p className="lead">International festivals, star nights and print coverage of our productions.</p>
          </div>
          <div className="press-grid">
            <figure><img src="/images/poster-china-diwali-2015.jpg" alt="China Diwali Festival 2015" loading="lazy" /><figcaption>China Diwali Festival — International Event</figcaption></figure>
            <figure><img src="/images/poster-star-bollywood-night.jpg" alt="Star Bollywood Night" loading="lazy" /><figcaption>Star Bollywood Night</figcaption></figure>
            <figure><img src="/images/poster-anup-jalota.jpg" alt="Anup Jalota Night" loading="lazy" /><figcaption>Anup Jalota Night</figcaption></figure>
            <figure><img src="/images/press-rajasthan-diwas.jpg" alt="Rajasthan Diwas press coverage" loading="lazy" /><figcaption>Rajasthan Diwas — Press Coverage</figcaption></figure>
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="center">
            <span className="eyebrow">From the Blog</span>
            <h2 className="h2">Stories &amp; Updates</h2>
          </div>
          {posts.length > 0 ? (
            <>
              <div className="blog-grid">
                {posts.map((p) => (
                  <Link className="post-card" key={p.slug} href={`/blog/${p.slug}`}>
                    {p.cover_image && <img src={p.cover_image} alt={p.title} loading="lazy" />}
                    <div className="body">
                      <span className="date">{p.published_at ? new Date(p.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}</span>
                      <h3>{p.title}</h3>
                      <p>{p.excerpt}</p>
                      <span className="read">Read more →</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="center" style={{ marginTop: 34 }}>
                <Link className="btn btn-dark" href="/blog">View All Posts</Link>
              </div>
            </>
          ) : (
            <p className="lead center" style={{ marginTop: 24 }}>New stories from our events are on the way — check back soon.</p>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact" style={{ background: "linear-gradient(135deg,#fff5f8,#fff9f3)" }}>
        <div className="container">
          <div className="center">
            <span className="eyebrow" style={{ color: "#ff6f00" }}>Get in Touch</span>
            <h2 className="h2">Say Hello, Let&apos;s Celebrate</h2>
            <p className="lead">Call, mail or follow — we love talking about your big day.</p>
          </div>
          <div className="contact-grid">
            <div className="contact-cards">
              <div className="contact-card"><h4>Call Us</h4><p><a href={`tel:+91${c(map, "contact", "info", "phone1").replace(/\D/g, "").slice(-10)}`}>{c(map, "contact", "info", "phone1")}</a> • <a href={`tel:+91${c(map, "contact", "info", "phone2").replace(/\D/g, "").slice(-10)}`}>{c(map, "contact", "info", "phone2")}</a></p></div>
              <div className="contact-card" style={{ borderTopColor: "#00acc1" }}><h4 style={{ color: "#00acc1" }}>Email</h4><p><a href={`mailto:${c(map, "contact", "info", "email")}`}>{c(map, "contact", "info", "email")}</a></p></div>
              <div className="contact-card" style={{ borderTopColor: "#ff6f00" }}><h4 style={{ color: "#ff6f00" }}>Visit</h4><p>{c(map, "contact", "info", "address")}</p></div>
              <div className="contact-card" style={{ borderTopColor: "#7b1fa2" }}><h4 style={{ color: "#7b1fa2" }}>Follow</h4><p><a href={c(map, "contact", "info", "instagram")} target="_blank" rel="noreferrer">Instagram</a> • <a href={c(map, "contact", "info", "facebook")} target="_blank" rel="noreferrer">Facebook</a> • <a href={c(map, "contact", "info", "youtube")} target="_blank" rel="noreferrer">YouTube</a></p></div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: "linear-gradient(120deg,#ff6f00,#e91e63)", color: "#fff", textAlign: "center" }}>
        <div className="container">
          <h2 className="h2" style={{ color: "#fff" }}>{c(map, "home", "cta", "title")}</h2>
          <p className="lead" style={{ color: "#ffe9f0", margin: "0 auto 30px" }}>{c(map, "home", "cta", "subtitle")}</p>
          <div className="hero-ctas" style={{ justifyContent: "center" }}>
            <a className="btn btn-white" href="tel:+919602228846">Get a Free Quote</a>
            <a className="btn btn-outline" href="https://wa.me/919602228846" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
