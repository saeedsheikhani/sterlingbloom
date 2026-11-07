"use client";

import { useEffect, useState } from "react";
import { isCalendlyUrl, openCalendly } from "../../lib/calendly-popup";

const CALENDLY_URL = "https://calendly.com/sumaiya-sterlingbloomdecor/30min";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("sterling-bloom-theme");
    const initialDark = saved !== "light";
    setDark(initialDark);
    document.documentElement.dataset.theme = initialDark ? "dark" : "light";
    document.documentElement.style.colorScheme = initialDark ? "dark" : "light";
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    document.documentElement.style.colorScheme = nextDark ? "dark" : "light";
    window.localStorage.setItem("sterling-bloom-theme", nextDark ? "dark" : "light");
  }

  return (
    <div className="sb-floating-actions" aria-label="Display and booking controls">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={dark}
        className="sb-theme-toggle"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {dark
            ? <path d="M20.2 15.1A8.6 8.6 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z" />
            : <><circle cx="12" cy="12" r="3.7" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>}
        </svg>
      </button>
      {isCalendlyUrl(CALENDLY_URL) ? (
        <button type="button" onClick={openCalendly} className="sb-floating-book" aria-label="Book a meeting">
          Book a meeting
        </button>
      ) : (
        <a href={CALENDLY_URL} className="sb-floating-book">Book a meeting</a>
      )}
    </div>
  );
}
