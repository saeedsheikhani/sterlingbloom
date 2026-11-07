import Hero from "./components/hero";
import About from "./components/about";
import Services from "./components/services";
import Gallery from "./components/gallery";
import Process from "./components/process";
import Investment from "./components/investment";
import Testimonials from "./components/testimonials";
import Contact from "./components/contact";
import ScrollReveal from "./components/scroll-reveal";
import FAQ from "./components/faq";
import { getSiteContent } from "../lib/site-content";
import connectDB from "../lib/mongodb";
import Review from "../models/Review";

// Website content is editable in the admin panel and must be read from MongoDB per request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();
  let approvedReviews = [];
  try {
    await connectDB();
    approvedReviews = await Review.find({ status: "approved" }).select("name event review").sort({ createdAt: -1 }).limit(12).lean();
  } catch (error) {
    console.error("Approved reviews load failed:", error);
  }
  const visible = (key) => content.visibility?.[key] !== false;

  return (
    <main id="main-content" tabIndex={-1}>
      <ScrollReveal />
      {visible("hero") && <Hero content={content.hero} />}
      {visible("about") && <About content={content.about} />}
      {visible("services") && <Services content={content.services} />}
      {visible("gallery") && <Gallery content={content.gallery} />}
      {visible("process") && <Process content={content.process} />}
      {visible("investment") && <Investment content={content.investment} />}
      {visible("testimonials") && <Testimonials content={content.testimonials} approvedReviews={approvedReviews} />}
      {visible("faq") && <FAQ content={content.faq} />}
      {visible("contact") && <Contact content={content.contact} />}
    </main>
  );
}
