"use client";

import { useEffect, useState } from "react";
import { openCalendly } from "../../lib/calendly-popup";

// Floating "Book Now" button. The site is dark-only, so there is no light/dark toggle.
// It hides while the hero is on screen, because the hero has its own Book button.
export default function FloatingBook() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={"sb-floating-actions" + (heroVisible ? " is-hidden" : "")} aria-label="Booking">
      <button type="button" onClick={openCalendly} className="sb-floating-book" aria-label="Book Now" tabIndex={heroVisible ? -1 : 0}>
        Book Now
      </button>
    </div>
  );
}
