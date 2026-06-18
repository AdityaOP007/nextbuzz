"use client";

import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { formatPrice } from "@/lib/utils";
import { FALLBACK_IMAGES } from "@/types";
import { generateTicketId } from "@/lib/utils";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, total } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (!cart.length) return;
    const phone = prompt("Enter WhatsApp Number to send booking details:", "");
    if (!phone) return;
    setCartOpen(false);
    const ticketId = generateTicketId();
    const eventList = cart.map((e) => e.title).join(", ");
    const msg = `🎟️ *NextBuzz Multi-Ticket Booking*\n\n*Events:* ${eventList}\n*Booking ID:* ${ticketId}\n*Total:* ${formatPrice(total)}\n\nThank you! 🎉`;
    toast("Opening WhatsApp with your booking...", "success");
    setTimeout(() => {
      window.open(
        `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    }, 800);
  };

  return (
    <div
      className={`fixed bottom-0 right-0 top-0 z-[1001] flex w-[400px] flex-col border-l border-[var(--border)] bg-[var(--bg2)] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] transition-[right] duration-300 ease-in-out max-md:w-full ${
        cartOpen
          ? "right-0 pointer-events-auto"
          : "-right-[420px] pointer-events-none max-md:-right-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] p-6">
        <h3 className="font-head text-[1.3rem] font-black">🛒 Your Cart</h3>
        <button
          onClick={() => setCartOpen(false)}
          className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] text-[var(--muted)]"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!cart.length ? (
          <div className="px-6 py-[60px] text-center text-[var(--muted)]">
            <div className="mb-3.5 text-[3rem]">🛒</div>
            <div className="font-bold">Your cart is empty</div>
            <div className="mt-1.5 text-[0.85rem]">Find something you love!</div>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="relative mb-3 flex gap-3.5 rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-3.5"
            >
              <img
                className="h-[60px] w-[60px] shrink-0 rounded-[10px] object-cover"
                src={item.imageUrl || item.img || ""}
                alt={item.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    FALLBACK_IMAGES[item.category] || "";
                }}
              />
              <div className="flex-1">
                <div className="font-head text-[0.95rem] font-bold">{item.title}</div>
                <div className="text-[0.78rem] text-[var(--muted)]">{item.date}</div>
                <div className="font-head mt-1 text-base font-black text-[var(--gold)]">
                  {formatPrice(item.price)}
                </div>
              </div>
              <button
                onClick={async () => {
                  try {
                    await removeFromCart(item.id);
                  } catch (error: unknown) {
                    const err = error as { response?: { data?: { error?: string } } };
                    toast(err.response?.data?.error || "Failed to remove from cart", "error");
                  }
                }}
                className="absolute right-2.5 top-2.5 flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,77,109,0.2)] bg-[rgba(255,77,109,0.15)] text-[var(--rose)] transition-colors hover:bg-[rgba(255,77,109,0.3)]"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-[var(--border)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-semibold text-[var(--muted)]">Total</span>
            <strong className="font-head text-[1.5rem] font-black text-[var(--gold)]">
              {formatPrice(total)}
            </strong>
          </div>
          <button className="btn-full" onClick={handleCheckout}>
            Checkout & Get Tickets 🎟️
          </button>
        </div>
      )}
    </div>
  );
}
