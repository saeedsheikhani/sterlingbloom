import Link from "next/link";

export default function About({ content }) {
  return (
    <section data-reveal id="about" className="about-section bg-[#F8F7F4] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 sm:gap-12 sm:px-8 lg:grid-cols-[0.78fr_1fr] lg:gap-16 lg:px-10 xl:gap-20">
        <div className="group relative h-[360px] overflow-hidden rounded-[20px] shadow-xl shadow-black/10 sm:h-[460px] lg:h-[540px] xl:h-[570px]">
          {content.image ? (
            <img
              src={content.image}
              alt="Luxury wedding decor by Sterling Bloom"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#F1EEE8] px-6 text-center text-sm text-gray-500">
              Choose an image for this section in Admin → Website Content.
            </div>
          )}
        </div>

        <div className="lg:py-8 xl:py-10">
          <p className="eyebrow">{content.eyebrow}</p>
          <div className="mb-6 mt-4 h-px w-14 bg-[#C9A96E] sm:mb-7 sm:mt-5" />

          <h2 className="section-heading max-w-xl">
            {content.before}{" "}
            <span className="about-highlight">{content.highlight}</span>{" "}
            {content.after}
          </h2>

          <p className="section-copy mt-5 max-w-xl sm:mt-6">
            {content.description}
          </p>

          <ul className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
            {content.features.map((feature, index) => (
              <li
                key={index}
                className="about-feature flex items-start gap-3 text-base text-gray-800 sm:text-lg"
              >
                <span className="mt-0.5 text-[#C9A96E]" aria-hidden="true">
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 sm:mt-9">
            <Link href="#portfolio" className="btn-primary">
              {content.button}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
