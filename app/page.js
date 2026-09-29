import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { getContentMap, c } from "../lib/content";
import { supabasePublic } from "../lib/supabaseServer";

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
  ["💒", "Wedding Planning", "Complete coordination, themes, venues & hospitality.", "#e91e63"],
  ["🎤", "Celebrity Management", "Appearances, live performances & full coordination.", "#7b1fa2"],
  ["🎬", "Films & Television", "Production expertise from devotional albums to TV shows.", "#00acc1"],
  ["🏢", "Corporate Events", "Launches, conferences, award nights & brand activations.", "#ff6f00"],
  ["💃", "Sangeet & Choreography", "Ladies sangeet, couple dances & professional choreography.", "#d81b60"],
  ["🎂", "Birthdays & Social", "Theme parties, cocktail nights & private celebrations.", "#0097a7"],
  ["🌍", "International Shows", "Taking Indian entertainment beyond borders.", "#5e35b1"],
  ["📣", "Brand Promotions", "Road shows, mall activations & promotional events.", "#f4511e"],
  ["✨", "Magic Shows", "Stage magic & illusion acts for all ages.", "#8e24aa"],
  ["🎪", "Exhibitions", "Stall design, fabrication & event infrastructure.", "#00897b"],
  ["🎧", "DJ & Sound", "Hi-fi sound systems, DJ setups & lighting.", "#3949ab"],
  ["📺", "Media Management", "Print coverage, stage backdrops & projector systems.", "#6d4c41"],
];

const ARTISTS = ["Sonu Nigam", "Shreya Ghoshal", "Sunil Grover", "Govinda", "Preity Zinta", "Shilpa Shetty",
  "Kailash Kher", "Udit Narayan", "Alka Yagnik", "Anup Jalota", "Rajpal Yadav", "Suniel Shetty",
  "Shamita Shetty", "Chunky Pandey", "Monali Thakur", "Darshan Raval"];

const CLIENTS = ["Hindustan Zinc", "Vedanta Group", "JK Cement", "Royal Enfield", "Honda", "Maruti Suzuki",
  "UltraTech Cement", "Wonder Cement", "JK White Cement", "Lafarge Cement"];

const GALLERY = [
  ["/images/ig-couple-portrait.jpg", "Wedding couple portrait"],
  ["/images/fb-sunflower-wedding-stage.jpg", "Sunflower wedding stage"],
  ["/images/ig-floral-decor-closeup.jpg", "Floral décor detail"],
  ["/images/ig-sparkler-celebration.jpg", "Sparkler celebration"],
  ["/images/fb-floral-mandap-stage.jpg", "Floral mandap stage"],
  ["/images/ig-guests-celebrating.jpg", "Guests celebrating"],
];

export default async function Home() {
  const map = await getContentMap();
  let posts = [];
  try {
    const sb = supabasePublic();
    const { data } = await sb.from("posts").select("title,slug,excerpt,cover_image,published_at")
      .eq("status", "published").order("published_at", { ascending: false }).limit(3);
    posts = data || [];
  } catch { /* no posts yet */ }

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
            <div className="carousel" id="eventCarousel">
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

      {/* WEDDINGS + GALLERY */}
      <section className="section" id="weddings">
        <div className="container">
          <div className="center">
            <span className="eyebrow">Wedding Gallery</span>
            <h2 className="h2">Shaadi Moments, Up Close</h2>
            <p className="lead">Real décor, real couples, real celebrations — from intimate functions to grand destination weddings.</p>
          </div>
          <div className="masonry" id="gallery">
            {GALLERY.map(([src, alt]) => (
              <figure key={src}><img src={src} alt={alt} loading="lazy" /><figcaption>{alt}</figcaption></figure>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services" style={{ background: "#fff" }}>
        <div className="container">
          <div className="center">
            <span className="eyebrow" style={{ color: "#00acc1" }}>What We Do</span>
            <h2 className="h2">One Team, Every Celebration</h2>
            <p className="lead">Twelve signature services — pick your flavour, we handle the rest.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map(([icon, t, d, col]) => (
              <div className="service-tile" key={t} style={{ background: col }}>
                <div className="icon">{icon}</div>
                <h3>{t}</h3><p>{d}</p>
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
          <div className="artist-names">{ARTISTS.map((a) => <span key={a}>{a}</span>)}</div>
          <div className="process">
            {[["01", "Understand"], ["02", "Curate"], ["03", "Coordinate"], ["04", "Plan"], ["05", "Execute"], ["06", "Deliver"]].map(([n, t]) => (
              <div className="step" key={n}><b>{n}</b><span>{t}</span></div>
            ))}
          </div>
          <div style={{ marginTop: 36 }}>
            <a className="btn btn-primary" href="#contact">Book an Artist</a>
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
