"use client";

import { useEffect, useRef, useState } from "react";

function Field({ label, value, onChange, multiline = false, hint, type = "text", min, max, step }) {
  const common = {
    value: value ?? "",
    type,
    min,
    max,
    step,
    onChange: (event) => onChange(event.target.value),
    className: "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#211d19] outline-none transition focus:border-[#B68A35] focus:ring-2 focus:ring-[#B68A35]/10",
  };

  return (
    <label className="block">
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">{label}</span>
      {multiline ? <textarea {...common} rows={4} /> : <input {...common} /> }
      {hint && <span className="mt-1 block text-[11px] leading-5 text-gray-400">{hint}</span>}
    </label>
  );
}



function ColorField({ label, value, onChange }) {
  const safeValue = /^#[0-9a-f]{6}$/i.test(value || "") ? value : "#ffffff";
  return (
    <label className="block">
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">{label}</span>
      <div className="mt-2 flex items-center gap-3">
        <input aria-label={label + " color picker"} type="color" value={safeValue} onChange={(event) => onChange(event.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1" />
        <input value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm uppercase text-[#211d19] outline-none focus:border-[#B68A35]" placeholder="#FFFFFF" />
      </div>
    </label>
  );
}

function ToggleField({ label, checked, onChange, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#B68A35]" />
      <span>
        <span className="block text-xs font-medium text-[#211d19]">{label}</span>
        {hint && <span className="mt-1 block text-[11px] leading-5 text-gray-500">{hint}</span>}
      </span>
    </label>
  );
}

function MediaPicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  async function openPicker() {
    setOpen(true);
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (response.status === 401 ? "Your admin session has expired. Sign in again." : "Unable to load the Media Library."));
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      setLoadError(error.message || "Unable to load the Media Library.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">{label}</span>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#211d19] outline-none focus:border-[#B68A35]" placeholder="Paste image URL or choose from Media Library" />
        <button type="button" onClick={openPicker} className="sb-admin-choose-button shrink-0 rounded-xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]">Choose Image</button>
      </div>
      {value ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
          <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[#F1EEE8]">
            <img src={value} alt={label + " preview"} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#211d19]">Current image</p>
            <p className="mt-1 break-all text-[11px] leading-5 text-gray-500">{value}</p>
            <button type="button" onClick={() => onChange("")} className="mt-1 text-xs font-semibold text-red-700 underline underline-offset-2">Clear image</button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[11px] leading-5 text-gray-500">No image selected. Add a URL or choose an image from the Media Library.</p>
      )}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center">
          <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-[22px] bg-[#F8F7F4] shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#B68A35]">MEDIA LIBRARY</p>
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-medium">Choose an asset</h3>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="sb-admin-secondary-button rounded-lg border px-3 py-2 text-xs font-medium">Close</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5">
              {loading ? <p className="text-sm text-gray-600">Loading library…</p> : loadError ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{loadError}</p> : items.length ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((item, index) => {
                    const assetUrl = item.secureUrl || item.url || "";
                    return (
                      <button type="button" key={item.publicId || assetUrl || index} disabled={!assetUrl} onClick={() => { onChange(assetUrl); setOpen(false); }} className="overflow-hidden rounded-xl border border-gray-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-[#B68A35] disabled:cursor-not-allowed disabled:opacity-60">
                        <div className="relative aspect-[4/3] bg-gray-100">
                          {item.resourceType === "video" ? <video src={assetUrl} muted playsInline className="h-full w-full object-cover" /> : assetUrl ? <img src={assetUrl} alt={item.alt || item.title || "Media library image"} className="h-full w-full object-cover" loading="lazy" /> : <span className="flex h-full items-center justify-center p-3 text-xs text-gray-500">Image URL missing</span>}
                        </div>
                        <p className="truncate px-3 py-2 text-xs text-gray-600">{item.title || item.publicId || "Untitled asset"}</p>
                      </button>
                    );
                  })}
                </div>
              ) : <p className="text-sm text-gray-400">No media yet. Upload something in Media Library first.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionCard({ eyebrow, title, children, onReset }) {
  return (
    <section className="rounded-[22px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B68A35]">{eyebrow}</p>
      <div className="flex flex-wrap items-start justify-between gap-3"><h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-medium">{title}</h2>{onReset && <button type="button" onClick={onReset} className="sb-admin-secondary-button mt-2 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition">Reset to default</button>}</div>
      <div className="mt-7 space-y-5">{children}</div>
    </section>
  );
}

export default function ContentEditor({ initialContent }) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const previewRef = useRef(null);

  useEffect(() => {
    const frame = previewRef.current;
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage({ type: "STERLING_BLOOM_DRAFT", content }, window.location.origin);
  }, [content]);

  function update(section, key, value) {
    setContent((current) => ({
      ...current,
      [section]: { ...current[section], [key]: value },
    }));
  }

  function updateNested(section, parent, key, value) {
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [parent]: { ...(current[section]?.[parent] || {}), [key]: value },
      },
    }));
  }

  function updateDesign(group, key, value) {
    setContent((current) => ({
      ...current,
      design: {
        ...(current.design || {}),
        [group]: { ...(current.design?.[group] || {}), [key]: value },
      },
    }));
  }

  function updateArray(section, key, index, field, value) {
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: current[section][key].map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      },
    }));
  }

  function updateNestedArray(section, key, index, field, value) {
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: current[section][key].map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      },
    }));
  }

  async function resetSection(section) {
    const label = section === "design" ? "theme and layout settings" : section === "nav" ? "navigation and logo settings" : section;
    if (!window.confirm("Reset " + label + " to the original defaults? This will replace your unsaved edits for this section.")) return;
    setMessage("");
    try {
      const response = await fetch("/api/admin/content?defaults=1", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load defaults.");
      setContent((current) => ({ ...current, [section]: data.content[section] }));
      setMessage("Defaults restored for " + label + ". Save the website content to publish this reset.");
    } catch (error) {
      setMessage(error.message || "Could not restore defaults.");
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed.");
      setContent(data.content);
      setMessage("Website content saved successfully.");
    } catch (error) {
      setMessage(error.message || "Could not save website content.");
    } finally {
      setSaving(false);
    }
  }

  function removeItem(section, key, index) {
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: current[section][key].filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  }

  function addItem(section, key, item) {
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: [...current[section][key], item],
      },
    }));
  }

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-6 2xl:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
      <aside className="min-w-0 lg:sticky lg:top-4">
        <div className="overflow-hidden border border-gray-200 bg-[#F8F7F4] shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B68A35]">Live preview</p><p className="mt-1 text-xs text-gray-500">Unpublished · updates as you edit</p></div>
            <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-amber-800">Draft</span>
          </div>
          <iframe
            ref={previewRef}
            title="Sterling Bloom live draft preview"
            src="/admin/content/preview"
            onLoad={() => previewRef.current?.contentWindow?.postMessage({ type: "STERLING_BLOOM_DRAFT", content }, window.location.origin)}
            className="h-[70vh] min-h-[560px] w-full bg-white lg:h-[calc(100vh-7rem)] lg:min-h-[720px]"
          />
        </div>
        <p className="mt-3 text-[11px] leading-5 text-gray-400">Changes are only a draft until you press Save Website Content. Scroll inside the preview to inspect the whole page.</p>
      </aside>
      <div className="min-w-0 space-y-6">
      <SectionCard eyebrow="PAGE BUILDER" title="Section Visibility">
        <p className="text-sm leading-6 text-gray-500">Choose which parts of the public website are displayed. Hidden sections stay saved and can be turned back on any time.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["hero", "Hero / Homepage banner"], ["about", "About"], ["services", "Services"],
            ["gallery", "Portfolio / Gallery"], ["process", "Our Process"], ["packages", "Packages"],
            ["testimonials", "Testimonials"], ["instagramStrip", "Instagram Feed"], ["calendly", "Book a Consultation"],
            ["contact", "Contact Form"], ["nav", "Navigation Bar"], ["footer", "Footer"],
          ].map(([key, label]) => (
            <ToggleField key={key} label={label} checked={content.visibility?.[key] ?? true} onChange={(value) => setContent((current) => ({ ...current, visibility: { ...(current.visibility || {}), [key]: value } }))} hint={content.visibility?.[key] === false ? "Hidden on the website" : "Visible on the website"} />
          ))}
        </div>
      </SectionCard>
      <SectionCard eyebrow="DESIGN SYSTEM" title="Theme Studio" onReset={() => resetSection("design")}>
        <p className="max-w-3xl text-sm leading-6 text-gray-500">Customize the website palette and shared layout values. Save your changes to apply them to the public site.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">Theme preset</span>
            <select value={content.design?.theme || "light"} onChange={(e) => update("design", "theme", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#211d19]">
              <option value="light">Light / Ivory</option>
              <option value="dark">Dark / Evening</option>
              <option value="custom">Custom Palette</option>
            </select>
          </label>
          <ColorField label="Page Background" value={content.design?.colors?.background || "#F8F7F4"} onChange={(v) => updateDesign("colors", "background", v)} />
          <ColorField label="Card / Surface Background" value={content.design?.colors?.surface || "#FFFFFF"} onChange={(v) => updateDesign("colors", "surface", v)} />
          <ColorField label="Main Text Color" value={content.design?.colors?.text || "#211D19"} onChange={(v) => updateDesign("colors", "text", v)} />
          <ColorField label="Muted Text Color" value={content.design?.colors?.mutedText || "#66615B"} onChange={(v) => updateDesign("colors", "mutedText", v)} />
          <ColorField label="Accent / Special Text" value={content.design?.colors?.accent || "#B68A35"} onChange={(v) => updateDesign("colors", "accent", v)} />
          <ColorField label="Light Accent / Gradient" value={content.design?.colors?.accentLight || "#D6B56D"} onChange={(v) => updateDesign("colors", "accentLight", v)} />
          <ColorField label="Dark Contrast Color" value={content.design?.colors?.dark || "#1D1813"} onChange={(v) => updateDesign("colors", "dark", v)} />
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Content Width (px)" type="number" min={720} max={1800} step={1} value={content.design?.layout?.contentWidth ?? 1280} onChange={(v) => updateDesign("layout", "contentWidth", Math.max(720, Math.min(1800, Number(v) || 1280)))} hint="Range: 720–1800px." />
          <Field label="Section Spacing (px)" type="number" min={24} max={180} step={1} value={content.design?.layout?.sectionSpacing ?? 80} onChange={(v) => updateDesign("layout", "sectionSpacing", Math.max(24, Math.min(180, Number(v) || 80)))} hint="Shared spacing scale: 24–180px." />
          <Field label="Card Corner Radius (px)" type="number" min={0} max={48} step={1} value={content.design?.layout?.cardRadius ?? 20} onChange={(v) => updateDesign("layout", "cardRadius", Math.max(0, Math.min(48, Number(v) || 0)))} hint="Use 0 for sharp corners." />
          <Field label="Card Padding (px)" type="number" min={8} max={64} step={1} value={content.design?.layout?.cardPadding ?? 24} onChange={(v) => updateDesign("layout", "cardPadding", Math.max(8, Math.min(64, Number(v) || 24)))} hint="Spacing token for components wired to the design system." />
        </div>
        <div className="mt-6 rounded-xl border border-gray-200 p-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">Palette Preview</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ["Background", content.design?.colors?.background || "#F8F7F4"],
              ["Surface", content.design?.colors?.surface || "#FFFFFF"],
              ["Text", content.design?.colors?.text || "#211D19"],
              ["Accent", content.design?.colors?.accent || "#B68A35"],
              ["Light accent", content.design?.colors?.accentLight || "#D6B56D"],
              ["Dark", content.design?.colors?.dark || "#1D1813"],
            ].map(([name, color]) => <span key={name} title={name + ": " + color} className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-[11px] text-gray-600"><span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color }} />{name}</span>)}
          </div>
        </div>
      </SectionCard>

      <SectionCard eyebrow="NAVIGATION" title="Navigation" onReset={() => resetSection("nav")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Brand Name" value={content.nav.brand} onChange={(v) => update("nav", "brand", v)} />
          <Field label="Consultation Button" value={content.nav.cta} onChange={(v) => update("nav", "cta", v)} />
          <Field label="Consultation Button Action" value={content.nav.ctaHref} onChange={(v) => update("nav", "ctaHref", v)} hint="Example: #contact, /consultation, or an external URL." />
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">Navigation Links</p>
          {content.nav.links.map(([label, href], index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
              <input value={label} onChange={(e) => {
                const links = [...content.nav.links];
                links[index] = [e.target.value, links[index][1]];
                update("nav", "links", links);
              }} className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B68A35]" placeholder="Label" />
              <input value={href} onChange={(e) => {
                const links = [...content.nav.links];
                links[index] = [links[index][0], e.target.value];
                update("nav", "links", links);
              }} className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B68A35]" placeholder="#section" />
              <button type="button" onClick={() => update("nav", "links", content.nav.links.filter((_, i) => i !== index))} className="rounded-xl border px-4 text-xs text-gray-500 hover:border-red-300 hover:text-red-600">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => update("nav", "links", [...content.nav.links, ["New Link", "#contact"]])} className="text-xs font-medium uppercase tracking-[0.12em] text-[#B68A35]">+ Add navigation link</button>
        </div>
        <div className="mt-6 border-t border-gray-100 pt-6">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">Logo Studio</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <ToggleField label="Show logo in navigation" checked={content.nav.logoSettings?.visible ?? true} onChange={(v) => updateNested("nav", "logoSettings", "visible", v)} />
            <ToggleField label="Show background behind logo when scrolled" checked={content.nav.logoSettings?.backgroundEnabled ?? true} onChange={(v) => updateNested("nav", "logoSettings", "backgroundEnabled", v)} />
            <ToggleField label="Show border when scrolled" checked={content.nav.logoSettings?.borderEnabled ?? true} onChange={(v) => updateNested("nav", "logoSettings", "borderEnabled", v)} />
            <ToggleField label="Show logo shadow when scrolled" checked={content.nav.logoSettings?.shadowEnabled ?? true} onChange={(v) => updateNested("nav", "logoSettings", "shadowEnabled", v)} />
            <Field label="Mobile Logo Size (px)" type="number" min={32} max={140} step={1} value={content.nav.logoSettings?.mobileSize ?? 76} onChange={(v) => updateNested("nav", "logoSettings", "mobileSize", Math.max(32, Math.min(140, Number(v) || 76)))} />
            <Field label="Desktop Logo Size (px)" type="number" min={40} max={180} step={1} value={content.nav.logoSettings?.desktopSize ?? 88} onChange={(v) => updateNested("nav", "logoSettings", "desktopSize", Math.max(40, Math.min(180, Number(v) || 88)))} />
            <Field label="Logo Corner Radius (%)" type="number" min={0} max={50} step={1} value={content.nav.logoSettings?.borderRadius ?? 0} onChange={(v) => updateNested("nav", "logoSettings", "borderRadius", Math.max(0, Math.min(50, Number(v) || 0)))} hint="0% = square corners, 50% = fully round. Applies to the logo frame." />
            <ColorField label="Scrolled Logo Background" value={content.nav.logoSettings?.background || "#F8F7F4"} onChange={(v) => updateNested("nav", "logoSettings", "background", v)} />
            <ColorField label="Scrolled Border Color" value={content.nav.logoSettings?.borderColor || "#B68A35"} onChange={(v) => updateNested("nav", "logoSettings", "borderColor", v)} />
            <Field label="Border Thickness (px)" type="number" min={0} max={8} step={1} value={content.nav.logoSettings?.borderWidth ?? 1} onChange={(v) => updateNested("nav", "logoSettings", "borderWidth", Math.max(0, Math.min(8, Number(v) || 0)))} />
          </div>
        </div>
      </SectionCard>

      <SectionCard eyebrow="HERO" title="Hero Section" onReset={() => resetSection("hero")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(v) => update("hero", "eyebrow", v)} />
          <Field label="Primary Button" value={content.hero.primaryButton} onChange={(v) => update("hero", "primaryButton", v)} />
          <Field label="Primary Button Action" value={content.hero.primaryButtonHref} onChange={(v) => update("hero", "primaryButtonHref", v)} hint="Example: #contact, /consultation, or an external URL." />
          <Field label="Heading Before Highlight" value={content.hero.before} onChange={(v) => update("hero", "before", v)} />
          <Field label="Highlighted Heading" value={content.hero.highlight} onChange={(v) => update("hero", "highlight", v)} />
          <Field label="Heading After Highlight" value={content.hero.after} onChange={(v) => update("hero", "after", v)} />
          <Field label="Secondary Button" value={content.hero.secondaryButton} onChange={(v) => update("hero", "secondaryButton", v)} />
          <Field label="Secondary Button Action" value={content.hero.secondaryButtonHref} onChange={(v) => update("hero", "secondaryButtonHref", v)} hint="Example: #portfolio or /portfolio." />
        </div>
        <Field label="Description" value={content.hero.description} onChange={(v) => update("hero", "description", v)} multiline />
        <div className="grid gap-5 sm:grid-cols-2">
          <MediaPicker label="Background Image" value={content.hero.backgroundImage} onChange={(v) => update("hero", "backgroundImage", v)} />
          <Field label="Hero Video" value={content.hero.video} onChange={(v) => update("hero", "video", v)} hint="Shown on tablets and computers." />
          <Field label="Mobile Hero Video" value={content.hero.mobileVideo} onChange={(v) => update("hero", "mobileVideo", v)} hint="Vertical video shown on phones. Leave empty to use the default." />
        </div>
      </SectionCard>

      <SectionCard eyebrow="OUR STORY" title="About / Story" onReset={() => resetSection("about")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" value={content.about.eyebrow} onChange={(v) => update("about", "eyebrow", v)} />
          <Field label="Button" value={content.about.button} onChange={(v) => update("about", "button", v)} />
          <Field label="Heading Before Highlight" value={content.about.before} onChange={(v) => update("about", "before", v)} />
          <Field label="Highlighted Heading" value={content.about.highlight} onChange={(v) => update("about", "highlight", v)} />
          <Field label="Heading After Highlight" value={content.about.after} onChange={(v) => update("about", "after", v)} />
          <MediaPicker label="Image" value={content.about.image} onChange={(v) => update("about", "image", v)} />
        </div>
        <Field label="Description" value={content.about.description} onChange={(v) => update("about", "description", v)} multiline />
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">Story Features</p>
          <div className="mt-3 space-y-3">
            {content.about.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input value={feature} onChange={(e) => {
                  const features = [...content.about.features];
                  features[index] = e.target.value;
                  update("about", "features", features);
                }} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B68A35]" />
                <button type="button" onClick={() => update("about", "features", content.about.features.filter((_, i) => i !== index))} className="rounded-xl border px-4 text-xs text-gray-500 hover:border-red-300 hover:text-red-600">Remove</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => update("about", "features", [...content.about.features, "New feature"])} className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-[#B68A35]">+ Add feature</button>
        </div>
      </SectionCard>

      <SectionCard eyebrow="SERVICES" title="Services" onReset={() => resetSection("services")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" value={content.services.eyebrow} onChange={(v) => update("services", "eyebrow", v)} />
          <Field label="Featured Label" value={content.services.featuredLabel} onChange={(v) => update("services", "featuredLabel", v)} />
          <Field label="Heading" value={content.services.heading} onChange={(v) => update("services", "heading", v)} />
          <Field label="Button" value={content.services.button} onChange={(v) => update("services", "button", v)} />
        </div>
        <Field label="Description" value={content.services.description} onChange={(v) => update("services", "description", v)} multiline />
        <div className="space-y-4">
          {content.services.items.map((item, index) => (
            <div key={item.id || index} className="rounded-2xl border border-gray-200 bg-[#FBFAF7] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">Service {String(index + 1).padStart(2, "0")}</p>
                <button type="button" onClick={() => removeItem("services", "items", index)} className="text-xs text-gray-400 hover:text-red-600">Remove</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title" value={item.title} onChange={(v) => updateArray("services", "items", index, "title", v)} />
                <MediaPicker label="Service image" value={item.image} onChange={(v) => updateArray("services", "items", index, "image", v)} />
              </div>
              <div className="mt-4">
                <Field label="Description" value={item.description} onChange={(v) => updateArray("services", "items", index, "description", v)} multiline />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addItem("services", "items", { id: Date.now(), title: "New Service", description: "", image: "" })} className="text-xs font-medium uppercase tracking-[0.12em] text-[#B68A35]">+ Add service</button>
        </div>
      </SectionCard>

      <SectionCard eyebrow="FEATURED WORK" title="Portfolio" onReset={() => resetSection("gallery")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" value={content.gallery.eyebrow} onChange={(v) => update("gallery", "eyebrow", v)} />
          <Field label="Heading" value={content.gallery.heading} onChange={(v) => update("gallery", "heading", v)} />
          <Field label="Bottom Note" value={content.gallery.note} onChange={(v) => update("gallery", "note", v)} />
        </div>
        <Field label="Description" value={content.gallery.description} onChange={(v) => update("gallery", "description", v)} multiline />
        <div className="space-y-4">
          {content.gallery.items.map((item, index) => (
            <div key={item.id || index} className="rounded-2xl border border-gray-200 bg-[#FBFAF7] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">Portfolio Item {String(index + 1).padStart(2, "0")}</p>
                <button type="button" onClick={() => removeItem("gallery", "items", index)} className="text-xs text-gray-400 hover:text-red-600">Remove</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Title" value={item.title} onChange={(v) => updateArray("gallery", "items", index, "title", v)} />
                <Field label="Category" value={item.category} onChange={(v) => updateArray("gallery", "items", index, "category", v)} hint="Use weddings, ceremonies or mehndi." />
                <MediaPicker label="Image" value={item.image} onChange={(v) => updateArray("gallery", "items", index, "image", v)} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addItem("gallery", "items", { id: Date.now(), title: "New Work", category: "weddings", image: "" })} className="text-xs font-medium uppercase tracking-[0.12em] text-[#B68A35]">+ Add portfolio item</button>
        </div>
      </SectionCard>

      <SectionCard eyebrow="PROCESS" title="How It Works" onReset={() => resetSection("process")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" value={content.process.eyebrow} onChange={(v) => update("process", "eyebrow", v)} />
          <Field label="Heading" value={content.process.heading} onChange={(v) => update("process", "heading", v)} />
        </div>
        <Field label="Description" value={content.process.description} onChange={(v) => update("process", "description", v)} multiline />
        <div className="space-y-4">
          {content.process.steps.map((step, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 bg-[#FBFAF7] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">Step {String(index + 1).padStart(2, "0")}</p>
                <button type="button" onClick={() => removeItem("process", "steps", index)} className="text-xs text-gray-400 hover:text-red-600">Remove</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Number" value={step.number} onChange={(v) => updateArray("process", "steps", index, "number", v)} />
                <Field label="Title" value={step.title} onChange={(v) => updateArray("process", "steps", index, "title", v)} />
              </div>
              <div className="mt-4"><Field label="Description" value={step.description} onChange={(v) => updateArray("process", "steps", index, "description", v)} multiline /></div>
            </div>
          ))}
          <button type="button" onClick={() => addItem("process", "steps", { number: String(content.process.steps.length + 1).padStart(2, "0"), title: "New Step", description: "" })} className="text-xs font-medium uppercase tracking-[0.12em] text-[#B68A35]">+ Add step</button>
        </div>
      </SectionCard>

      <SectionCard eyebrow="PACKAGES" title="Packages" onReset={() => resetSection("packages")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" value={content.packages.eyebrow} onChange={(v) => update("packages", "eyebrow", v)} />
          <Field label="Heading" value={content.packages.heading} onChange={(v) => update("packages", "heading", v)} />
          <Field label="Button" value={content.packages.button} onChange={(v) => update("packages", "button", v)} />
          <Field label="Featured Label" value={content.packages.featuredLabel} onChange={(v) => update("packages", "featuredLabel", v)} />
        </div>
        <Field label="Description" value={content.packages.description} onChange={(v) => update("packages", "description", v)} multiline />
        <Field label="Pricing Note" value={content.packages.note} onChange={(v) => update("packages", "note", v)} multiline />
        <div className="space-y-4">
          {content.packages.items.map((item, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 bg-[#FBFAF7] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">Package {String(index + 1).padStart(2, "0")}</p>
                <button type="button" onClick={() => removeItem("packages", "items", index)} className="text-xs text-gray-400 hover:text-red-600">Remove</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" value={item.name} onChange={(v) => updateArray("packages", "items", index, "name", v)} />
                <label className="flex items-end gap-3 pb-1 text-sm"><input type="checkbox" checked={!!item.featured} onChange={(e) => updateArray("packages", "items", index, "featured", e.target.checked)} /> Featured package</label>
              </div>
              <div className="mt-4"><Field label="Description" value={item.description} onChange={(v) => updateArray("packages", "items", index, "description", v)} multiline /></div>
              <div className="mt-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">Features</p>
                <div className="mt-3 space-y-2">
                  {item.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-2">
                      <input value={feature} onChange={(e) => {
                        const features = [...item.features];
                        features[featureIndex] = e.target.value;
                        updateArray("packages", "items", index, "features", features);
                      }} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B68A35]" />
                      <button type="button" onClick={() => updateArray("packages", "items", index, "features", item.features.filter((_, i) => i !== featureIndex))} className="rounded-xl border px-3 text-xs text-gray-500">×</button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => updateArray("packages", "items", index, "features", [...item.features, "New feature"])} className="mt-3 text-xs text-[#B68A35]">+ Add feature</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addItem("packages", "items", { name: "New Package", description: "", features: [], featured: false })} className="text-xs font-medium uppercase tracking-[0.12em] text-[#B68A35]">+ Add package</button>
        </div>
      </SectionCard>

      <SectionCard eyebrow="FAQS" title="Frequently Asked Questions" onReset={() => resetSection("faq")}>
        <ToggleField label="Show FAQs on the public website" checked={content.visibility?.faq ?? true} onChange={(value) => setContent((current) => ({ ...current, visibility: { ...(current.visibility || {}), faq: value } }))} hint="Turn the entire FAQ section on or off without deleting its content." />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" value={content.faq?.eyebrow || ""} onChange={(v) => update("faq", "eyebrow", v)} />
          <Field label="Heading" value={content.faq?.heading || ""} onChange={(v) => update("faq", "heading", v)} />
        </div>
        <Field label="Description" value={content.faq?.description || ""} onChange={(v) => update("faq", "description", v)} multiline />
        <div className="space-y-4">
          {(content.faq?.items || []).map((item, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 bg-[#FBFAF7] p-5">
              <div className="mb-4 flex items-center justify-between"><p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">Question {String(index + 1).padStart(2, "0")}</p><button type="button" onClick={() => removeItem("faq", "items", index)} className="text-xs text-gray-400 hover:text-red-600">Remove</button></div>
              <Field label="Question" value={item.question} onChange={(v) => updateArray("faq", "items", index, "question", v)} />
              <div className="mt-4"><Field label="Answer" value={item.answer} onChange={(v) => updateArray("faq", "items", index, "answer", v)} multiline /></div>
            </div>
          ))}
          <button type="button" onClick={() => addItem("faq", "items", { question: "New question", answer: "" })} className="text-xs font-medium uppercase tracking-[0.12em] text-[#B68A35]">+ Add FAQ</button>
        </div>
      </SectionCard>

      <SectionCard eyebrow="TESTIMONIALS" title="Client Stories" onReset={() => resetSection("testimonials")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" value={content.testimonials.eyebrow} onChange={(v) => update("testimonials", "eyebrow", v)} />
          <Field label="Label" value={content.testimonials.label} onChange={(v) => update("testimonials", "label", v)} />
          <Field label="Heading" value={content.testimonials.heading} onChange={(v) => update("testimonials", "heading", v)} />
          <Field label="Launch Note" value={content.testimonials.note} onChange={(v) => update("testimonials", "note", v)} multiline />
        </div>
        <Field label="Description" value={content.testimonials.description} onChange={(v) => update("testimonials", "description", v)} multiline />
        <div className="space-y-4">
          {content.testimonials.items.map((item, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 bg-[#FBFAF7] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">Story {String(index + 1).padStart(2, "0")}</p>
                <button type="button" onClick={() => removeItem("testimonials", "items", index)} className="text-xs text-gray-400 hover:text-red-600">Remove</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Client Name" value={item.name} onChange={(v) => updateArray("testimonials", "items", index, "name", v)} />
                <Field label="Event" value={item.event} onChange={(v) => updateArray("testimonials", "items", index, "event", v)} />
              </div>
              <div className="mt-4"><Field label="Review" value={item.review} onChange={(v) => updateArray("testimonials", "items", index, "review", v)} multiline /></div>
            </div>
          ))}
          <button type="button" onClick={() => addItem("testimonials", "items", { name: "New Client", event: "Event", review: "" })} className="text-xs font-medium uppercase tracking-[0.12em] text-[#B68A35]">+ Add client story</button>
        </div>
      </SectionCard>

      <SectionCard eyebrow="INSTAGRAM" title="Instagram Strip" onReset={() => resetSection("instagramStrip")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" value={content.instagramStrip.eyebrow} onChange={(v) => update("instagramStrip", "eyebrow", v)} />
          <Field label="Handle / Label" value={content.instagramStrip.handle} onChange={(v) => update("instagramStrip", "handle", v)} hint="Use the public Instagram handle, e.g. @sterlingbloomdecor." />
          <Field label="Heading" value={content.instagramStrip.heading} onChange={(v) => update("instagramStrip", "heading", v)} />
          <Field label="Instagram URL" value={content.instagramStrip.url} onChange={(v) => update("instagramStrip", "url", v)} hint="Public profile URL, e.g. https://instagram.com/yourhandle" />
          <Field label="Button" value={content.instagramStrip.button} onChange={(v) => update("instagramStrip", "button", v)} />
        </div>
        <Field label="Description" value={content.instagramStrip.description} onChange={(v) => update("instagramStrip", "description", v)} multiline />
        <div className="space-y-4">
          {content.instagramStrip.items.map((item, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 bg-[#FBFAF7] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">Instagram Image {String(index + 1).padStart(2, "0")}</p>
                <button type="button" onClick={() => removeItem("instagramStrip", "items", index)} className="text-xs text-gray-400 hover:text-red-600">Remove</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <MediaPicker label="Image" value={item.image} onChange={(v) => updateArray("instagramStrip", "items", index, "image", v)} />
                <Field label="Alt Text" value={item.alt} onChange={(v) => updateArray("instagramStrip", "items", index, "alt", v)} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addItem("instagramStrip", "items", { image: "", alt: "Sterling Bloom event" })} className="text-xs font-medium uppercase tracking-[0.12em] text-[#B68A35]">+ Add Instagram image</button>
        </div>
      </SectionCard>

      <SectionCard eyebrow="CONSULTATION" title="Calendly Booking" onReset={() => resetSection("consultation")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" value={content.calendly.eyebrow} onChange={(v) => update("calendly", "eyebrow", v)} />
          <Field label="Heading" value={content.calendly.heading} onChange={(v) => update("calendly", "heading", v)} />
        </div>
        <Field label="Description" value={content.calendly.description} onChange={(v) => update("calendly", "description", v)} multiline />
        <p className="rounded-xl border border-[#D6B56D]/40 bg-[#FBF7ED] px-4 py-3 text-xs leading-5 text-gray-600">
          Calendly authentication stays server-side. The public booking page is loaded from your Calendly account after the Vercel environment variable is configured.
        </p>
      </SectionCard>

      <SectionCard eyebrow="CONTACT" title="Contact & Inquiry" onReset={() => resetSection("contact")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" value={content.contact.eyebrow} onChange={(v) => update("contact", "eyebrow", v)} />
          <Field label="Phone" value={content.contact.phone} onChange={(v) => update("contact", "phone", v)} />
          <Field label="Heading" value={content.contact.heading} onChange={(v) => update("contact", "heading", v)} />
          <Field label="Highlighted Heading" value={content.contact.highlight} onChange={(v) => update("contact", "highlight", v)} />
          <Field label="Email" value={content.contact.email} onChange={(v) => update("contact", "email", v)} />
          <Field label="Location" value={content.contact.location} onChange={(v) => update("contact", "location", v)} />
          <Field label="Hours" value={content.contact.hours || ""} onChange={(v) => update("contact", "hours", v)} />
          <Field label="Form Eyebrow" value={content.contact.formEyebrow} onChange={(v) => update("contact", "formEyebrow", v)} />
          <Field label="Form Heading" value={content.contact.formHeading} onChange={(v) => update("contact", "formHeading", v)} />
          <Field label="Form Button" value={content.contact.formButton} onChange={(v) => update("contact", "formButton", v)} />
        </div>
        <Field label="Description" value={content.contact.description} onChange={(v) => update("contact", "description", v)} multiline />
        <Field label="Consultation Note" value={content.contact.note} onChange={(v) => update("contact", "note", v)} />
        <Field label="Form Description" value={content.contact.formDescription} onChange={(v) => update("contact", "formDescription", v)} />
        <Field label="Form Footnote" value={content.contact.formFootnote} onChange={(v) => update("contact", "formFootnote", v)} />
        <MediaPicker label="Contact Background Image" value={content.contact.backgroundImage || ""} onChange={(v) => update("contact", "backgroundImage", v)} />
      </SectionCard>

      <SectionCard eyebrow="FOOTER" title="Footer" onReset={() => resetSection("footer")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" value={content.footer.eyebrow} onChange={(v) => update("footer", "eyebrow", v)} />
          <Field label="Closing Line" value={content.footer.closing} onChange={(v) => update("footer", "closing", v)} />
          <Field label="Heading" value={content.footer.heading} onChange={(v) => update("footer", "heading", v)} />
          <Field label="Highlighted Heading" value={content.footer.highlight} onChange={(v) => update("footer", "highlight", v)} />
          <Field label="Instagram Label" value={content.footer.instagram} onChange={(v) => update("footer", "instagram", v)} />
          <Field label="Instagram URL" value={content.footer.instagramHref} onChange={(v) => update("footer", "instagramHref", v)} hint="Full URL, for example https://instagram.com/yourhandle" />
          <Field label="Facebook Label" value={content.footer.facebook} onChange={(v) => update("footer", "facebook", v)} />
          <Field label="Facebook URL" value={content.footer.facebookHref} onChange={(v) => update("footer", "facebookHref", v)} hint="Full URL, for example https://facebook.com/yourpage" />
        </div>
        <Field label="Description" value={content.footer.description} onChange={(v) => update("footer", "description", v)} multiline />
      </SectionCard>

      </div>
      <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className={message.includes("successfully") ? "text-sm text-green-700" : "text-sm text-gray-500"}>{message || "Changes are local until you save them."}</p>
        <button type="button" onClick={save} disabled={saving} className="btn-primary shrink-0 rounded-xl px-7 py-3.5 text-xs uppercase tracking-[0.16em] disabled:opacity-60">
          {saving ? "Saving..." : "Save Website Content"}
        </button>
      </div>
    </div>
  );
}
