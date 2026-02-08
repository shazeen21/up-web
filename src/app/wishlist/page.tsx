"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCommerce } from "@/features/commerce/CommerceProvider";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Product } from "@/data/products";

export default function WishlistPage() {
  const { wishlist } = useCommerce();
  const supabase = supabaseBrowser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!wishlist.length) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from("products").select("*").in("id", wishlist) as { data: any[] | null; error: any };

        if (data && !error) {
          // Map Supabase data to Product type
          const mappedProducts = data.map((row) => ({
            id: row.id,
            name: row.name,
            price: row.price,
            image: row.images?.[0] || "",
            images: row.images,
            brand: row.category,
            badge: row.featured ? "Featured" : row.limited ? "Limited" : undefined,
            material: undefined,
            thickness: undefined,
            rate: undefined,
            description: row.description,
            aspect_ratio: row.aspect_ratio,
          })) as Product[];

          setProducts(mappedProducts);
        } else {
          throw new Error("Supabase failed");
        }
      } catch (err) {
        // Fallback to static data
        console.log("Using static data for wishlist");
        const { featuredProducts, uphaarCollection, kyddozCollection, festiveCollection } = await import("@/data/products");
        const allProducts = [...featuredProducts, ...uphaarCollection, ...kyddozCollection, ...festiveCollection];

        const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));
        setProducts(wishlistProducts);
      }

      setLoading(false);
    };
    load();
  }, [wishlist, supabase]);

  return (
    <div className="min-h-screen bg-[#f3cfc6] text-black">
      <Navbar theme="home" />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-black">Wishlist</h1>
          <p className="text-base text-black/80">
            Saved products with quick access to buy or add to cart.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-[#670E10]/80">Loading...</p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} tone="home" />
            ))
          ) : (
            <p className="text-black/80">
              No items saved yet. Add some favorites to your wishlist.
            </p>
          )}
        </div>
      </main>
      <Footer theme="home" />
    </div>
  );
}
