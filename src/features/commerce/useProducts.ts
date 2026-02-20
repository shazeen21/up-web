import {
  featuredProducts,
  uphaarCollection,
  kyddozCollection,
  festiveCollection,
  Product,
} from "@/data/products";

export function useProducts(brand?: Product["brand"]) {
  if (brand === "uphaar") {
    const brandFeatured = featuredProducts.filter((p) => p.brand === "uphaar");
    const regular = [...uphaarCollection].reverse();
    return { products: [...brandFeatured, ...regular] };
  }
  if (brand === "kyddoz") {
    const brandFeatured = featuredProducts.filter((p) => p.brand === "kyddoz");
    const regular = [...kyddozCollection].reverse();
    return { products: [...brandFeatured, ...regular] };
  }
  if (brand === "festive") {
    const brandFeatured = featuredProducts.filter((p) => p.brand === "festive");
    const regular = [...festiveCollection].reverse();
    return { products: [...brandFeatured, ...regular] };
  }

  const allProducts: Product[] = [
    ...featuredProducts,
    ...[...uphaarCollection].reverse(),
    ...[...kyddozCollection].reverse(),
    ...[...festiveCollection].reverse(),
  ];

  return { products: allProducts };
}
