import connectDB from "./mongodb";
import SiteContent from "../models/SiteContent";
import { DEFAULT_PORTFOLIO_TABS } from "./portfolio-tabs";
import { INVESTMENT_DEFAULTS } from "./investment-defaults";

export const defaultSiteContent = {
  visibility: {
    hero: true, about: true, services: true, gallery: true, process: true,
    investment: true, testimonials: true,
    contact: true, nav: true, footer: true, faq: true,
  },
  nav: {
    brand: "Sterling Bloom",
    logo: "/images/sterling-bloom-logo.svg",
    links: [
      ["About", "#about"],
      ["Services", "#services"],
      ["Portfolio", "#portfolio"],
      ["Process", "#process"],
      ["Investment", "#investment"],
      ["Testimonials", "#testimonials"],
    ],
    cta: "Book Consultation",
    ctaHref: "https://calendly.com/sumaiya-sterlingbloomdecor/30min",
    logoSettings: {
      visible: true,
      mobileSize: 76,
      desktopSize: 88,
      borderRadius: 0,
      borderEnabled: true,
      borderColor: "#B68A35",
      borderWidth: 1,
      background: "#F8F7F4",
      backgroundEnabled: true,
      shadowEnabled: true,
    },
  },
  design: {
    theme: "light",
    colors: {
      background: "#F8F7F4",
      surface: "#FFFFFF",
      text: "#211D19",
      mutedText: "#66615B",
      accent: "#B68A35",
      accentLight: "#D6B56D",
      dark: "#1D1813",
    },
    layout: { contentWidth: 1280, sectionSpacing: 56, cardRadius: 20, cardPadding: 24 },
  },
  hero: {
    eyebrow: "✨ Luxury Event Decor",
    before: "Creating ",
    highlight: "Meaningful Celebrations",
    after: " With Intentional Design",
    description: "Custom event design and decor for weddings, corporate events, and private celebrations—thoughtfully styled to feel unforgettable.",
    primaryButton: "Book a Consultation",
    primaryButtonHref: "https://calendly.com/sumaiya-sterlingbloomdecor/30min",
    secondaryButton: "View Our Work",
    secondaryButtonHref: "#portfolio",
    backgroundImage: "/images/about.jpg",
    video: "/videos/hero.mp4",
    mobileVideo: "https://res.cloudinary.com/xuv4gqwa/video/upload/v1794070444/sterling-bloom/bi5eczuoemda9ihrvuuh.mp4",
  },
  about: {
    eyebrow: "ABOUT STERLING BLOOM",
    before: "Designing",
    highlight: "Exceptional Experiences",
    after: "For Every Occasion",
    description: "At Sterling Bloom Decor, we transform weddings, corporate events, and private celebrations into timeless experiences through elegant styling, thoughtful design, and meticulous attention to detail.",
    features: ["Luxury Wedding Decor", "Corporate Event Styling", "Private Celebrations"],
    button: "Start Your Event",
    image: "/images/about.jpg",
  },
  services: {
    eyebrow: "OUR SERVICES",
    heading: "Designed For Every Occasion",
    description: "Thoughtful design, refined styling, and seamless execution for celebrations that feel distinctly yours.",
    items: [
      { id: 1, title: "Luxury Weddings", description: "Elegant wedding décor crafted to create timeless memories with premium floral arrangements and bespoke styling.", image: "/images/services/wedding.jpg" },
      { id: 2, title: "Nikah Ceremonies", description: "Graceful and sophisticated Nikah setups designed with tradition and modern elegance.", image: "/images/services/nikah.jpg" },
      { id: 3, title: "Mehndi Events", description: "Colorful and vibrant Mehndi celebrations featuring immersive themes and artistic décor.", image: "/images/services/mehndi.jpg" },
      { id: 4, title: "Corporate Events", description: "Professional event styling that reflects your brand while creating memorable experiences.", image: "/images/services/corporate.jpg" },
    ],
    featuredLabel: "FEATURED SERVICE",
    button: "Discuss This Service",
  },
  gallery: {
    eyebrow: "FEATURED WORK",
    heading: "A Glimpse of Our Creations",
    description: "A selection of celebrations shaped through thoughtful styling, considered details, and a distinct sense of place.",
    tabs: DEFAULT_PORTFOLIO_TABS,
    items: [
      { id: 1, title: "Elegant Wedding", category: "weddings", image: "/images/gallery/wedding-1.jpg" },
      { id: 2, title: "Floral Wedding", category: "weddings", image: "/images/gallery/wedding-2.jpg" },
      { id: 3, title: "Nikah Celebration", category: "nikah-mehndi", image: "/images/gallery/nikah-1.jpg" },
      { id: 4, title: "Mehndi Celebration", category: "nikah-mehndi", image: "/images/gallery/mehndi-1.jpg" },
      { id: 5, title: "Corporate Event", category: "corporate", image: "/images/gallery/corporate-1.jpg" },
      { id: 6, title: "Luxury Reception", category: "weddings", image: "/images/gallery/wedding-3.jpg" },
    ],
    note: "More celebrations, details, and event stories coming soon.",
  },
  process: {
    eyebrow: "OUR PROCESS",
    heading: "From Concept to Celebration",
    description: "From the first conversation to the final detail, we carefully transform your vision into a memorable celebration.",
    steps: [
      { number: "01", title: "Consultation", description: "We listen to your ideas, understand your vision, and discover what makes your celebration unique." },
      { number: "02", title: "Concept & Moodboard", description: "We turn your ideas into a refined visual direction that brings your celebration to life." },
      { number: "03", title: "Planning", description: "We plan every detail with precision, from styling and florals to layout and execution." },
      { number: "04", title: "Installation", description: "Our team transforms the venue with careful attention to every design element." },
      { number: "05", title: "Celebrate", description: "Everything comes together beautifully, leaving you free to enjoy your special occasion.",
      },
    ],
  },
  investment: INVESTMENT_DEFAULTS,

  faq: {
    eyebrow: "GOOD TO KNOW",
    heading: "Frequently Asked Questions",
    description: "A few helpful details before we start planning your celebration.",
    items: [
      { question: "What events does Sterling Bloom design?", answer: "We design weddings, Nikah and Mehndi celebrations, corporate events, and private occasions. Each concept is tailored to your event and venue." },
      { question: "How do we get started?", answer: "Send us an inquiry with your event type, date, venue, guest count, and ideas. We will follow up to discuss availability and the next steps." },
      { question: "Do you offer custom packages?", answer: "Yes. Styling, florals, decor, and planning support can be tailored to the scale, priorities, and creative direction of your celebration." },
      { question: "How is pricing determined?", answer: "Pricing depends on the event date, venue, guest count, design scope, and selected details. Contact us for a proposal based on your needs." },
      { question: "How far in advance should we book?", answer: "As early as possible is best, especially for popular dates. Share your date with us and we can discuss availability." },
    ],
  },
  testimonials: {
    eyebrow: "TESTIMONIALS",
    heading: "Kind Words From Our Clients",
    description: "Every celebration is personal. Here is what some of our clients have shared about their experience with Sterling Bloom.",
    items: [
      { name: "Ayesha & Hamza", event: "Wedding", review: "Sterling Bloom turned our wedding vision into something even more beautiful than we imagined. Every detail felt thoughtful and perfectly executed." },
      { name: "Sarah Khan", event: "Nikah Ceremony", review: "The attention to detail and creativity were incredible. Our Nikah setup felt elegant, intimate, and completely personal to us." },
      { name: "Hassan Malik", event: "Corporate Event", review: "Professional from start to finish. The team understood our requirements and transformed the venue into a beautiful experience for our guests." },
    ],
    label: "Client Story",
    note: "Client stories shown here are sample presentation content and should be replaced with verified feedback before launch.",
    googleRating: "5.0",
    googleLinkText: "Read Our Reviews on Google",
    googleUrl: "https://share.google/rmH7zZms0fO6ToQA5",
    googleReviewText: "Leave Us a Google Review",
  },


  contact: {
    eyebrow: "LET'S CREATE TOGETHER",
    heading: "Let's Create Something",
    highlight: "Beautiful Together",
    description: "Tell us about your event, your vision, and the experience you want to create. Our team would love to help bring it to life.",
    phone: "+1 (647) 544-5681",
    email: "sumaiya@sterlingbloomdecor.com",
    location: "Greater Toronto Area, Ontario",
    hours: "Tuesday to Sunday, 9:00 AM to 6:00 PM · Monday Off",
    backgroundImage: "/images/about.jpg",
    note: "Final details, availability, and pricing are discussed during your consultation.",
    formEyebrow: "INQUIRY FORM",
    formHeading: "Start Your Celebration",
    formDescription: "Share a few details and we will get back to you about your event.",
    formButton: "Request Consultation",
    formFootnote: "We’ll review your inquiry and follow up with next steps.",
  },
  footer: {
    logo: "/images/sterling-bloom-logo.svg",
    heading: "Beautifully considered.",
    highlight: "Meaningfully remembered.",
    instagram: "@sterlingbloomdecor",
    instagramHref: "https://www.instagram.com/sterlingbloomdecor",
    facebook: "Facebook",
    facebookHref: "",
    contactLabel: "Contact",
    exploreLabel: "Explore",
    closing: "Designed with intention.",
  },
};

function mergeContent(defaults, saved) {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return defaults;
  return Object.fromEntries(
    Object.entries(defaults).map(([key, defaultValue]) => {
      const savedValue = saved[key];
      if (defaultValue && typeof defaultValue === "object" && !Array.isArray(defaultValue)) return [key, mergeContent(defaultValue, savedValue)];
      return [key, savedValue === undefined ? defaultValue : savedValue];
    }),
  );
}

export async function getSiteContent() {
  try {
    await connectDB();
    const record = await SiteContent.findOne({ key: "main" }).lean();
    return mergeContent(defaultSiteContent, record?.content);
  } catch (error) {
    console.error("Site content load failed:", error);
    return defaultSiteContent;
  }
}
