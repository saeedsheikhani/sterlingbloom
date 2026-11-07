"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { INSTAGRAM_URL } from "../../lib/site-links";

// Filter tabs are fixed here; each portfolio item's admin "Category" must be one of these values.
const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Weddings", value: "weddings" },
  { label: "Ceremonies", value: "ceremonies" },
  { label: "Mehndi", value: "mehndi" },
];

// Ignore capital letters and stray spaces in the admin "Category" field.
const normalize = (value) => String(value ?? "").trim().toLowerCase();

export default function Gallery({ content }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const gridRef = useRef(null);

  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const filteredGallery =
    activeCategory === "all"
      ? content.items
      : content.items.filter((item) => normalize(item.category) === activeCategory);

  useEffect(() => {
    if (!gridRef.current || prefersReducedMotion()) return;

    const cards = Array.from(gridRef.current.querySelectorAll("[data-gallery-card]"));

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.965, clipPath: "inset(8% 0 0 0)" },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        clipPath: "inset(0% 0 0 0)",
        duration: 0.72,
        ease: "power3.out",
        stagger: { each: 0.075, from: "start" },
      },
    );
  }, [activeCategory]);

  const changeCategory = (category) => {
    if (category === activeCategory) return;

    if (!gridRef.current || prefersReducedMotion()) {
      setActiveCategory(category);
      return;
    }

    const cards = gridRef.current.querySelectorAll("[data-gallery-card]");
    gsap.to(cards, {
      opacity: 0,
      y: -18,
      scale: 0.97,
      duration: 0.28,
      ease: "power2.in",
      stagger: { each: 0.035, from: "end" },
      onComplete: () => setActiveCategory(category),
    });
  };

  return (
    <section data-reveal id="portfolio" className="sb-portfolio bg-[#F8F7F4] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="eyebrow">{content.eyebrow}</p>
          <div className="mx-auto mt-5 h-px w-16 bg-[#B68A35]" />
          <h2 className="section-heading mx-auto mt-7 max-w-4xl">{content.heading}</h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">{content.description}</p>
        </div>

        <div className="mt-8 flex justify-center gap-5 pb-2 sm:mt-12 sm:gap-8">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => changeCategory(category.value)}
              aria-pressed={activeCategory === category.value}
              className={"relative shrink-0 whitespace-nowrap pb-3 text-[13px] transition-colors duration-300 sm:text-base " + (activeCategory === category.value ? "font-medium text-[#B68A35]" : "text-gray-500 hover:text-[#211d19]")}
            >
              {category.label}
              <span className={"absolute bottom-0 left-0 h-px bg-[#B68A35] transition-all duration-500 " + (activeCategory === category.value ? "w-full" : "w-0")} aria-hidden="true" />
            </button>
          ))}
        </div>

        {/* Equal tiles: two per row on phones and tablets, three per row on computers. */}
        <div ref={gridRef} className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 md:gap-5 lg:grid-cols-3">
          {filteredGallery.map((item, index) => (
            <article key={item.id} data-gallery-card className="group relative overflow-hidden rounded-[2px] bg-white">
              <div className="relative aspect-[4/5] overflow-hidden md:aspect-[4/3]">
                <img src={item.image} alt={item.title} loading={index < 2 ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 md:p-6">
                  <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/75 sm:text-[10px] md:text-xs">{item.category}</p>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-[15px] font-medium leading-tight text-white sm:text-2xl md:text-3xl">{item.title}</h3>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <p className="mx-auto mb-5 max-w-md text-sm leading-6 text-gray-500">{content.note}</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            View More on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
