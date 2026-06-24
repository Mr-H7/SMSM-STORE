"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { createContactMessageAction } from "@/lib/system-api/actions";
import type { Locale } from "@/lib/types";

type Props = {
  locale: Locale;
  variant?: "dark" | "red";
  buttonLabel?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function NewsletterForm({ locale, variant = "dark", buttonLabel }: Props) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const copy = {
    invalid: locale === "ar" ? "اكتب بريد إلكتروني صحيح." : "Enter a valid email address.",
    loading: locale === "ar" ? "جارٍ الاشتراك..." : "Joining...",
    success: locale === "ar" ? "تم الاشتراك بنجاح. سنرسل لك أحدث العروض." : "You are on the list. We will send the latest drops.",
    error: locale === "ar" ? "تعذر الاشتراك الآن. حاول مرة أخرى." : "Unable to join right now. Please try again.",
    placeholder: locale === "ar" ? "البريد الإلكتروني" : "Email address",
    button: buttonLabel ?? (locale === "ar" ? "اشتراك" : "Join"),
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const cleanEmail = email.trim().toLowerCase();
    if (!emailPattern.test(cleanEmail)) {
      setStatus("error");
      setMessage(copy.invalid);
      return;
    }

    setStatus("submitting");
    setMessage("");
    const result = await createContactMessageAction({
      name: "Newsletter Lead",
      contact: cleanEmail,
      message: "[NEWSLETTER] Newsletter subscription request",
      website,
    });

    if (result.ok) {
      setEmail("");
      setWebsite("");
      setStatus("success");
      setMessage(copy.success);
      return;
    }

    setStatus("error");
    setMessage(result.message || copy.error);
  };

  const red = variant === "red";
  const inputClass = red
    ? "w-full min-w-0 rounded-none border border-[#f5beb9]/40 bg-black/15 px-4 py-3 text-sm text-white outline-none placeholder:text-[#f0d4d2] focus:border-white/80"
    : "smsm-input";
  const buttonClass = red
    ? "inline-flex min-h-[46px] items-center justify-center rounded-none bg-[#efe7df] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#8c0000] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
    : "smsm-btn-primary w-full px-4 disabled:cursor-not-allowed disabled:opacity-60";
  const messageClass = status === "success" ? (red ? "text-[#fff4ef]" : "text-[#ffb4a8]") : "text-red-200";

  return (
    <form onSubmit={onSubmit} className={red ? "w-full" : "space-y-2"} noValidate>
      <div className={red ? "flex flex-col items-center justify-center gap-3 sm:flex-row" : "space-y-2"}>
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "submitting") {
              setStatus("idle");
              setMessage("");
            }
          }}
          className={inputClass}
          placeholder={copy.placeholder}
          autoComplete="email"
          aria-invalid={status === "error"}
          disabled={status === "submitting"}
        />
        <input
          type="text"
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />
        <button type="submit" className={buttonClass} disabled={status === "submitting"}>
          {status === "submitting" ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : null}
          {status === "success" ? <CheckCircle2 className="me-2 h-4 w-4" /> : null}
          {status === "submitting" ? copy.loading : copy.button}
          {red && status !== "submitting" ? <ArrowRight className="ms-2 h-4 w-4" /> : null}
        </button>
      </div>
      {message ? <p className={"mt-2 text-xs " + messageClass}>{message}</p> : null}
    </form>
  );
}
