import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import connectDB from "../../../../lib/mongodb";
import Inquiry from "../../../../models/Inquiry";
import InquiryStatus from "./status";

function formatDate(date) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Karachi",
  }).format(new Date(date));
}

export default async function AdminInquiryDetail({ params }) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  let inquiry;

  try {
    await connectDB();
    inquiry = await Inquiry.findById(id).lean();
  } catch (error) {
    console.error("Admin inquiry detail failed:", error);
    throw error;
  }

  if (!inquiry) notFound();

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#211d19]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/admin/inquiries" className="text-xs uppercase tracking-[0.14em] text-gray-400 transition hover:text-[#B68A35]">
            ← All Inquiries
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="rounded-[10px] border border-gray-200 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-gray-600 transition hover:border-[#B68A35] hover:text-[#B68A35]">
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">INQUIRY</p>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-medium sm:text-5xl">
              {inquiry.name}
            </h1>
            <p className="mt-3 text-sm text-gray-500">{formatDate(inquiry.createdAt)}</p>
          </div>
          <InquiryStatus inquiryId={inquiry._id.toString()} initialStatus={inquiry.status} />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <section className="rounded-[20px] border border-gray-200 bg-white p-6 sm:p-7">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#B68A35]">CONTACT</p>
            <dl className="mt-6 space-y-5">
              <div><dt className="text-[10px] uppercase tracking-[0.12em] text-gray-400">Email</dt><dd className="mt-1 break-all text-sm"><a href={"mailto:" + inquiry.email} className="underline decoration-[#D6B56D] underline-offset-4 hover:text-[#8C6824]">{inquiry.email}</a></dd></div>
              <div><dt className="text-[10px] uppercase tracking-[0.12em] text-gray-400">Phone</dt><dd className="mt-1 text-sm"><a href={"tel:" + String(inquiry.phone || "").replace(/[^+\d]/g, "")} className="underline decoration-[#D6B56D] underline-offset-4 hover:text-[#8C6824]">{inquiry.phone}</a></dd></div>
              <div><dt className="text-[10px] uppercase tracking-[0.12em] text-gray-400">I am a</dt><dd className="mt-1 text-sm">{inquiry.role || "Not provided"}</dd></div>
              <div><dt className="text-[10px] uppercase tracking-[0.12em] text-gray-400">Event</dt><dd className="mt-1 text-sm">{inquiry.eventType}</dd></div>
              <div><dt className="text-[10px] uppercase tracking-[0.12em] text-gray-400">Event date</dt><dd className="mt-1 text-sm">{inquiry.eventDate || "Not provided"}</dd></div>
              {inquiry.venue && <div><dt className="text-[10px] uppercase tracking-[0.12em] text-gray-400">Venue / city</dt><dd className="mt-1 text-sm">{inquiry.venue}</dd></div>}
              {inquiry.guestCount && <div><dt className="text-[10px] uppercase tracking-[0.12em] text-gray-400">Guest count</dt><dd className="mt-1 text-sm">{inquiry.guestCount}</dd></div>}
              <div><dt className="text-[10px] uppercase tracking-[0.12em] text-gray-400">Estimated budget</dt><dd className="mt-1 text-sm">{inquiry.budget || "Not provided"}</dd></div>
            </dl>
          </section>

          <section className="rounded-[20px] border border-gray-200 bg-white p-6 sm:p-7">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#B68A35]">MESSAGE</p>
            <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-gray-600">{inquiry.message}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
