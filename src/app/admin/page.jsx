import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../lib/admin-auth";
import connectDB from "../../lib/mongodb";
import Inquiry from "../../models/Inquiry";
import Review from "../../models/Review";

const modules = [
  {
    title: "Inquiries",
    description: "Review consultation requests, contact details, event types, and follow-up status.",
    status: "Live",
    href: "/admin/inquiries",
  },
  {
    title: "Website Content",
    description: "Edit headings, copy, services, portfolio entries, investment, testimonials, and contact content without code.",
    status: "Live",
    href: "/admin/content",
  },
  {
    title: "Customer Reviews",
    description: "Review customer submissions, approve verified feedback, and publish it to the website.",
    status: "Live",
    href: "/admin/reviews",
  },
  {
    title: "Media Library",
    description: "Upload and organize Cloudinary images and videos for the website.",
    status: "Live",
    href: "/admin/media",
  },
  {
    title: "Events & Clients",
    description: "Organize client contacts, event dates, venues, budgets, notes, and booking status.",
    status: "Live",
    href: "/admin/events-clients",
  },
];

export default async function AdminDashboard() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  let newInquiries = 0;
  let totalInquiries = 0;
  let pendingReviews = 0;

  try {
    await connectDB();
    [newInquiries, totalInquiries, pendingReviews] = await Promise.all([
      Inquiry.countDocuments({ status: "new" }),
      Inquiry.countDocuments(),
      Review.countDocuments({ status: "pending" }),
    ]);
  } catch (error) {
    console.error("Admin dashboard stats failed:", error);
  }

  const stats = [
    { label: "New inquiries", value: String(newInquiries), note: "Awaiting follow-up" },
    { label: "Total inquiries", value: String(totalInquiries), note: "All website requests" },
    { label: "Portfolio items", value: "—", note: "Cloudinary connection next" },
    { label: "Pending reviews", value: String(pendingReviews), note: "Awaiting approval" },
  ];

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#211d19]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#B68A35]">
              Sterling Bloom
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-medium">
              Admin Portal
            </h1>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="rounded-[10px] border border-gray-200 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-gray-600 transition hover:border-[#B68A35] hover:text-[#B68A35]">
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div>
          <p className="eyebrow">DASHBOARD</p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-medium sm:text-5xl">
            Your event business, in one place.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Manage website leads today, then progressively take control of portfolio,
            events, clients, and every piece of public content from here.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-[18px] border border-gray-200 bg-white p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400">{stat.label}</p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[#B68A35]">{stat.value}</p>
              <p className="mt-2 text-xs leading-5 text-gray-400">{stat.note}</p>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#B68A35]">WORKSPACE</p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-medium">Management Modules</h3>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {modules.map((module) => (
              <article key={module.title} className="rounded-[20px] border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-[family-name:var(--font-display)] text-2xl font-medium">{module.title}</h4>
                  <span className="rounded-full border border-[#D6B56D] px-3 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-[#B68A35]">{module.status}</span>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">{module.description}</p>
                {module.href && (
                  <Link href={module.href} className="mt-5 inline-flex text-xs font-medium uppercase tracking-[0.14em] text-[#B68A35] hover:text-[#8C6824]">
                    Open {module.title} →
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
