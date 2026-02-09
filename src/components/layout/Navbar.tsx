"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { useCommerce } from "@/features/commerce/CommerceProvider";

export type NavbarProps = {
  theme?: "home" | "uphaar" | "kyddoz" | "festive";
};

const themeBg: Record<NonNullable<NavbarProps["theme"]>, string> = {
  home: "bg-home-primary text-home-secondary",
  uphaar: "bg-[#b7c1b9] text-[#ffffff]",
  kyddoz: "bg-[#E7F5FF] text-[#0B3C5D]",
  festive: "bg-home-primary text-home-secondary",
};

const iconBtn =
  "flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#670E10] shadow-md ring-1 ring-black/10 transition hover:scale-105 cursor-pointer relative";

const iconClass = "h-6 w-6 stroke-[1.8]";

export function Navbar({ theme = "home" }: NavbarProps) {
  const { user, openAuth, signOut } = useAuth();
  const { cart, wishlist } = useCommerce();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showUserMenu) setShowUserMenu(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showUserMenu]);

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const wishlistCount = wishlist.length;

  const links = [
    { href: "/", label: "Home" },
    { href: "/uphaar", label: "Uphaar" },
    { href: "/kyddoz", label: "Kyddoz" },
    { href: "/festive-picks", label: "Festive Picks" },
  ];

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuth();
    } else {
      setShowUserMenu(!showUserMenu);
    }
  };

  const handleCartClick = () => {
    router.push("/checkout");
  };

  return (
    <>
      <header className={`${themeBg[theme]} fixed top-0 w-full z-40 border-b border-black/5 shadow-sm transition-all duration-300`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3 lg:px-10 lg:py-4">

          {/* HAMBURGER BUTTON (Mobile/Tablet) */}
          <button
            className="lg:hidden p-1 -ml-1 text-current hover:opacity-80 transition-opacity"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>

          {/* LOGOS */}
          <div className="flex items-center gap-2 lg:gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="relative h-9 w-20 sm:h-12 sm:w-24 md:h-16 md:w-32 lg:h-24 lg:w-60 hover:scale-105 transition-transform duration-300">
              <Image
                src="/logos/uphaar.png"
                alt="Uphaar"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="relative h-9 w-20 sm:h-12 sm:w-24 md:h-16 md:w-32 lg:h-24 lg:w-60 hover:scale-105 transition-transform duration-300">
              <Image
                src="/logos/kyddoz.png"
                alt="Kyddoz"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* LINKS (Desktop) */}
          <nav className="hidden items-center gap-8 text-lg font-semibold lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:opacity-80 transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ICON BUTTONS */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            <Link href="/wishlist" className="flex size-9 sm:size-11 items-center justify-center rounded-full bg-white text-[#670E10] shadow-md ring-1 ring-black/10 transition hover:scale-105 cursor-pointer relative">
              <HeartIcon />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button className="flex size-9 sm:size-11 items-center justify-center rounded-full bg-white text-[#670E10] shadow-md ring-1 ring-black/10 transition hover:scale-105 cursor-pointer relative" onClick={handleCartClick} title="View Cart">
              <BagIcon />
              {mounted && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="relative flex items-center gap-3">
              <button
                className={`flex size-9 sm:size-11 items-center justify-center rounded-full bg-white text-[#670E10] shadow-md ring-1 ring-black/10 transition hover:scale-105 cursor-pointer relative ${!user ? "ring-2 ring-red-400 animate-pulse" : ""
                  }`}
                onClick={handleUserClick}
                title={user ? "User Menu" : "Click to Login"}
              >
                <UserIcon />
              </button>

              {!user && (
                <span
                  className="hidden md:block text-base font-semibold text-[#670E10] cursor-pointer hover:underline"
                  onClick={handleUserClick}
                >
                  Login
                </span>
              )}

              {user && showUserMenu && (
                <div
                  className="absolute right-0 top-14 z-50 min-w-[220px] rounded-lg bg-white shadow-xl border border-gray-200 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Logged in as:</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push("/profile");
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                  >
                    👤 My Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push("/admin");
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                  >
                    🛠️ Admin Panel
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOut();
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col p-4 gap-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-lg font-semibold text-gray-800 hover:text-red-700 py-2 border-b border-gray-50 last:border-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleUserClick(e);
                  }}
                  className="text-lg font-semibold text-left text-[#670E10] py-2"
                >
                  Login
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-[60px] sm:h-[80px] lg:h-[110px]" />
    </>
  );
}

/* ================= ICONS ================= */

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={iconClass}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={iconClass}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75V6a3.75 3.75 0 017.5 0v.75m-9 0h10.5m-10.5 0A2.25 2.25 0 004.5 9v9A2.25 2.25 0 006.75 20.25h10.5A2.25 2.25 0 0019.5 18V9a2.25 2.25 0 00-2.25-2.25"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={iconClass}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
      />
    </svg>
  );
}
