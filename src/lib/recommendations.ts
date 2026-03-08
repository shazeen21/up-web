/**
 * ============================================================
 * PRODUCT RECOMMENDATION ENGINE
 * ============================================================
 * Simple collaborative-filtering recommendation engine.
 * "Customers who bought X also bought Y."
 *
 * Algorithm:
 *  1. Find all orders containing the target product
 *  2. Collect all OTHER products purchased in those orders
 *  3. Rank by frequency → top N = recommendations
 * ============================================================
 */

import { supabaseBrowser } from "./supabase-browser";

export interface RecommendedProduct {
    id: string;
    name: string;
    price: number;
    image?: string;
    category: string;
    score: number;  // co-purchase frequency
}

/**
 * Get product recommendations based on co-purchase data.
 * @param productId  The product currently being viewed
 * @param limit      Maximum number of recommendations to return
 */
export async function getProductRecommendations(
    productId: string,
    limit = 4
): Promise<RecommendedProduct[]> {
    try {
        const supabase = supabaseBrowser();

        // 1. Fetch all orders from Supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: orders, error } = await (supabase as any)
            .from("orders")
            .select("items")
            .not("items", "is", null) as { data: Array<{ items: unknown }> | null; error: unknown };

        if (error || !orders) return [];

        // 2. Find orders containing the target product
        const relevantOrders = orders.filter((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            return items.some(
                (item: { id?: string; productId?: string }) =>
                    item.id === productId || item.productId === productId
            );
        });

        if (relevantOrders.length === 0) return [];

        // 3. Count co-purchased products
        const coFrequency: Record<string, number> = {};

        for (const order of relevantOrders) {
            const items = Array.isArray(order.items) ? order.items : [];
            for (const item of items as Array<{ id?: string; productId?: string }>) {
                const pid = item.id || item.productId;
                if (pid && pid !== productId) {
                    coFrequency[pid] = (coFrequency[pid] ?? 0) + 1;
                }
            }
        }

        // 4. Sort by frequency, take top N
        const topProductIds = Object.entries(coFrequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([pid, score]) => ({ pid, score }));

        if (topProductIds.length === 0) return [];

        // 5. Fetch product details for the recommended IDs
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: products } = await (supabase as any)
            .from("products")
            .select("id, name, price, images, category")
            .in(
                "id",
                topProductIds.map((t) => t.pid)
            ) as { data: Array<{ id: string; name: string; price: number; images: string[] | null; category: string }> | null };

        if (!products) return [];

        // 6. Merge score into product data
        return products
            .map((p) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                image: Array.isArray(p.images) ? p.images[0] : undefined,
                category: p.category,
                score: topProductIds.find((t) => t.pid === p.id)?.score ?? 0,
            }))
            .sort((a, b) => b.score - a.score);
    } catch {
        return [];
    }
}

/**
 * Get popular products (fallback when no co-purchase data exists)
 * Used for new products or products with no purchase history.
 */
export async function getPopularProducts(
    excludeId?: string,
    limit = 4
): Promise<RecommendedProduct[]> {
    try {
        const supabase = supabaseBrowser();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
            .from("products")
            .select("id, name, price, images, category")
            .eq("availability", true)
            .eq("featured", true)
            .order("created_at", { ascending: false })
            .limit(limit + 1) as { data: Array<{ id: string; name: string; price: number; images: string[] | null; category: string }> | null };

        return (data ?? [])
            .filter((p) => p.id !== excludeId)
            .slice(0, limit)
            .map((p) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                image: Array.isArray(p.images) ? p.images[0] : undefined,
                category: p.category,
                score: 0,
            }));
    } catch {
        return [];
    }
}

/**
 * Main entry point — returns co-purchase recommendations,
 * falls back to popular products if not enough data.
 */
export async function getRecommendations(
    productId: string,
    limit = 4
): Promise<RecommendedProduct[]> {
    const copurchase = await getProductRecommendations(productId, limit);

    if (copurchase.length >= 2) return copurchase.slice(0, limit);

    const popular = await getPopularProducts(productId, limit - copurchase.length);
    return [...copurchase, ...popular].slice(0, limit);
}
