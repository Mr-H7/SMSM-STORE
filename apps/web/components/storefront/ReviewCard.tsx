import { Review, Locale } from "@/lib/types";

export function ReviewCard({ review, locale }: { review: Review; locale: Locale }) {
  return (
    <article className="smsm-panel p-6">
      <div className="mb-4 text-[#cd0000]">{"★★★★★".slice(0, review.rating)}</div>
      <p className="text-sm leading-7 text-[#e5dfd7]">
        {locale === "ar" ? review.textAr : review.textEn}
      </p>
      <div className="mt-5 border-t border-[#2f2f2f] pt-3">
        <div className="smsm-heading text-sm font-semibold">
          {locale === "ar" ? review.nameAr : review.nameEn}
        </div>
        <div className="text-xs text-[#9f9f9f]">{locale === "ar" ? review.cityAr : review.cityEn}</div>
      </div>
    </article>
  );
}

