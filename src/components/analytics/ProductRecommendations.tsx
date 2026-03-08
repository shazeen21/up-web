"use client";

/**
 * ============================================================
 * PRODUCT RECOMMENDATIONS WIDGET
 * ============================================================
 * Displays "Customers also bought" recommendations.
 * Can be placed on product pages and checkout pages.
 * ============================================================
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRecommendations, RecommendedProduct } from "@/lib/recommendations";

interface ProductRecommendationsProps {
    productId: string;
    title?: string;
    className?: string;
}

export function ProductRecommendations({
    productId,
    title = "Customers Also Bought",
    className = "",
}: ProductRecommendationsProps) {
    const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const results = await getRecommendations(productId, 4);
            if (!cancelled) {
                setRecommendations(results);
                setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [productId]);

    if (loading) {
        return (
            <div className={`space-y-4 ${className}`}>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-xl bg-gray-100 animate-pulse aspect-square" />
                    ))}
                </div>
            </div>
        );
    }

    if (recommendations.length === 0) return null;

    return (
        <section className={`${className}`}>
            <h3 className="text-xl font-semibold text-[#670E10] mb-4">{title}</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {recommendations.map((product) => (
                    <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group rounded-xl bg-white border border-[#f3cfc6] overflow-hidden 
                       hover:shadow-lg hover:border-[#670E10]/30 transition-all duration-300"
                    >
                        {/* Product Image */}
                        <div className="aspect-square bg-[#f3cfc6]/30 relative overflow-hidden">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl">🎁</div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-3">
                            <p className="text-xs text-gray-500 capitalize mb-1">{product.category}</p>
                            <p className="text-sm font-semibold text-[#670E10] line-clamp-2 leading-tight">
                                {product.name}
                            </p>
                            <p className="mt-1 text-sm font-bold text-gray-800">
                                ₹{product.price.toLocaleString("en-IN")}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
