import { Category } from "@/lib/types";
import { products } from "@/lib/data/products";

const count = (slug: string) => products.filter((product) => product.category === slug).length;

export const categories: Category[] = [
  { id: "10000000-0000-4000-8000-000000000001", nameAr: "سنيكرز", nameEn: "Sneakers", slug: "sneakers", image: "/images/template.svg", productCount: count("sneakers"), isActive: true },
  { id: "10000000-0000-4000-8000-000000000002", nameAr: "أحذية رياضية", nameEn: "Sport Shoes", slug: "sport-shoes", image: "/images/template.svg", productCount: count("sport-shoes"), isActive: true },
  { id: "10000000-0000-4000-8000-000000000003", nameAr: "أحذية كاجوال", nameEn: "Casual Shoes", slug: "casual-shoes", image: "/images/template.svg", productCount: count("casual-shoes"), isActive: true },
  { id: "10000000-0000-4000-8000-000000000004", nameAr: "جري وأداء", nameEn: "Running", slug: "running", image: "/images/template.svg", productCount: count("running"), isActive: true },
  { id: "10000000-0000-4000-8000-000000000005", nameAr: "سنيكرز فاخر", nameEn: "Luxury Sneakers", slug: "luxury-sneakers", image: "/images/template.svg", productCount: count("luxury-sneakers"), isActive: true },
  { id: "10000000-0000-4000-8000-000000000006", nameAr: "اير ماكس", nameEn: "Air Max", slug: "air-max", image: "/images/template.svg", productCount: count("air-max"), isActive: true },
  { id: "10000000-0000-4000-8000-000000000007", nameAr: "جوردن", nameEn: "Jordan", slug: "jordan", image: "/images/template.svg", productCount: count("jordan"), isActive: true },
  { id: "10000000-0000-4000-8000-000000000008", nameAr: "أديداس", nameEn: "Adidas", slug: "adidas", image: "/images/template.svg", productCount: count("adidas"), isActive: true },
  { id: "10000000-0000-4000-8000-000000000009", nameAr: "نيو بالنس", nameEn: "New Balance", slug: "new-balance", image: "/images/template.svg", productCount: count("new-balance"), isActive: true }
];
