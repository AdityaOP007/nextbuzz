"use client";

import { CATEGORIES } from "@/types";

interface CategoriesSectionProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function CategoriesSection({
  activeCategory,
  onCategoryChange,
}: CategoriesSectionProps) {
  return (
    <div id="categories" className="px-[5vw] pb-[50px] max-md:px-4 max-md:pb-10">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="font-head text-[clamp(1.6rem,3vw,2.4rem)] font-black tracking-[-1px]">
          Browse by <em className="not-italic text-[var(--orange)]">Category</em>
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] px-[22px] py-2.5 text-[0.85rem] font-bold transition-all ${
              activeCategory === cat.id
                ? "border-[var(--orange)] bg-[rgba(255,107,53,0.12)] text-[var(--orange)]"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--orange)] hover:bg-[rgba(255,107,53,0.12)] hover:text-[var(--white)]"
            }`}
          >
            <span className="text-[1.1rem]">{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
