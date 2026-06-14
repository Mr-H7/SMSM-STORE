import Link from "next/link";
import { MessageCircle } from "lucide-react";

type Props = {
  href: string;
  label: string;
  primary?: boolean;
  full?: boolean;
};

export function WhatsappButton({ href, label, primary, full }: Props) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${primary ? "smsm-btn-primary" : "smsm-btn-secondary"} ${full ? "w-full" : ""} gap-2`}
    >
      <MessageCircle className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}
