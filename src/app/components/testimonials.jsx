const GOOGLE_DEFAULTS = {
  googleRating: "5.0",
  googleLinkText: "Read Our Reviews on Google",
  googleUrl: "https://share.google/rmH7zZms0fO6ToQA5",
  googleReviewText: "Leave Us a Google Review",
};

export default function Testimonials({ content, approvedReviews = [] }) {
  const displayItems = approvedReviews.map((review) => ({ name: review.name, event: review.event, review: review.review, approved: true }));
  // Only show the section once there are at least 2 approved reviews.
  if (displayItems.length < 2) return null;

  const googleRating = content?.googleRating || GOOGLE_DEFAULTS.googleRating;
  const googleLinkText = content?.googleLinkText || GOOGLE_DEFAULTS.googleLinkText;
  const googleUrl = content?.googleUrl || GOOGLE_DEFAULTS.googleUrl;
  const googleReviewText = content?.googleReviewText || GOOGLE_DEFAULTS.googleReviewText;

  return (
    <section data-reveal id="testimonials" className="bg-[#F8F7F4] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="eyebrow">{content?.eyebrow}</p>
          <div className="mx-auto mt-5 h-px w-16 bg-[#B68A35]" />
          <h2 className="section-heading mx-auto mt-7 max-w-4xl">{content?.heading}</h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">{content?.description}</p>
          <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <p className="sb-google-rating text-sm font-medium tracking-[0.06em]">
              {googleRating} <span aria-hidden="true">★</span><span className="sr-only">stars</span> on Google
            </p>
            <span className="hidden h-4 w-px bg-current opacity-30 sm:block" aria-hidden="true" />
            <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="sb-google-link text-xs font-medium uppercase tracking-[0.16em] underline decoration-[#B68A35]/60 underline-offset-4 transition hover:decoration-[#D6B56D]">
              {googleLinkText}
            </a>
          </div>
        </div>

        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-12 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {displayItems.map((testimonial, index) => (
            <article key={testimonial.name + index} className={"relative flex h-[48svh] max-h-[390px] min-h-[270px] w-[84vw] max-w-[360px] shrink-0 snap-center flex-col overflow-hidden rounded-[22px] border bg-white p-6 sm:p-8 lg:h-auto lg:min-h-0 lg:w-auto lg:max-w-none lg:shrink lg:p-10 " + (index === 1 ? "border-[#D6B56D] shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:-translate-y-2" : "border-gray-200")}>
              <span className="absolute right-7 top-5 font-[family-name:var(--font-display)] text-7xl font-light leading-none text-[#D6B56D]/25" aria-hidden="true">“</span>
              <div className="relative z-10 flex items-center justify-between gap-4">
                <span className="text-xs tracking-[0.25em] text-[#B68A35]" aria-label="5 out of 5 stars">★★★★★</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">{testimonial.approved ? "Verified Client" : content?.label}</span>
              </div>
              <p className="relative z-10 mt-5 line-clamp-6 flex-1 overflow-hidden font-[family-name:var(--font-display)] text-lg leading-7 text-gray-700 sm:mt-7 sm:text-2xl sm:leading-8">“{testimonial.review}”</p>
              <div className="mt-8 flex items-end justify-between gap-4 border-t border-gray-100 pt-5">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{testimonial.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#B68A35]">{testimonial.event}</p>
                </div>
                <span className="font-[family-name:var(--font-display)] text-2xl text-[#D6B56D]/50">0{index + 1}</span>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-2 text-center text-[10px] uppercase tracking-[0.18em] text-gray-400 md:hidden">Swipe to explore reviews</p>


        <p className="mt-8 text-center">
          <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="sb-google-review-link inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] underline decoration-[#B68A35]/60 underline-offset-4 transition hover:decoration-[#D6B56D]">
            <span aria-hidden="true">★</span> {googleReviewText}
          </a>
        </p>
      </div>
    </section>
  );
}
