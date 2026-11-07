// Portfolio filter tabs, editable in the admin panel.
// Each tab has a stable `id` (never changes) and a `label` (can be renamed).
// Portfolio items store the tab id in their `category` field.

export const DEFAULT_PORTFOLIO_TABS = [
  { id: "weddings", label: "Weddings" },
  { id: "ceremonies", label: "Ceremonies" },
  { id: "nikah-mehndi", label: "Nikah & Mehndi" },
];

// Older items used free-text categories; map them onto the starting tabs.
const LEGACY_CATEGORIES = { nikah: "nikah-mehndi", mehndi: "nikah-mehndi" };

const normalize = (value) => String(value ?? "").trim().toLowerCase();

export function getPortfolioTabs(gallery) {
  if (!Array.isArray(gallery?.tabs)) return DEFAULT_PORTFOLIO_TABS;
  return gallery.tabs.filter((tab) => tab && typeof tab.id === "string" && tab.id);
}

// Returns the id of the tab an item belongs to, or null if it isn't assigned to an existing tab.
export function resolveItemTab(category, tabs) {
  if (tabs.some((tab) => tab.id === category)) return category;
  const value = normalize(category);
  if (!value) return null;
  const byId = tabs.find((tab) => normalize(tab.id) === value);
  if (byId) return byId.id;
  const legacy = LEGACY_CATEGORIES[value];
  if (legacy && tabs.some((tab) => tab.id === legacy)) return legacy;
  return null;
}

export function newPortfolioTabId() {
  return "tab-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
