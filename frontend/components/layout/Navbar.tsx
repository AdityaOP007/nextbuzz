"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { getInitials } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface NavbarProps {
  onSignIn: () => void;
  onProfileEdit: () => void;
  onContact: () => void;
}

export default function Navbar({ onSignIn, onProfileEdit, onContact }: NavbarProps) {
  const { user, logout } = useAuth();
  const { cart, setCartOpen } = useCart();
  const [dropOpen, setDropOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-[999] flex h-[70px] items-center justify-between border-b border-[var(--border)] bg-[rgba(17,10,0,0.85)] px-[5vw] backdrop-blur-[20px] max-md:px-4">
      <Link href="/" className="logo">
        Next<span>Buzz</span>
      </Link>

      <div className="hidden items-center gap-7 md:flex">
        <button
          onClick={() => scrollTo("events")}
          className="cursor-pointer text-[0.875rem] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--white)]"
        >
          Events
        </button>
        <button
          onClick={() => scrollTo("categories")}
          className="cursor-pointer text-[0.875rem] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--white)]"
        >
          Categories
        </button>
        <button
          onClick={onContact}
          className="cursor-pointer text-[0.875rem] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--white)]"
        >
          Contact
        </button>
      </div>

      <div className="flex items-center gap-3.5">
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg3)] text-[1.2rem] text-[var(--white)] transition-colors hover:bg-[var(--bg2)]"
        >
          🛒
          {cart.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--rose)] text-[0.65rem] font-extrabold text-white">
              {cart.length}
            </span>
          )}
        </button>

        {!user ? (
          <button className="btn-nav" onClick={onSignIn}>
            Sign In
          </button>
        ) : (
          <div className="relative flex items-center gap-2.5" ref={profileRef}>
            <button
              onClick={() => setDropOpen(!dropOpen)}
              className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border-2 border-[rgba(255,107,53,0.4)] bg-gradient-to-br from-[var(--orange)] to-[var(--rose)] text-[0.9rem] font-extrabold text-white transition-transform hover:scale-[1.08]"
            >
              {getInitials(user.name || user.firstName)}
            </button>
            <button
              onClick={() => setDropOpen(!dropOpen)}
              className="max-w-[100px] cursor-pointer truncate text-[0.82rem] font-bold text-[var(--white)]"
            >
              {(user.name || user.firstName).split(" ")[0]}
            </button>
            {dropOpen && (
              <div className="absolute right-0 top-[calc(100%+14px)] z-[999] min-w-[220px] animate-[slideUp_0.2s_ease] rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="mb-1.5 border-b border-[var(--border)] px-3.5 py-3.5 pb-2.5">
                  <div className="font-head text-[0.95rem] font-bold">{user.name}</div>
                  <div className="mt-0.5 break-all text-[0.78rem] text-[var(--muted)]">
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="mt-0.5 text-[0.78rem] text-[var(--teal)]">
                      📱 {user.phone}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setDropOpen(false);
                    onProfileEdit();
                  }}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] px-3.5 py-2.5 text-[0.85rem] font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--bg3)] hover:text-[var(--white)]"
                >
                  ✏️ Edit Profile
                </button>
                <Link
                  href="/bookings"
                  onClick={() => setDropOpen(false)}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] px-3.5 py-2.5 text-[0.85rem] font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--bg3)] hover:text-[var(--white)]"
                >
                  🎟️ My Bookings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setDropOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] px-3.5 py-2.5 text-[0.85rem] font-semibold text-[var(--rose)] transition-colors hover:bg-[rgba(255,77,109,0.1)]"
                >
                  ↩ Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
