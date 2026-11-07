"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { isCalendlyUrl, openCalendly } from "../../lib/calendly-popup";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Vertical video shown on phones if the admin "Mobile Hero Video" field is empty.
// The admin "Hero Video" field is used on larger screens.
const MOBILE_VIDEO_URL = "https://res.cloudinary.com/xuv4gqwa/video/upload/v1794070444/sterling-bloom/bi5eczuoemda9ihrvuuh.mp4";
const DEFAULT_BOOKING_URL = "https://calendly.com/sumaiya-sterlingbloomdecor/30min";

export default function Hero({ content }) {
  const heroRef = useRef(null);
  const primaryHref = content.primaryButtonHref && content.primaryButtonHref !== "#contact" ? content.primaryButtonHref : DEFAULT_BOOKING_URL;
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const buttonsRef = useRef(null);
  const videoRef = useRef(null);
  const scrollRef = useRef(null);
  const eyebrowRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const videoSrc = isMobile ? (content.mobileVideo || MOBILE_VIDEO_URL) : content.video;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    // Keep hero copy visible immediately on mobile/slow connections; animate only the background video.
    if (videoRef.current) gsap.fromTo(videoRef.current, { scale: 1.06 }, { scale: 1, duration: 2, ease: "power2.out" });
  }, { scope: heroRef, dependencies: [videoSrc] });

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-[100svh] overflow-hidden bg-[#1d1813] bg-cover bg-center lg:min-h-screen"
      style={{ backgroundImage: `url("${content.backgroundImage || "/images/hero.jpg"}")` }}
    >
      {isMobile !== null && videoSrc && (
      <video
        key={videoSrc}
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={content.backgroundImage}
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      )}

      <div className="absolute inset-0 z-10 bg-black/45" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/55 via-black/25 to-black/10" />

      <div className="relative z-10 flex min-h-[100svh] items-start px-5 pb-20 pt-[6.75rem] sm:items-center sm:px-8 sm:pt-20 lg:min-h-screen lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-4xl">
            <p ref={eyebrowRef} className="eyebrow border-white/40 text-white">
              {content.eyebrow}
            </p>

            <h1
              ref={titleRef}
              style={{ opacity: 1 }}
              className="mt-5 max-w-4xl font-[family-name:var(--font-display)] text-[2.5rem] font-medium leading-[1] tracking-[-0.025em] text-white sm:text-6xl sm:leading-[0.94] lg:text-8xl"
            >
              {content.before}{" "}
              <span className="special-text">{content.highlight}</span>
              {content.after}
            </h1>

            <p
              ref={textRef}
              style={{ opacity: 1 }}
              className="mt-5 max-w-2xl text-[0.95rem] leading-7 text-white/85 sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl"
            >
              {content.description}
            </p>

            <div ref={buttonsRef} style={{ opacity: 1 }} className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              {isCalendlyUrl(primaryHref) ? (
                <button type="button" onClick={(e) => openCalendly(e, primaryHref)} className="btn-primary">
                  {content.primaryButton}
                </button>
              ) : (
                <Link href={primaryHref} className="btn-primary">
                  {content.primaryButton}
                </Link>
              )}
              <Link href={content.secondaryButtonHref || "#portfolio"} className="btn-ghost border border-[#D6B56D] bg-transparent text-white hover:bg-[#B68A35] hover:text-white">
                {content.secondaryButton}
              </Link>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className={
            "absolute bottom-7 left-1/2 hidden -translate-x-1/2 transition-opacity sm:block " +
            (isScrolled ? "opacity-0" : "opacity-100")
          }
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">
            Scroll to explore ↓
          </span>
        </div>
      </div>
    </section>
  );
}
