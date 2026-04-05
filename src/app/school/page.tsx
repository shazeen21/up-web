"use client";

import { useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { useProducts } from "@/features/commerce/useProducts";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";
import { motion, useScroll, useTransform } from "framer-motion";

export default function SchoolPage() {
  const { products } = useProducts("school");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Need at least a few products to showcase
  const flashProducts = products.slice(0, 4);
  const showcaseLeft = products[1] || products[0];
  const showcaseRight = products[products.length - 1] || products[0];

  return (
    <div className="min-h-screen bg-[#F4FBFF] text-[#0B3C5D] font-sans selection:bg-[#0B3C5D] selection:text-white">
      <Navbar theme="school" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-12 space-y-16">
        
        {/* 1. HERO BANNER */}
        <FadeIn direction="up">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0B3C5D] via-[#104C74] to-[#1C699E] px-8 py-16 sm:py-24 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between shadow-xl ring-1 ring-black/5">
            {/* Sparkles / Deco */}
            <div className="absolute top-10 right-1/4 opacity-20 hidden md:block">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
            <div className="absolute bottom-10 left-10 opacity-10">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>

            <div className="relative z-10 space-y-6 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-blue-300 animate-pulse"></span>
                THE NEW DROP 
              </div>
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1]">
                BACK TO <br /> SCHOOL
              </h1>
              <p className="text-lg sm:text-xl text-white/80 font-light max-w-md">
                Equip them for success. Up to <span className="font-semibold text-blue-200">20% OFF</span> on personalized essentials. Just Dropped.
              </p>
              
              <button 
                onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-4 overflow-hidden relative group inline-flex items-center justify-center gap-3 rounded-full bg-white/10 border border-white/20 px-8 py-4 text-sm font-semibold tracking-wider text-white backdrop-blur-lg hover:bg-white/20 transition-all active:scale-95 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
              >
                <span>SHOP THE DROP</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Hero Image (Optional visual placement) */}
            <div className="hidden lg:block relative z-10 w-[400px] h-[400px]">
               <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
               {showcaseLeft && (
                 <motion.img 
                   src={showcaseLeft.images?.[0] || showcaseLeft.image}
                   alt="Hero Collection" 
                   className="object-contain w-full h-full drop-shadow-2xl"
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ duration: 1, ease: "easeOut" }}
                 />
               )}
            </div>
          </div>
        </FadeIn>

        {/* 2. FLASH SALE STRIP */}
        <FadeIn direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-white/70 border border-white p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                 <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-red-600">FLASH SALE</h3>
                <p className="text-sm font-medium opacity-70">Ending soon — Up to 30% off selected items</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {flashProducts.map((p, i) => (
                  <div key={p.id} className="h-12 w-12 rounded-full ring-2 ring-white overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm relative group">
                    <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
              <button 
                onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm font-bold tracking-wide hover:opacity-70 transition-opacity whitespace-nowrap flex items-center gap-1"
              >
                Don't Miss Out &rarr;
              </button>
            </div>
          </div>
        </FadeIn>

        {/* 3. OFFER CARDS */}
        <section>
          <StaggerContainer className="grid lg:grid-cols-2 gap-6">
            {/* Card 1 */}
            <StaggerItem>
              <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-tr from-[#D6EFFF] to-white border border-[#ACE4FF]/50 p-8 sm:p-10 min-h-[250px] shadow-sm flex flex-col justify-center items-start">
                <div className="absolute top-0 right-0 p-8 w-1/2 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block">
                   <div className="relative w-full h-full bg-[#0B3C5D]/5 blur-[60px] rounded-full"></div>
                </div>
                <h4 className="text-sm font-bold tracking-widest text-[#0B3C5D]/60 mb-2">ESSENTIALS</h4>
                <h3 className="text-3xl font-extrabold mb-6">EVERYDAY UNDER <br/> ₹599</h3>
                <button 
                  onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-full bg-[#0B3C5D] text-white px-6 py-2.5 text-sm font-semibold shadow-md active:scale-95 transition-all"
                >
                  Shop Essentials
                </button>
              </div>
            </StaggerItem>
            {/* Card 2 */}
            <StaggerItem>
              <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-tr from-[#FFF3D6] to-white border border-[#FFE8B3]/50 p-8 sm:p-10 min-h-[250px] shadow-sm flex flex-col justify-center items-start">
               <h4 className="text-sm font-bold tracking-widest text-amber-600/60 mb-2">DEAL OF THE DAY</h4>
                <h3 className="text-3xl font-extrabold mb-6">LUNCHBOX & <br/> BOTTLE COMBOS</h3>
                <button 
                  onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-full bg-amber-500 text-white px-6 py-2.5 text-sm font-semibold shadow-md active:scale-95 transition-all"
                >
                  Shop Combos
                </button>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* 4. HOT CATEGORIES GRID */}
        <section>
           <FadeIn direction="up">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-bold tracking-tight">Trending Categories</h2>
             </div>
           </FadeIn>
           <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
             {["Bags", "Labels & Tags", "Stationery", "Lunch & Hydration"].map((cat, idx) => (
               <StaggerItem key={idx}>
                 <div 
                   className="group cursor-pointer aspect-square rounded-[2rem] bg-white border border-black/5 shadow-sm overflow-hidden relative flex items-center justify-center p-6 text-center hover:shadow-md transition-all active:scale-95"
                   onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
                 >
                   <div className="absolute inset-0 bg-[#0B3C5D]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <h3 className="relative z-10 font-bold text-lg tracking-tight group-hover:text-[#0B3C5D] transition-colors">{cat}</h3>
                 </div>
               </StaggerItem>
             ))}
           </StaggerContainer>
        </section>

        {/* 5. SPLIT SHOWCASE SECTION */}
        <section ref={scrollRef}>
          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {/* Split 1 */}
            <StaggerItem>
              <div className="relative overflow-hidden rounded-[2rem] bg-[#0B3C5D] text-white aspect-[4/5] sm:aspect-[3/4] group flex flex-col justify-end p-8">
                {showcaseRight && (
                  <motion.div style={{ y: parallaxY }} className="absolute inset-0 z-0">
                    <img src={showcaseRight.images?.[0] || showcaseRight.image} alt={showcaseRight.name} className="object-cover w-full h-full opacity-60 mix-blend-screen scale-105 group-hover:scale-110 transition-transform duration-1000" />
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3C5D] via-[#0B3C5D]/40 to-transparent z-10"></div>
                <div className="relative z-20 space-y-4">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-white">Trend Collection</span>
                  <h3 className="text-3xl font-bold">The Signature <br/> Styles</h3>
                  <button onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all">
                    Explore <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </StaggerItem>

            {/* Split 2 */}
            <StaggerItem>
              <div className="relative overflow-hidden rounded-[2rem] bg-[#E7F5FF] text-[#0B3C5D] aspect-[4/5] sm:aspect-[3/4] group flex flex-col justify-end p-8 border border-black/5">
                {showcaseLeft && (
                   <motion.div style={{ y: parallaxY }} className="absolute inset-0 z-0 flex items-center justify-center p-12">
                     <img src={showcaseLeft.images?.[0] || showcaseLeft.image} alt={showcaseLeft.name} className="object-contain w-full h-full drop-shadow-xl scale-95 group-hover:scale-100 transition-transform duration-1000" />
                   </motion.div>
                )}
                <div className="relative z-20 space-y-4">
                  <span className="inline-block px-3 py-1 bg-[#0B3C5D]/10 rounded-full text-xs font-bold uppercase tracking-widest text-[#0B3C5D]">Everyday Essentials</span>
                  <h3 className="text-3xl font-bold">Core Back to <br/> School Kit</h3>
                  <button onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all">
                    Shop Now <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* PREVIOUS: THE MAIN COLLECTION */}
        <section id="collection" className="pt-10 scroll-mt-20">
          <FadeIn direction="up">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-4xl font-extrabold tracking-tight">The Full Collection</h2>
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#0B3C5D] text-sm font-bold text-white">
                {products.length}
              </span>
            </div>
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

      <Footer theme="school" />
    </div>
  );
}
