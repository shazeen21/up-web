"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSlider } from "@/components/ui/HeroSlider";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { uphaarHeroSlides } from "@/data/products";
import { useProducts } from "@/features/commerce/useProducts";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";

export default function UphaarPage() {
  const { products } = useProducts("uphaar");
  const bulkNumber = process.env.NEXT_PUBLIC_UPHAAR_WHATSAPP!;

  const openBulk = () => {
    const msg =
      "Hello, I would like to place a bulk order.%0ACustomer Name:%0APhone Number:%0AQuantity:%0ANotes:%0AOrder Type: Bulk";
    window.open(`https://wa.me/${bulkNumber.replace("+", "")}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-black">
      <Navbar theme="uphaar" />
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-12 lg:px-8 lg:py-16">
        <FadeIn direction="up">
          <HeroSlider images={uphaarHeroSlides} tone="uphaar" />
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <section className="rounded-3xl bg-[#b7c1b9] text-[#ffffff] p-8  shadow-card">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold text-uphaar-bg">
                  CUSTOM HAMPERS
                </h2>
                <p className="max-w-2xl text-base text-uphaar-bg/80">
                  If you have something specific in mind or would like a fully customized solution, feel free to connect with us.
                </p>
              </div>
              <Button tone="green" onClick={openBulk}>
                CONNECT NOW
              </Button>
            </div>
          </section>
        </FadeIn>

        <section className="space-y-6">
          <FadeIn direction="up">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-semibold text-black">Our Collection</h2>
            </div>
          </FadeIn>
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {products.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} tone="uphaar" />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </main>
      <Footer theme="uphaar" />
    </div>
  );
}

