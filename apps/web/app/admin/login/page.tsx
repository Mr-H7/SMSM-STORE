"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useAdminAuth } from "@/components/shared/AdminAuthProvider";
import { useAdminLocale } from "@/components/shared/AdminLocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function AdminLoginPage() {
  const { locale, setLocale, dir } = useAdminLocale();
  const dictionary = getDictionary(locale);
  const { login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const result = await login({ username, password });
    if (!result.ok) {
      setError(result.message || (locale === "ar" ? "بيانات الدخول غير صحيحة." : "Invalid credentials."));
      return;
    }
    window.location.href = "/admin/dashboard";
  };

  return (
    <div
      dir={dir}
      className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_0%_10%,rgba(205,0,0,0.2),transparent_40%),#0c0c0c] p-4 text-[#efe6de]"
    >
      <div className="grid w-full max-w-5xl items-center gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="hidden lg:block">
          <div className="flex items-center gap-4">
            <Image
              src="/images/smsm-logo.png"
              alt="SMSM STORE"
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-sm border border-[#2b2b2b] object-cover"
              priority
            />
            <div>
              <h1 className="smsm-heading text-6xl font-extrabold leading-none">SMSM STORE</h1>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#9f9f9f]">BEST SHOES STORE</p>
            </div>
          </div>
          <p className="smsm-label mt-3 text-[#cd0000]">
            {locale === "ar" ? "بوابة الإدارة" : "Administrative Gateway"}
          </p>
          <div className="relative mt-6 flex min-h-[380px] items-center justify-center overflow-hidden border border-[#2a2a2a] bg-[radial-gradient(circle_at_center,rgba(205,0,0,0.18),transparent_42%),linear-gradient(145deg,#171717,#050505)]">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#cd0000] to-transparent opacity-70" />
            <div className="absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-[#cd0000] to-transparent opacity-40" />
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-[#3a1a1a] bg-black/45 shadow-[0_0_60px_rgba(205,0,0,0.18)]">
                <Image
                  src="/images/smsm-logo.png"
                  alt="SMSM STORE admin preview"
                  width={132}
                  height={132}
                  className="h-32 w-32 object-contain"
                  priority
                />
              </div>
              <p className="smsm-heading mt-8 text-3xl font-extrabold tracking-[0.08em] text-[#f4f0e9]">
                SMSM STORE
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[#cd0000]">
                Admin Control Panel
              </p>
            </div>
          </div>
        </section>
        <form className="border border-[#303030] bg-[#171717] p-8" onSubmit={onSubmit}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="smsm-heading text-4xl font-bold">{dictionary.admin.loginTitle}</h2>
              <p className="mt-2 text-sm text-[#a8a8a8]">{dictionary.admin.loginHint}</p>
            </div>
            <button
              type="button"
              onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
              className="smsm-btn-secondary px-3"
            >
              {locale === "ar" ? "EN" : "AR"}
            </button>
          </div>
          <div className="space-y-4">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder={dictionary.admin.username}
              className="smsm-input"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={dictionary.admin.password}
              className="smsm-input"
            />
            <button className="smsm-btn-primary w-full">
              {locale === "ar" ? "دخول لوحة التحكم" : "Login to Dashboard"}
            </button>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
          </div>
        </form>
      </div>
    </div>
  );
}
