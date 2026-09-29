import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://samridhi-films.vercel.app"),
  title: {
    default: "Samridhi Films & Television | Event Management, Weddings & Artist Management",
    template: "%s | Samridhi Films & Television",
  },
  description:
    "Samridhi Films & Television — Chittorgarh's complete event management company since 1999. Weddings, celebrity shows, government & corporate events. You Just Think & We Will Manage It!",
  keywords: ["event management", "wedding planner Rajasthan", "celebrity management", "Chittorgarh events", "corporate events"],
  openGraph: {
    type: "website",
    siteName: "Samridhi Films & Television",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <a
          className="wa-float"
          href="https://wa.me/919602228846?text=Hi%20Samridhi%20Films!%20I%20want%20to%20plan%20an%20event."
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
        >
          ✆
        </a>
      </body>
    </html>
  );
}
