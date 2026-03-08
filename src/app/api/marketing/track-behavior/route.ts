/**
 * ============================================================
 * API ROUTE: /api/marketing/track-behavior
 * ============================================================
 * Records customer behavior events server-side.
 * Called from the frontend for tracking product views, 
 * cart events, and page visits.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { event_type, product_id, product_name, page_url, session_id, metadata } = body;

        // Validate required fields
        if (!event_type || !session_id) {
            return NextResponse.json(
                { success: false, error: "Missing event_type or session_id" },
                { status: 400 }
            );
        }

        const VALID_EVENTS = ["product_view", "add_to_cart", "purchase", "page_view", "newsletter_signup"];
        if (!VALID_EVENTS.includes(event_type)) {
            return NextResponse.json(
                { success: false, error: "Invalid event_type" },
                { status: 400 }
            );
        }

        // Create Supabase client with server-side auth
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        // Get current user if authenticated
        const { data: { user } } = await supabase.auth.getUser();

        // Insert behavior record
        const { error } = await supabase
            .from("customer_behavior")
            .insert({
                customer_id: user?.id ?? null,
                session_id,
                event_type,
                product_id: product_id ?? null,
                product_name: product_name ?? null,
                page_url: page_url ?? null,
                metadata: metadata ?? {},
                created_at: new Date().toISOString(),
            });

        if (error) {
            // Table might not exist yet — fail silently
            console.warn("[Behavior Tracker] DB insert failed:", error.message);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[Behavior Tracker] Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
