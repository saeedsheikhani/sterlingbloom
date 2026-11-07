"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { openCalendly } from "../../lib/calendly-popup";
import { BOOKING_URL, INSTAGRAM_URL, SECTION_LINKS, WHATSAPP_URL } from "../../lib/site-links";

function Icon({ type }) {
  const paths = {
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" /></>,
    whatsapp: <path fill="currentColor" stroke="none" d="M20.5 3.5A11.7 11.7 0 0 0 2.1 17.6L.5 23.5l6-1.6A11.7 11.7 0 0 0 20.5 3.5ZM12 21a9.6 9.6 0 0 1-4.9-1.3l-.4-.2-3.5.9.9-3.4-.2-.4A9.5 9.5 0 1 1 12 21Zm5.2-7.1c-.3-.2-1.7-.8-2-.9s-.5-.2-.7.2-.8.9-.9 1.1-.3.2-.6.1a7.8 7.8 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5s0-.4 0-.5-.7-1.7-1-2.3c-.2-.5-.5-.4-.7-.4H7.7c-.2 0-.5.1-.8.4s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2a11.3 11.3 0 0 0 4.4 3.9c.6.3 1.1.4 1.5.6.6.2 1.2.2 1.7.1.5-.1 1.7-.7 1.9-1.4s.2-1.3.2-1.4-.2-.2-.5-.4Z" />,
    facebook: <path d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v4h4v-4h3.2l.8-4H13V9.3c0-.8.3-1.3 1-1.3Z" fill="currentColor" stroke="none" />,
    phone: <path d="M7.2 3.8 5.1 5.9c-.8.8-.9 2-.3 3 2.6 4.3 6.2 7.9 10.5 10.5 1 .6 2.2.5 3-.3l2.1-2.1-3.2-3.2-2.2 1.4a17 17 0 0 1-5.7-5.7l1.4-2.2-3.5-3.5Z" />,
    email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    pin: <><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7">{paths[type]}</svg>;
}

const hasText = (value) => typeof value === "string" && value.trim() !== "";

export default function Footer({ content, contact, preview = false }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") && !preview) return null;

  const phoneHref = `tel:${String(contact.phone || "").replace(/[^+\d]/g, "")}`;
  const emailHref = `mailto:${contact.email || ""}`;
  const instagramHref = content.instagramHref || INSTAGRAM_URL;
  const instagramLabel = content.instagram || "@sterlingbloomdecor";

  return (
    <footer className="sb-footer bg-[#1D1813] text-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* Top band: closing line and the main booking action. */}
        <div className="flex flex-col items-start gap-8 border-b border-white/10 py-14 lg:flex-row lg:items-end lg:justify-between lg:py-16">
          <div className="max-w-2xl">
            {hasText(content.eyebrow) && (
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#D6B56D]">{content.eyebrow}</p>
            )}
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-[2.4rem] font-medium leading-[1.05] sm:text-5xl lg:text-6xl">
              {content.heading}
              <br />
              <span className="text-[#D6B56D]">{content.highlight}</span>
            </h2>
          </div>
          <button type="button" onClick={(event) => openCalendly(event, BOOKING_URL)} className="btn-primary w-full px-10 py-4 text-xs uppercase tracking-[0.18em] sm:w-auto">
            Book Now
          </button>
        </div>

        {/* Columns: one column on phones, brand on top with two columns below on tablets, three columns on computers. */}
        <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr] lg:gap-16">
          <div className="md:col-span-2 lg:col-span-1">
            <Image
              src="/images/sterling_bloom_logo_white.png"
              alt="Sterling Bloom Design & Decor"
              width={640}
              height={635}
              className="h-auto w-36"
            />
            {hasText(content.description) && (
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">{content.description}</p>
            )}
            <div className="mt-6 flex items-center gap-3">
              <a href={instagramHref} target="_blank" rel="noopener noreferrer" aria-label={`Instagram (${instagramLabel})`} className="sb-footer-icon"><Icon type="instagram" /></a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Chat with Sterling Bloom on WhatsApp" className="sb-footer-icon"><Icon type="whatsapp" /></a>
              {hasText(content.facebookHref) && (
                <a href={content.facebookHref} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="sb-footer-icon"><Icon type="facebook" /></a>
              )}
              <span className="ml-1 text-xs tracking-[0.08em] text-white/50">{instagramLabel}</span>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#D6B56D]">{content.exploreLabel || "Explore"}</h3>
            <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3.5 md:grid-cols-1">
              {SECTION_LINKS.map(([label, href]) => (
                <li key={href}><a href={href} className="text-sm text-white/65 transition hover:text-[#D6B56D]">{label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#D6B56D]">{content.contactLabel || "Contact"}</h3>
            <div className="mt-6 space-y-4 text-sm text-white/65">
              {hasText(contact.location) && (
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.location)}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 transition hover:text-[#D6B56D]"><Icon type="pin" /><span>{contact.location}</span></a>
              )}
              {hasText(contact.phone) && (
                <a href={phoneHref} className="flex items-center gap-3 transition hover:text-[#D6B56D]"><Icon type="phone" /><span>{contact.phone}</span></a>
              )}
              {hasText(contact.email) && (
                <a href={emailHref} className="flex items-center gap-3 break-all transition hover:text-[#D6B56D]"><Icon type="email" /><span>{contact.email}</span></a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar: stacked and centred on phones, split on larger screens. */}
        <div className="flex flex-col items-center gap-2 border-t border-white/10 pt-6 pb-24 text-center text-[11px] tracking-[0.06em] text-white/40 sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Sterling Bloom Design &amp; Decor. All rights reserved.</p>
          {hasText(content.closing) && <p>{content.closing}</p>}
        </div>
      </div>
    </footer>
  );
}
