"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useProducts } from "@/features/commerce/useProducts";
import { ScaleIn } from "@/components/ui/Animated";

export default function FestivePicksPage() {
  const { products } = useProducts("festive");

  return (
    <div className="min-h-screen bg-[#f3cfc6] text-black flex flex-col">
      <Navbar theme="festive" />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-16">
        <ScaleIn>
          <h1 className="text-4xl md:text-6xl font-bold text-[#2F2A55] tracking-wider">
            COMING SOON...
          </h1>
        </ScaleIn>
      </main>

      <Footer theme="festive" />
    </div>
  );
}
