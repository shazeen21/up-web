import {
  featuredProducts,
  uphaarCollection,
  kyddozCollection,
  festiveCollection,
  Product,
} from "@/data/products";

export function useProducts(brand?: Product["brand"]) {
  if (brand === "uphaar") {
    return { products: uphaarCollection };
  }
  if (brand === "kyddoz") {
    return { products: kyddozCollection };
  }
  if (brand === "festive") {
    return { products: festiveCollection };
  }

  const allProducts: Product[] = [
    ...featuredProducts,
    ...uphaarCollection,
    ...kyddozCollection,
    ...festiveCollection,
  ];

  return { products: allProducts };
}
