"use client";

import Image from "next/image";
import React from "react";
import { Instagram, Facebook } from "lucide-react";

type FooterProps = {
  theme?: "home" | "uphaar" | "kyddoz" | "festive";
};

const themeStyles: Record<
  NonNullable<FooterProps["theme"]>,
  { bg: string; text: string }
> = {
  home: { bg: "bg-home-primary", text: "text-home-secondary" },
  uphaar: { bg: "bg-[#b7c1b9]", text: "text-[#ffffff]" },
  kyddoz: { bg: "bg-[#E7F5FF]", text: "text-[#0B3C5D]" },
  festive: { bg: "bg-home-primary", text: "text-home-secondary" },
};

const socialBtn =
  "flex size-11 items-center justify-center rounded-full bg-white text-[#670E10] shadow-md hover:scale-105 transition";

const iconClass = "h-5 w-5";

export function Footer({ theme = "home" }: FooterProps) {
  const styles = themeStyles[theme];

  return (
    <footer className={`${styles.bg} ${styles.text} mt-24`}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

          {/* LOGOS */}
          {/* LOGOS */}
          <div className="flex flex-col gap-6">
            <div className="relative h-14 w-52">
              <Image src="/logos/uphaar.png" alt="Uphaar" fill className="object-contain" />
            </div>
            <div className="relative h-14 w-52">
              <Image src="/logos/kyddoz.png" alt="Kyddoz" fill className="object-contain" />
            </div>
          </div>

          {/* CONTACT */}
          <div className="flex flex-col gap-3 text-sm leading-relaxed">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <p className="opacity-80 max-w-sm">
              Reach out for bulk orders, custom hampers, and brand collaborations.
            </p>

            {/* UPHAAR CONTACT */}
            {theme === "uphaar" && (
              <div className="mt-2 space-y-1">
                <p className="font-medium">sachin@uphaar.net</p>
                <p className="font-medium">+91 98211 41072</p>
              </div>
            )}

            {/* KYDDOZ CONTACT */}
            {theme === "kyddoz" && (
              <div className="mt-2 space-y-1">
                <p className="font-medium">kyddozworld2@gmail.com</p>
                <p className="font-medium">+91 87671 74252</p>
              </div>
            )}

            {/* HOME GENERAL CONTACT */}
            {theme === "home" && (
              <div className="mt-2 space-y-1">
                <p className="font-medium">sachin@uphaar.net</p>
                <p className="font-medium">kyddozworld2@gmail.com</p>
                <p className="font-medium">+91 87671 74252 / +91 98211 41072</p>
              </div>
            )}
          </div>

          {/* SOCIAL */}
          <div className="flex gap-4 md:justify-end">
            {theme !== "home" && (
              <>
                <Social
                  href={
                    theme === "uphaar"
                      ? "https://www.instagram.com/uphaar.corporate/"
                      : "https://www.instagram.com/personalised_kyddoz_world/?hl=en"
                  }
                  label="Instagram"
                >
                  <Instagram className={iconClass} />
                </Social>

                {theme === "kyddoz" && (
                  <Social
                    href="https://www.facebook.com/KyddozPersonalisedGifting/"
                    label="Facebook"
                  >
                    <Facebook className={iconClass} />
                  </Social>
                )}

                <Social href="https://whatsapp.com" label="WhatsApp">
                  <WhatsappIcon />
                </Social>
              </>
            )}
          </div>

        </div>
      </div>
    </footer>
  );
}

/* SOCIAL BUTTON */
function Social({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={socialBtn}
    >
      {children}
    </a>
  );
}

/* ================= WHATSAPP BRAND ICON ================= */

function WhatsappIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M12.04 2C6.55 2 2.07 6.48 2.07 11.97c0 1.93.5 3.82 1.45 5.5L2 22l4.67-1.23a9.92 9.92 0 005.37 1.56h.01c5.49 0 9.97-4.48 9.97-9.97C22 6.48 17.52 2 12.04 2zm5.82 14.49c-.25.7-1.45 1.36-2.02 1.44-.54.08-1.24.11-3.97-.85-3.5-1.23-5.77-4.34-5.95-4.59-.18-.25-1.43-1.9-1.43-3.63 0-1.73.9-2.58 1.22-2.93.31-.35.69-.44.92-.44.23 0 .46 0 .66.01.21.01.49-.08.77.59.29.7.98 2.42 1.07 2.59.09.17.15.37.03.6-.12.23-.18.37-.35.56-.17.19-.37.42-.53.56-.17.14-.35.3-.15.59.2.29.9 1.48 1.93 2.39 1.33 1.18 2.46 1.54 2.82 1.71.36.17.57.14.78-.08.21-.23.9-1.05 1.14-1.41.23-.36.47-.3.78-.18.31.12 1.97.93 2.31 1.1.35.17.58.25.67.39.08.14.08.81-.17 1.51z" />
    </svg>
  );
}
