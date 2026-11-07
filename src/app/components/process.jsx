export default function Process({ content }) {
  const steps = content.steps || [];

  return (
    <section data-reveal id="process" className="bg-[#F8F7F4] py-14 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="eyebrow">{content.eyebrow}</p>
          <div className="mx-auto mt-5 h-px w-16 bg-[#B68A35]" />
          <h2 className="section-heading mx-auto mt-7 max-w-3xl">{content.heading}</h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">{content.description}</p>
        </div>

        {/* Phones and tablets: vertical timeline, circles on the left joined by a thin gold line. */}
        <ol className="mx-auto mt-10 max-w-xl space-y-6 lg:hidden">
          {steps.map((step, index) => (
            <li key={step.number || index} className="relative flex gap-4">
              {index < steps.length - 1 && (
                <span aria-hidden="true" className="sb-process-line absolute -bottom-6 left-5 top-10 w-px -translate-x-1/2" />
              )}
              <div className="sb-process-circle relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D6B56D] text-sm text-[#B68A35]">
                {index + 1}
              </div>
              <div className="pt-1.5 text-left">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-medium leading-tight text-[#211d19]">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-gray-500">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Computers: horizontal timeline, circles joined by a thin gold line. */}
        <div className="relative mt-12 hidden lg:block">
          <span aria-hidden="true" className="sb-process-line absolute top-7 h-px" style={{ left: `${50 / Math.max(steps.length, 1)}%`, right: `${50 / Math.max(steps.length, 1)}%` }} />
          <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(steps.length, 1)}, minmax(0, 1fr))` }}>
            {steps.map((step, index) => (
              <li key={step.number || index} className="group relative px-3 text-center">
                <div className="sb-process-circle relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D6B56D] text-sm text-[#B68A35]">
                  {index + 1}
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-medium leading-tight text-[#211d19]">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-[220px] text-sm leading-6 text-gray-500">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
