"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { isCalendlyUrl, openCalendly } from "../../lib/calendly-popup";

// Phone/tablet menu: a fixed list of page sections (the desktop menu uses the admin links).
const MOBILE_LINKS = [
  ["About", "#about"],
  ["Services", "#services"],
  ["Portfolio", "#portfolio"],
  ["Packages", "#packages"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"],
];
const WHATSAPP_URL = "https://wa.me/16475445681?text=" + encodeURIComponent("Hello Sterling Bloom, I'd like to discuss an event.");
const INSTAGRAM_URL = "https://www.instagram.com/sterlingbloomdecor";

export default function Navbar({ content, preview = false }) {
  const pathname = usePathname();
  const navLinks = content.links.map(([name, href]) => ({ name, href }));
  const consultationHref = content.ctaHref && content.ctaHref !== "#contact" ? content.ctaHref : "https://calendly.com/sumaiya-sterlingbloomdecor/30min";
  const logoSettings = content.logoSettings || {};
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [tappedLink, setTappedLink] = useState(null);

  // Lock the page behind the full-screen menu while it is open.
  useEffect(() => {
    if (!isOpen) {
      setTappedLink(null);
      return undefined;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [isOpen]);

  // Close the menu, then scroll smoothly to the section (or go to it on the home page).
  function goToSection(event, hash) {
    event.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(hash);
    if (!target) {
      window.location.href = "/" + hash;
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      window.history.replaceState(null, "", hash);
    });
  }

  useEffect(() => {
    if (pathname?.startsWith("/admin") && !preview) return undefined;
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (pathname?.startsWith("/admin") && !preview) return null;

  // The site is dark-only: see-through over the hero, solid dark once scrolled or with the menu open.
  // With the menu open, the bar is transparent so it blends into the full-screen menu, and sits above floating buttons.
  const effectiveNavClass = isOpen
    ? "z-[140] bg-transparent text-[#F4EFE7]"
    : isScrolled
      ? "z-50 bg-[#201E1B]/95 text-[#F4EFE7] shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      : "z-50 bg-transparent text-white";

  return (
    <nav aria-label="Primary navigation" className={"fixed left-0 top-0 w-full transition-[background-color,box-shadow,color] duration-500 " + effectiveNavClass}>
      <div className={"sb-navbar-inner relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10 " + (isScrolled ? "is-scrolled" : "")}>
        {(logoSettings?.visible ?? true) && (
          <Link href="/" aria-label="Sterling Bloom home" className="sb-logo-white shrink-0">
            <Image
              src="/images/sterling_bloom_logo_white_horizontal.png"
              alt="Sterling Bloom"
              width={1545}
              height={415}
              priority
              sizes="(max-width: 639px) 220px, 260px"
              className="h-auto w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
            />
          </Link>
        )}

        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm transition-colors hover:text-[#D6B56D]">{link.name}</Link>
          ))}
          {isCalendlyUrl(consultationHref) ? (
            <button type="button" onClick={(e) => openCalendly(e, consultationHref)} className="btn-primary ml-2 px-5 py-2.5">
              {content.cta}
            </button>
          ) : (
            <a href={consultationHref} className="btn-primary ml-2 px-5 py-2.5">{content.cta}</a>
          )}
        </div>

        <button
          className="group relative flex h-11 w-11 items-center justify-center rounded-[2px] border border-current/30 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          data-mobile-menu-toggle
        >
          <span className="relative block h-5 w-5" aria-hidden="true">
            <span className={"absolute left-0 top-1 h-px w-5 origin-center bg-current transition-transform duration-300 ease-out " + (isOpen ? "translate-y-1.5 rotate-45" : "")} />
            <span className={"absolute left-0 top-2.5 h-px w-5 bg-current transition-all duration-200 ease-out " + (isOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100")} />
            <span className={"absolute left-0 top-4 h-px w-5 origin-center bg-current transition-transform duration-300 ease-out " + (isOpen ? "-translate-y-1.5 -rotate-45" : "")} />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        aria-hidden={!isOpen}
        inert={!isOpen ? true : undefined}
        className={"sb-mobile-menu fixed inset-0 z-0 flex flex-col overflow-y-auto bg-[#171614] px-6 pb-6 pt-28 text-[#F4EFE7] transition-[opacity,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden " + (isOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0")}
      >
        <ul className="flex flex-col gap-1" onTouchStart={() => {}}>
          {MOBILE_LINKS.map(([name, href]) => (
            <li key={href}>
              <a
                href={href}
                onPointerDown={() => setTappedLink(href)}
                onClick={(event) => goToSection(event, href)}
                className={"group relative inline-block py-1.5 font-[family-name:var(--font-display)] text-[1.9rem] font-normal leading-tight tracking-[0.01em] transition-colors duration-200 hover:text-[#D6B56D] active:text-[#D6B56D] " + (tappedLink === href ? "text-[#D6B56D]" : "")}
              >
                {name}
                <span aria-hidden="true" className={"absolute bottom-1 left-0 h-px w-full origin-left bg-[#D6B56D] transition-transform duration-300 group-hover:scale-x-100 group-active:scale-x-100 " + (tappedLink === href ? "scale-x-100" : "scale-x-0")} />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          {isCalendlyUrl(consultationHref) ? (
            <button type="button" onClick={() => { setIsOpen(false); openCalendly(undefined, consultationHref); }} className="btn-primary w-full py-4 text-xs uppercase tracking-[0.18em]">
              Book Now
            </button>
          ) : (
            <a href={consultationHref} onClick={() => setIsOpen(false)} className="btn-primary w-full py-4 text-xs uppercase tracking-[0.18em]">
              Book Now
            </a>
          )}
          <div className="mt-5 flex items-center justify-center gap-4">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Chat with Sterling Bloom on WhatsApp" className="sb-menu-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.7 11.7 0 0 0 2.1 17.6L.5 23.5l6-1.6A11.7 11.7 0 0 0 20.5 3.5ZM12 21a9.6 9.6 0 0 1-4.9-1.3l-.4-.2-3.5.9.9-3.4-.2-.4A9.5 9.5 0 1 1 12 21Zm5.2-7.1c-.3-.2-1.7-.8-2-.9s-.5-.2-.7.2-.8.9-.9 1.1-.3.2-.6.1a7.8 7.8 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5s0-.4 0-.5-.7-1.7-1-2.3c-.2-.5-.5-.4-.7-.4H7.7c-.2 0-.5.1-.8.4s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2a11.3 11.3 0 0 0 4.4 3.9c.6.3 1.1.4 1.5.6.6.2 1.2.2 1.7.1.5-.1 1.7-.7 1.9-1.4s.2-1.3.2-1.4-.2-.2-.5-.4Z"/></svg>
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Sterling Bloom on Instagram (@sterlingbloomdecor)" className="sb-menu-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/></svg>
            </a>
          </div>
          <p className="mt-3 text-center text-[11px] tracking-[0.14em] text-white/50">@sterlingbloomdecor</p>
        </div>
      </div>
    </nav>
  );
}
