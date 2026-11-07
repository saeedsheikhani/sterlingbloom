// Homepage section order, editable in the admin panel (Page Sections).
// The hero always stays first; these sections follow it in the saved order.
export const SECTION_LABELS = {
  about: "About",
  services: "Services",
  gallery: "Portfolio",
  process: "Our Process",
  investment: "Investment",
  testimonials: "Testimonials",
  faq: "FAQ",
  contact: "Contact Form",
};

export const DEFAULT_SECTION_ORDER = Object.keys(SECTION_LABELS);

// Saved order may be missing, out of date, or contain unknown keys: keep the known
// sections in the saved order and add any missing ones at the end in default order.
export function getSectionOrder(content) {
  const saved = Array.isArray(content?.sectionOrder) ? content.sectionOrder : [];
  const order = saved.filter((key, index) => SECTION_LABELS[key] && saved.indexOf(key) === index);
  for (const key of DEFAULT_SECTION_ORDER) if (!order.includes(key)) order.push(key);
  return order;
}
