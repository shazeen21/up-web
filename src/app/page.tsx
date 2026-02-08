"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { VideoSlider } from "@/components/ui/VideoSlider";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";

import { featuredProducts, Product } from "@/data/products";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Database } from "@/lib/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

const brandCards = [
  {
    name: "Uphaar",
    logo: "/logos/uphaar.png",
    support: "Custom corporate gifting solutions",
    size: "normal",
    href: "/uphaar",
  },
  {
    name: "Kyddoz",
    logo: "/logos/kyddoz.png",
    support: "Personalized gifts for every occasion",
    size: "normal",
    href: "/kyddoz",
  },
];

export default function HomePage() {
  // Start with featuredProducts from file immediately
  const [products, setProducts] = useState<Product[]>(featuredProducts);
  const supabase = supabaseBrowser();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = (await supabase
          .from("products")
          .select("*")
          .eq("featured", true)
          .order("created_at", { ascending: false })) as {
            data: ProductRow[] | null;
            error: any;
          };

        if (data && !error && data.length > 0) {
          // Map DB products
          const mapped = data.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.images?.[0] || "",
            images: p.images || [],
            brand: (p.category as "uphaar" | "kyddoz" | "festive") || "uphaar",
            badge: p.featured ? "Featured" : undefined,
            description: p.description || "",
            aspect_ratio: p.aspect_ratio || undefined,
          }));

          // Combine local file products + DB products
          // We use a Map to avoid duplicates if IDs match
          const combined = [...featuredProducts, ...mapped];
          // logical deduping based on ID
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

          setProducts(unique);
        } else {
          // Fallback to just file products
          setProducts(featuredProducts);
        }
      } catch {
        setProducts(featuredProducts);
      }
    };

    fetchFeatured();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#f3cfc6] text-black">
      <Navbar theme="home" />

      <main className="container-responsive py-10 sm:py-14 lg:py-20 space-y-16 sm:space-y-20">
        {/* BRAND CARDS */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6" staggerDelay={0.15}>
          {brandCards.map((brand) => (
            <StaggerItem key={brand.name}>
              <Link href={brand.href}>
                <motion.div
                  className="group relative overflow-hidden rounded-3xl
                             bg-[#fffdf8] px-6 sm:px-8 py-8
                             shadow-soft transition
                             border-2 border-[#691314]/40"
                  whileHover={{
                    scale: 1.02,
                    borderColor: "#691314",
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex min-h-[200px] flex-col items-center justify-between text-center text-[#670E10]">
                    <motion.div
                      className="flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`relative ${brand.size === "large"
                          ? "h-28 w-56 sm:h-32 sm:w-64 md:h-36 md:w-72"
                          : "h-24 w-48 sm:h-28 sm:w-56 md:h-32 md:w-64"
                          }`}
                      >
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                    </motion.div>

                    <div className="mt-4 space-y-2">
                      <p className="mx-auto max-w-xs text-sm sm:text-base font-medium opacity-90">
                        {brand.support}
                      </p>

                      <p className="text-xs font-bold tracking-wider underline underline-offset-4 cursor-pointer pt-2">
                        CLICK HERE
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* FEATURED PRODUCTS */}
        <section>
          <FadeIn direction="up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#670E10]">
              Featured Products
            </h2>

            <p className="mt-2 text-sm sm:text-base text-[#670E10]/80">
              Handpicked bestsellers across Uphaar, Kyddoz, and Festive Picks.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <div className="mt-8 relative">
              <div
                className="
      flex gap-4 sm:gap-6
      overflow-x-auto
      scroll-smooth
      snap-x snap-mandatory
      pb-4
      [-ms-overflow-style:none]
      [scrollbar-width:none]
    "
              >
                {/* hide scrollbar (webkit) */}
                <style jsx>{`
      div::-webkit-scrollbar {
        display: none;
      }
    `}</style>

                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="
          snap-start
          min-w-[75%]
          sm:min-w-[45%]
          md:min-w-[32%]
          lg:min-w-[24%]
        "
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.25, 0.4, 0.25, 1]
                    }}
                  >
                    <ProductCard product={product} tone="home" />
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* LIVE EVENTS */}
        <section>
          <FadeIn direction="up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#670E10]">
              Live Events
            </h2>

            <p className="mt-2 text-sm sm:text-base text-[#670E10]/80">
              A glimpse of our live celebrations, gifting moments, and on-ground events.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <div className="mt-8">
              <VideoSlider />
            </div>
          </FadeIn>
        </section>
      </main>

      <Footer theme="home" />
    </div>
  );
}
