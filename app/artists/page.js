import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getContentMap, c } from "../../lib/content";
import { supabasePublic } from "../../lib/supabaseServer";

export const revalidate = 60;

export const metadata = {
  title: "Artist Management",
  description: "Book Bollywood singers, folk artists, bands and anchors for your event — curated and stage-managed by Samridhi Films & Television.",
};

const FALLBACK = [
  { name: "Sonu Nigam", category: "Playback Singer" },
  { name: "Shreya Ghoshal", category: "Playback Singer" },
  { name: "Sunil Grover", category: "Comedy / Actor" },
  { name: "Govinda", category: "Bollywood Star" },
  { name: "Preity Zinta", category: "Bollywood Star" },
  { name: "Shilpa Shetty", category: "Bollywood Star" },
  { name: "Kailash Kher", category: "Sufi Singer" },
  { name: "Udit Narayan", category: "Playback Singer" },
  { name: "Alka Yagnik", category: "Playback Singer" },
  { name: "Anup Jalota", category: "Bhajan Samrat" },
  { name: "Rajpal Yadav", category: "Comedy / Actor" },
  { name: "Suniel Shetty", category: "Bollywood Star" },
  { name: "Monali Thakur", category: "Playback Singer" },
  { name: "Darshan Raval", category: "Singer / Performer" },
];

const GRADS = [
  "linear-gradient(135deg,#7b1fa2,#e91e63)",
  "linear-gradient(135deg,#e91e63,#ff6f00)",
  "linear-gradient(135deg,#00acc1,#5e35b1)",
  "linear-gradient(135deg,#ff6f00,#ffc107)",
];

const PROCESS = [
  ["01", "Understand", "We learn your event, audience and budget."],
  ["02", "Curate", "We shortlist the perfect artists for your vibe."],
  ["03", "Coordinate", "Dates, contracts and logistics — handled."],
  ["04", "Plan", "Setlists, staging and sound, locked in."],
  ["05", "Execute", "Our crew stage-manages the performance."],
  ["06", "Deliver", "A night your guests will never forget."],
];

async function getArtists() {
  try {
    const sb = supabasePublic();
    const { data } = await sb.from("artists").select("*").order("sort").order("created_at");
    return data && data.length ? data : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export default async function ArtistsPage() {
  const map = await getContentMap();
  const artists = await getArtists();

  return (
    <>
      <Header />
      <section className="hero" style={{ background: "linear-gradient(120deg,#4a1d5e,#c2185b)" }}>
        <img className="hero-bg" src="/images/diwali-live-musical.jpg" alt="Live musical night" />
        <div className="container hero-inner" style={{ padding: "80px 0 70px" }}>
          <span className="eyebrow" style={{ color: "#ffe082" }}>{c(map, "artists", "hero", "eyebrow")}</span>
          <h1>{c(map, "artists", "hero", "title")}</h1>
          <p className="sub">{c(map, "artists", "hero", "subtitle")}</p>
          <div className="hero-ctas">
            <a className="btn btn-white" href="/#contact">Book an Artist</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="center">
            <span className="eyebrow">Line-up</span>
            <h2 className="h2">{c(map, "artists", "list", "title")}</h2>
            <p className="lead">{c(map, "artists", "list", "subtitle")}</p>
          </div>
          <div className="wedding-grid">
            {artists.map((a, i) => (
              <div className="artist-card" key={a.id || a.name} style={{ flex: "none", background: "#fff", border: "1px solid #f0d7e2" }}>
                {a.image_url ? (
                  <img src={a.image_url} alt={a.name} loading="lazy" />
                ) : (
                  <div className="aimg" style={{ background: GRADS[i % GRADS.length] }}>
                    {a.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                )}
                <div className="ainfo">
                  <h4 style={{ color: "var(--ink)" }}>{a.name}</h4>
                  {a.category && <span className="acat" style={{ color: "var(--pink)" }}>{a.category}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section artist-band">
        <div className="container">
          <span className="eyebrow">{c(map, "artists", "process", "title")}</span>
          <h2 className="h2" style={{ color: "#fff" }}>{c(map, "artists", "process", "title")}</h2>
          <div className="process">
            {PROCESS.map(([n, t, d]) => (
              <div className="step" key={n}><b>{n}</b><span>{t}</span><p style={{ fontSize: 13, opacity: 0.75, margin: "8px 0 0" }}>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "linear-gradient(120deg,#7b1fa2,#e91e63)", color: "#fff", textAlign: "center" }}>
        <div className="container">
          <h2 className="h2" style={{ color: "#fff" }}>{c(map, "artists", "cta", "title")}</h2>
          <p className="lead" style={{ color: "#f3e3f7", margin: "0 auto 30px" }}>{c(map, "artists", "cta", "subtitle")}</p>
          <div className="hero-ctas" style={{ justifyContent: "center" }}>
            <Link className="btn btn-white" href="/#contact">Enquire Now</Link>
            <a className="btn btn-outline" href="https://wa.me/919602228846" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
