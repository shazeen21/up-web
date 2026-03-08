"use client";

/**
 * ============================================================
 * ANALYTICS PROVIDER COMPONENT
 * ============================================================
 * This component:
 *  - Injects Google Analytics 4 script
 *  - Injects Meta Pixel script
 *  - Injects Google Ads tracking
 *  - Tracks page views on route changes (SPA-aware)
 *  - Provides a React context for event tracking
 *
 * Usage: Wrap your app with <AnalyticsProvider> in providers.tsx
 * ============================================================
 */

import { createContext, useContext, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import {
    trackGA4Event,
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackNewsletterSignup,
    trackPageView,
} from "@/lib/analytics";

// ─── Context ──────────────────────────────────────────────────

interface AnalyticsContextValue {
    trackProductView: typeof trackProductView;
    trackAddToCart: typeof trackAddToCart;
    trackPurchase: typeof trackPurchase;
    trackNewsletterSignup: typeof trackNewsletterSignup;
    trackEvent: typeof trackGA4Event;
}

const AnalyticsContext = createContext<AnalyticsContextValue>({
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackNewsletterSignup,
    trackEvent: trackGA4Event,
});

export function useAnalytics() {
    return useContext(AnalyticsContext);
}

// ─── Provider Component ───────────────────────────────────────

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

interface AnalyticsProviderProps {
    children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
    const pathname = usePathname();

    // Track page views on route changes
    useEffect(() => {
        if (GA4_ID) {
            trackPageView(pathname ?? "/");
        }
    }, [pathname]);

    return (
        <AnalyticsContext.Provider
            value={{ trackProductView, trackAddToCart, trackPurchase, trackNewsletterSignup, trackEvent: trackGA4Event }}
        >
            {/* ── Google Analytics 4 ─────────────────────────────── */}
            {GA4_ID && (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
                    />
                    <Script
                        id="ga4-init"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', {
                  page_path: window.location.pathname,
                  send_page_view: true
                });
              `,
                        }}
                    />
                </>
            )}

            {/* ── Meta Pixel ─────────────────────────────────────── */}
            {META_PIXEL_ID && (
                <Script
                    id="meta-pixel"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
                    }}
                />
            )}

            {/* ── Google Ads ─────────────────────────────────────── */}
            {GOOGLE_ADS_ID && (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
                    />
                    <Script
                        id="google-ads-init"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ADS_ID}');
              `,
                        }}
                    />
                </>
            )}

            {children}
        </AnalyticsContext.Provider>
    );
}
