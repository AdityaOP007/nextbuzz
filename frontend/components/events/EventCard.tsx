"use client";

import Link from "next/link";
import { Event, AVATAR_COLORS, FALLBACK_IMAGES } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";

interface EventCardProps {
  event: Event;
  onBook: (event: Event) => void;
}

export default function EventCard({ event, onBook }: EventCardProps) {
  const { isInCart, toggleCartItem } = useCart();
  const { toast } = useToast();
  const inCart = isInCart(event.id);
  const sold = event.sold || event.availableSeats <= 0;
  const tagClass = `tag-${event.category.toLowerCase()}`;
  const img = event.imageUrl || event.img || "";
  const fallback = FALLBACK_IMAGES[event.category] || img;
  const attendees = event.attendees || ["A", "S", "R"];

  return (
    <div className="group relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] transition-all hover:-translate-y-1.5 hover:border-[rgba(255,107,53,0.35)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
      <div
        className="relative h-[200px] cursor-pointer overflow-hidden"
        onClick={() => onBook(event)}
      >
        <img
          className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
          src={img}
          alt={event.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallback;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,10,0,0.85)] via-transparent to-transparent" />
        <div className="absolute left-3.5 top-3.5 flex gap-1.5">
          <span
            className={`tag rounded-full px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.05em] ${tagClass}`}
          >
            {event.category}
          </span>
        </div>
        {sold && (
          <span className="absolute right-3.5 top-3.5 rounded-md bg-[var(--rose)] px-2.5 py-1 text-[0.65rem] font-extrabold tracking-[0.05em] text-white">
            SOLD OUT
          </span>
        )}
        <div className="absolute bottom-3.5 right-3.5">
          <div className="font-head text-[1.3rem] font-black text-[var(--gold)] [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
            {formatPrice(event.price)}
          </div>
        </div>
      </div>
      <div className="p-[18px]">
        <Link
          href={`/events/${event.id}`}
          className="font-head mb-2 block text-[1.15rem] font-bold leading-[1.3] transition-colors hover:text-[var(--orange)]"
        >
          {event.title}
        </Link>
        <div className="mb-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[0.82rem] font-medium text-[var(--muted)]">
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="shrink-0 opacity-70"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {event.date} · {event.time}
          </div>
          <div className="flex items-center gap-1.5 text-[0.82rem] font-medium text-[var(--muted)]">
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="shrink-0 opacity-70"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.venue}
          </div>
        </div>
        <div className="relative z-[2] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[0.78rem] text-[var(--muted)]">
            <div className="flex">
              {attendees.map((a, i) => (
                <div
                  key={i}
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-[var(--card)] text-[0.6rem] font-extrabold text-white first:ml-0"
                  style={{
                    background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    marginLeft: i > 0 ? -8 : 0,
                  }}
                >
                  {a}
                </div>
              ))}
            </div>
            <span>+{attendees.length * 23} going</span>
          </div>
          <button
            className={`btn-book ${inCart ? "added" : ""}`}
            onClick={async (e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!sold) {
                try {
                  await toggleCartItem(event);
                } catch (error: unknown) {
                  const err = error as { response?: { data?: { error?: string } } };
                  toast(err.response?.data?.error || "Failed to update cart", "error");
                }
              }
            }}
            disabled={sold}
          >
            {inCart ? "✓ Added" : sold ? "Sold Out" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
