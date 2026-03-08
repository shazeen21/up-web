/**
 * ============================================================
 * API ROUTE: /api/analytics/dashboard
 * ============================================================
 * Returns aggregated analytics data for the admin dashboard.
 * Admin-only endpoint (checked server-side).
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    try {
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

        // ── Verify admin ──────────────────────────────────────────
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // ── Fetch all orders ──────────────────────────────────────
        const { data: orders } = await supabase
            .from("orders")
            .select("id, total, items, customer_details, created_at, user_id");

        // ── Fetch all profiles ────────────────────────────────────
        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, email, name, created_at");

        // ── Fetch behavior events ─────────────────────────────────
        const { data: behaviors } = await supabase
            .from("customer_behavior")
            .select("event_type, product_id, product_name, session_id, created_at")
            .limit(5000);

        const ordersArr = orders ?? [];
        const profilesArr = profiles ?? [];
        const behaviorsArr = behaviors ?? [];

        // ── Compute metrics ───────────────────────────────────────

        const totalRevenue = ordersArr.reduce((sum, o) => sum + (o.total ?? 0), 0);
        const totalOrders = ordersArr.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const totalCustomers = profilesArr.length;

        // Unique sessions = unique visitors estimate
        const uniqueSessions = new Set(behaviorsArr.map((b) => b.session_id)).size;
        const conversionRate = uniqueSessions > 0
            ? ((totalOrders / uniqueSessions) * 100).toFixed(1)
            : "0";

        // ── Product analytics ─────────────────────────────────────

        // Most viewed products
        const viewEvents = behaviorsArr.filter((b) => b.event_type === "product_view");
        const viewCounts: Record<string, { name: string; count: number }> = {};
        for (const e of viewEvents) {
            if (e.product_id) {
                viewCounts[e.product_id] = {
                    name: e.product_name ?? e.product_id,
                    count: (viewCounts[e.product_id]?.count ?? 0) + 1,
                };
            }
        }
        const mostViewed = Object.entries(viewCounts)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 5)
            .map(([id, { name, count }]) => ({ id, name, count }));

        // Most purchased products  
        const productSales: Record<string, { name: string; count: number; revenue: number }> = {};
        for (const order of ordersArr) {
            const items = Array.isArray(order.items) ? order.items : [];
            for (const item of items as Array<{ id?: string; name?: string; price?: number; quantity?: number }>) {
                const pid = item.id ?? "unknown";
                const qty = item.quantity ?? 1;
                const rev = (item.price ?? 0) * qty;
                productSales[pid] = {
                    name: item.name ?? pid,
                    count: (productSales[pid]?.count ?? 0) + qty,
                    revenue: (productSales[pid]?.revenue ?? 0) + rev,
                };
            }
        }
        const mostPurchased = Object.entries(productSales)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 5)
            .map(([id, { name, count, revenue }]) => ({ id, name, count, revenue }));

        // ── Customer segmentation counts ──────────────────────────

        const customerOrderCounts: Record<string, number> = {};
        const customerSpend: Record<string, number> = {};
        for (const order of ordersArr) {
            if (order.user_id) {
                customerOrderCounts[order.user_id] = (customerOrderCounts[order.user_id] ?? 0) + 1;
                customerSpend[order.user_id] = (customerSpend[order.user_id] ?? 0) + (order.total ?? 0);
            }
        }

        const segments = {
            new_visitor: 0,
            one_time_buyer: 0,
            repeat_buyer: 0,
            vip: 0,
        };

        for (const profile of profilesArr) {
            const orders_count = customerOrderCounts[profile.id] ?? 0;
            const spent = customerSpend[profile.id] ?? 0;

            if (spent >= 5000) segments.vip++;
            else if (orders_count >= 2) segments.repeat_buyer++;
            else if (orders_count === 1) segments.one_time_buyer++;
            else segments.new_visitor++;
        }

        // ── Revenue over time (last 7 days by default) ────────────
        const revenueByDay: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split("T")[0];
            revenueByDay[key] = 0;
        }
        for (const order of ordersArr) {
            if (order.created_at) {
                const key = order.created_at.split("T")[0];
                if (key in revenueByDay) {
                    revenueByDay[key] += order.total ?? 0;
                }
            }
        }

        const revenueChart = Object.entries(revenueByDay).map(([date, revenue]) => ({
            date,
            revenue,
        }));

        return NextResponse.json({
            success: true,
            metrics: {
                totalRevenue,
                totalOrders,
                avgOrderValue,
                totalCustomers,
                uniqueVisitors: uniqueSessions,
                conversionRate: parseFloat(conversionRate),
            },
            mostViewed,
            mostPurchased,
            segments,
            revenueChart,
            recentOrders: ordersArr
                .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
                .slice(0, 10)
                .map((o) => ({
                    id: o.id,
                    total: o.total,
                    created_at: o.created_at,
                    customer: (o.customer_details as Record<string, unknown>)?.name ?? "Unknown",
                })),
        });
    } catch (error) {
        console.error("[Analytics API] Error:", error);
        return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
    }
}
