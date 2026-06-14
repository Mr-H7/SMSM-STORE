import Link from "next/link";

export default function RootPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b0b] px-6 text-[#efe7df]">
      <Link href="/ar" className="smsm-btn-primary">
        Continue to SMSM STORE
      </Link>
    </main>
  );
}
