"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Product } from "@/data/products";
import { useCommerce } from "@/features/commerce/CommerceProvider";
import { useAuth } from "@/features/auth/AuthProvider";

type ProductCardProps = {
  product: Product;
  tone?: "home" | "uphaar" | "kyddoz" | "festive";
};

const toneStyles: Record<
  NonNullable<ProductCardProps["tone"]>,
  {
    text: string;
    button: string;
    buttonHover: string;
    cardBg: string;
  }
> = {
  home: {
    text: "#670E10",
    button: "#670E10",
    buttonHover: "#520b0d",
    cardBg: "#FDF3F3",
  },
  uphaar: {
    text: "#36794B",
    button: "#36794B",
    buttonHover: "#2c5f3c",
    cardBg: "#ECFFF3",
  },
  kyddoz: {
    text: "#0B3C5D",
    button: "#0B3C5D",
    buttonHover: "#08314d",
    cardBg: "#F2FAFF",
  },
  festive: {
    text: "#2F2A55",
    button: "#2F2A55",
    buttonHover: "#23204a",
    cardBg: "#E6E8FF",
  },
};

export function ProductCard({ product, tone = "home" }: ProductCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, wishlist, toggleWishlist } = useCommerce();
  const style = toneStyles[tone];
  const [adding, setAdding] = useState(false);

  const isInWishlist = wishlist.includes(product.id);

  const primaryImage =
    product.images?.[0] ||
    product.image ||
    "/placeholder.png"; // safe fallback

  const aspectClass = product.aspect_ratio || "aspect-[4/3]";

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdding(true);
    addToCart(product.id, 1);
    setTimeout(() => setAdding(false), 800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      onClick={handleViewProduct}
      className="relative cursor-pointer rounded-2xl p-4 shadow-card transition h-full flex flex-col"
      style={{ backgroundColor: style.cardBg }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.5 }}
    >
      {/* Wishlist */}
      <motion.button
        onClick={handleToggleWishlist}
        className="absolute top-6 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isInWishlist ? style.button : "none"}
          stroke={style.button}
          strokeWidth={2}
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </motion.button>

      {/* IMAGE */}
      <motion.div
        className={`relative mb-4 overflow-hidden rounded-xl bg-white ${aspectClass}`}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority={false}
        />

        {product.badge && (
          <div className="absolute left-3 top-3">
            <Badge tone="amber">{product.badge}</Badge>
          </div>
        )}
      </motion.div>

      {/* CONTENT WRAPPER for Flex alignment */}
      <div className="flex-1 flex flex-col">
        {/* CONTENT */}
        <h3 className="line-clamp-2 text-base font-semibold" style={{ color: style.text }}>
          {product.name}
        </h3>

        {product.price > 0 && tone !== "uphaar" && tone !== "home" && (
          <p className="mt-1 text-lg font-bold" style={{ color: style.text }}>
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        )}

        {/* DETAILS */}
        <div className="mt-3 space-y-1 text-xs" style={{ color: `${style.text}cc` }}>
          {product.material && <p>Material: {product.material}</p>}
          {product.thickness && <p>Thickness: {product.thickness}</p>}
          {product.rate && <p>Rate: {product.rate}</p>}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex gap-2 w-full">
        <Button
          onClick={handleViewProduct}
          className="w-full text-white"
          style={{ backgroundColor: style.button }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = style.buttonHover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = style.button)
          }
        >
          View Product
        </Button>
      </div>
    </motion.div>
  );
}
