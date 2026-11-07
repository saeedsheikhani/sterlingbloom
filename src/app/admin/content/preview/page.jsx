"use client";

import { Fragment, useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import Hero from "../../../components/hero";
import About from "../../../components/about";
import Services from "../../../components/services";
import Gallery from "../../../components/gallery";
import Process from "../../../components/process";
import Investment from "../../../components/investment";
import TestimonialsPreview from "../../../components/testimonials-preview";
import Contact from "../../../components/contact";
import FAQ from "../../../components/faq";
import { getSectionOrder } from "../../../../lib/section-order";

export default function ContentPreviewPage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    function receive(event) {
      if (event.origin !== window.location.origin || event.data?.type !== "STERLING_BLOOM_DRAFT") return;
      setContent(event.data.content);
    }
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "STERLING_BLOOM_PREVIEW_READY" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  if (!content) return <main className="grid min-h-screen place-items-center bg-[#F8F7F4] px-6 text-center text-[#211D19]"><p className="text-sm">Waiting for your draft preview…</p></main>;
  const design = content.design || {};
  const colors = design.colors || {};
  const layout = design.layout || {};
  const style = {
    "--sb-page-bg": colors.background || "#F8F7F4",
    "--sb-surface": colors.surface || "#FFFFFF",
    "--sb-text": colors.text || "#211D19",
    "--sb-muted": colors.mutedText || "#66615B",
    "--sb-accent": colors.accent || "#B68A35",
    "--sb-accent-light": colors.accentLight || "#D6B56D",
    "--sb-content-width": String(layout.contentWidth || 1280) + "px",
    "--sb-section-spacing": String(layout.sectionSpacing || 56) + "px",
    "--sb-card-radius": String(layout.cardRadius ?? 20) + "px",
    "--sb-card-padding": String(layout.cardPadding ?? 24) + "px",
  };
  const visible = (key) => content.visibility?.[key] !== false;
  const sections = {
    about: <About content={content.about} />,
    services: <Services content={content.services} />,
    gallery: <Gallery content={content.gallery} />,
    process: <Process content={content.process} />,
    investment: <Investment content={content.investment} />,
    testimonials: <TestimonialsPreview content={content.testimonials} />,
    faq: <FAQ content={content.faq || {}} />,
    contact: <Contact content={content.contact} />,
  };
  return <div style={style} className="sb-preview min-h-screen overflow-x-hidden bg-[var(--sb-page-bg)] text-[var(--sb-text)]">
    {visible("nav") && <Navbar content={content.nav} preview />}
    <div className="relative z-10 border-b border-black/10 bg-white/95 px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[.16em] text-[#8A682A]">Live draft preview · Not published</div>
    <main>
      {visible("hero") && <Hero content={content.hero} />}
      {getSectionOrder(content).filter(visible).map((key) => <Fragment key={key}>{sections[key]}</Fragment>)}
    </main>
    {visible("footer") && <Footer content={content.footer} contact={content.contact} preview />}
  </div>;
}
