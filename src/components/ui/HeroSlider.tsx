 "use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type HeroSliderProps = {
  images: string[];
  tone?: "home" | "uphaar" | "kyddoz" | "festive";
  height?: string;
};

const toneBorders: Record<NonNullable<HeroSliderProps["tone"]>, string> = {
  home: "from-[#670E10] to-[#520b0d]",
  uphaar: "from-[#36794B] to-[#2c5f3c]",
  kyddoz: "from-[#FF6A9E] to-[#E84A6A]",
  festive: "from-[#8A8DB0] to-[#6e7190]",
};

export function HeroSlider({ images, tone = "home", height = "520px" }: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (isHovering) return;
      setActive((prev) => (prev + 1) % images.length);
    }, 3400);
    return () => clearInterval(id);
  }, [images.length, isHovering]);

  const handleArrow = (dir: "prev" | "next") => {
    setActive((prev) => {
      if (dir === "next") return (prev + 1) % images.length;
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${toneBorders[tone]} shadow-soft`}
      style={{ height }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > 40) {
          handleArrow(delta < 0 ? "next" : "prev");
        }
        touchStart.current = null;
      }}
    >
      {images.map((image, idx) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt="Featured product"
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />

      <div className="absolute inset-y-0 left-0 flex items-center px-4">
        <button
          aria-label="Previous hero"
          className="flex size-11 items-center justify-center rounded-full bg-white/70 text-gray-800 shadow-md transition hover:scale-105"
          onClick={() => handleArrow("prev")}
        >
          ‹
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center px-4">
        <button
          aria-label="Next hero"
          className="flex size-11 items-center justify-center rounded-full bg-white/70 text-gray-800 shadow-md transition hover:scale-105"
          onClick={() => handleArrow("next")}
        >
          ›
        </button>
      </div>

      <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setActive(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === active ? "w-8 bg-white" : "w-3 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

