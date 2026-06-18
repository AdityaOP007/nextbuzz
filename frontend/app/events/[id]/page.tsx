"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import LoginModal, { useLoginModal } from "@/components/auth/LoginModal";
import dynamic from "next/dynamic";
import BookingModal from "@/components/booking/BookingModal";
import { eventService } from "@/services/event.service";
import { Event, FALLBACK_IMAGES } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

const EventMap = dynamic(() => import("@/components/events/EventMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-[14px] border border-[var(--border)] bg-[var(--bg3)] text-[var(--muted)]">
      Loading map...
    </div>
  ),
});

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const loginModal = useLoginModal();
  const [event, setEvent] = useState<Event | null>(null);
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await eventService.getEventById(params.id as string);
        if (res.success) setEvent(res.data);
        else router.push("/");
      } catch {
        toast("Event not found", "error");
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) load();
  }, [params.id, router, toast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--muted)]">
        Loading event...
      </div>
    );
  }

  if (!event) return null;

  const sold = event.sold || event.availableSeats <= 0;
  const tagClass = `tag-${event.category.toLowerCase()}`;

  return (
    <>
      <Navbar
        onSignIn={loginModal.openLogin}
        onProfileEdit={loginModal.openProfile}
        onContact={() => toast("Reach us at hello@nextbuzz.in")}
      />

      <div className="relative h-[360px] overflow-hidden">
        <img
          src={event.imageUrl || event.img || ""}
          alt={event.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              FALLBACK_IMAGES[event.category] || "";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[rgba(17,10,0,0.5)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-[5vw] pb-10 max-md:px-4">
          <Link
            href="/"
            className="mb-4 inline-block text-[0.85rem] font-semibold text-[var(--muted)] hover:text-[var(--orange)]"
          >
            ← Back to Events
          </Link>
          <span
            className={`tag mb-3 inline-block rounded-full px-3 py-1 text-[0.7rem] font-extrabold uppercase ${tagClass}`}
          >
            {event.category}
          </span>
          <h1 className="font-head text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight tracking-[-1px]">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] grid-cols-[1fr_380px] gap-10 px-[5vw] py-12 max-lg:grid-cols-1 max-md:px-4">
        <div>
          <div className="mb-8 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[0.9rem] text-[var(--muted)]">
              📅 <strong className="text-[var(--white)]">{event.date} · {event.time}</strong>
            </div>
            <div className="flex items-center gap-2 text-[0.9rem] text-[var(--muted)]">
              📍 <strong className="text-[var(--white)]">{event.venue}, {event.city}</strong>
            </div>
            <div className="flex items-center gap-2 text-[0.9rem] text-[var(--muted)]">
              🎟️ <strong className="text-[var(--white)]">{event.availableSeats} seats remaining</strong>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="font-head mb-4 text-[1.5rem] font-black">About This Event</h2>
            <p className="text-[0.95rem] leading-[1.8] text-[var(--muted)]">
              {event.description ||
                "Join us for an unforgettable experience. Book your tickets now before they sell out!"}
            </p>
          </div>

          {event.latitude && event.longitude && (
            <div>
              <h2 className="font-head mb-4 text-[1.5rem] font-black">
                Route to <em className="not-italic text-[var(--orange)]">Venue</em>
              </h2>
              <p className="mb-4 text-[0.85rem] text-[var(--muted)]">
                Allow location access to see directions from your current location.
              </p>
              <EventMap
                latitude={event.latitude}
                longitude={event.longitude}
                venue={event.venue}
              />
            </div>
          )}
        </div>

        <div className="h-fit rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-7">
          <div className="font-head mb-1 text-[2rem] font-black text-[var(--gold)]">
            {formatPrice(event.price)}
          </div>
          <p className="mb-6 text-[0.82rem] text-[var(--muted)]">+ ₹49 convenience fee</p>
          {sold ? (
            <button
              disabled
              className="btn-full cursor-not-allowed opacity-60"
            >
              Sold Out
            </button>
          ) : (
            <button className="btn-full" onClick={() => setBookingEvent(event)}>
              🎟️ Book Tickets
            </button>
          )}
          <div className="mt-6 space-y-2 border-t border-[var(--border)] pt-6 text-[0.85rem] text-[var(--muted)]">
            <div className="flex justify-between">
              <span>Category</span>
              <span className="font-semibold text-[var(--white)]">{event.category}</span>
            </div>
            <div className="flex justify-between">
              <span>City</span>
              <span className="font-semibold text-[var(--white)]">{event.city}</span>
            </div>
            <div className="flex justify-between">
              <span>Capacity</span>
              <span className="font-semibold text-[var(--white)]">{event.capacity}</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <CartDrawer />
      <LoginModal open={loginModal.open} mode={loginModal.mode} onClose={loginModal.close} />
      <BookingModal
        event={bookingEvent}
        open={!!bookingEvent}
        onClose={() => setBookingEvent(null)}
      />
    </>
  );
}
