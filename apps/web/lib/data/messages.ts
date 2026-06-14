import { CustomerMessage } from "@/lib/types";

export const messages: CustomerMessage[] = [
  {
    id: "MSG-1001",
    name: "Ahmed Samir",
    contact: "+20 10 5555 0001",
    message: "I need help choosing the right size for Air Force white.",
    status: "unread",
    createdAt: "2026-05-18 18:15"
  },
  {
    id: "MSG-1002",
    name: "Mona Salah",
    contact: "mona@example.com",
    message: "Do you have New Balance 530 available for pickup today?",
    status: "read",
    createdAt: "2026-05-17 12:40"
  },
  {
    id: "MSG-1003",
    name: "Omar Adel",
    contact: "+20 12 2222 1988",
    message: "Please send photos for the Balenciaga Track model.",
    status: "archived",
    createdAt: "2026-05-15 20:05"
  }
];
