"use client";

import { CITIES } from "@/types";

interface SearchSectionProps {
  search: string;
  city: string;
  aiQuery: string;
  aiResult: string;
  aiLoading: boolean;
  onSearchChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onAiQueryChange: (v: string) => void;
  onFilter: () => void;
  onAiSearch: () => void;
}

export default function SearchSection({
  search,
  city,
  aiQuery,
  aiResult,
  aiLoading,
  onSearchChange,
  onCityChange,
  onAiQueryChange,
  onFilter,
  onAiSearch,
}: SearchSectionProps) {
  return (
    <div className="relative z-[1] px-[5vw] pb-[60px] max-md:px-4 max-md:pb-10">
      <div className="flex items-center gap-3 rounded-[var(--radius)] border-[1.5px] border-[var(--border)] bg-[var(--card)] p-2 pl-[22px] transition-colors focus-within:border-[rgba(255,107,53,0.5)]">
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="#a88d6a"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onInput={onFilter}
          placeholder="Search events, venues, artists..."
          className="flex-1 border-none bg-transparent py-2 font-body text-base text-[var(--white)] outline-none placeholder:text-[var(--muted)]"
        />
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={city}
            onChange={(e) => {
              onCityChange(e.target.value);
            }}
            className="cursor-pointer rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] px-4 py-2 font-body text-[0.82rem] font-semibold text-[var(--white)] outline-none"
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button className="btn-search" onClick={onFilter}>
            Search
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-dashed border-[rgba(155,93,229,0.3)] bg-[rgba(155,93,229,0.08)] px-4 py-2.5">
        <span className="whitespace-nowrap rounded-full bg-[var(--purple)] px-2.5 py-0.5 text-[0.65rem] font-extrabold tracking-[0.06em] text-white">
          ✦ AI
        </span>
        <input
          type="text"
          value={aiQuery}
          onChange={(e) => onAiQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAiSearch()}
          placeholder='Try: "something fun under ₹500 this weekend"'
          className="flex-1 border-none bg-transparent font-body text-[0.9rem] text-[var(--white)] outline-none placeholder:text-[rgba(168,141,106,0.6)]"
        />
        <button className="btn-ai" onClick={onAiSearch} disabled={aiLoading}>
          {aiLoading ? "..." : "Ask AI"}
        </button>
      </div>

      {aiResult && (
        <div className="mt-3.5 rounded-xl border border-[rgba(155,93,229,0.25)] bg-[rgba(155,93,229,0.1)] px-5 py-4 text-[0.88rem] leading-[1.7] text-[#d4c2f0]">
          ✦ {aiResult}
        </div>
      )}
    </div>
  );
}
