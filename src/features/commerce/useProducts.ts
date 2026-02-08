import {
  featuredProducts,
  uphaarCollection,
  kyddozCollection,
  festiveCollection,
  Product,
} from "@/data/products";

export function useProducts(brand?: Product["brand"]) {
  const allProducts: Product[] = [
    ...featuredProducts,
    ...uphaarCollection,
    ...kyddozCollection,
    ...festiveCollection,
  ];

  const products = brand
    ? allProducts.filter((p) => p.brand === brand)
    : allProducts;

  return { products };
}
