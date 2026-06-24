import Link from "next/link";
import { Facebook, Instagram, Music2 } from "lucide-react";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61590026293806&ref=PROFILE_EDIT_xav_ig_profile_page_web#",
    icon: Facebook
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/smsm_store01",
    icon: Instagram
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@smsm88049",
    icon: Music2
  }
] as const;

export function SocialLinks() {
  return (
    <div className="flex items-center gap-2">
      {socialLinks.map(({ label, href, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
          className="group inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#343434] bg-[#111] text-[#a7a7a7] transition duration-300 hover:-translate-y-1 hover:border-[#cd0000] hover:bg-[#cd0000]/10 hover:text-[#f2ece5] hover:shadow-[0_10px_28px_rgba(205,0,0,0.18)]"
        >
          <Icon className="h-4 w-4 transition duration-300 group-hover:scale-110" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
