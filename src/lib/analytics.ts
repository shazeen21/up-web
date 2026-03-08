/**
 * ============================================================
 * ANALYTICS & EVENT TRACKING MODULE
 * ============================================================
 * Central module for tracking all user interactions.
 * Supports Google Analytics 4, Meta Pixel, Google Ads.
 * All tracking calls are safe — they silently fail if scripts
 * are not loaded (e.g. blocked by ad blockers).
 */

// ─── Type declarations for global SDKs ───────────────────────
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    OneSignal?: unknown[];
  }
}

// ─── GA4 Event Helpers ────────────────────────────────────────

/** Push a custom event to Google Analytics 4 */
export function trackGA4Event(
  eventName: string,
  params: Record<string, unknown> = {}
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

/** Track a product view (GA4 + Meta Pixel) */
export function trackProductView(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) {
  // ── Google Analytics 4 ──────────────────────────────────────
  trackGA4Event("view_item", {
    currency: "INR",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
      },
    ],
  });

  // ── Meta Pixel ──────────────────────────────────────────────
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "INR",
    });
  }
}

/** Track add-to-cart event (GA4 + Meta Pixel) */
export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  quantity?: number;
}) {
  const qty = product.quantity ?? 1;

  // ── Google Analytics 4 ──────────────────────────────────────
  trackGA4Event("add_to_cart", {
    currency: "INR",
    value: product.price * qty,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: qty,
      },
    ],
  });

  // ── Meta Pixel ──────────────────────────────────────────────
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price * qty,
      currency: "INR",
    });
  }
}

/** Track a completed purchase (GA4 + Meta Pixel + Google Ads) */
export function trackPurchase(order: {
  orderId: string;
  total: number;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
}) {
  // ── Google Analytics 4 ──────────────────────────────────────
  trackGA4Event("purchase", {
    transaction_id: order.orderId,
    value: order.total,
    currency: "INR",
    items: order.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });

  // ── Meta Pixel ──────────────────────────────────────────────
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Purchase", {
      value: order.total,
      currency: "INR",
      content_ids: order.items.map((i) => i.id),
      content_type: "product",
    });
  }

  // ── Google Ads conversion ───────────────────────────────────
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID,
      value: order.total,
      currency: "INR",
      transaction_id: order.orderId,
    });
  }
}

/** Track newsletter signup */
export function trackNewsletterSignup(email: string) {
  trackGA4Event("sign_up", { method: "newsletter" });

  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", { content_name: "newsletter_signup" });
  }
}

/** Track page view explicitly (useful for SPA route changes) */
export function trackPageView(url: string, title?: string) {
  trackGA4Event("page_view", {
    page_location: url,
    page_title: title,
  });
}
