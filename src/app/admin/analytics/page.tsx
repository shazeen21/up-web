"use client";

/**
 * ============================================================
 * ADMIN ANALYTICS DASHBOARD
 * ============================================================
 * Full business intelligence dashboard showing:
 *  - Revenue, orders, conversion rate
 *  - Customer segments (pie chart)
 *  - Revenue over time (line chart)
 *  - Most viewed & most purchased products
 *  - Recent orders
 *
 * Uses Chart.js via CDN (no npm install needed)
 * ============================================================
 */

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/features/auth/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase-browser";
import Script from "next/script";

// ─── Types ────────────────────────────────────────────────────

interface DashboardData {
    metrics: {
        totalRevenue: number;
        totalOrders: number;
        avgOrderValue: number;
        totalCustomers: number;
        uniqueVisitors: number;
        conversionRate: number;
    };
    mostViewed: Array<{ id: string; name: string; count: number }>;
    mostPurchased: Array<{ id: string; name: string; count: number; revenue: number }>;
    segments: {
        new_visitor: number;
        one_time_buyer: number;
        repeat_buyer: number;
        vip: number;
    };
    revenueChart: Array<{ date: string; revenue: number }>;
    recentOrders: Array<{
        id: string;
        total: number;
        created_at: string;
        customer: string;
    }>;
}

// ─── Chart helpers ────────────────────────────────────────────

declare global {
    interface Window {
        Chart: {
            new(canvas: HTMLCanvasElement, config: Record<string, unknown>): { destroy: () => void };
        };
    }
}

function formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
}

// ─── Metric Card ──────────────────────────────────────────────

function MetricCard({
    icon,
    label,
    value,
    subtext,
    color = "#670E10",
}: {
    icon: string;
    label: string;
    value: string;
    subtext?: string;
    color?: string;
}) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f3cfc6]">
            <div className="flex items-center gap-3 mb-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${color}15` }}
                >
                    {icon}
                </div>
                <span className="text-sm text-gray-500 font-medium">{label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
    );
}

// ─── Segment Badge ────────────────────────────────────────────

