"use client";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/ui/HeroSlider";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { kyddozHeroSlides, schoolCollection } from "@/data/products";
import { useProducts } from "@/features/commerce/useProducts";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";

export default function KyddozPage() {
  const { products } = useProducts("kyddoz");

  const backToSchoolProducts = [...schoolCollection].reverse();
  const allProducts = [...products, ...backToSchoolProducts];

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

        {/* BANNER REPLACING HERO SLIDER */}
        <FadeIn direction="up">
          <Link href="/school" className="block group">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0B3C5D] to-[#145681] p-8 sm:p-12 shadow-card transition-transform group-hover:scale-[1.02]">
              {/* Decorative background circle */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl transition-opacity group-hover:bg-white/10" />
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-300 animate-pulse" />
                    New Drop Live
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Back to School <br className="hidden sm:block" /> Collection
                  </h2>
                  <p className="max-w-md text-white/80">
                    Personalised school essentials — stationery, bags, labels, and more. Upgrade their daily gear.
                  </p>
                </div>

                <div className="shrink-0">
                  <span className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0B3C5D] shadow-lg transition-transform group-hover:translate-x-1">
                    Shop Now <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </FadeIn>

        {/* BULK ORDERS SECTION */}
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

        {/* KYDDOZ COLLECTION */}
        <section>
          <FadeIn direction="up">
            <h2 className="text-3xl font-semibold mb-4">Our Collection</h2>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.map((p) => (
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
