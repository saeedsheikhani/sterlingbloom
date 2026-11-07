export const CALENDLY_URL = "https://calendly.com/sumaiya-sterlingbloomdecor/30min";
const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

let calendlyPromise = null;

function openCalendlyIframe(url) {
  const existing = document.getElementById("sterling-bloom-calendly-fallback");
  if (existing) return;

  const overlay = document.createElement("div");
  overlay.id = "sterling-bloom-calendly-fallback";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Book a 30-Minute Consultation");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2147483647",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    background: "rgba(20, 16, 12, 0.78)",
    backdropFilter: "blur(6px)",
  });

  const panel = document.createElement("div");
  Object.assign(panel.style, {
    position: "relative",
    width: "min(100%, 1080px)",
    height: "min(92vh, 820px)",
    background: "#fff",
    overflow: "hidden",
    boxShadow: "0 30px 80px rgba(0,0,0,.35)",
  });

  const close = document.createElement("button");
  close.type = "button";
  close.setAttribute("aria-label", "Close consultation booking");
  close.textContent = "×";
  Object.assign(close.style, {
    position: "absolute",
    top: "10px",
    right: "14px",
    zIndex: "2",
    width: "40px",
    height: "40px",
    border: "0",
    background: "rgba(255,255,255,.94)",
    color: "#1d1813",
    fontSize: "28px",
    lineHeight: "40px",
    cursor: "pointer",
    boxShadow: "0 4px 18px rgba(0,0,0,.12)",
  });

  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.title = "Sterling Bloom consultation booking";
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allow", "payment");
  Object.assign(iframe.style, {
    width: "100%",
    height: "100%",
    minWidth: "320px",
    border: "0",
  });

  const closeModal = () => {
    document.body.style.overflow = "";
    overlay.remove();
  };

  close.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", function handleKeydown(e) {
    if (e.key !== "Escape") return;
    closeModal();
    document.removeEventListener("keydown", handleKeydown);
  });

  panel.append(close, iframe);
  overlay.append(panel);
  document.body.append(overlay);
  document.body.style.overflow = "hidden";
}

function waitForCalendly(timeout = 8000) {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.Calendly?.initPopupWidget) return Promise.resolve(window.Calendly);
  if (calendlyPromise) return calendlyPromise;

  calendlyPromise = new Promise((resolve) => {
    const startedAt = Date.now();
    let settled = false;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      window.clearInterval(interval);
      window.clearTimeout(timer);
      resolve(value);
    };

    const check = () => {
      if (window.Calendly?.initPopupWidget) {
        finish(window.Calendly);
      } else if (Date.now() - startedAt >= timeout) {
        finish(null);
      }
    };

    const interval = window.setInterval(check, 50);
    const timer = window.setTimeout(() => finish(window.Calendly || null), timeout + 100);

    const existing = document.querySelector('script[src="' + CALENDLY_SCRIPT + '"]');

    if (!existing) {
      const script = document.createElement("script");
      script.src = CALENDLY_SCRIPT;
      script.async = true;
      script.onload = check;
      script.onerror = () => finish(null);
      document.head.appendChild(script);
    }

    check();
  });

  return calendlyPromise;
}

// Pass the admin-saved booking link as `url`; falls back to the default link.
export async function openCalendly(event, url) {
  const bookingUrl = isCalendlyUrl(url) ? url : CALENDLY_URL;
  event?.preventDefault?.();
  event?.stopPropagation?.();

  if (typeof window === "undefined") return false;

  const Calendly = await waitForCalendly();

  if (Calendly?.initPopupWidget) {
    Calendly.initPopupWidget({ url: bookingUrl });
  } else {
    openCalendlyIframe(bookingUrl);
  }

  return false;
}

export function isCalendlyUrl(value = "") {
  return String(value).toLowerCase().includes("calendly.com");
}
