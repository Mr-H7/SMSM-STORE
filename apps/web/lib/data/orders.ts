import { Order } from "@/lib/types";

export const orders: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Ahmed Samir",
    phone: "+20 10 5555 0001",
    address: "Nasr City, Cairo",
    status: "new",
    items: [
      {
        productId: "p1",
        productNameAr: "سنيكرز SMSM ألترا أسود",
        productNameEn: "SMSM Ultra Black Sneaker",
        image: "/images/template.svg",
        size: "42",
        color: "Black",
        quantity: 1,
        unitPrice: 2499
      }
    ],
    total: 2499,
    createdAt: "2026-04-30 17:10"
  },
  {
    id: "ORD-1002",
    customerName: "Mona Salah",
    phone: "+20 11 6000 2233",
    address: "Smouha, Alexandria",
    status: "processing",
    items: [
      {
        productId: "p5",
        productNameAr: "SMSM دايناميك أسود أحمر",
        productNameEn: "SMSM Dynamic Black Red",
        image: "/images/template.svg",
        size: "43",
        color: "Red",
        quantity: 1,
        unitPrice: 2799
      },
      {
        productId: "p8",
        productNameAr: "SMSM ستريت فولت",
        productNameEn: "SMSM Street Volt",
        image: "/images/template.svg",
        size: "42",
        color: "Black",
        quantity: 1,
        unitPrice: 1899
      }
    ],
    total: 4698,
    createdAt: "2026-04-29 13:25"
  },
  {
    id: "ORD-1003",
    customerName: "Ali Hassan",
    phone: "+20 12 1234 9087",
    address: "6th October, Giza",
    status: "completed",
    items: [
      {
        productId: "p3",
        productNameAr: "كاجوال SMSM كلاسيك أبيض",
        productNameEn: "SMSM Classic Casual White",
        image: "/images/template.svg",
        size: "41",
        color: "White",
        quantity: 2,
        unitPrice: 1999
      }
    ],
    total: 3998,
    createdAt: "2026-04-25 11:00"
  }
];
