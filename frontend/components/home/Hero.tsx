"use client";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-[5vw] pb-[60px] pt-20 max-md:px-4 max-md:pb-10 max-md:pt-[50px]">
      <div className="pointer-events-none absolute -top-[200px] left-1/2 h-[800px] w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(255,107,53,0.15)_0%,transparent_70%)]" />
      <div className="relative z-[1] max-w-[700px]">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(255,187,51,0.3)] bg-[rgba(255,187,51,0.12)] px-4 py-1.5 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[var(--gold)] before:content-['🎉']">
          🇮🇳 Events across India
        </div>
        <h1 className="font-head mb-5 text-[clamp(2.8rem,6vw,5rem)] font-black leading-[1.05] tracking-[-2px]">
          Life&apos;s Too Short for
          <br />
          <em className="bg-gradient-to-br from-[var(--gold)] via-[var(--orange)] to-[var(--rose)] bg-clip-text not-italic text-transparent">
            Boring Weekends
          </em>
        </h1>
        <p className="mb-9 max-w-[480px] text-[1.05rem] leading-[1.7] text-[var(--muted)]">
          Discover concerts, food festivals, workshops, comedy nights & more — book in
          seconds, experience forever.
        </p>
        <div className="flex flex-wrap items-center gap-3.5">
          <button
            className="btn-primary"
            onClick={() =>
              document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            🎟️ Browse Events
          </button>
          <button className="btn-ghost">How it works ↓</button>
        </div>
        <div className="mt-14 flex gap-10 border-t border-[var(--border)] pt-8 max-md:gap-6">
          <div>
            <strong className="font-head block text-[2rem] font-black text-[var(--gold)]">
              200+
            </strong>
            <span className="text-[0.8rem] font-semibold text-[var(--muted)]">
              Live Events
            </span>
          </div>
          <div>
            <strong className="font-head block text-[2rem] font-black text-[var(--gold)]">
              50K+
            </strong>
            <span className="text-[0.8rem] font-semibold text-[var(--muted)]">
              Happy Attendees
            </span>
          </div>
          <div>
            <strong className="font-head block text-[2rem] font-black text-[var(--gold)]">
              30+
            </strong>
            <span className="text-[0.8rem] font-semibold text-[var(--muted)]">
              Cities
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
