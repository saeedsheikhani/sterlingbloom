"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function SiteEnhancements({ analyticsId = "" }) {
  const [progress, setProgress] = useState(0);
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
