"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Marquee() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <Link href="/school" className="block w-full z-50 bg-[#0B3C5D] text-white overflow-hidden py-2.5 cursor-pointer hover:bg-[#082a42] transition-colors duration-300">
      <div 
        className="flex whitespace-nowrap group text-xs sm:text-sm font-semibold tracking-widest uppercase"
      >
        {/* We duplicate the text multiple times to create a seamless infinite scroll loop */}
        <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
          <span className="mx-4">✨ NEW DROP LIVE: BACK TO SCHOOL ✨ SHOP NOW ✨</span>
          <span className="mx-4">✨ NEW DROP LIVE: BACK TO SCHOOL ✨ SHOP NOW ✨</span>
          <span className="mx-4">✨ NEW DROP LIVE: BACK TO SCHOOL ✨ SHOP NOW ✨</span>
          <span className="mx-4">✨ NEW DROP LIVE: BACK TO SCHOOL ✨ SHOP NOW ✨</span>
          <span className="mx-4">✨ NEW DROP LIVE: BACK TO SCHOOL ✨ SHOP NOW ✨</span>
        </div>
        <div className="flex animate-marquee group-hover:[animation-play-state:paused]" aria-hidden="true">
          <span className="mx-4">✨ NEW DROP LIVE: BACK TO SCHOOL ✨ SHOP NOW ✨</span>
          <span className="mx-4">✨ NEW DROP LIVE: BACK TO SCHOOL ✨ SHOP NOW ✨</span>
          <span className="mx-4">✨ NEW DROP LIVE: BACK TO SCHOOL ✨ SHOP NOW ✨</span>
          <span className="mx-4">✨ NEW DROP LIVE: BACK TO SCHOOL ✨ SHOP NOW ✨</span>
          <span className="mx-4">✨ NEW DROP LIVE: BACK TO SCHOOL ✨ SHOP NOW ✨</span>
        </div>
      </div>
    </Link>
  );
}
