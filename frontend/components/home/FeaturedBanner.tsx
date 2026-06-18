"use client";

import { Event } from "@/types";
import { formatPrice } from "@/lib/utils";

interface FeaturedBannerProps {
  event: Event | null;
  onBook: (event: Event) => void;
}

export default function FeaturedBanner({ event, onBook }: FeaturedBannerProps) {
  if (!event) return null;

  const dateParts = event.date.replace(",", "").split(" ");
  const day = dateParts[1] || "30";
  const month = (dateParts[2] || "MAY").slice(0, 3).toUpperCase();

  return (
    <div className="relative mx-[5vw] mb-[60px] flex items-center gap-12 overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#2a1200] via-[#1e0d00] to-[#0d1a1a] p-12 max-md:mx-4 max-md:mb-10 max-md:flex-col max-md:p-7">
      <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] bg-[radial-gradient(circle,rgba(255,107,53,0.18)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-[-60px] left-[200px] h-[300px] w-[300px] bg-[radial-gradient(circle,rgba(0,201,167,0.1)_0%,transparent_70%)]" />

      <div className="relative z-[1] flex-1">
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,187,51,0.3)] bg-[rgba(255,187,51,0.15)] px-3.5 py-1 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[var(--gold)]">
          ⭐ This Weekend&apos;s Pick
        </div>
        <h2 className="font-head mb-3.5 text-[clamp(1.8rem,3.5vw,3rem)] font-black leading-[1.1] tracking-[-1.5px]">
          {event.title.split(" ").slice(0, -2).join(" ")}{" "}
          <span className="italic text-[var(--orange)]">
            {event.title.split(" ").slice(-2).join(" ")}
          </span>
        </h2>
        <p className="mb-7 max-w-[420px] text-[0.95rem] leading-[1.7] text-[var(--muted)]">
          {event.description ||
            "Don't miss this incredible event — book your tickets now!"}
        </p>
        <button className="btn-primary" onClick={() => onBook(event)}>
          🎟️ Book Tickets — {formatPrice(event.price)}
        </button>
      </div>

      <div className="relative z-[1] h-[280px] w-[280px] shrink-0 max-md:h-[200px] max-md:w-full">
        <img
          className="h-full w-full rounded-[20px] border-[3px] border-[rgba(255,107,53,0.3)] object-cover"
          src={event.imageUrl || event.img || ""}
          alt={event.title}
        />
        <div className="absolute -right-3 -top-3 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[var(--gold)] font-head text-[1.4rem] font-black leading-[1.1] text-[var(--bg)]">
          {day}
          <small className="text-[0.55rem] font-extrabold tracking-[0.05em]">
            {month}
          </small>
        </div>
      </div>
    </div>
  );
}
