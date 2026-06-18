"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import SearchSection from "@/components/home/SearchSection";
import FeaturedBanner from "@/components/home/FeaturedBanner";
import CategoriesSection from "@/components/home/CategoriesSection";
import EventsGrid from "@/components/events/EventsGrid";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import LoginModal, { useLoginModal } from "@/components/auth/LoginModal";
import BookingModal from "@/components/booking/BookingModal";
import { eventService } from "@/services/event.service";
import { Event } from "@/types";
import { useToast } from "@/hooks/useToast";

export default function HomePage() {
  const { toast } = useToast();
  const loginModal = useLoginModal();
  const [events, setEvents] = useState<Event[]>([]);
  const [filtered, setFiltered] = useState<Event[]>([]);
  const [featured, setFeatured] = useState<Event | null>(null);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      const res = await eventService.getEvents();
      if (res.success) {
        setEvents(res.data);
        setFiltered(res.data);
        setFeatured(res.data.find((e) => e.featured) || res.data[0] || null);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: unknown }; message?: string };
      console.error(err.response?.data || err.message || error);
      const isNetwork = err.message === "Network Error";
      toast(
        isNetwork
          ? "Cannot reach backend API. Make sure it is running on http://localhost:4000"
          : "Failed to load events",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const applyFilters = useCallback(() => {
    const q = search.toLowerCase();
    const result = events.filter((ev) => {
      const matchQ =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q);
      const matchCity = !city || ev.city === city;
      const matchCat = !category || ev.category === category;
      return matchQ && matchCity && matchCat;
    });
    setFiltered(result);
  }, [events, search, city, category]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleAiSearch = () => {
    if (!aiQuery.trim()) {
      toast("Type something to search!", "error");
      return;
    }
    setAiLoading(true);
    setAiResult("");

    const q = aiQuery.toLowerCase();
    const matches = events.filter((ev) => {
      if (q.includes("free") && ev.price > 0) return false;
      const priceMatch = q.match(/₹?\s*(\d+)/);
      if (priceMatch && ev.price > parseInt(priceMatch[1])) return false;
      if (q.includes("music") && ev.category !== "Music") return false;
      if (q.includes("food") && ev.category !== "Food") return false;
      if (q.includes("tech") && ev.category !== "Tech") return false;
      if (q.includes("weekend") && !ev.date.toLowerCase().includes("sat") && !ev.date.toLowerCase().includes("sun")) return false;
      return !ev.sold && ev.availableSeats > 0;
    });

    setTimeout(() => {
      if (matches.length) {
        const top = matches.slice(0, 2);
        setAiResult(
          top
            .map(
              (e) =>
                `${e.title} (${e.category}, ${e.date}) — ${e.price === 0 ? "FREE" : "₹" + e.price}`
            )
            .join(". ") + ". These look like great matches for you!"
        );
      } else {
        setAiResult(
          "Try browsing all events or adjusting your filters — there are plenty of exciting options!"
        );
      }
      setAiLoading(false);
    }, 800);
  };

  return (
    <>
      <Navbar
        onSignIn={loginModal.openLogin}
        onProfileEdit={loginModal.openProfile}
        onContact={() => toast("Reach us at hello@nextbuzz.in")}
      />
      <Hero />
      <SearchSection
        search={search}
        city={city}
        aiQuery={aiQuery}
        aiResult={aiResult}
        aiLoading={aiLoading}
        onSearchChange={setSearch}
        onCityChange={(v) => {
          setCity(v);
        }}
        onAiQueryChange={setAiQuery}
        onFilter={applyFilters}
        onAiSearch={handleAiSearch}
      />
      <FeaturedBanner event={featured} onBook={setBookingEvent} />
      <CategoriesSection
        activeCategory={category}
        onCategoryChange={setCategory}
      />
      {loading ? (
        <div className="px-[5vw] py-20 text-center text-[var(--muted)]">Loading events...</div>
      ) : (
        <EventsGrid events={filtered} onBook={setBookingEvent} />
      )}
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
