"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { INSTAGRAM_URL } from "../../lib/site-links";
import { getPortfolioTabs, resolveItemTab } from "../../lib/portfolio-tabs";


export default function Gallery({ content }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const gridRef = useRef(null);

  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Tabs come from the admin panel; tabs with no items (or no name) are hidden.
  const tabs = getPortfolioTabs(content).filter((tab) => String(tab.label ?? "").trim());
  const items = content.items.map((item) => ({ ...item, tabId: resolveItemTab(item.category, tabs) }));
  const usedTabs = tabs.filter((tab) => items.some((item) => item.tabId === tab.id));
  const tabLabel = (id) => tabs.find((tab) => tab.id === id)?.label || "";
  const currentTab = usedTabs.some((tab) => tab.id === activeCategory) ? activeCategory : "all";

  const filteredGallery = currentTab === "all" ? items : items.filter((item) => item.tabId === currentTab);

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
  }, [currentTab]);

  const changeCategory = (category) => {
    if (category === currentTab) return;

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

        {usedTabs.length > 0 && (
        <div className="-mx-5 mt-8 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:mt-12 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max gap-5 pb-2 sm:gap-8">
          {[{ id: "all", label: "All" }, ...usedTabs].map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => changeCategory(category.id)}
              aria-pressed={currentTab === category.id}
              className={"relative shrink-0 whitespace-nowrap pb-3 text-[13px] transition-colors duration-300 sm:text-base " + (currentTab === category.id ? "font-medium text-[#B68A35]" : "text-gray-500 hover:text-[#211d19]")}
            >
              {category.label}
              <span className={"absolute bottom-0 left-0 h-px bg-[#B68A35] transition-all duration-500 " + (currentTab === category.id ? "w-full" : "w-0")} aria-hidden="true" />
            </button>
          ))}
          </div>
        </div>
        )}

        {/* Equal tiles: two per row on phones and tablets, three per row on computers. */}
        <div ref={gridRef} className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 md:gap-5 lg:grid-cols-3">
          {filteredGallery.map((item, index) => (
            <article key={item.id} data-gallery-card className="group relative overflow-hidden rounded-[2px] bg-white">
              <div className="relative aspect-[4/5] overflow-hidden md:aspect-[4/3]">
                <img src={item.image} alt={item.title} loading={index < 2 ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 md:p-6">
                  <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/75 sm:text-[10px] md:text-xs">{tabLabel(item.tabId)}</p>
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
