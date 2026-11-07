import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../../lib/admin-auth";
import connectDB from "../../../lib/mongodb";
import Inquiry from "../../../models/Inquiry";

const statusStyles = {
  new: "border-[#D6B56D] bg-[#FBF7ED] text-[#8C6824]",
  contacted: "border-blue-200 bg-blue-50 text-blue-700",
  consultation: "border-purple-200 bg-purple-50 text-purple-700",
  booked: "border-green-200 bg-green-50 text-green-700",
  closed: "border-gray-200 bg-gray-50 text-gray-600",
};

const statusLabels = {
  new: "New",
  contacted: "Contacted",
  consultation: "Consultation",
  booked: "Booked",
  closed: "Closed",
};

function formatDate(date) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Karachi",
  }).format(new Date(date));
}

export default async function AdminInquiriesPage({ searchParams }) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const params = await searchParams;
  const validStatuses = ["new", "contacted", "consultation", "booked", "closed"];
  const selectedStatus = validStatuses.includes(params?.status) ? params.status : "all";
  let inquiries = [];
  let loadError = "";

  try {
    await connectDB();
    const filter = selectedStatus === "all" ? {} : { status: selectedStatus };
    inquiries = await Inquiry.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  } catch (error) {
    console.error("Admin inquiries page failed:", error);
    loadError = "Unable to connect to the inquiry database right now.";
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#211d19]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs uppercase tracking-[0.14em] text-gray-400 transition hover:text-[#B68A35]">
              ← Dashboard
            </Link>
            <div className="hidden h-5 w-px bg-gray-200 sm:block" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#B68A35]">Sterling Bloom</p>
              <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-medium sm:text-3xl">Inquiries</h1>
            </div>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="rounded-[10px] border border-gray-200 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-gray-600 transition hover:border-[#B68A35] hover:text-[#B68A35]">
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">LEAD MANAGEMENT</p>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-medium sm:text-5xl">
              Consultation requests
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              Every website inquiry lands here. Open a request to review the full message and move it through your follow-up pipeline.
            </p>
          </div>
          <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs text-gray-500">
            {inquiries.length} request{inquiries.length === 1 ? "" : "s"}
          </div>
        </div>

        <nav aria-label="Filter inquiries by status" className="mt-7 flex flex-wrap gap-2">
          {[["all", "All inquiries"], ["new", "New"], ["contacted", "Contacted"], ["consultation", "Consultation"], ["booked", "Booked"], ["closed", "Closed"]].map(([value, label]) => (
            <Link key={value} href={value === "all" ? "/admin/inquiries" : "/admin/inquiries?status=" + value} aria-current={selectedStatus === value ? "page" : undefined} className={"border px-4 py-2 text-xs uppercase tracking-[0.1em] transition " + (selectedStatus === value ? "border-[#B68A35] bg-[#B68A35] text-white" : "border-gray-200 bg-white text-gray-600 hover:border-[#B68A35] hover:text-[#8C6824]")}>
              {label}
            </Link>
          ))}
        </nav>

        {loadError ? (
          <div className="mt-8 rounded-[18px] border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {loadError}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="mt-8 rounded-[20px] border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="font-[family-name:var(--font-display)] text-3xl">No inquiries yet.</p>
            <p className="mt-2 text-sm text-gray-500">New consultation requests will appear here.</p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-[20px] border border-gray-200 bg-white">
            <div className="hidden border-b border-gray-100 px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-gray-400 md:grid md:grid-cols-[1.2fr_1fr_1fr_1fr_110px] md:gap-4">
              <span>Client</span><span>Event</span><span>Received</span><span>Status</span><span />
            </div>
            <div className="divide-y divide-gray-100">
              {inquiries.map((inquiry) => (
                <Link
                  key={inquiry._id.toString()}
                  href={`/admin/inquiries/${inquiry._id}`}
                  className="grid gap-3 px-5 py-5 transition hover:bg-[#FBFAF7] md:grid-cols-[1.2fr_1fr_1fr_1fr_110px] md:items-center md:gap-4 md:px-6"
                >
                  <div>
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="mt-1 truncate text-xs text-gray-500">{inquiry.email}</p>
                  </div>
                  <div className="text-sm text-gray-600">{inquiry.eventType}</div>
                  {inquiry.role && <div className="text-xs text-gray-400">{inquiry.role}</div>}
                  <div className="text-xs leading-5 text-gray-500">{formatDate(inquiry.createdAt)}</div>
                  <div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${statusStyles[inquiry.status] || statusStyles.new}`}>
                      {statusLabels[inquiry.status] || inquiry.status}
                    </span>
                  </div>
                  <div className="text-xs uppercase tracking-[0.12em] text-[#B68A35] md:text-right">View →</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
