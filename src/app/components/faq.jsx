"use client";

import { useState } from "react";

const fallbackItems = [
  { question: "What events does Sterling Bloom design?", answer: "We design weddings, Nikah and Mehndi celebrations, corporate events, and private occasions. Each concept is tailored to your event and venue." },
  { question: "How do we get started?", answer: "Send us an inquiry with your event type, date, venue, guest count, and ideas. We will follow up to discuss availability and the next steps." },
  { question: "Do you offer custom packages?", answer: "Yes. Styling, florals, decor, and planning support can be tailored to the scale, priorities, and creative direction of your celebration." },
  { question: "How is pricing determined?", answer: "Pricing depends on the event date, venue, guest count, design scope, and selected details. Contact us for a proposal based on your needs." },
  { question: "How far in advance should we book?", answer: "As early as possible is best, especially for popular dates. Share your date with us and we can discuss availability." },
];

export default function FAQ({ content = {} }) {
  const [openIndex, setOpenIndex] = useState(0);
  const items = Array.isArray(content.items) ? content.items : fallbackItems;
  return (
    <section id="faq" data-reveal className="sb-faq-section">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 md:py-[var(--sb-section-spacing,56px)]">
        <p className="eyebrow">{content.eyebrow || "GOOD TO KNOW"}</p>
        <h2 className="section-heading mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">{content.heading || "Frequently Asked Questions"}</h2>
        <p className="section-copy mt-4 max-w-2xl text-base leading-7">{content.description || "A few helpful details before we start planning your celebration."}</p>
        <div className="mt-9 border-t border-black/10">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = "sb-faq-panel-" + index;
            return <div className="sb-faq-item" key={index}>
              <h3><button type="button" className="sb-faq-question" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenIndex(isOpen ? -1 : index)}><span>{item.question}</span><span className="sb-faq-mark" aria-hidden="true">{isOpen ? "−" : "+"}</span></button></h3>
              <div id={panelId} className={"sb-faq-answer-wrap" + (isOpen ? " is-open" : "")} aria-hidden={!isOpen} inert={!isOpen}><div className="sb-faq-answer"><p>{item.answer}</p></div></div>
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}
