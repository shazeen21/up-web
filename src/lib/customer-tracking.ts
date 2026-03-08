/**
 * ============================================================
 * CUSTOMER TRACKING SERVICE
 * ============================================================
 * Records customer behavior events (product views, cart adds,
 * page visits) and manages customer segmentation.
 *
 * All calls are fire-and-forget — they won't block navigation.
 * Note: Uses (supabase as any) for marketing tables since they
 * are not yet in the Supabase auto-generated types.
 * ============================================================
 */

import { supabaseBrowser } from "./supabase-browser";

export interface BehaviorEvent {
    customer_id?: string;
    session_id: string;
    event_type: "product_view" | "add_to_cart" | "purchase" | "page_view" | "newsletter_signup";
    product_id?: string;
    product_name?: string;
    page_url?: string;
    metadata?: Record<string, unknown>;
}

/** Generate or retrieve a persistent anonymous session ID */
export function getSessionId(): string {
    if (typeof window === "undefined") return "server";

    let sid = sessionStorage.getItem("_uk_session");
    if (!sid) {
        sid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        sessionStorage.setItem("_uk_session", sid);
    }
    return sid;
}

/** Record a behavior event to the customer_behavior table */
export async function recordBehavior(event: BehaviorEvent): Promise<void> {
    try {
        const supabase = supabaseBrowser();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("customer_behavior").insert({
            customer_id: event.customer_id ?? null,
            session_id: event.session_id,
            event_type: event.event_type,
            product_id: event.product_id ?? null,
            product_name: event.product_name ?? null,
            page_url: event.page_url ?? null,
            metadata: event.metadata ?? {},
            created_at: new Date().toISOString(),
        });
    } catch {
        // Silently fail — tracking must never break the UI
    }
}

/** Record a product view */
export async function trackProductBehavior(
    productId: string,
    productName: string,
    customerId?: string
): Promise<void> {
    await recordBehavior({
        customer_id: customerId,
        session_id: getSessionId(),
        event_type: "product_view",
        product_id: productId,
        product_name: productName,
        page_url: typeof window !== "undefined" ? window.location.href : undefined,
    });
}

/** Record an add-to-cart event */
export async function trackCartBehavior(
    productId: string,
    productName: string,
    price: number,
    customerId?: string
): Promise<void> {
    await recordBehavior({
        customer_id: customerId,
        session_id: getSessionId(),
        event_type: "add_to_cart",
        product_id: productId,
        product_name: productName,
        metadata: { price },
        page_url: typeof window !== "undefined" ? window.location.href : undefined,
    });
}

/** Save/update a customer's last visit timestamp */
export async function updateCustomerLastVisit(customerId: string): Promise<void> {
    try {
        const supabase = supabaseBrowser();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
            .from("customer_analytics")
            .upsert(
                { customer_id: customerId, last_visit: new Date().toISOString() },
                { onConflict: "customer_id" }
            );
    } catch {
        // Silently fail
    }
}

// ─── Customer Segmentation ────────────────────────────────────

export type CustomerSegment =
    | "new_visitor"
    | "cart_abandoner"
    | "repeat_buyer"
    | "vip"
    | "one_time_buyer"
    | "newsletter_subscriber";

/** Compute segment from customer analytics data */
export function computeSegment(analytics: {
    total_orders: number;
    total_spent: number;
    has_cart_items: boolean;
}): CustomerSegment {
    if (analytics.total_spent >= 5000) return "vip";
    if (analytics.total_orders >= 2) return "repeat_buyer";
    if (analytics.total_orders === 1) return "one_time_buyer";
    if (analytics.has_cart_items) return "cart_abandoner";
    return "new_visitor";
}

/** Update a customer's segment in the database */
export async function updateCustomerSegment(
    customerId: string,
    segment: CustomerSegment
): Promise<void> {
    try {
        const supabase = supabaseBrowser();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
            .from("customer_analytics")
            .upsert({ customer_id: customerId, segment }, { onConflict: "customer_id" });
    } catch {
        // Silently fail
    }
}
