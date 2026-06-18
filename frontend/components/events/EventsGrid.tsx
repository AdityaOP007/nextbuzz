"use client";

import { Event } from "@/types";
import EventCard from "./EventCard";

interface EventsGridProps {
  events: Event[];
  onBook: (event: Event) => void;
}

export default function EventsGrid({ events, onBook }: EventsGridProps) {
  return (
    <>
      <div id="events" className="flex items-end justify-between px-[5vw] pb-7 max-md:px-4 max-md:pb-5">
        <h2 className="font-head text-[clamp(1.6rem,3vw,2.4rem)] font-black tracking-[-1px]">
          Upcoming <em className="not-italic text-[var(--orange)]">Events</em>
        </h2>
        <span className="text-[0.85rem] font-semibold text-[var(--muted)]">
          {events.length} event{events.length !== 1 ? "s" : ""}
        </span>
      </div>
      {events.length === 0 ? (
        <div className="px-[5vw] pb-[60px] text-center text-[var(--muted)] max-md:px-4 max-md:pb-10">
          <div className="mb-4 text-[3rem]">🔍</div>
          <div className="text-[1.1rem] font-bold">No events found</div>
          <div className="mt-2 text-[0.88rem]">Try a different search or category</div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 px-[5vw] pb-[60px] max-md:grid-cols-1 max-md:px-4 max-md:pb-10">
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} onBook={onBook} />
          ))}
        </div>
      )}
    </>
  );
}
