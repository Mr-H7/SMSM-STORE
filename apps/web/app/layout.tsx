import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "SMSM STORE",
  description: "BEST SHOES STORE",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png"
  }
};
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