function SegmentBar({
    label,
    count,
    total,
    color,
    icon,
}: {
    label: string;
    count: number;
    total: number;
    color: string;
    icon: string;
}) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-3">
            <div className="w-7 text-lg flex-shrink-0">{icon}</div>
            <div className="flex-1">
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-sm font-bold" style={{ color }}>
                        {count} ({pct}%)
                    </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%`, background: color }}
                    />
                </div>
            </div>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────

export default function AnalyticsDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [chartLoaded, setChartLoaded] = useState(false);

    const revenueChartRef = useRef<HTMLCanvasElement>(null);
    const revenueChartInstance = useRef<{ destroy: () => void } | null>(null);

    // ── Auth check ─────────────────────────────────────────────

    useEffect(() => {
        if (!user) return;

        const supabase = supabaseBrowser();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase as any)
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()
            .then(({ data: profile }: { data: { role: string } | null }) => {
                if (profile?.role !== "admin") {
                    router.push("/");
                } else {
                    setIsAdmin(true);
                }
            });
    }, [user, router]);

    // ── Fetch dashboard data ───────────────────────────────────

    useEffect(() => {
        if (!isAdmin) return;

        fetch("/api/analytics/dashboard")
            .then((r) => r.json())
            .then((result) => {
                if (result.success) {
                    setData(result);
                } else {
                    setError(result.error ?? "Failed to load analytics");
                }
            })
            .catch(() => setError("Failed to connect to analytics API"))
            .finally(() => setLoading(false));
    }, [isAdmin]);

    // ── Render revenue chart ───────────────────────────────────

    useEffect(() => {
        if (!chartLoaded || !data || !revenueChartRef.current || !window.Chart) return;

        // Destroy previous chart instance
        if (revenueChartInstance.current) {
            revenueChartInstance.current.destroy();
        }

        const labels = data.revenueChart.map((d) => formatDate(d.date));
        const values = data.revenueChart.map((d) => d.revenue);

        revenueChartInstance.current = new window.Chart(revenueChartRef.current, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label: "Revenue (₹)",
                        data: values,
                        borderColor: "#670E10",
                        backgroundColor: "rgba(103,14,16,0.08)",
                        borderWidth: 2.5,
                        pointBackgroundColor: "#670E10",
                        pointRadius: 4,
                        fill: true,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx: { raw: unknown }) =>
                                `₹${Number(ctx.raw).toLocaleString("en-IN")}`,
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (val: unknown) =>
                                `₹${Number(val).toLocaleString("en-IN")}`,
                        },
                        grid: { color: "rgba(0,0,0,0.05)" },
                    },
                    x: { grid: { display: false } },
                },
            },
        });
    }, [chartLoaded, data]);

    // ── Loading / Error States ─────────────────────────────────

    if (!user) {
        return (
            <div className="min-h-screen bg-[#f3cfc6] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">🔐</div>
                    <p className="text-[#670E10] font-semibold">Please log in to access the dashboard</p>
                </div>
            </div>
        );
    }

    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen bg-[#f3cfc6] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-[#670E10] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-[#670E10] font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f3cfc6] flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-[#670E10] font-semibold mb-2">Analytics Error</p>
                    <p className="text-gray-500 text-sm mb-4">{error}</p>
                    <p className="text-xs text-gray-400">
                        Make sure you&apos;ve run the marketing SQL schema in Supabase.
                    </p>
                </div>
            </div>
        );
    }

    const { metrics, mostViewed, mostPurchased, segments, recentOrders } = data!;
    const totalCustomers = metrics.totalCustomers;
    const totalSegmented = Object.values(segments).reduce((a, b) => a + b, 0) || 1;

    return (
        <>
            {/* Chart.js CDN */}
            <Script
                src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
                strategy="afterInteractive"
                onLoad={() => setChartLoaded(true)}
            />

            <div className="min-h-screen bg-[#f3cfc6]">
                <Navbar theme="home" />

                <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">

                    {/* ── Header ─────────────────────────────────────── */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#670E10]">Analytics Dashboard</h1>
                            <p className="text-[#670E10]/60 text-sm mt-1">
                                Business intelligence for Uphaar & Kyddoz
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <a
                                href="/admin"
                                className="rounded-xl bg-[#670E10] text-white text-sm font-semibold px-5 py-2.5 
                           hover:bg-[#8B1416] transition-colors"
                            >
                                ← Admin Panel
                            </a>
                            <a
                                href="/admin/orders"
                                className="rounded-xl border-2 border-[#670E10] text-[#670E10] text-sm 
                           font-semibold px-5 py-2.5 hover:bg-[#670E10]/5 transition-colors"
                            >
                                View Orders
                            </a>
                        </div>
                    </div>

                    {/* ── Key Metrics ────────────────────────────────── */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <MetricCard
                            icon="💰"
                            label="Total Revenue"
                            value={formatCurrency(metrics.totalRevenue)}
                            subtext="All time"
                        />
                        <MetricCard
                            icon="📦"
                            label="Total Orders"
                            value={String(metrics.totalOrders)}
                            subtext="Completed"
                        />
                        <MetricCard
                            icon="🛒"
                            label="Avg Order Value"
                            value={formatCurrency(metrics.avgOrderValue)}
                            subtext="Per order"
                        />
                        <MetricCard
                            icon="👥"
                            label="Customers"
                            value={String(totalCustomers)}
                            subtext="Registered"
                        />
                        <MetricCard
                            icon="👁️"
                            label="Unique Visitors"
                            value={String(metrics.uniqueVisitors)}
                            subtext="Sessions tracked"
                        />
                        <MetricCard
                            icon="📈"
                            label="Conversion Rate"
                            value={`${metrics.conversionRate}%`}
                            subtext="Visitors → Orders"
                        />
                    </div>

                    {/* ── Revenue Chart ──────────────────────────────── */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3cfc6]">
                        <h2 className="text-lg font-bold text-[#670E10] mb-4">Revenue (Last 7 Days)</h2>
                        <div className="relative h-64">
                            <canvas ref={revenueChartRef} />
                        </div>
                    </div>

                    {/* ── Two Column: Products + Segments ───────────── */}
                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Most Purchased */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3cfc6]">
                            <h2 className="text-lg font-bold text-[#670E10] mb-4">🏆 Top Products (Sales)</h2>
                            {mostPurchased.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-8">No purchase data yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {mostPurchased.map((p, i) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-[#f3cfc6]/20 
                                 hover:bg-[#f3cfc6]/40 transition-colors"
                                        >
                                            <span className="text-[#670E10] font-bold text-sm w-5">#{i + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {p.count} sold · {formatCurrency(p.revenue)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Most Viewed */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3cfc6]">
                            <h2 className="text-lg font-bold text-[#670E10] mb-4">👁️ Most Viewed Products</h2>
                            {mostViewed.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-8">
                                    No view tracking data yet.
                                    <br />
                                    <span className="text-xs">Add trackProductView() calls to product pages.</span>
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {mostViewed.map((p, i) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-[#f3cfc6]/20 
                                 hover:bg-[#f3cfc6]/40 transition-colors"
                                        >
                                            <span className="text-[#670E10] font-bold text-sm w-5">#{i + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                                                <p className="text-xs text-gray-500">{p.count} views</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Customer Segments ──────────────────────────── */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3cfc6]">
                        <h2 className="text-lg font-bold text-[#670E10] mb-2">Customer Segments</h2>
                        <p className="text-xs text-gray-400 mb-6">
                            Automatically categorized based on purchase history
                        </p>
                        <div className="grid sm:grid-cols-2 gap-5">
                            <SegmentBar
                                label="VIP Customers (₹5,000+)"
                                count={segments.vip}
                                total={totalSegmented}
                                color="#FFD700"
                                icon="👑"
                            />
                            <SegmentBar
                                label="Repeat Buyers (2+ orders)"
                                count={segments.repeat_buyer}
                                total={totalSegmented}
                                color="#22C55E"
                                icon="🔄"
                            />
                            <SegmentBar
                                label="One-Time Buyers"
                                count={segments.one_time_buyer}
                                total={totalSegmented}
                                color="#3B82F6"
                                icon="🛍️"
                            />
                            <SegmentBar
                                label="New / No Purchases"
                                count={segments.new_visitor}
                                total={totalSegmented}
                                color="#9CA3AF"
                                icon="👋"
                            />
                        </div>
                    </div>

                    {/* ── Recent Orders ──────────────────────────────── */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3cfc6]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-[#670E10]">Recent Orders</h2>
                            <a
                                href="/admin/orders"
                                className="text-sm text-[#670E10] hover:underline font-medium"
                            >
                                View all →
                            </a>
                        </div>

                        {recentOrders.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
                        ) : (
                            <div className="overflow-x-auto -mx-2">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[#f3cfc6]">
                                            <th className="text-left text-xs text-gray-400 font-semibold py-2 px-2">
                                                ORDER ID
                                            </th>
                                            <th className="text-left text-xs text-gray-400 font-semibold py-2 px-2">
                                                CUSTOMER
                                            </th>
                                            <th className="text-left text-xs text-gray-400 font-semibold py-2 px-2">
                                                AMOUNT
                                            </th>
                                            <th className="text-left text-xs text-gray-400 font-semibold py-2 px-2">
                                                DATE
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="border-b border-[#f3cfc6]/50 hover:bg-[#f3cfc6]/20 transition-colors"
                                            >
                                                <td className="py-3 px-2 font-mono text-xs text-gray-500">
                                                    #{order.id.split("-")[0]}
                                                </td>
                                                <td className="py-3 px-2 text-gray-800 font-medium">
                                                    {order.customer}
                                                </td>
                                                <td className="py-3 px-2 font-semibold text-[#670E10]">
                                                    {formatCurrency(order.total)}
                                                </td>
                                                <td className="py-3 px-2 text-gray-500 text-xs">
                                                    {order.created_at
                                                        ? new Date(order.created_at).toLocaleDateString("en-IN")
                                                        : "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ── Marketing Actions ──────────────────────────── */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3cfc6]">
                        <h2 className="text-lg font-bold text-[#670E10] mb-4">🚀 Marketing Actions</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                {
                                    label: "Send Cart Abandon Emails",
                                    icon: "🛒",
                                    desc: "Target customers with items in cart",
                                    color: "#F97316",
                                },
                                {
                                    label: "Launch Flash Sale Notification",
                                    icon: "⚡",
                                    desc: "Push notification to all subscribers",
                                    color: "#EF4444",
                                },
                                {
                                    label: "Email VIP Customers",
                                    icon: "👑",
                                    desc: "Exclusive offer for high-value customers",
                                    color: "#FFD700",
                                },
                                {
                                    label: "Send New Collection Email",
                                    icon: "✨",
                                    desc: "Announce to all newsletter subscribers",
                                    color: "#8B5CF6",
                                },
                            ].map((action) => (
                                <button
                                    key={action.label}
                                    className="text-left p-4 rounded-xl border-2 border-gray-100 hover:border-[#670E10]/30 
                             hover:shadow-md transition-all duration-200 group"
                                    onClick={() => alert(`Campaign action: "${action.label}"\n\nThis would trigger the marketing automation flow. Configure your email/push credentials in .env.local to enable sending.`)}
                                >
                                    <div className="text-2xl mb-2">{action.icon}</div>
                                    <p className="text-sm font-semibold text-gray-800 group-hover:text-[#670E10] mb-1">
                                        {action.label}
                                    </p>
                                    <p className="text-xs text-gray-400 leading-tight">{action.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                </main>

                <Footer theme="home" />
            </div>
        </>
    );
}
