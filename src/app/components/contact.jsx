"use client";

import { useState } from "react";

// Keep these in sync with the server list in src/app/api/inquiries/route.js.
const EVENT_TYPES = ["Wedding", "Ceremony", "Nikah", "Mehndi", "Engagement", "Bridal Shower", "Other"];
const ROLES = ["Couple", "Family Member", "Wedding Planner"];
const BUDGETS = ["$5,000–$10,000", "$10,000–$20,000", "$20,000+", "Not sure yet, I'd like guidance"];

export default function Contact({ content }) {
  const [status, setStatus] = useState("idle");
  const [pendingForm, setPendingForm] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [receivedOpen, setReceivedOpen] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setPendingForm(event.currentTarget);
    setConfirmOpen(true);
  }

  async function submitInquiry() {
    if (!pendingForm) return;
    setConfirmOpen(false);
    setStatus("loading");
    const form = pendingForm;
    const payload = Object.fromEntries(new FormData(form).entries());
    const eventType = EVENT_TYPES.includes(payload.event) ? payload.event : "Other";

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, eventType }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed.");

      // The inquiry is saved. If the server could not send the email
      // (Web3Forms' free plan only accepts browser submissions), send it from the browser.
      let emailSent = data.emailSent === true;
      const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      if (!emailSent && web3formsKey) {
        try {
          const notification = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: web3formsKey,
              subject: `New Sterling Bloom inquiry — ${eventType}`,
              from_name: "Sterling Bloom Website",
              replyto: payload.email,
              role: payload.role,
              name: payload.name,
              email: payload.email,
              phone: payload.phone,
              eventType,
              eventDate: payload.eventDate || "Not provided",
              venue: payload.venue || "Not provided",
              guestCount: payload.guestCount || "Not provided",
              budget: payload.budget || "Not provided",
              message: payload.message,
              botcheck: "",
            }),
          });
          const result = await notification.json().catch(() => ({}));
          emailSent = notification.ok && result.success === true;
          if (!emailSent) console.error("Web3Forms rejected the browser notification:", result.message);
        } catch (notificationError) {
          console.error("Browser notification failed:", notificationError);
        }
      }

      form.reset();
      setPendingForm(null);
      setStatus(emailSent ? "success" : "email-error");
      setReceivedOpen(true);
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setPendingForm(null);
    }
  }

  return (
    <section data-reveal id="contact" className="relative overflow-hidden bg-[#2A2118] py-20 sm:py-24 lg:py-28">
      {content.backgroundImage && (
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${content.backgroundImage}")` }}
          aria-hidden="true"
        />
      )}
      <div className="contact-background-overlay pointer-events-none absolute inset-0 bg-[#2A2118]/88" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="text-white lg:sticky lg:top-28">
            <p className="inline-flex border border-[#C9A45C] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#D6B56D] sm:text-xs">{content.eyebrow}</p>
            <h2 className="mt-7 max-w-xl font-[family-name:var(--font-display)] text-4xl font-medium leading-[1.05] sm:text-5xl lg:text-6xl">{content.heading}<span className="block text-[#D6B56D]">{content.highlight}</span></h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/65 sm:text-lg sm:leading-8">{content.description}</p>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
              <a href={`tel:${String(content.phone || "").replace(/[^+\d]/g, "")}`} className="transition hover:text-[#D6B56D]"><p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#D6B56D]">Phone</p><p className="mt-1 text-sm text-white/80">{content.phone}</p></a>
              <a href={`mailto:${content.email || ""}`} className="transition hover:text-[#D6B56D]"><p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#D6B56D]">Email</p><p className="mt-1 text-sm text-white/80">{content.email}</p></a>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.location || "")}`} target="_blank" rel="noreferrer" className="transition hover:text-[#D6B56D]"><p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#D6B56D]">Location</p><p className="mt-1 text-sm text-white/80">{content.location}</p></a>
              <div><p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#D6B56D]">Hours</p><p className="mt-1 text-sm leading-6 text-white/80">{content.hours}</p></div>
            </div>
            <p className="mt-8 border-l border-[#B68A35] pl-4 text-xs leading-6 text-white/45">{content.note}</p>
          </div>

          <div className="contact-form-card rounded-[2px] border border-white/10 bg-white p-6 shadow-2xl shadow-black/20 sm:p-9 lg:p-10">
            <div className="mb-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B68A35]">{content.formEyebrow}</p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-medium text-gray-900 sm:text-4xl">{content.formHeading}</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">{content.formDescription}</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {[
                ["name", "Your Name", "text", "Enter your name"],
                ["email", "Email Address", "email", "Enter your email"],
                ["phone", "Phone Number", "tel", "Enter your phone number"],
              ].map(([id, label, type, placeholder]) => (
                <div key={id}>
                  <label htmlFor={id} className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 sm:text-xs">{label}</label>
                  <input id={id} name={id} type={type} placeholder={placeholder} required autoComplete={id === "name" ? "name" : id === "email" ? "email" : "tel"} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#B68A35] focus:ring-2 focus:ring-[#B68A35]/10" />
                </div>
              ))}
              <div>
                <label htmlFor="role" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 sm:text-xs">I am a</label>
                <select id="role" name="role" defaultValue="" required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-600 outline-none transition focus:border-[#B68A35] focus:ring-2 focus:ring-[#B68A35]/10">
                  <option value="" disabled>Select one</option>
                  {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="event" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 sm:text-xs">Event Type</label>
                <select id="event" name="event" defaultValue="" required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-600 outline-none transition focus:border-[#B68A35] focus:ring-2 focus:ring-[#B68A35]/10">
                  <option value="" disabled>Select an event</option>
                  {EVENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="eventDate" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 sm:text-xs">Event Date <span className="normal-case tracking-normal">(optional)</span></label>
                  <input id="eventDate" name="eventDate" type="date" min={new Date().toISOString().slice(0, 10)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#B68A35] focus:ring-2 focus:ring-[#B68A35]/10" />
                </div>
                <div>
                  <label htmlFor="guestCount" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 sm:text-xs">Guest Count <span className="normal-case tracking-normal">(optional)</span></label>
                  <input id="guestCount" name="guestCount" inputMode="numeric" placeholder="Approx. number of guests" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#B68A35] focus:ring-2 focus:ring-[#B68A35]/10" />
                </div>
              </div>
              <div>
                <label htmlFor="venue" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 sm:text-xs">Venue / City <span className="normal-case tracking-normal">(optional)</span></label>
                <input id="venue" name="venue" placeholder="Where will your event take place?" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#B68A35] focus:ring-2 focus:ring-[#B68A35]/10" />
              </div>
              <div>
                <label htmlFor="budget" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 sm:text-xs">Estimated Budget</label>
                <select id="budget" name="budget" defaultValue="" required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-600 outline-none transition focus:border-[#B68A35] focus:ring-2 focus:ring-[#B68A35]/10">
                  <option value="" disabled>Select a budget</option>
                  {BUDGETS.map((budget) => <option key={budget} value={budget}>{budget}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 sm:text-xs">Tell Us About Your Event</label>
                <textarea id="message" name="message" rows="4" placeholder="Tell us about your event, date, venue, and vision..." required className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#B68A35] focus:ring-2 focus:ring-[#B68A35]/10" />
              </div>

              {status === "error" && (
                <div role="alert" style={{ borderLeft: "3px solid #9A3B32", background: "#FBF0EE", padding: "16px 18px" }}>
                  <p style={{ fontSize: "16px", fontWeight: 600, color: "#7A2A23", margin: 0 }}>Your inquiry didn’t go through.</p>
                  <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#5C5248", margin: "4px 0 0" }}>Please check your connection and try again, or contact us by phone or email.</p>
                </div>
              )}

              <button type="submit" disabled={status === "loading"} className="btn-primary w-full rounded-[2px] py-4 text-xs uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-60">
                {status === "loading" ? "Sending..." : content.formButton}
              </button>
            </form>
            <p className="mt-4 text-center text-[11px] leading-5 text-gray-400">{content.formFootnote}</p>

            {confirmOpen && (
              <div className="sb-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setConfirmOpen(false); setPendingForm(null); } }}>
                <section className="sb-confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="sb-confirm-title" aria-describedby="sb-confirm-description">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B68A35]">Confirm inquiry</p>
                  <h4 id="sb-confirm-title" className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[#211D19]">Ready to send your inquiry?</h4>
                  <p id="sb-confirm-description" className="mt-3 text-sm leading-6 text-[#71695e]">We’ll securely submit the details you provided to the Sterling Bloom team.</p>
                  <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button type="button" className="sb-modal-secondary" onClick={() => { setConfirmOpen(false); setPendingForm(null); }}>Review details</button>
                    <button type="button" className="sb-modal-primary" onClick={submitInquiry}>Send inquiry</button>
                  </div>
                </section>
              </div>
            )}

            {receivedOpen && (
              <div className="sb-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setReceivedOpen(false); }}>
                <section className="sb-confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="sb-received-title" aria-describedby="sb-received-description">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B68A35]">Inquiry received</p>
                  <h4 id="sb-received-title" className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[#211D19]">Thank you, we’ve received your inquiry.</h4>
                  <p id="sb-received-description" className="mt-3 text-sm leading-6 text-[#71695e]">
                    {status === "email-error"
                      ? "We’ll review your details and get back to you soon. If your request is urgent, please also call or email us directly."
                      : "We’ll review your details and get back to you within 1–2 business days."}
                  </p>
                  <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button type="button" className="sb-modal-primary" autoFocus onClick={() => setReceivedOpen(false)}>Done</button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
