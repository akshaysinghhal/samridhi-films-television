import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/images/logo.png" alt="Samridhi Films & Television" />
            <p style={{ fontSize: 14.5, maxWidth: 340 }}>
              A complete event management company since 1999. Weddings, celebrity shows,
              government &amp; corporate events — across India. A Group of Navratan Jain.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link href="/#about">About Us</Link>
            <Link href="/#weddings">Weddings</Link>
            <Link href="/#artists">Artist Management</Link>
            <Link href="/#gallery">Gallery</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/#contact">Contact</Link>
          </div>
          <div>
            <h4>Reach Us</h4>
            <a href="tel:+919602228846">+91 96022 28846</a>
            <a href="tel:+917737289938">+91 77372 89938</a>
            <a href="mailto:samridhifilms@yahoo.co.in">samridhifilms@yahoo.co.in</a>
            <a href="https://www.instagram.com/samridhi_films_and_television/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.facebook.com/SamridhiFilmsAndTelevision" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.youtube.com/@SONAMUSICLIVE" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Samridhi Films And Television • Since 1999</span>
          <span>Mumbai &amp; Chittorgarh, Rajasthan</span>
        </div>
      </div>
    </footer>
  );
}
