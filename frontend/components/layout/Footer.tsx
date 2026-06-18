export default function Footer() {
  return (
    <footer className="mt-10 border-t border-[var(--border)] bg-[var(--bg2)] px-[5vw] pb-8 pt-[60px]">
      <div className="mb-12 grid grid-cols-[2fr_1fr_1fr_1fr] gap-12 max-md:grid-cols-2 max-md:gap-8">
        <div>
          <div className="logo text-[1.4rem]">
            Next<span>Buzz</span>
          </div>
          <p className="mt-3.5 max-w-[260px] text-[0.88rem] leading-[1.7] text-[var(--muted)]">
            Discover the best events near you. Book tickets in seconds. Make memories
            that last forever.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-[0.85rem] font-extrabold tracking-[0.05em] text-[var(--white)]">
            Discover
          </h4>
          {["Concerts", "Festivals", "Workshops", "Comedy Shows"].map((l) => (
            <a
              key={l}
              href="#"
              className="mb-2.5 block text-[0.85rem] text-[var(--muted)] no-underline transition-colors hover:text-[var(--orange)]"
            >
              {l}
            </a>
          ))}
        </div>
        <div>
          <h4 className="mb-4 text-[0.85rem] font-extrabold tracking-[0.05em] text-[var(--white)]">
            Cities
          </h4>
          {["Bengaluru", "Mumbai", "Delhi", "Hyderabad"].map((l) => (
            <a
              key={l}
              href="#"
              className="mb-2.5 block text-[0.85rem] text-[var(--muted)] no-underline transition-colors hover:text-[var(--orange)]"
            >
              {l}
            </a>
          ))}
        </div>
        <div>
          <h4 className="mb-4 text-[0.85rem] font-extrabold tracking-[0.05em] text-[var(--white)]">
            Company
          </h4>
          {["About Us", "Careers", "Privacy", "Terms"].map((l) => (
            <a
              key={l}
              href="#"
              className="mb-2.5 block text-[0.85rem] text-[var(--muted)] no-underline transition-colors hover:text-[var(--orange)]"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--border)] pt-7 text-[0.82rem] text-[var(--muted)]">
        <span>© 2025 NextBuzz · Made with ❤️ in India</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}
