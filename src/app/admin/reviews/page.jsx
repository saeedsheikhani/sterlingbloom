"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  async function load() {
    const response = await fetch("/api/admin/reviews", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    setReviews(data.reviews || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteReview(review) {
    if (!window.confirm("Permanently delete the review from \u201c" + review.name + "\u201d? This can\u2019t be undone.")) return;
    const response = await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: review._id }),
    });
    if (response.ok) setReviews((current) => current.filter((item) => item._id !== review._id));
    else window.alert("The review couldn\u2019t be deleted. Please try again.");
  }

  // Add (no id) or edit (with id) a review. Returns an error message, or "" when saved.
  async function saveReview(fields, id) {
    const response = await fetch("/api/admin/reviews", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(id ? { id, ...fields } : fields),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return data.error || "The review couldn\u2019t be saved. Please try again.";
    if (id) setReviews((current) => current.map((item) => (item._id === id ? data.review : item)));
    else setReviews((current) => [data.review, ...current]);
    return "";
  }

  async function updateStatus(id, status) {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#211d19]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs uppercase tracking-[0.14em] text-gray-400 hover:text-[#B68A35]">← Dashboard</Link>
            <div className="hidden h-5 w-px bg-gray-200 sm:block" />
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium">Customer Reviews</h1>
          </div>
          <form action="/api/admin/logout" method="POST"><button className="rounded-[10px] border border-gray-200 px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-gray-600">Sign Out</button></form>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <p className="eyebrow">REVIEW MODERATION</p>
        <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-medium">Approve real client feedback.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">New customer reviews stay private until you approve them. Approved reviews automatically appear on the public Testimonials section (it shows once there are at least 2). Reviews you add here are approved straight away.</p>
        <div className="mt-6">
          {adding ? (
            <ReviewEditor
              title="Add a review"
              saveLabel="Add & Publish"
              onCancel={() => setAdding(false)}
              onSave={async (fields) => { const error = await saveReview(fields); if (!error) setAdding(false); return error; }}
            />
          ) : (
            <button type="button" onClick={() => { setAdding(true); setEditingId(null); }} className="sb-admin-gold rounded-[8px] bg-[#B68A35] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-white">+ Add Review</button>
          )}
        </div>
        <div className="mt-8 space-y-4">
          {loading ? <p className="text-sm text-gray-500">Loading reviews…</p> : reviews.length === 0 ? <p className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">No customer reviews yet.</p> : reviews.map((review) => (
            editingId === review._id ? (
              <ReviewEditor
                key={review._id}
                title={"Edit review from " + review.name}
                saveLabel="Save Changes"
                initial={review}
                onCancel={() => setEditingId(null)}
                onSave={async (fields) => { const error = await saveReview(fields, review._id); if (!error) setEditingId(null); return error; }}
              />
            ) : (
            <article key={review._id} className="rounded-[20px] border border-gray-200 bg-white p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><h3 className="font-[family-name:var(--font-display)] text-2xl font-medium">{review.name}</h3><p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#B68A35]">{review.event}</p><p className="mt-2 text-xs text-gray-400">{review.source === "admin" ? "Added by admin" : review.email}</p></div>
                <span className={"rounded-full px-3 py-1 text-[9px] font-medium uppercase tracking-[0.16em] " + (review.status === "approved" ? "bg-green-50 text-green-700" : review.status === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700")}>{review.status}</span>
              </div>
              <p className="mt-5 text-sm leading-7 text-gray-600">“{review.review}”</p>
              <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                {review.status !== "approved" && <button onClick={() => updateStatus(review._id, "approved")} className="sb-admin-gold rounded-[8px] bg-[#B68A35] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-white">Approve & Publish</button>}
                {review.status !== "rejected" && <button onClick={() => updateStatus(review._id, "rejected")} className="rounded-[8px] border border-gray-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-gray-600">Reject</button>}
                {review.status !== "pending" && <button onClick={() => updateStatus(review._id, "pending")} className="rounded-[8px] border border-gray-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-gray-600">Move to Pending</button>}
                <button onClick={() => { setEditingId(review._id); setAdding(false); }} className="rounded-[8px] border border-gray-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-gray-600">Edit</button>
                <button onClick={() => deleteReview(review)} className="ml-auto rounded-[8px] border border-red-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </article>
            )
          ))}
        </div>
      </div>
    </main>
  );
}

// Form used for adding a new review and editing an existing one.
function ReviewEditor({ title, saveLabel, initial = {}, onSave, onCancel }) {
  const [name, setName] = useState(initial.name || "");
  const [event, setEvent] = useState(initial.event || "");
  const [review, setReview] = useState(initial.review || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const field = "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#211d19] outline-none transition focus:border-[#B68A35] focus:ring-2 focus:ring-[#B68A35]/10";
  const label = "text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500";

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError(await onSave({ name, event, review }));
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="rounded-[20px] border border-[#B68A35]/50 bg-white p-6 sm:p-7">
      <p className="font-[family-name:var(--font-display)] text-2xl font-medium">{title}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block"><span className={label}>Client name</span><input value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} className={field} placeholder="e.g. Ayesha & Hamza" /></label>
        <label className="block"><span className={label}>Event type</span><input value={event} onChange={(e) => setEvent(e.target.value)} required maxLength={100} className={field} placeholder="e.g. Wedding" /></label>
      </div>
      <label className="mt-4 block"><span className={label}>Review</span><textarea value={review} onChange={(e) => setReview(e.target.value)} required maxLength={1500} rows={4} className={field + " resize-y"} placeholder="What the client said" /></label>
      {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="sb-admin-gold rounded-[8px] bg-[#B68A35] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-white disabled:opacity-60">{saving ? "Saving\u2026" : saveLabel}</button>
        <button type="button" onClick={onCancel} className="rounded-[8px] border border-gray-200 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-gray-600">Cancel</button>
      </div>
    </form>
  );
}
