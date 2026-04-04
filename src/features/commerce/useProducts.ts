import {
  featuredProducts,
  uphaarCollection,
  kyddozCollection, schoolCollection,
  festiveCollection,
  Product,
} from "@/data/products";

export function useProducts(brand?: Product["brand"]) {
  if (brand === "uphaar") {
    const brandFeatured = featuredProducts.filter((p) => p.brand === "uphaar");
    const regular = [...uphaarCollection].reverse();
    return { products: [...regular, ...brandFeatured] };
  }
  if (brand === "kyddoz") {
    const brandFeatured = featuredProducts.filter((p) => p.brand === "kyddoz");
    const regular = [...kyddozCollection, ...schoolCollection].reverse();
    return { products: [...regular, ...brandFeatured] };
  }
  if (brand === "festive") {
    const brandFeatured = featuredProducts.filter((p) => p.brand === "festive");
    const regular = [...festiveCollection].reverse();
    return { products: [...regular, ...brandFeatured] };
  }

  const allProducts: Product[] = [
    ...featuredProducts,
    ...[...uphaarCollection].reverse(),
    ...[...kyddozCollection, ...schoolCollection].reverse(),
    ...[...festiveCollection].reverse(),
  ];

  return { products: allProducts };
}
