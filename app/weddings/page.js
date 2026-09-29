import Header from "../../components/Header";
import Footer from "../../components/Footer";
import WeddingGrid from "../../components/WeddingGrid";
import { getContentMap, c } from "../../lib/content";
import { supabasePublic } from "../../lib/supabaseServer";

export const revalidate = 60;

export const metadata = {
  title: "Weddings",
  description: "Wedding planning, décor and destination weddings by Samridhi Films & Television — real celebrations across Rajasthan and India.",
};

async function getWeddings() {
  try {
    const sb = supabasePublic();
    const { data } = await sb.from("weddings").select("*")
      .order("pinned", { ascending: false }).order("sort").order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function WeddingsPage() {
  const map = await getContentMap();
  const weddings = await getWeddings();

  return (
    <>
      <Header />
      <section className="hero" style={{ background: "linear-gradient(120deg,#c2185b,#ff6f00)" }}>
        <img className="hero-bg" src="/images/ig-haldi-decor-collage.jpg" alt="Wedding décor" />
        <div className="container hero-inner" style={{ padding: "80px 0 70px" }}>
          <span className="eyebrow" style={{ color: "#ffe082" }}>{c(map, "weddings", "hero", "eyebrow")}</span>
          <h1>{c(map, "weddings", "hero", "title")}</h1>
          <p className="sub">{c(map, "weddings", "hero", "subtitle")}</p>
          <div className="hero-ctas">
            <a className="btn btn-white" href="/#contact">Plan Your Wedding</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {weddings.length === 0 ? (
            <p className="lead center">Our wedding stories are being added — check back soon, or <a href="/#contact" style={{ color: "var(--pink)", fontWeight: 700 }}>talk to us</a> about yours.</p>
          ) : (
            <WeddingGrid weddings={weddings} />
          )}
        </div>
      </section>

      <section className="section" style={{ background: "linear-gradient(120deg,#ff6f00,#e91e63)", color: "#fff", textAlign: "center" }}>
        <div className="container">
          <h2 className="h2" style={{ color: "#fff" }}>Dreaming of Your Big Day?</h2>
          <p className="lead" style={{ color: "#ffe9f0", margin: "0 auto 30px" }}>From haldi to reception — décor, sangeet, artists and complete coordination.</p>
          <div className="hero-ctas" style={{ justifyContent: "center" }}>
            <a className="btn btn-white" href="/#contact">Get a Free Quote</a>
            <a className="btn btn-outline" href="https://wa.me/919602228846" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
