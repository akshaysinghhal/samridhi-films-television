"use client";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label="Samridhi Films & Television">
          <img src="/images/logo.png" alt="Samridhi Films & Television logo" />
        </Link>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/#about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/#weddings" onClick={() => setOpen(false)}>Weddings</Link>
          <Link href="/#artists" onClick={() => setOpen(false)}>Artists</Link>
          <Link href="/#gallery" onClick={() => setOpen(false)}>Gallery</Link>
          <Link href="/blog" onClick={() => setOpen(false)}>Blog</Link>
          <Link href="/#contact" onClick={() => setOpen(false)}>Contact</Link>
        </nav>
        <div className="nav-cta">
          <a className="btn btn-primary" href="tel:+919602228846">Call Now</a>
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        </div>
      </div>
    </header>
  );
}
