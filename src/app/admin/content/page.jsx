import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../../lib/admin-auth";
import { getSiteContent } from "../../../lib/site-content";
import ContentEditor from "./editor";

export default async function AdminContentPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#211d19]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs uppercase tracking-[0.14em] text-gray-400 hover:text-[#B68A35]">
              ← Dashboard
            </Link>
            <div className="hidden h-5 w-px bg-gray-200 sm:block" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#B68A35]">Sterling Bloom</p>
              <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-medium">Website Content</h1>
            </div>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="rounded-[10px] border border-gray-200 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-gray-600 hover:border-[#B68A35] hover:text-[#B68A35]">
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1800px] px-4 py-8 sm:px-6 sm:py-12 xl:px-8">
        <div className="mb-8">
          <p className="eyebrow">CMS</p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-medium sm:text-5xl">
            Edit the website without code.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Update headings, descriptions, services, portfolio entries, investment,
            client stories, contact details, and footer content from one place.
            Media uploads and visual positioning will be added through the Media Library next.
          </p>
        </div>

        <ContentEditor initialContent={content} />
      </div>
    </main>
  );
}
