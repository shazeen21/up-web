"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/ui/HeroSlider";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { kyddozHeroSlides } from "@/data/products";
import { useProducts } from "@/features/commerce/useProducts";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";

export default function KyddozPage() {
  const { products } = useProducts("kyddoz");

  const bulkNumber = process.env.NEXT_PUBLIC_KYDDOZ_WHATSAPP!;

  const openBulk = () => {
    const msg =
      "Hello, I would like to place a bulk Kyddoz order.%0ACustomer Name:%0APhone Number:%0AQuantity:%0ANotes:%0AOrder Type: Bulk";
    window.open(
      `https://wa.me/${bulkNumber.replace("+", "")}?text=${msg}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-[#ACE4FF] text-[#0B3C5D]">
      <Navbar theme="kyddoz" />

      <main className="mx-auto max-w-6xl px-6 py-12 space-y-12">

        {/* HERO */}
        <FadeIn direction="up">
          <HeroSlider images={kyddozHeroSlides} tone="kyddoz" />
        </FadeIn>

        {/* ✅ BULK ORDERS SECTION (RESTORED) */}
        <FadeIn direction="up" delay={0.2}>
          <section className="rounded-3xl bg-[#E7F5FF] p-8 shadow-card">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold text-[#0B3C5D]">
                  CUSTOM HAMPERS
                </h2>
                <p className="max-w-2xl text-base text-[#0B3C5D]/80">
                  If you have something specific in mind or would like a fully customized solution, feel free to connect with us.
                </p>
              </div>

              <Button
                className="!bg-[#0B3C5D] !text-white hover:!bg-[#0B3C5D] focus:!bg-[#0B3C5D] active:!bg-[#0B3C5D]"
                onClick={openBulk}
              >
                CONNECT NOW
              </Button>

            </div>
          </section>
        </FadeIn>

        {/* COLLECTION */}
        <section>
          <FadeIn direction="up">
            <h2 className="text-3xl font-semibold mb-4">Our Collection</h2>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} tone="kyddoz" />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

      </main>

      <Footer theme="kyddoz" />
    </div>
  );
}
