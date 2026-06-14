"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductFilters } from "@/components/storefront/ProductFilters";
import { ProductSkeleton } from "@/components/storefront/ProductSkeleton";
import { Category, Locale, Product } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/dictionary";

export function ProductCatalogClient({
  locale,
  products,
  categories
}: {
  locale: Locale;
  products: Product[];
  categories: Category[];
}) {
  const dictionary = getDictionary(locale);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [size, setSize] = useState("all");
  const [color, setColor] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const categoryQuery = searchParams.get("category");
    if (categoryQuery) setCategory(categoryQuery);
  }, []);

  const allSizes = useMemo(() => Array.from(new Set(products.flatMap((product) => product.sizes))), [products]);
  const allColors = useMemo(() => Array.from(new Set(products.flatMap((product) => product.colors))), [products]);

  const filtered = useMemo(() => {
    const categorySlugs = categories.map((item) => item.slug);
    let list = products.filter((product) => product.isActive);
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((product) => {
        const name = locale === "ar" ? product.nameAr : product.nameEn;
        const description = locale === "ar" ? product.descriptionAr : product.descriptionEn;
        return name.toLowerCase().includes(term) || description.toLowerCase().includes(term) || product.slug.includes(term);
      });
    }
    if (category !== "all" && categorySlugs.includes(category)) list = list.filter((product) => product.category === category);
    if (size !== "all") list = list.filter((product) => product.sizes.includes(size));
    if (color !== "all") list = list.filter((product) => product.colors.includes(color));
    if (availability === "in") list = list.filter((product) => product.stock > 0);
    if (availability === "out") list = list.filter((product) => product.stock <= 0);
    list = list.filter((product) => product.price >= minPrice && product.price <= maxPrice);
    switch (sortBy) {
      case "best": return [...list].sort((a, b) => Number(Boolean(b.bestSeller)) - Number(Boolean(a.bestSeller)));
      case "low": return [...list].sort((a, b) => a.price - b.price);
      case "high": return [...list].sort((a, b) => b.price - a.price);
      default: return [...list].sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
    }
  }, [products, categories, search, locale, category, size, color, availability, minPrice, maxPrice, sortBy]);

  const sortLabelMap: Record<string, string> = {
    newest: dictionary.products.sortNewest,
    best: dictionary.products.sortBest,
    low: dictionary.products.sortLow,
    high: dictionary.products.sortHigh
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 180);
    return () => clearTimeout(timer);
  }, [search, category, size, color, availability, minPrice, maxPrice, sortBy]);

  return (
    <div className="grid gap-6 lg:grid-cols-[270px_1fr]">
      <ProductFilters
        locale={locale}
        dictionary={dictionary}
        size={size}
        setSize={setSize}
        color={color}
        setColor={setColor}
        availability={availability}
        setAvailability={setAvailability}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sizes={allSizes}
        colors={allColors}
      />
      <section>
        <div className="smsm-panel mb-4 flex items-center justify-between p-3 text-xs uppercase tracking-[0.13em] text-[#c0c0c0]">
          <span>{locale === "ar" ? "عدد المنتجات" : "Showing products"}: {filtered.length}</span>
          <span>{sortLabelMap[sortBy]}</span>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <ProductSkeleton /><ProductSkeleton /><ProductSkeleton /><ProductSkeleton /><ProductSkeleton /><ProductSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <div className="smsm-panel p-10 text-center text-[#b8b8b8]">{dictionary.products.noResults}</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}
          </div>
        )}
      </section>
    </div>
  );
}
