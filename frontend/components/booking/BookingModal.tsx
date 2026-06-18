"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Event, TicketType, CONVENIENCE_FEE } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { bookingService } from "@/services/booking.service";
import { formatPrice, generateTicketId } from "@/lib/utils";

const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  quantity: z.coerce.number().min(1).max(5),
  ticketType: z.enum(["General Admission", "VIP", "Early Bird"]),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

export default function BookingModal({ event, open, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState<{
    ticketId: string;
    total: string;
    name: string;
    email: string;
    phone: string;
    qty: number;
    type: string;
  } | null>(null);

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      quantity: 1,
      ticketType: "General Admission",
    },
  });

  const qty = form.watch("quantity") || 1;

  useEffect(() => {
    if (event && open) {
      setStep(1);
      setTicketData(null);
      form.reset({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        quantity: 1,
        ticketType: "General Admission",
      });
    }
  }, [event, open, user, form]);

  if (!open || !event) return null;

  const calcTotal = () => {
    if (event.price === 0) return "FREE";
    return formatPrice(event.price * qty + CONVENIENCE_FEE);
  };

  const onSubmit = async (data: BookingForm) => {
    if (!user) {
      toast("Please sign in to save your booking to the database", "error");
      setLoading(false);
      return;
    }

    setLoading(true);
    const payload = {
      eventId: event.id,
      quantity: data.quantity,
      ticketType: data.ticketType as TicketType,
    };
    console.log("Submitting:", payload);

    try {
      const res = await bookingService.createBooking(payload);
      if (!res.success) {
        toast(res.error || "Booking failed", "error");
        setLoading(false);
        return;
      }

      const ticketId = res.data.ticketId || generateTicketId();
      const total =
        event.price === 0 ? "Free" : formatPrice(event.price * data.quantity + CONVENIENCE_FEE);

      setTicketData({
        ticketId,
        total,
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        qty: data.quantity,
        type: data.ticketType,
      });
      setStep(2);
      toast("🎉 Booking confirmed!", "success");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      console.error(err.response?.data || error);
      toast(err.response?.data?.error || "Booking failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsapp = () => {
    if (!ticketData) return;
    let phone = prompt("Enter WhatsApp Number to send ticket:", ticketData.phone);
    if (!phone) return;
    const msg = `🎟️ *NextBuzz Ticket Confirmed!*\n\nHi ${ticketData.name}! 🎉\n\n*Event:* ${event.title}\n*Date:* ${event.date} at ${event.time}\n*Venue:* ${event.venue}\n*Tickets:* ${ticketData.qty}x ${ticketData.type}\n*Booking ID:* ${ticketData.ticketId}\n*Total:* ${ticketData.total}\n\nSee you there! 🔥`;
    window.open(
      `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className={`overlay ${open ? "open" : ""}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute right-[18px] top-[18px] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg3)] text-[var(--muted)]"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="border-b border-[var(--border)] px-9 pb-6 pt-9 max-md:px-5">
          <h3 className="font-head mb-1.5 text-[1.7rem] font-black tracking-[-1px]">
            {event.title}
          </h3>
          <p className="text-[0.88rem] text-[var(--muted)]">
            {event.date} · {event.venue}
          </p>
        </div>

        <div className="px-9 py-7 max-md:px-5">
          {step === 1 ? (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3.5 grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                    Your Name
                  </label>
                  <input
                    {...form.register("name")}
                    placeholder="Aarav Sharma"
                    className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 text-[0.9rem] text-[var(--white)] outline-none focus:border-[rgba(255,107,53,0.5)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                    Email
                  </label>
                  <input
                    {...form.register("email")}
                    type="email"
                    placeholder="you@gmail.com"
                    className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 text-[0.9rem] text-[var(--white)] outline-none focus:border-[rgba(255,107,53,0.5)]"
                  />
                </div>
              </div>
              <div className="mb-3.5 grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                    WhatsApp Number
                  </label>
                  <input
                    {...form.register("phone")}
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 text-[0.9rem] text-[var(--white)] outline-none focus:border-[rgba(255,107,53,0.5)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                    No. of Tickets
                  </label>
                  <select
                    {...form.register("quantity")}
                    className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 text-[0.9rem] text-[var(--white)] outline-none"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3.5 flex flex-col gap-1.5">
                <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                  Ticket Type
                </label>
                <select
                  {...form.register("ticketType")}
                  className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 text-[0.9rem] text-[var(--white)] outline-none"
                >
                  <option>General Admission</option>
                  <option>VIP</option>
                  <option>Early Bird</option>
                </select>
              </div>

              <div className="mb-4 rounded-[14px] border border-[var(--border)] bg-[var(--bg3)] p-4">
                <div className="mb-2 flex justify-between text-[0.85rem]">
                  <span className="text-[var(--muted)]">Ticket Price</span>
                  <span className="font-bold">{formatPrice(event.price)}</span>
                </div>
                <div className="mb-2 flex justify-between text-[0.85rem]">
                  <span className="text-[var(--muted)]">Convenience Fee</span>
                  <span className="font-bold">{event.price === 0 ? "FREE" : formatPrice(CONVENIENCE_FEE)}</span>
                </div>
                <div className="mt-1 flex justify-between border-t border-[var(--border)] pt-2.5">
                  <span className="font-extrabold">Total</span>
                  <span className="font-head text-[1.2rem] font-black text-[var(--gold)]">
                    {calcTotal()}
                  </span>
                </div>
              </div>

              <button type="submit" className="btn-full" disabled={loading}>
                {loading ? "Confirming..." : "Confirm & Get Ticket 🎟️"}
              </button>
            </form>
          ) : (
            ticketData && (
              <div className="mt-6">
                <div className="relative overflow-hidden rounded-[18px] border-2 border-[rgba(255,187,51,0.3)] bg-gradient-to-br from-[#1a0800] to-[#0d1a0d] p-7">
                  <div className="absolute bottom-0 left-1/2 top-0 w-px bg-[repeating-linear-gradient(to_bottom,transparent,transparent_6px,rgba(255,187,51,0.2)_6px,rgba(255,187,51,0.2)_12px)]" />
                  <div className="mb-5 border-b border-dashed border-[rgba(255,187,51,0.2)] pb-5">
                    <div className="font-head mb-2 text-[1.4rem] font-black">{event.title}</div>
                    <div className="flex flex-col gap-1.5 text-[0.85rem] text-[var(--muted)]">
                      <div>
                        📅 <strong className="text-[var(--white)]">{event.date} at {event.time}</strong>
                      </div>
                      <div>
                        📍 <strong className="text-[var(--white)]">{event.venue}</strong>
                      </div>
                      <div>
                        👤 <strong className="text-[var(--white)]">{ticketData.name}</strong>
                      </div>
                      <div>
                        🎟️{" "}
                        <strong className="text-[var(--white)]">
                          {ticketData.qty} × {ticketData.type}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-6 top-6 flex h-20 w-20 items-center justify-center rounded-[10px] bg-[var(--white)] text-[2.5rem]">
                    🎫
                  </div>
                  <div className="mt-4 font-mono text-[0.75rem] tracking-[0.1em] text-[var(--muted)]">
                    Booking ID: {ticketData.ticketId}
                  </div>
                  <div className="mt-3.5 flex items-center justify-between">
                    <span className="text-[0.82rem] text-[var(--muted)]">Total Paid</span>
                    <span className="font-head text-[1.3rem] font-black text-[var(--gold)]">
                      {ticketData.total}
                    </span>
                  </div>
                </div>

                <button className="btn-whatsapp" onClick={sendWhatsapp}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Share via WhatsApp
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
