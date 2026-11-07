import Script from "next/script";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import FloatingBook from "./components/floating-book";
import SiteEnhancements from "./components/site-enhancements";
import { getSiteContent } from "../lib/site-content";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sterlingbloom.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sterling Bloom | Luxury Event Decor & Styling",
  description:
    "Sterling Bloom creates refined event design and decor for weddings, Nikah and Mehndi celebrations, corporate events, and private occasions.",
  keywords: [
    "Sterling Bloom",
    "luxury event decor",
    "wedding decor",
    "Nikah decor",
    "Mehndi decor",
    "event design",
    "event styling",
    "corporate event decor",
    "private celebrations",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Sterling Bloom",
    title: "Sterling Bloom | Luxury Event Decor & Styling",
    description:
      "Thoughtfully designed event decor for weddings, celebrations, and special occasions.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Sterling Bloom — Luxury Event Decor & Styling" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sterling Bloom | Luxury Event Decor & Styling",
    description:
      "Thoughtfully designed event decor for weddings, celebrations, and special occasions.",
  },
  icons: {
    icon: "/images/Sterling Bloom - Final Logo.svg",
  },
};

export default async function RootLayout({ children }) {
  const content = await getSiteContent();
  const design = content.design || {};
  const colors = design.colors || {};
  const layout = design.layout || {};
  const designStyle = {
    "--sb-page-bg": colors.background || "#F8F7F4",
    "--sb-surface": colors.surface || "#FFFFFF",
    "--sb-text": colors.text || "#211D19",
    "--sb-muted": colors.mutedText || "#66615B",
    "--sb-accent": colors.accent || "#B68A35",
    "--sb-accent-light": colors.accentLight || "#D6B56D",
    "--sb-dark": colors.dark || "#1D1813",
    "--sb-content-width": String(layout.contentWidth || 1280) + "px",
    "--sb-section-spacing": String(layout.sectionSpacing || 56) + "px",
    "--sb-card-radius": String(layout.cardRadius ?? 20) + "px",
    "--sb-card-padding": String(layout.cardPadding || 24) + "px",
  };

  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-site-theme={design.theme || "light"}
      data-theme="dark"
      style={{ ...designStyle, colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)]">
        <a className="sb-skip-link" href="#main-content">Skip to content</a>
        <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
        {content.visibility?.nav !== false && <Navbar content={content.nav} />}
        <FloatingBook />
        <SiteEnhancements analyticsId={process.env.NEXT_PUBLIC_GA_ID || "G-MHP199PFVE"} />
        {children}
        {content.visibility?.footer !== false && <Footer content={content.footer} contact={content.contact} />}
      </body>
    </html>
  );
}
