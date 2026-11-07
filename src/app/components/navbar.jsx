"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import BrandLogo from "./brand-logo";
import { isCalendlyUrl, openCalendly } from "../../lib/calendly-popup";

export default function Navbar({ content, preview = false }) {
  const pathname = usePathname();
  const navLinks = content.links.map(([name, href]) => ({ name, href }));
  const consultationHref = content.ctaHref && content.ctaHref !== "#contact" ? content.ctaHref : "https://calendly.com/sumaiya-sterlingbloomdecor/30min";
  const logoSettings = content.logoSettings || {};
  const mobileLogoSize = Math.max(32, Math.min(140, Number(logoSettings.mobileSize) || 76));
  const desktopLogoSize = Math.max(40, Math.min(180, Number(logoSettings.desktopSize) || 88));
  const logoRadius = Math.max(0, Math.min(50, Number(logoSettings.borderRadius) || 0));
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Follow the site's light/dark mode, which the theme toggle stores on <html data-theme>.
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.dataset.theme !== "light");
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (
        event.target.closest("#mobile-navigation") ||
        event.target.closest("[data-mobile-menu-toggle]")
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  if (pathname?.startsWith("/admin") && !preview) return null;

  const navClass = isScrolled
    ? "bg-[#F8F7F4]/96 text-[#6f5226] shadow-[0_8px_30px_rgba(29,24,19,0.08)] backdrop-blur-xl"
    : "bg-transparent text-white";

  // White logo whenever the navbar is dark: see-through over the hero, or solid in dark mode.
  // The original logo shows only when the navbar is solid cream (light mode).
  const showWhiteLogo = isDark || (!isScrolled && !isOpen);

  const effectiveNavClass = isOpen
    ? "bg-[#F8F7F4]/96 text-[#6f5226] shadow-[0_8px_30px_rgba(29,24,19,0.08)] backdrop-blur-xl"
    : navClass;

  return (
    <nav aria-label="Primary navigation" className={"fixed left-0 top-0 z-50 w-full transition-all duration-500 " + effectiveNavClass}>
      <div className={"sb-navbar-inner mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10 " + (isScrolled ? "is-scrolled" : "")}
        style={{ "--sb-logo-mobile": mobileLogoSize + "px", "--sb-logo-desktop": desktopLogoSize + "px", "--sb-logo-radius": logoRadius + "%", minHeight: "max(84px, " + (mobileLogoSize + 12) + "px)" }}>
        {(logoSettings?.visible ?? true) && showWhiteLogo && (
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
        {(logoSettings?.visible ?? true) && !showWhiteLogo && (
          <Link
            href="/"
            aria-label="Sterling Bloom home"
            className="sb-logo-frame shrink-0 transition-all duration-300"
            style={{
              padding: isScrolled && (logoSettings?.backgroundEnabled ?? true) ? 4 : 0,
              borderRadius: logoRadius + "%",
              clipPath: "inset(0 round " + logoRadius + "%)",
              overflow: "hidden",
                          backgroundColor: isScrolled && (logoSettings?.backgroundEnabled ?? true) ? (logoSettings?.background || "#F8F7F4") : "transparent",
              border: isScrolled && (logoSettings?.borderEnabled ?? true) ? (String(logoSettings?.borderWidth ?? 1) + "px solid " + (logoSettings?.borderColor || "#B68A35")) : "none",
              boxShadow: isScrolled && (logoSettings?.shadowEnabled ?? true) ? "0 3px 14px rgba(29,24,19,0.14)" : "none",
            }}
          >
            <BrandLogo
              priority
              className="sb-brand-logo"
              style={{
                borderRadius: logoRadius + "%",
                overflow: "hidden",
              }}
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
          aria-controls="mobile-navigation"
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
        id="mobile-navigation"
        aria-hidden={!isOpen}
        className={"max-h-[85vh] overflow-y-auto border-t border-black/5 bg-[#F8F7F4] px-5 text-[#6f5226] shadow-lg transition-all duration-300 ease-out lg:hidden " + (isOpen ? "pb-6 pt-4 opacity-100" : "max-h-0 overflow-hidden pb-0 pt-0 opacity-0")}
      >
        <div className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-sm">
              {link.name}
            </Link>
          ))}
          {isCalendlyUrl(consultationHref) ? (
            <button type="button" onClick={() => { setIsOpen(false); openCalendly(undefined, consultationHref); }} className="btn-primary mt-1 w-full">
              {content.cta}
            </button>
          ) : (
            <a href={consultationHref} onClick={() => setIsOpen(false)} className="btn-primary mt-1 w-full">
              {content.cta}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
