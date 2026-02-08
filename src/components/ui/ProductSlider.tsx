"use client";

import { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { FadeIn, StaggerContainer, StaggerItem } from "./Animated";

type Props = {
  items: Product[];
  tone?: "home" | "uphaar" | "kyddoz" | "festive";
  title?: string;
  description?: string;
};

export function ProductSlider({ items, tone, title, description }: Props) {
  return (
    <section>
      <FadeIn direction="up">
        {title && <h2 className="text-2xl font-semibold">{title}</h2>}
        {description && <p className="opacity-80">{description}</p>}
      </FadeIn>

      <StaggerContainer className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={p} tone={tone} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
