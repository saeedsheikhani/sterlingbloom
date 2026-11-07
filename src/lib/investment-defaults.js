// Default text for the Investment section (editable in the admin panel).
export const INVESTMENT_DEFAULTS = {
  eyebrow: "Investment",
  heading: "Custom Decor, Tailored to Your Celebration",
  description: "Every design is created from scratch around your vision, so pricing is tailored to your guest count, venue, number of events, and design scope.",
  button: "Book Now",
  plannerLabel: "For Planners",
  plannerHeading: "Planning a Wedding for a Client?",
  plannerDescription: "We'd love to partner with you. Custom decor, florals, and installation for planners across the GTA, with clear communication and reliable on-the-day setup.",
  plannerButton: "Partner With Us",
  plannerEmail: "sumaiya@sterlingbloomdecor.com",
  plannerSubject: "Planner Collaboration",
};

// Saved content may be missing fields (or the whole section); fill them from the defaults.
export function withInvestmentDefaults(content) {
  const merged = { ...INVESTMENT_DEFAULTS };
  for (const [key, value] of Object.entries(content || {})) {
    if (typeof value === "string") merged[key] = value;
  }
  return merged;
}
