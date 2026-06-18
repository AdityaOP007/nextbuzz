"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import LoginModal, { useLoginModal } from "@/components/auth/LoginModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const loginModal = useLoginModal();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/");
      return;
    }
    async function load() {
      try {
        const res = await bookingService.getUserBookings();
        if (res.success) setBookings(res.data);
      } catch {
        toast("Failed to load bookings", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, authLoading, router, toast]);

  return (
    <>
      <Navbar
        onSignIn={loginModal.openLogin}
        onProfileEdit={loginModal.openProfile}
        onContact={() => toast("Reach us at hello@nextbuzz.in")}
      />

      <div className="px-[5vw] py-16 max-md:px-4">
        <Link
          href="/"
          className="mb-6 inline-block text-[0.85rem] font-semibold text-[var(--muted)] hover:text-[var(--orange)]"
        >
          ← Back to Home
        </Link>
        <h1 className="font-head mb-2 text-[clamp(2rem,4vw,3rem)] font-black tracking-[-1px]">
          My <em className="not-italic text-[var(--orange)]">Bookings</em>
        </h1>
        <p className="mb-10 text-[var(--muted)]">Your ticket history and upcoming events</p>

        {loading ? (
          <div className="text-[var(--muted)]">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] px-8 py-16 text-center">
            <div className="mb-4 text-[3rem]">🎟️</div>
            <div className="font-head mb-2 text-xl font-bold">No bookings yet</div>
            <p className="mb-6 text-[var(--muted)]">Discover events and book your first ticket!</p>
            <Link href="/" className="btn-primary inline-flex no-underline">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex gap-5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-5 max-md:flex-col"
              >
                {b.event?.imageUrl && (
                  <img
                    src={b.event.imageUrl}
                    alt={b.event.title}
                    className="h-[100px] w-[100px] shrink-0 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="font-head mb-1 text-lg font-bold">
                    {b.event?.title || "Event"}
                  </div>
                  <div className="mb-2 text-[0.82rem] text-[var(--muted)]">
                    {b.event?.venue}, {b.event?.city}
                  </div>
                  <div className="flex flex-wrap gap-4 text-[0.85rem]">
                    <span>
                      🎟️ {b.quantity}× {b.ticketType}
                    </span>
                    <span className="font-semibold text-[var(--gold)]">
                      {formatPrice(b.totalPrice)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-bold ${
                        b.bookingStatus === "confirmed"
                          ? "bg-[rgba(0,201,167,0.15)] text-[var(--teal)]"
                          : "bg-[rgba(255,77,109,0.15)] text-[var(--rose)]"
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </div>
                </div>
                <div className="text-right text-[0.78rem] text-[var(--muted)]">
                  {new Date(b.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <CartDrawer />
      <LoginModal open={loginModal.open} mode={loginModal.mode} onClose={loginModal.close} />
    </>
  );
}
