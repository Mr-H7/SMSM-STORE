"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Dictionary } from "@/lib/i18n/dictionary";

type Props = {
  locale: "ar" | "en";
  dictionary: Dictionary;
  size: string;
  setSize: (value: string) => void;
  color: string;
  setColor: (value: string) => void;
  availability: string;
  setAvailability: (value: string) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
  search: string;
  setSearch: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sizes: string[];
  colors: string[];
};

export function ProductFilters(props: Props) {
  const [open, setOpen] = React.useState(false);
  const { dictionary, locale } = props;

  const filterFields = (
    <div className="grid gap-3">
      <input
        value={props.search}
        onChange={(event) => props.setSearch(event.target.value)}
        placeholder={dictionary.products.search}
        className="smsm-input"
      />
      <div className="grid grid-cols-2 gap-2">
        <select value={props.size} onChange={(event) => props.setSize(event.target.value)} className="smsm-input">
          <option value="all">{locale === "ar" ? "المقاس" : "Size"}</option>
          {props.sizes.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select value={props.color} onChange={(event) => props.setColor(event.target.value)} className="smsm-input">
          <option value="all">{locale === "ar" ? "اللون" : "Color"}</option>
          {props.colors.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <select
        value={props.availability}
        onChange={(event) => props.setAvailability(event.target.value)}
        className="smsm-input"
      >
        <option value="all">{dictionary.products.availability}</option>
        <option value="in">{dictionary.products.inStock}</option>
        <option value="out">{dictionary.products.outStock}</option>
      </select>
      <select value={props.sortBy} onChange={(event) => props.setSortBy(event.target.value)} className="smsm-input">
        <option value="newest">{dictionary.products.sortNewest}</option>
        <option value="best">{dictionary.products.sortBest}</option>
        <option value="low">{dictionary.products.sortLow}</option>
        <option value="high">{dictionary.products.sortHigh}</option>
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={props.minPrice}
          onChange={(event) => props.setMinPrice(Number(event.target.value))}
          className="smsm-input"
          placeholder="Min EGP"
        />
        <input
          type="number"
          value={props.maxPrice}
          onChange={(event) => props.setMaxPrice(Number(event.target.value))}
          className="smsm-input"
          placeholder="Max EGP"
        />
      </div>
      <button
        className="smsm-btn-secondary w-full"
        type="button"
        onClick={() => {
          props.setSearch("");
          props.setSize("all");
          props.setColor("all");
          props.setAvailability("all");
          props.setMinPrice(0);
          props.setMaxPrice(10000);
          props.setSortBy("newest");
        }}
      >
        {locale === "ar" ? "إعادة تعيين الفلاتر" : "Reset Filters"}
      </button>
    </div>
  );

  return (
    <aside className="smsm-panel p-4">
      <button className="mb-3 flex items-center gap-2 text-sm font-semibold lg:hidden" onClick={() => setOpen((p) => !p)}>
        <SlidersHorizontal className="h-4 w-4" />
        {dictionary.products.filters}
      </button>
      <div className="hidden lg:block">{filterFields}</div>
      {open ? <div className="border-t border-[#2a2a2a] pt-3 lg:hidden">{filterFields}</div> : null}
    </aside>
  );
}
