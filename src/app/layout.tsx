import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const sans = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const display = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Uphaar & Kyddoz",
  description:
    "Premium gifts and personalized products from Uphaar & Kyddoz - Making every moment special.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${display.variable} bg-[#ebe5da] antialiased overflow-x-hidden`}
      >
        <Providers>
          <div className="min-h-screen w-full">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
