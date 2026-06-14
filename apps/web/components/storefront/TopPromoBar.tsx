export function TopPromoBar({ text }: { text: string }) {
  return (
    <div className="border-b border-[#202020] bg-[#0b0b0b] py-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c7c7c7] md:text-xs">
      {text}
    </div>
  );
}
