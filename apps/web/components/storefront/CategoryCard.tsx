import Link from "next/link";
import Image from "next/image";
import { Category, Locale } from "@/lib/types";

type Props = {
  category: Category;
  locale: Locale;
};

export function CategoryCard({ category, locale }: Props) {
  const name = locale === "ar" ? category.nameAr : category.nameEn;

  return (
    <Link
      href={`/${locale}/products?category=${category.slug}`}
      className="smsm-panel group relative block min-h-[230px] overflow-hidden"
    >
      <Image
        src={category.image}
        alt={name}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />
      <div className="absolute bottom-0 start-0 w-full p-4">
        <div className="smsm-heading text-xl font-semibold text-[#f2ede5]">{name}</div>
        <div className="mt-1 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-[#b4b4b4]">
          <span>{locale === "ar" ? "منتجات" : "Products"}</span>
          <span>{category.productCount}</span>
        </div>
      </div>
    </Link>
  );
}
