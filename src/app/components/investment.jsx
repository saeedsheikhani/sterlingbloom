"use client";

import { openCalendly } from "../../lib/calendly-popup";
import { BOOKING_URL } from "../../lib/site-links";
import { withInvestmentDefaults } from "../../lib/investment-defaults";

const hasText = (value) => typeof value === "string" && value.trim() !== "";

export default function Investment({ content }) {
  const c = withInvestmentDefaults(content);
  const plannerHref = `mailto:${c.plannerEmail}?subject=${encodeURIComponent(c.plannerSubject)}`;

  return (
    <section data-reveal id="investment" className="sb-investment bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:px-10">
        {/* Block 1: custom pricing */}
        <div>
          {hasText(c.eyebrow) && <p className="eyebrow">{c.eyebrow}</p>}
          <h2 className="section-heading mt-4 max-w-xl">{c.heading}</h2>
          <p className="section-copy mt-5 max-w-xl">{c.description}</p>
          {hasText(c.button) && (
            <button type="button" onClick={(event) => openCalendly(event, BOOKING_URL)} className="btn-primary mt-8 px-10 py-4 text-xs uppercase tracking-[0.18em]">
              {c.button}
            </button>
          )}
        </div>

        {/* Block 2: for planners */}
        <div className="sb-planner-panel border border-[#B68A35]/60 p-7 sm:p-10">
          {hasText(c.plannerLabel) && (
            <p className="sb-planner-label text-[10px] font-medium uppercase tracking-[0.24em]">{c.plannerLabel}</p>
          )}
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-[1.75rem] font-medium leading-tight text-[#211d19] sm:text-3xl">{c.plannerHeading}</h3>
          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">{c.plannerDescription}</p>
          {hasText(c.plannerButton) && hasText(c.plannerEmail) && (
            <a href={plannerHref} className="sb-outline-btn mt-7 inline-flex items-center justify-center px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em]">
              {c.plannerButton}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
