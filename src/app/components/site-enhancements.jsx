"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const PHONE = "16475445681";

export default function SiteEnhancements({ analyticsId = "" }) {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [cookieChoice, setCookieChoice] = useState("pending");

  useEffect(() => {
    const stored = window.localStorage.getItem("sb-cookie-choice");
    if (stored === "accepted" || stored === "rejected") setCookieChoice(stored);

    let ticking = false;
    const updateScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
        setShowTop(window.scrollY > 500);
        ticking = false;
      });
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  function chooseCookies(choice) {
    window.localStorage.setItem("sb-cookie-choice", choice);
    setCookieChoice(choice);
  }

  return (
    <>
      <div className="sb-scroll-progress" style={{ width: progress + "%" }} aria-hidden="true" />
      {cookieChoice === "pending" && (
        <section className="sb-cookie-banner" aria-label="Cookie preferences">
          <div>
            <p className="sb-cookie-title">Your privacy matters</p>
            <p className="sb-cookie-copy">We use essential storage to remember your preferences. Optional analytics are only enabled if you accept.</p>
          </div>
          <div className="sb-cookie-actions">
            <button type="button" onClick={() => chooseCookies("rejected")}>Essential only</button>
            <button type="button" onClick={() => chooseCookies("accepted")}>Accept analytics</button>
          </div>
        </section>
      )}

      {showTop && (
        <button className="sb-back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })} aria-label="Back to top">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 14 6-6 6 6" /></svg>
        </button>
      )}

      <div className="sb-quick-actions" aria-label="Quick contact actions">
        <a href={"https://wa.me/" + PHONE + "?text=" + encodeURIComponent("Hello Sterling Bloom, I'd like to discuss an event.")} target="_blank" rel="noopener noreferrer" aria-label="Chat with Sterling Bloom on WhatsApp" title="Chat on WhatsApp">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.7 11.7 0 0 0 2.1 17.6L.5 23.5l6-1.6A11.7 11.7 0 0 0 20.5 3.5ZM12 21a9.6 9.6 0 0 1-4.9-1.3l-.4-.2-3.5.9.9-3.4-.2-.4A9.5 9.5 0 1 1 12 21Zm5.2-7.1c-.3-.2-1.7-.8-2-.9s-.5-.2-.7.2-.8.9-.9 1.1-.3.2-.6.1a7.8 7.8 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5s0-.4 0-.5-.7-1.7-1-2.3c-.2-.5-.5-.4-.7-.4H7.7c-.2 0-.5.1-.8.4s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2a11.3 11.3 0 0 0 4.4 3.9c.6.3 1.1.4 1.5.6.6.2 1.2.2 1.7.1.5-.1 1.7-.7 1.9-1.4s.2-1.3.2-1.4-.2-.2-.5-.4Z"/></svg>
        </a>
      </div>

      {cookieChoice === "accepted" && analyticsId && (
        <>
          <Script src={"https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(analyticsId)} strategy="afterInteractive" />
          <Script id="sb-google-analytics" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            window.gtag('js', new Date());
            window.gtag('config', '${analyticsId}', { anonymize_ip: true });
          `}</Script>
        </>
      )}
    </>
  );
}
