import { ProductSkeleton } from "@/components/storefront/ProductSkeleton";

export default function StorefrontLoading() {
  return (
    <div className="smsm-container min-h-[60vh] animate-pulse py-10" aria-busy="true" aria-label="Loading page">
      <div className="mb-8 h-3 w-24 bg-[#2b2b2b]" />
      <div className="mb-3 h-10 w-full max-w-md bg-[#242424]" />
      <div className="mb-10 h-4 w-full max-w-xl bg-[#1d1d1d]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
      </div>
    </div>
  );
}
