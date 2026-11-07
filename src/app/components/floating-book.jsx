"use client";

import { openCalendly } from "../../lib/calendly-popup";

// Floating "Book a meeting" button. The site is dark-only, so there is no light/dark toggle.
export default function FloatingBook() {
  return (
    <div className="sb-floating-actions" aria-label="Booking">
      <button type="button" onClick={openCalendly} className="sb-floating-book" aria-label="Book a meeting">
        Book a meeting
      </button>
    </div>
  );
}
