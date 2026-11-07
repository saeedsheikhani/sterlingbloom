"use client";

import { useEffect, useRef, useState } from "react";
import { openCalendly } from "../../lib/calendly-popup";
import { BOOKING_URL } from "../../lib/site-links";
import { gsap } from "gsap";

export default function Services({ content }) {
  const [activeService, setActiveService] = useState(0);
  const active = content.items[activeService] || content.items[0];
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const numberRef = useRef(null);
  const transitionRef = useRef(null);

  // Phones: swipeable card row with dots that follow the swipe position.
  const trackRef = useRef(null);
  const [slide, setSlide] = useState(0);

  const handleTrackScroll = () => {
    const track = trackRef.current;
    const first = track?.firstElementChild;
    if (!first) return;
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || "0");
    setSlide(Math.min(content.items.length - 1, Math.max(0, Math.round(track.scrollLeft / step))));
  };

  const goToSlide = (index) => {
    const track = trackRef.current;
    const card = track?.children[index];
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || "0"), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const bookService = (event) => openCalendly(event, BOOKING_URL);

  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!stageRef.current || prefersReducedMotion()) return;

    gsap.set([imageRef.current, contentRef.current], {
      opacity: 0,
      filter: "blur(4px)",
      scale: 0.985,
    });

    gsap.to([imageRef.current, contentRef.current], {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.06,
    });

    gsap.fromTo(
      numberRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.65, delay: 0.12, ease: "power2.out" },
    );

    return () => {
      gsap.killTweensOf([imageRef.current, contentRef.current, numberRef.current]);
    };
  }, [activeService]);

  const selectService = (index) => {
    if (index === activeService) return;

    if (prefersReducedMotion()) {
      setActiveService(index);
      return;
    }

    transitionRef.current?.kill();

    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => setActiveService(index),
    });

    transitionRef.current = timeline;

    // Soft dissolve: no horizontal slide or clip-path wipe.
    timeline
      .to(imageRef.current, {
        opacity: 0,
        filter: "blur(5px)",
        scale: 1.018,
        duration: 0.42,
      })
      .to(
        contentRef.current,
        {
          opacity: 0,
          filter: "blur(4px)",
          scale: 0.99,
          duration: 0.36,
        },
        "<0.02",
      );
  };

  return (
    <section data-reveal id="services" className="sb-services bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="eyebrow">{content.eyebrow}</p>
          <div className="mx-auto mt-5 h-px w-16 bg-[#B68A35]" />
          <h2 className="section-heading mx-auto mt-7 max-w-3xl">{content.heading}</h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">{content.description}</p>
        </div>

        {/* Phones and tablets: swipeable cards, one per service. */}
        <div className="lg:hidden">
          <div
            ref={trackRef}
            onScroll={handleTrackScroll}
            className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
            aria-label="Services"
          >
            {content.items.map((service, index) => (
              <article
                key={service.id}
                className="w-[85%] shrink-0 snap-start overflow-hidden rounded-[2px] bg-white shadow-lg shadow-black/10 sm:w-[60%]"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${content.items.length}: ${service.title}`}
              >
                <div className="relative aspect-[4/5] bg-[#F8F7F4]">
                  {service.image ? (
                    <img src={service.image} alt={service.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-gray-500">Choose an image for this service in Admin → Website Content.</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-medium leading-tight text-[#211d19]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{service.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex justify-center gap-2.5">
            {content.items.map((service, index) => (
              <button
                key={service.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Show ${service.title}`}
                aria-current={slide === index ? "true" : undefined}
                className="sb-service-dot flex h-6 w-6 items-center justify-center"
              >
                <span className={"sb-service-dot-mark block h-1.5 rounded-full transition-all duration-300 " + (slide === index ? "is-active w-5" : "w-1.5")} />
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button type="button" onClick={bookService} className="btn-primary">{content.button}</button>
          </div>
        </div>

        {/* Computers: tabs and a featured card. */}
        <div className="hidden lg:block">
        <div className="-mx-5 mt-7 flex justify-start gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-12 sm:justify-center sm:gap-8 sm:px-0">
          {content.items.map((service, index) => (
            <button
              key={service.id}
              type="button"
              onClick={() => selectService(index)}
              aria-pressed={activeService === index}
              className={"relative shrink-0 px-3 pb-3 text-sm font-medium transition-colors duration-300 sm:text-base " + (activeService === index ? "text-[#B68A35]" : "text-gray-500 hover:text-[#211d19]")}
            >
              {service.title}
              <span
                className={"absolute bottom-0 left-3 h-px bg-[#B68A35] transition-all duration-500 " + (activeService === index ? "right-3" : "right-full")}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>

        <div ref={stageRef} className="mt-8 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14">
          <div ref={imageRef} className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-[#F8F7F4] shadow-xl shadow-black/10 lg:aspect-[5/4]">
            {active.image ? (
              <img src={active.image} alt={active.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-gray-500">Choose an image for this service in Admin → Website Content.</div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 border border-white/30 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm sm:bottom-6 sm:left-6">
              {String(activeService + 1).padStart(2, "0")} / {String(content.items.length).padStart(2, "0")}
            </div>
          </div>

          <div ref={contentRef} className="lg:pl-2">
            <p className="eyebrow mb-5">{content.featuredLabel}</p>
            <div className="mb-7 h-px w-16 bg-[#B68A35]" />
            <div className="flex items-end justify-between gap-5">
              <h3 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-tight tracking-[-0.02em] text-[#211d19] sm:text-5xl">
                {active.title}
              </h3>
              <span ref={numberRef} className="hidden shrink-0 pb-1 font-[family-name:var(--font-display)] text-4xl font-light text-[#D6B56D]/60 lg:block">
                {String(activeService + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:mt-8 sm:text-lg sm:leading-8">{active.description}</p>
            <div className="mt-8">
              <button type="button" onClick={bookService} className="btn-primary">{content.button}</button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
