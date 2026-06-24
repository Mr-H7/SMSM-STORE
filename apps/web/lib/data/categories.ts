import { Category } from "@/lib/types";
import { products } from "@/lib/data/products";

const count = (slug: string) => products.filter((product) => product.category === slug).length;

export const categories: Category[] = [
  
  { id: "10000000-0000-4000-8000-000000000006", nameAr: "اير ماكس", nameEn: "Air Max", slug: "air-max", image: "/images/smsm-logo.png", productCount: count("air-max"), isActive: true },
  { id: "10000000-0000-4000-8000-000000000007", nameAr: "جوردن", nameEn: "Jordan", slug: "jordan", image: "/images/smsm-logo.png", productCount: count("jordan"), isActive: true },
  { id: "10000000-0000-4000-8000-000000000008", nameAr: "أديداس", nameEn: "Adidas", slug: "adidas", image: "/images/smsm-logo.png", productCount: count("adidas"), isActive: true },
  { id: "10000000-0000-4000-8000-000000000009", nameAr: "نيو بالنس", nameEn: "New Balance", slug: "new-balance", image: "/images/smsm-logo.png", productCount: count("new-balance"), isActive: true }
];
